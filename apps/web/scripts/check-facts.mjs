// Lists the facts not yet real (src/lib/facts.ts), and fails if there are any.
import { FACTS } from "../src/lib/facts.ts";

const open = Object.entries(FACTS).filter(([, fact]) => fact.status !== "real");
for (const [key, fact] of open) console.log(`${fact.status}  ${key}: ${fact.value}`);
console.log(`${open.length} fact${open.length === 1 ? "" : "s"} to confirm`);
process.exitCode = open.length ? 1 : 0;
