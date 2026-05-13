"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function Home() {
  const { title, logos, subtitleTop, subtitleBottom, telegramLinks, footer } =
    siteConfig;

  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(buttonLabel: string) {
    if (!contact.trim() || contact.trim().length < 3) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, buttonLabel }),
      });

      if (res.ok) {
        setStatus("success");
        setContact("");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "មានបញ្ហា សូមព្យាយាមម្ដងទៀត");
        setStatus("error");
      }
    } catch {
      setErrorMsg("មានបញ្ហា សូមព្យាយាមម្ដងទៀត");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="h-1.5 bg-[#1a2060] w-full" />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-[700px] px-10 py-10 flex flex-col items-center gap-6">

          {/* Top subtitle */}
          <p className="text-[#6b3a00] font-semibold text-[30px] text-center">
            {subtitleTop}
          </p>

          <div className="w-12 border-b-2 border-[#6b3a00]" />

          {/* Logo gallery */}
          <div className="grid md:grid-cols-4 grid-cols-2 gap-4 pt-4">
            {logos.map((logo) => (
              <a
                key={logo.src}
                href={logo.href}
                className="block hover:opacity-90 transition-opacity"
              >
                <div className="rounded-full shadow-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="object-cover w-[150px] rounded-full"
                  />
                </div>
              </a>
            ))}
          </div>

          {/* Input field */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-semibold text-[#6b3a00]">
              លេខទូរស័ព្ទ / Username
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="ឧ. 0123456789 ឬ @username"
              minLength={3}
              className="w-full border-2 border-gray-200 focus:border-[#6b3a00] outline-none rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 transition-colors"
            />
          </div>

          {/* Success message */}
          {status === "success" && (
            <p className="text-green-600 font-semibold text-sm text-center">
              ✅ បានទទួលជោគជ័យ! ភ្នាក់ងារនឹងទាក់ទងអ្នកឆាប់ៗ។
            </p>
          )}

          {/* Error message */}
          {status === "error" && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          {/* Telegram buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            {telegramLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleSubmit(link.label)}
                disabled={status === "loading" || !contact.trim()}
                className="flex items-center w-[200px] justify-center gap-2 bg-[#5c2d00] hover:bg-[#7a3a00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-bold px-7 py-3 rounded-xl text-base"
              >
                {status === "loading" ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <TelegramIcon />
                )}
                {status === "loading" ? "កំពុងផ្ញើ..." : link.label}
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-gray-500 text-sm">
        {footer}
      </footer>
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}
