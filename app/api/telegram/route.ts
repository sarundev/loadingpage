import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { contact, buttonLabel, companyNames } = await req.json();

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { error: "Telegram credentials not configured" },
      { status: 500 }
    );
  }

  if (!contact || typeof contact !== "string" || contact.trim().length < 3) {
    return NextResponse.json({ error: "Invalid contact" }, { status: 400 });
  }

  const raw = contact.trim();
  const isUsername = raw.startsWith("@");
  const username = isUsername ? raw.slice(1) : null;

  const contactDisplay = isUsername
    ? `<a href="https://t.me/${username}">${raw}</a>`
    : `<code>${raw}</code>`;

  const company =
    Array.isArray(companyNames) && companyNames.length > 0
      ? companyNames.join(", ")
      : "—";

  const text =
    `🔔 <b>ការចុះឈ្មោះថ្មី</b>\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🏢 ក្រុមហ៊ុន: <b>${company}</b>\n` +
    `📱 លេខទូរស័ព្ទ / Username: ${contactDisplay}\n` +
    `━━━━━━━━━━━━━━━`;

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err.description }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
