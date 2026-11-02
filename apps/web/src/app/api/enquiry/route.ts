import { NextResponse } from "next/server";
import { PRODUCTS } from "@/features/products/catalogue";
import { EMAIL } from "@/lib/contact";
import { READY_MADE_PIECE } from "@/lib/routes";
import { TOPICS, validateEnquiry } from "../../contact/enquiry";

const PIECE_NAMES = new Map<string, string>([...PRODUCTS.map((p) => [p.id, p.name] as const), [READY_MADE_PIECE, "Ready-made furniture"]]);

/**
 * An enquiry from the contact form: checked again here, then emailed through
 * Resend when RESEND_API_KEY is set (from ENQUIRY_FROM to ENQUIRY_TO, both
 * defaulting to our address); without a key it is written to the server log,
 * so the form works end to end in development.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const { enquiry, errors } = validateEnquiry(body);
  if (enquiry.piece && !PIECE_NAMES.has(enquiry.piece)) errors.piece = "Pick a piece from the list.";
  if (Object.keys(errors).length > 0) return NextResponse.json({ ok: false, errors }, { status: 400 });

  const topic = TOPICS.find((t) => t.id === enquiry.topic)?.name ?? enquiry.topic;
  const piece = enquiry.piece ? PIECE_NAMES.get(enquiry.piece) : undefined;
  const subject = `Enquiry from ${enquiry.name}: ${topic}${piece ? `, ${piece}` : ""}`;
  const text = [`Topic: ${topic}`, `Piece: ${piece ?? "Not given"}`, `Name: ${enquiry.name}`, `Email: ${enquiry.email}`, "", enquiry.message].join("\n");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[enquiry] ${subject}\n${text}`);
    return NextResponse.json({ ok: true });
  }

  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM ?? EMAIL,
      to: [process.env.ENQUIRY_TO ?? EMAIL],
      reply_to: enquiry.email,
      subject,
      text,
    }),
  }).catch(() => null);

  if (!sent?.ok) {
    console.error(`[enquiry] Resend failed (${sent?.status ?? "no response"}): ${subject}`);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
