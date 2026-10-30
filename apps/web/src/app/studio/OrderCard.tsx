import { ORDER } from "@/features/walk/order";
import styles from "./OrderCard.module.css";

/** Where the order is once it is placed, in turn, as the delivery step shows them. */
const STAGES = ["Ordered", "Being made", "Out for delivery", "At your door"] as const;

/** The delivery slot picked at checkout, and how near it is once out: an example's. */
const SLOT = "Saturday, 10 am – 1 pm";
const NEAR = "About 40 minutes away";

const Tick = () => (
  <svg className={styles.tick} viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8.5l3.2 3L13 4.5" />
  </svg>
);

/**
 * The order's card over the 3D room, through the tour's last steps (`step`
 * 0 to 4 from FIRST_ORDER_STEP): the piece drawn in, its finishes (`finish`,
 * the one on it), the cart and checkout (`placed` once ordered), its way
 * home (`stage`, of STAGES), and home (`built` once put together). An example order, and says so: no
 * stock or price stands behind it.
 */
export function OrderCard({
  step,
  finish,
  placed,
  stage,
  built,
}: {
  step: number;
  finish: number;
  placed: boolean;
  stage: number;
  built: boolean;
}) {
  const on = ORDER.finishes[finish]!;
  return (
    <div className={styles.card}>
      <p className={styles.tag}>Example order</p>
      {/* keyed, so each step's card comes in afresh */}
      <div key={step} className={styles.part}>
        {step === 0 && (
          <>
            <h3 className={styles.name}>{ORDER.name}</h3>
            <p className={styles.line}>{ORDER.size}</p>
            <p className={styles.line}>{ORDER.made}</p>
            <p className={styles.state}>
              <Tick /> Drawn in by the way to the hall
            </p>
          </>
        )}
        {step === 1 && (
          <>
            <h3 className={styles.name}>{ORDER.name}</h3>
            <p className={styles.label}>Finish</p>
            <ul className={styles.options}>
              {ORDER.finishes.map((f, i) => (
                <li key={f.name} className={styles.option} data-on={i === finish || undefined}>
                  <span className={styles.swatch} style={{ background: f.color }} />
                  {f.name}
                </li>
              ))}
            </ul>
            <p className={styles.label}>Size</p>
            <p className={styles.line}>{ORDER.size}</p>
          </>
        )}
        {step === 2 && (
          <>
            <p className={styles.label}>Cart · 1 piece</p>
            <div className={styles.item}>
              <span className={styles.swatch} style={{ background: on.color }} />
              <div>
                <h3 className={styles.name}>{ORDER.name}</h3>
                <p className={styles.line}>
                  {on.name} · {ORDER.size}
                </p>
              </div>
            </div>
            <p className={styles.label}>Delivery</p>
            <p className={styles.line}>{SLOT}</p>
            <p className={styles.button} data-done={placed || undefined}>
              {placed ? (
                <>
                  <Tick /> Order placed
                </>
              ) : (
                "Place order"
              )}
            </p>
          </>
        )}
        {step === 3 && (
          <>
            <p className={styles.label}>Your order</p>
            <ol className={styles.stages}>
              {STAGES.map((name, i) => (
                <li key={name} className={styles.stage} data-done={i < stage || undefined} data-on={i === stage || undefined}>
                  <span className={styles.dot} />
                  <span>
                    {name}
                    {i === 2 && i === stage && <span className={styles.near}>{NEAR}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
        {step === 4 && (
          <>
            <p className={styles.state}>
              {built ? (
                <>
                  <Tick /> Delivered and put together
                </>
              ) : (
                "At your door, being put together"
              )}
            </p>
            <h3 className={styles.name}>{ORDER.name}</h3>
            <p className={styles.line}>
              {on.name}, by the way to the hall
            </p>
          </>
        )}
      </div>
    </div>
  );
}
