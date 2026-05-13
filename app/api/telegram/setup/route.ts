import { NextResponse } from "next/server";

// Visit /api/telegram/setup in your browser to find the correct chat ID.
// Make sure your bot has sent or received a message in the group first.
export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const data = await res.json();

  if (!data.ok) {
    return NextResponse.json({ error: data.description }, { status: 502 });
  }

  // Extract unique chats from updates
  const chats = new Map<number, { id: number; title: string; type: string }>();
  for (const update of data.result) {
    const msg = update.message || update.channel_post || update.my_chat_member?.chat;
    if (msg?.chat) {
      const c = msg.chat;
      chats.set(c.id, { id: c.id, title: c.title ?? c.username ?? "private", type: c.type });
    }
  }

  return NextResponse.json({
    hint: "Copy the 'id' of your group below and paste it into TELEGRAM_CHAT_ID in .env.local",
    chats: [...chats.values()],
    raw_update_count: data.result.length,
  });
}
