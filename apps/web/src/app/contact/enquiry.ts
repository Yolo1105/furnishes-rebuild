import type { ContactTopic } from "@/lib/routes";

/** What an enquiry can be about, as the form offers it. A link picks one with `?topic=` and its id. */
export const TOPICS: readonly { id: ContactTopic; name: string }[] = [
  { id: "product", name: "A question about a piece" },
  { id: "room", name: "Advice on a room" },
  { id: "visit", name: "A visit to my room" },
  { id: "office", name: "An office or bulk order" },
  { id: "custom", name: "A custom size or design" },
  { id: "order", name: "Ordering, or an order I've placed" },
];

export const isTopic = (value: unknown): value is ContactTopic => TOPICS.some((t) => t.id === value);

/** The form's fields, as sent to /api/enquiry. */
export type EnquiryField = "topic" | "piece" | "name" | "email" | "message";
export type Enquiry = Record<EnquiryField, string>;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

/** The longest each field may be. */
export const LIMITS: Record<EnquiryField, number> = { topic: 20, piece: 60, name: 100, email: 200, message: 4000 };

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Checks an enquiry, in the browser before sending and on the server on arrival: the fields trimmed, and what is wrong with each. */
export function validateEnquiry(input: unknown): { enquiry: Enquiry; errors: EnquiryErrors } {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const text = (key: EnquiryField) => (typeof raw[key] === "string" ? (raw[key] as string).trim() : "");
  const enquiry: Enquiry = { topic: text("topic"), piece: text("piece"), name: text("name"), email: text("email"), message: text("message") };
  const errors: EnquiryErrors = {};

  if (!isTopic(enquiry.topic)) errors.topic = "Pick what it's about.";
  if (!enquiry.name) errors.name = "Tell us your name.";
  if (!enquiry.email) errors.email = "Tell us where to reply.";
  else if (!EMAIL_FORMAT.test(enquiry.email)) errors.email = "Check the email address, for example alex@example.com.";
  if (!enquiry.message) errors.message = "Write a line or two about what you need.";

  for (const key of Object.keys(LIMITS) as EnquiryField[]) {
    if (!errors[key] && enquiry[key].length > LIMITS[key]) errors[key] = `Keep this under ${LIMITS[key].toLocaleString("en-SG")} characters.`;
  }
  return { enquiry, errors };
}
