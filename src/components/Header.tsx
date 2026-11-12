"use client";
import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, t } = useT();
  return (
    <header className="mx-auto flex max-w-xl items-center justify-between px-4 py-4">
      <Link href="/" className="text-lg font-black">🤝 {t("brand")}</Link>
      <div className="flex overflow-hidden rounded-xl border-[2.5px] border-[#1A1033] bg-white text-sm font-bold" role="group" aria-label="Language">
        {(["en", "hi"] as const).map((l) => (
          <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={`px-3 py-1.5 ${lang === l ? "bg-[#1A1033] text-white" : ""}`}>
            {l === "en" ? "EN" : "हिं"}
          </button>
        ))}
      </div>
    </header>
  );
}
