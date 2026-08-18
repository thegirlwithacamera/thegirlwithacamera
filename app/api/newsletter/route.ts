import { Resend } from "resend";
import { NextResponse } from "next/server";

// Substack est la vraie liste : c'est la qu'on ecrit le journal.
// Resend reste en second, comme copie de securite, pour qu'aucune adresse
// ne soit perdue si Substack refuse l'appel.
const SUBSTACK_URL =
  process.env.SUBSTACK_URL ?? "https://thegirlwithacamera.substack.com";

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

/**
 * Inscrit l'adresse en abonne GRATUIT sur Substack.
 *
 * C'est l'endpoint qu'utilise le formulaire officiel de Substack. Il n'est pas
 * documente publiquement : si Substack le change un jour, cette fonction
 * renvoie false, la copie Resend prend le relais et rien n'est perdu.
 */
async function subscribeToSubstack(email: string, pageUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${SUBSTACK_URL}/api/v1/free`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        first_url: pageUrl,
        first_referrer: "",
        current_url: pageUrl,
        current_referrer: "",
        referral_code: "",
        source: "embed",
        referring_pub_id: "",
        additional_referring_pub_id: "",
      }),
    });
    if (!res.ok) {
      console.error("Substack subscribe failed:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Substack subscribe error:", err);
    return false;
  }
}

async function copyToResend(email: string, lang: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const audienceId = await resolveAudienceId(resend);

    if (audienceId) {
      try {
        await resend.contacts.create({ email, unsubscribed: false, audienceId });
      } catch {
        // Contact may already exist : ignore and treat as success.
      }
      return true;
    }

    // Fallback : notify by email so nothing is lost.
    await resend.emails.send({
      from: "The Girl With A Camera <hello@thegirlwithacamera.com>",
      to: "hello@thegirlwithacamera.com",
      subject: `Newsletter signup · ${email}`,
      text: `New subscriber: ${email} (lang: ${lang})`,
    });
    return true;
  } catch (err) {
    console.error("Resend copy error:", err);
    return false;
  }
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

    const pageUrl = request.headers.get("referer") ?? "https://www.thegirlwithacamera.com/";

    const [substackOk, resendOk] = await Promise.all([
      subscribeToSubstack(email, pageUrl),
      copyToResend(email, lang),
    ]);

    if (!substackOk && !resendOk) {
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    return NextResponse.json({ success: true, substack: substackOk });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
