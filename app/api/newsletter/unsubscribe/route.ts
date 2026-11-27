import { Resend } from "resend";
import { NextResponse } from "next/server";

// Desinscription du journal par email : la personne donne son adresse, on la
// passe en "desinscrite" dans la liste Resend. Elle ne recoit plus rien.
// La reponse est la meme que l'adresse soit dans la liste ou non, pour ne pas
// reveler qui est inscrit.

const RATE: Map<string, { count: number; resetAt: number }> = new Map();
function rateLimit(key: string): boolean {
  const now = Date.now();
  const e = RATE.get(key);
  if (!e || e.resetAt < now) {
    RATE.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  e.count += 1;
  return e.count <= 4;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!rateLimit(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = (await request.json().catch(() => null)) as { email?: string } | null;
    const email = body?.email?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "Unavailable" }, { status: 500 });

    const resend = new Resend(process.env.RESEND_API_KEY);
    let audienceId = process.env.RESEND_AUDIENCE_ID ?? null;
    if (!audienceId) {
      const list = await resend.audiences.list();
      audienceId = list.data?.data?.[0]?.id ?? null;
    }
    if (audienceId) {
      try {
        await resend.contacts.update({ email, audienceId, unsubscribed: true });
      } catch {
        // adresse absente de la liste : rien a faire
      }
    } else {
      // Pas de liste Resend : on previent par mail pour que rien ne se perde.
      await resend.emails.send({
        from: "The Girl With A Camera <hello@thegirlwithacamera.com>",
        to: "hello@thegirlwithacamera.com",
        subject: `Newsletter unsubscribe · ${email}`,
        text: `Unsubscribe request: ${email}`,
      });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unsubscribe API error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
