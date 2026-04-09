import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.error("API KEY STATUS:", process.env.RESEND_API_KEY ? `present (starts with ${process.env.RESEND_API_KEY.slice(0, 5)})` : "UNDEFINED");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "The Girl With A Camera <hello@thegirlwithacamera.com>",
      to: "hello@thegirlwithacamera.com",
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
