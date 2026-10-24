/**
 * The demo account's facts, in a plain module so the server and the browser
 * both get real values. Imported from the client-only session file, the
 * server would get client references instead and read no cookie.
 */
export const DEMO_COOKIE = "furnishes-demo";

/** The demo account's name. Its first name, "Demo", is what the bar shows. */
export const DEMO_NAME = "Demo User";

/** The first word of a name: what the bar shows once someone is signed in. */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}
