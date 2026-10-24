import * as THREE from "three";

/**
 * A solid made of axis-aligned boxes, added and subtracted in order, turned
 * into one closed surface. The boxes' edges split space into a grid of cells;
 * each cell is filled or empty by the last box that covers it, and a face is
 * drawn wherever a filled cell meets an empty one. The surface is closed, so
 * a clipping plane through it shows only the solid's inside, which the plan
 * draws as solid ink: an architect's cut walls, with no extra geometry.
 */

type Op = { add: boolean; min: [number, number, number]; max: [number, number, number] };

export class BoxSolid {
  private ops: Op[] = [];

  add(min: [number, number, number], max: [number, number, number]) {
    this.ops.push({ add: true, min, max });
    return this;
  }

  sub(min: [number, number, number], max: [number, number, number]) {
    this.ops.push({ add: false, min, max });
    return this;
  }

  /** The surface, with normals and planar UVs in the solid's own units. */
  build(): THREE.BufferGeometry {
    const round = (v: number) => Math.round(v * 1e4) / 1e4;
    const axis = (k: 0 | 1 | 2) =>
      [...new Set(this.ops.flatMap((o) => [round(o.min[k]), round(o.max[k])]))].sort((a, b) => a - b);
    const cuts = [axis(0), axis(1), axis(2)] as const;
    const index = cuts.map((c) => new Map(c.map((v, i) => [v, i])));
    const [nx, ny, nz] = cuts.map((c) => c.length - 1) as [number, number, number];
    const filled = new Uint8Array(nx * ny * nz);
    const id = (i: number, j: number, k: number) => i + nx * (j + ny * k);

    for (const o of this.ops) {
      const lo = [0, 1, 2].map((a) => index[a]!.get(round(o.min[a]!))!);
      const hi = [0, 1, 2].map((a) => index[a]!.get(round(o.max[a]!))!);
      for (let k = lo[2]!; k < hi[2]!; k++)
        for (let j = lo[1]!; j < hi[1]!; j++)
          for (let i = lo[0]!; i < hi[0]!; i++) filled[id(i, j, k)] = o.add ? 1 : 0;
    }
    const at = (i: number, j: number, k: number) =>
      i < 0 || j < 0 || k < 0 || i >= nx || j >= ny || k >= nz ? 0 : filled[id(i, j, k)]!;

    const pos: number[] = [];
    const nor: number[] = [];
    const uv: number[] = [];
    const [xs, ys, zs] = cuts;
    const quad = (corners: number[][], n: [number, number, number]) => {
      // two triangles, wound so the normal faces out
      for (const c of [0, 1, 2, 0, 2, 3]) {
        const p = corners[c]!;
        pos.push(p[0]!, p[1]!, p[2]!);
        nor.push(...n);
        uv.push(n[0] ? p[2]! : p[0]!, n[1] ? p[2]! : p[1]!);
      }
    };
    for (let k = 0; k < nz; k++)
      for (let j = 0; j < ny; j++)
        for (let i = 0; i < nx; i++) {
          if (!filled[id(i, j, k)]) continue;
          const x0 = xs[i]!, x1 = xs[i + 1]!, y0 = ys[j]!, y1 = ys[j + 1]!, z0 = zs[k]!, z1 = zs[k + 1]!;
          if (!at(i + 1, j, k)) quad([[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], [1, 0, 0]);
          if (!at(i - 1, j, k)) quad([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], [-1, 0, 0]);
          if (!at(i, j + 1, k)) quad([[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], [0, 1, 0]);
          if (!at(i, j - 1, k)) quad([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0]);
          if (!at(i, j, k + 1)) quad([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1]);
          if (!at(i, j, k - 1)) quad([[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]], [0, 0, -1]);
        }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    return g;
  }
}
