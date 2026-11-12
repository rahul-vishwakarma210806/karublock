/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { bankById, bankView, poolFor, shuffled, type Cat } from "@/lib/bank";
import { Confetti, Face, type Opt } from "./Face";

type Draft = { key: string; bankId?: string; text: string; opts: Opt[]; answer: number };
const MAX = 15, MIN = 5;
const blankOpts = (): Opt[] => [{ t: "" }, { t: "" }, { t: "" }, { t: "" }];

async function toThumb(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const s = 192, c = document.createElement("canvas");
  c.width = c.height = s;
  const m = Math.min(bmp.width, bmp.height);
  c.getContext("2d")!.drawImage(bmp, (bmp.width - m) / 2, (bmp.height - m) / 2, m, m, 0, 0, s, s);
  return c.toDataURL("image/jpeg", 0.72);
}

export default function Create() {
  const { t, lang } = useT();
  const [stage, setStage] = useState<"intro" | "build" | "done">("intro");
  const [creator, setCreator] = useState("");
  const [cat, setCat] = useState<Cat>("school");
  const [ds, setDs] = useState<Draft[]>([]);
  const [i, setI] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const view = (d: Draft) => (d.bankId ? bankView(bankById[d.bankId], lang) : { text: d.text, opts: d.opts });
  const upd = (f: (d: Draft) => Draft) => setDs((a) => a.map((d, j) => (j === i ? f(d) : d)));
  const isCustom = (d?: Draft) => !!d && !d.bankId;

  function start() {
    if (!creator.trim()) return setErr(t("errName"));
    setErr("");
    setDs(shuffled(poolFor(cat)).slice(0, 10).map((b) => ({ key: b.id, bankId: b.id, text: "", opts: [], answer: -1 })));
    setI(0); setStage("build");
  }
  function swap() {
    const used = new Set(ds.map((d) => d.bankId));
    const next = shuffled(poolFor(cat)).find((b) => !used.has(b.id));
    if (next) upd(() => ({ key: next.id, bankId: next.id, text: "", opts: [], answer: -1 }));
  }
  function addOwn() {
    if (ds.length >= MAX) return;
    setDs((a) => [...a, { key: "c" + Date.now(), text: "", opts: blankOpts(), answer: 0 }]);
    setI(ds.length); setErr("");
  }
  function remove() {
    if (ds.length <= MIN) return;
    setDs((a) => a.filter((_, j) => j !== i));
    setI((x) => Math.min(x, ds.length - 2)); setErr("");
  }
  function valid(d: Draft) {
    if (d.bankId) return d.answer >= 0;
    const filled = d.opts.filter((o) => o.t.trim());
    return !!d.text.trim() && filled.length >= 2 && !!d.opts[d.answer]?.t.trim();
  }
  async function photo(k: number, f?: File) {
    if (!f) return;
    try { const img = await toThumb(f); upd((d) => ({ ...d, opts: d.opts.map((o, j) => (j === k ? { ...o, img } : o)) })); setErr(""); }
    catch { setErr(t("photoErr")); }
  }

  async function next() {
    const d = ds[i];
    if (!valid(d)) return setErr(isCustom(d) ? t("errQ") : t("errPick"));
    setErr("");
    if (i < ds.length - 1) return setI(i + 1);
    setBusy(true);
    try {
      const questions = ds.map((x) => {
        const v = view(x);
        if (x.bankId) return { text: v.text, options: v.opts, answer: x.answer };
        const keep = x.opts.map((o, j) => ({ o, j })).filter((p) => p.o.t.trim());
        return { text: x.text.trim(), options: keep.map((p) => ({ ...p.o, t: p.o.t.trim() })), answer: keep.findIndex((p) => p.j === x.answer) };
      });
      const r = await fetch("/api/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ creator: creator.trim(), lang, questions }) });
      const d2 = await r.json();
      if (!r.ok) throw new Error(d2.error);
      setCode(d2.code); setStage("done"); window.scrollTo({ top: 0 });
    } catch (e) { setErr(e instanceof Error && e.message.includes("photos") ? e.message : t("errNet")); }
    finally { setBusy(false); }
  }

  // ---------- done ----------
  if (stage === "done") {
    const url = `${window.location.origin}/q/${code}`;
    const wa = `https://wa.me/?text=${encodeURIComponent(t("waText", { name: creator.trim() }) + " " + url)}`;
    return (
      <div className="card anim-in mt-4 p-5 text-center">
        <Confetti />
        <div className="float text-6xl">🎉</div>
        <h1 className="mt-2 text-2xl font-black">{t("ready")}</h1>
        <p className="mt-2">{t("shareIt")}</p>
        <input readOnly value={url} className="field mt-3 text-center" onFocus={(e) => e.target.select()} />
        <div className="mt-4 grid gap-3">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-mint">{t("waShare")}</a>
          <button className="btn btn-white" onClick={() => navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })}>{copied ? t("copied") : t("copy")}</button>
          <Link href={`/q/${code}?board=1`} className="btn btn-white">{t("seeBoard")}</Link>
        </div>
      </div>
    );
  }

  // ---------- intro ----------
  if (stage === "intro")
    return (
      <>
        <section className="relative py-6">
          <span className="float absolute right-0 top-2 text-4xl" aria-hidden="true">🎒</span>
          <span className="float absolute right-12 top-16 text-3xl" style={{ animationDelay: "1.2s" }} aria-hidden="true">🎓</span>
          <h1 className="max-w-[85%] text-4xl font-black leading-tight">{t("heroTitle")}</h1>
          <p className="mt-3 text-lg">{t("heroSub2")}</p>
        </section>
        <div className="card p-4">
          <label className="font-bold" htmlFor="cn">{t("yourName")}</label>
          <input id="cn" className="field mt-1" maxLength={40} value={creator} placeholder={t("namePh")} onChange={(e) => setCreator(e.target.value)} />
          <p className="mt-4 font-bold">{t("forWho")}</p>
          <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup">
            {([["school", "🎒", "catSchool"], ["college", "🎓", "catCollege"], ["mix", "🎉", "catMix"]] as const).map(([v, e, k]) => (
              <button key={v} role="radio" aria-checked={cat === v} onClick={() => setCat(v)} className={`tile ${cat === v ? "sel" : ""}`}><span className="text-3xl">{e}</span>{t(k)}</button>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-[#FFF3B8] p-2 text-sm font-bold">🔒 {t("safety")}</p>
          {err && <p role="alert" className="mt-3 rounded-xl border-[2.5px] border-[#1A1033] bg-[#FFD6DF] p-3 font-bold">{err}</p>}
          <button className="btn btn-pink mt-4 w-full text-lg" onClick={start}>{t("startQuiz")}</button>
        </div>
      </>
    );

  // ---------- build ----------
  const d = ds[i], v = view(d), custom = isCustom(d), last = i === ds.length - 1;
  return (
    <div className="mt-2">
      <p className="font-bold">{t("of", { a: i + 1, b: ds.length })}</p>
      <div className="mt-1 h-3 overflow-hidden rounded-full border-[2.5px] border-[#1A1033] bg-white"><div className="h-full bg-[#FF4F7B] transition-all duration-500" style={{ width: `${((i + 1) / ds.length) * 100}%` }} /></div>
      <div key={d.key} className="anim-in">
        <p className="mt-4 text-sm font-bold">{custom ? t("ownHint") : t("tapYours")}</p>
        {custom ? (
          <>
            <input className="field mt-2" maxLength={200} value={d.text} placeholder={t("qPh")} aria-label={t("qPh")} onChange={(e) => upd((x) => ({ ...x, text: e.target.value }))} />
            <div className="mt-3 grid gap-3">
              {d.opts.map((o, k) => (
                <div key={k} className="flex items-center gap-2">
                  <input type="radio" name="ans" className="h-6 w-6 shrink-0 accent-[#2EC4A0]" checked={d.answer === k} onChange={() => upd((x) => ({ ...x, answer: k }))} aria-label={t("correct")} />
                  <label className="face shrink-0 cursor-pointer !h-14 !w-14 !text-2xl" title={t("photo")}>
                    {o.img ? <img src={o.img} alt="" className="h-full w-full object-cover" /> : "📷"}
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => photo(k, e.target.files?.[0])} aria-label={t("photo")} />
                  </label>
                  <input className="field" maxLength={80} value={o.t} placeholder={t("optPh", { n: k + 1 })} onChange={(e) => upd((x) => ({ ...x, opts: x.opts.map((y, j) => (j === k ? { ...y, t: e.target.value } : y)) }))} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-2xl font-black leading-snug">{v.text}</h1>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {v.opts.map((o, k) => (
                <button key={k} className={`tile ${d.answer === k ? "sel" : ""}`} style={{ animationDelay: `${k * 70}ms` }} aria-pressed={d.answer === k} onClick={() => { upd((x) => ({ ...x, answer: k })); setErr(""); }}>
                  <Face o={o} />{o.t}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {err && <p role="alert" className="mt-4 rounded-xl border-[2.5px] border-[#1A1033] bg-[#FFD6DF] p-3 font-bold">{err}</p>}
      <div className="mt-5 grid grid-cols-[1fr_2fr] gap-3">
        <button className="btn btn-white" disabled={i === 0 || busy} onClick={() => { setI(i - 1); setErr(""); }}>{t("back")}</button>
        <button className="btn btn-pink text-lg" disabled={busy} onClick={next}>{busy ? t("creating") : last ? t("create") : t("next")}</button>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-bold underline">
        {!custom && <button onClick={swap}>🔄 {t("swap")}</button>}
        {ds.length < MAX && <button onClick={addOwn}>✍️ {t("own")}</button>}
        {ds.length > MIN && <button onClick={remove}>🗑️ {t("del")}</button>}
      </div>
    </div>
  );
}
