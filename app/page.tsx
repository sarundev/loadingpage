"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

type TelegramLink = { label: string; href: string };
type Logo = { src: string; alt: string; name: string };

export default function Home() {
  const { logos, subtitleTop, telegramLinks, footer } = siteConfig;

  const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successLink, setSuccessLink] = useState<TelegramLink | null>(null);

  async function handleSubmit(link: TelegramLink) {
    if (!contact.trim() || contact.trim().length < 3) return;
    if (!selectedLogo) {
      setErrorMsg("សូមជ្រើសរើស Company ជាមុនសិន");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          buttonLabel: link.label,
          companyName: selectedLogo.name,
          companyLogo: selectedLogo.src,
        }),
      });

      if (res.ok) {
        setContact("");
        setSelectedLogo(null);
        setStatus("idle");
        setSuccessLink(link);
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

          <p className="text-[#6b3a00] font-semibold text-[30px] text-center">
            {subtitleTop}
          </p>

          <div className="w-12 border-b-2 border-[#6b3a00]" />

          {/* Logo selection */}
          <div className="w-full">
            <p className="text-sm font-semibold text-[#6b3a00] mb-3">
              ជ្រើសរើស Company
            </p>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
              {logos.map((logo) => {
                const isSelected = selectedLogo?.src === logo.src;
                return (
                  <button
                    key={logo.src}
                    type="button"
                    onClick={() => {
                      setSelectedLogo(logo);
                      if (status === "error") setStatus("idle");
                    }}
                    className={`flex flex-col items-center gap-2 rounded-2xl p-2 border-2 transition-all focus:outline-none ${
                      isSelected
                        ? "border-[#6b3a00] shadow-md scale-105"
                        : "border-transparent hover:border-[#c8913a]"
                    }`}
                  >
                    <div className="rounded-full shadow-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="object-cover w-37.5 rounded-full"
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold text-center ${
                        isSelected ? "text-[#6b3a00]" : "text-gray-500"
                      }`}
                    >
                      {logo.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-[#6b3a00] text-white px-2 py-0.5 rounded-full">
                        ✓ បានជ្រើស
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
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
                if (status === "error") setStatus("idle");
              }}
              placeholder="ឧ. 0123456789 ឬ @username"
              minLength={3}
              className="w-full border-2 border-gray-200 focus:border-[#6b3a00] outline-none rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 transition-colors"
            />
          </div>

          {status === "error" && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          {/* Telegram buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            {telegramLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleSubmit(link)}
                disabled={status === "loading" || !contact.trim()}
                className="flex items-center w-50 justify-center gap-2 bg-[#5c2d00] hover:bg-[#7a3a00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-bold px-7 py-3 rounded-xl text-base"
              >
                {status === "loading" ? (
                  <span className="animate-spin inline-block">⏳</span>
                ) : (
                  <TelegramIcon />
                )}
                {status === "loading" ? "កំពុងផ្ញើ..." : "ចុះឈ្មោះ"}
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-gray-500 text-sm">
        {footer}
      </footer>

      {/* Success popup */}
      {successLink && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => e.target === e.currentTarget && setSuccessLink(null)}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5 relative">
            <button
              onClick={() => setSuccessLink(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl">
              ✅
            </div>

            <h2 className="text-xl font-extrabold text-[#6b3a00] text-center">
              បានទទួលជោគជ័យ!
            </h2>
            <p className="text-gray-500 text-sm text-center leading-relaxed">
              សូមចុចប៊ូតុងខាងក្រោម ដើម្បីចូល Telegram
              និងទំនាក់ទំនងជាមួយភ្នាក់ងាររបស់យើង។
            </p>

            <a
              href={successLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#5c2d00] hover:bg-[#7a3a00] transition-colors text-white font-bold py-3 rounded-xl text-base"
            >
              <TelegramIcon />
              {successLink.label}
            </a>

            <button
              onClick={() => setSuccessLink(null)}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              បិទ
            </button>
          </div>
        </div>
      )}
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
