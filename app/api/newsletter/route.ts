import { Resend } from "resend";
import { NextResponse } from "next/server";

// Simple in-memory rate limit (one process, low traffic OK).
const RATE: Map<string, { count: number; resetAt: number }> = new Map();
const WINDOW_MS = 60_000;
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

let cachedAudienceId: string | null = null;

async function resolveAudienceId(resend: Resend): Promise<string | null> {
  if (cachedAudienceId) return cachedAudienceId;
  if (process.env.RESEND_AUDIENCE_ID) {
    cachedAudienceId = process.env.RESEND_AUDIENCE_ID;
    return cachedAudienceId;
  }
  // Auto-discover : pick the first audience on the account.
  try {
    const list = await resend.audiences.list();
    const first = list.data?.data?.[0];
    if (first?.id) {
      cachedAudienceId = first.id;
      return cachedAudienceId;
    }
  } catch {
    // ignore, fallback to email notification
  }
  return null;
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

    const { email, lang = "en" } = body as { email?: string; lang?: string };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Newsletter service not configured" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const audienceId = await resolveAudienceId(resend);

    if (audienceId) {
      try {
        await resend.contacts.create({ email, unsubscribed: false, audienceId });
      } catch {
        // Contact may already exist : ignore and treat as success.
      }
    } else {
      // Fallback : notify by email so nothing is lost.
      await resend.emails.send({
        from: "The Girl With A Camera <hello@thegirlwithacamera.com>",
        to: "hello@thegirlwithacamera.com",
        subject: `Newsletter signup · ${email}`,
        text: `New subscriber: ${email} (lang: ${lang})`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
