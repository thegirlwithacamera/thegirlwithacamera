import { Resend } from "resend";
import { NextResponse } from "next/server";

// Very small in-memory rate limit. Good enough for low-volume sites; replace
// with Upstash/Vercel KV if traffic grows.
const RATE: Map<string, { count: number; resetAt: number }> = new Map();
const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 4;

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = RATE.get(key);
  if (!entry || entry.resetAt < now) {
    RATE.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_PER_WINDOW;
}

const TYPE_LABELS: Record<string, string> = {
  brand: "Brand content",
  editorial: "Editorial / documentary",
  print: "Prints",
  mentoring: "Mentoring",
  press: "Press / interview",
  other: "Other",
};

const BUDGET_LABELS: Record<string, string> = {
  "under-2k": "Under €2,000",
  "2-5k": "€2,000 – €5,000",
  "5-15k": "€5,000 – €15,000",
  "15k+": "€15,000+",
  tbd: "To be discussed",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const {
      name, email, company = "", type = "", budget = "", deadline = "", message, lang = "en",
    } = body as Record<string, string>;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (message.length > 5000 || name.length > 200) {
      return NextResponse.json({ error: "Field too long" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      // Fail loudly in dev, gracefully in prod.
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const subject = `New ${TYPE_LABELS[type] ?? "enquiry"} from ${name}${company ? ` — ${company}` : ""}`;

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      company && `Company: ${company}`,
      type && `Type: ${TYPE_LABELS[type] ?? type}`,
      budget && `Budget: ${BUDGET_LABELS[budget] ?? budget}`,
      deadline && `Deadline: ${deadline}`,
      `Lang: ${lang}`,
      "",
      message,
    ].filter(Boolean).join("\n");

    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px;">
        <h2 style="font-family: Georgia, serif;">${escapeHtml(subject)}</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding:6px 12px 6px 0; color:#737373;">Name</td><td>${escapeHtml(name)}</td></tr>
          <tr><td style="padding:6px 12px 6px 0; color:#737373;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          ${company ? `<tr><td style="padding:6px 12px 6px 0; color:#737373;">Company</td><td>${escapeHtml(company)}</td></tr>` : ""}
          ${type ? `<tr><td style="padding:6px 12px 6px 0; color:#737373;">Type</td><td>${escapeHtml(TYPE_LABELS[type] ?? type)}</td></tr>` : ""}
          ${budget ? `<tr><td style="padding:6px 12px 6px 0; color:#737373;">Budget</td><td>${escapeHtml(BUDGET_LABELS[budget] ?? budget)}</td></tr>` : ""}
          ${deadline ? `<tr><td style="padding:6px 12px 6px 0; color:#737373;">Deadline</td><td>${escapeHtml(deadline)}</td></tr>` : ""}
          <tr><td style="padding:6px 12px 6px 0; color:#737373;">Lang</td><td>${escapeHtml(lang)}</td></tr>
        </table>
        <hr style="margin:24px 0; border:0; border-top:1px solid #e5e5e5;" />
        <p style="white-space: pre-wrap; line-height:1.6;">${escapeHtml(message)}</p>
      </div>
    `;

    await resend.emails.send({
      from: "The Girl With A Camera <hello@thegirlwithacamera.com>",
      to: "hello@thegirlwithacamera.com",
      replyTo: email,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
