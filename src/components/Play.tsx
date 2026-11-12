"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Confetti, Face, type Opt } from "./Face";

type PQuiz = { code: string; creator: string; lang: string; questions: { text: string; options: Opt[] }[] };
type Row = { id: string; name: string; score: number; total: number };
type Res = { score: number; total: number; correct: number[]; board: Row[] };

function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || to === 0) { setN(to); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (now: number) => { const p = Math.min(1, (now - t0) / 900); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}</>;
}

function Board({ rows, you }: { rows: Row[]; you?: string }) {
  const { t } = useT();
  const medal = ["🥇", "🥈", "🥉"];
  return (
    <div className="card mt-5 p-4">
      <h2 className="text-xl font-black">🏆 {t("leaderboard")}</h2>
      {rows.length === 0 ? <p className="mt-2">{t("empty")}</p> : (
        <ol className="mt-2 divide-y-2 divide-[#1A1033]/10">
          {rows.map((r, i) => (
            <li key={r.id} className={`anim-in flex justify-between py-2 font-bold ${r.id === you ? "text-[#FF4F7B]" : ""}`} style={{ animationDelay: `${i * 50}ms` }}>
              <span>{medal[i] ?? `${i + 1}.`} {r.name}</span><span>{r.score}/{r.total}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function Play({ code }: { code: string }) {
  const { t } = useT();
  const [quiz, setQuiz] = useState<PQuiz | null>(null);
  const [board, setBoard] = useState<Row[]>([]);
  const [missing, setMissing] = useState(false);
  const [name, setName] = useState("");
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [res, setRes] = useState<Res | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [showBoard, setShowBoard] = useState(false);

  useEffect(() => {
    setShowBoard(new URLSearchParams(window.location.search).get("board") === "1");
    try { setName(localStorage.getItem("kb_name") || ""); } catch {}
    fetch(`/api/quiz/${code}`).then(async (r) => {
      if (!r.ok) return setMissing(true);
      const d = await r.json(); setQuiz(d.quiz); setBoard(d.board);
    }).catch(() => setMissing(true));
  }, [code]);

  const confetti = useMemo(() => !!res && res.score / res.total >= 0.7, [res]);

  if (missing) return <div className="card mt-4 p-5 text-center"><p className="font-bold">{t("notFound")}</p><Link href="/" className="btn btn-pink mt-4">{t("makeOwn")}</Link></div>;
  if (!quiz) return <p className="mt-8 text-center text-xl font-black"><span className="float inline-block">🤝</span> {t("loading")}</p>;
  const n = quiz.questions.length;

  async function pick(i: number) {
    if (busy || answers[step] !== undefined) return;
    const next = [...answers]; next[step] = i; setAnswers(next);
    if (step < n - 1) { setTimeout(() => setStep((s) => s + 1), 260); return; }
    setBusy(true); setErr("");
    try {
      const r = await fetch(`/api/quiz/${code}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), answers: next }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setRes(d); setBoard(d.board); setStep(n); window.scrollTo({ top: 0 });
    } catch { setErr(t("errNet")); setAnswers(answers); } finally { setBusy(false); }
  }

  if (showBoard && !res)
    return <><h1 className="mt-4 text-2xl font-black">{t("quizBy", { name: quiz.creator })}</h1><Board rows={board} /><button className="btn mt-4 w-full" onClick={() => setShowBoard(false)}>{t("start")}</button></>;

  if (step === -1)
    return (
      <div className="card anim-in mt-4 p-5">
        <div className="float inline-block text-5xl" aria-hidden="true">🤔</div>
        <h1 className="mt-2 text-3xl font-black leading-tight">{t("intro", { name: quiz.creator })}</h1>
        <label className="mt-5 block font-bold" htmlFor="pn">{t("yourNameShort")}</label>
        <input id="pn" className="field mt-1" maxLength={30} value={name} onChange={(e) => setName(e.target.value)} />
        <p className="mt-3 rounded-xl bg-[#FFF3B8] p-2 text-sm font-bold">🔒 {t("safety")}</p>
        <button className="btn btn-pink mt-4 w-full text-lg" disabled={!name.trim()} onClick={() => { try { localStorage.setItem("kb_name", name.trim()); } catch {} setStep(0); }}>{t("start")}</button>
        {board.length > 0 && <button className="mt-4 w-full text-sm font-bold underline" onClick={() => setShowBoard(true)}>🏆 {t("leaderboard")}</button>}
      </div>
    );

  if (step < n) {
    const q = quiz.questions[step];
    return (
      <div className="mt-2">
        <p className="font-bold">{t("of", { a: step + 1, b: n })}</p>
        <div className="mt-1 h-3 overflow-hidden rounded-full border-[2.5px] border-[#1A1033] bg-white"><div className="h-full bg-[#FF4F7B] transition-all duration-500" style={{ width: `${((step + 1) / n) * 100}%` }} /></div>
        <div key={step} className="anim-in">
          <p className="mt-4 text-sm font-bold">{t("guess", { name: quiz.creator })}</p>
          <h1 className="mt-1 text-2xl font-black leading-snug">{q.text}</h1>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {q.options.map((o, i) => (
              <button key={i} disabled={busy} aria-pressed={answers[step] === i} className={`tile ${answers[step] === i ? "sel" : ""}`} style={{ animationDelay: `${i * 70}ms` }} onClick={() => pick(i)}>
                <Face o={o} />{o.t}
              </button>
            ))}
          </div>
        </div>
        {busy && <p className="mt-4 font-bold">{t("submitting")}</p>}
        {err && <p role="alert" className="mt-4 rounded-xl border-[2.5px] border-[#1A1033] bg-[#FFD6DF] p-3 font-bold">{err}</p>}
      </div>
    );
  }

  const r = res!;
  const ratio = r.score / r.total;
  const [emoji, rank] = ratio >= 0.9 ? ["👑", t("rank1")] : ratio >= 0.7 ? ["💛", t("rank2")] : ratio >= 0.4 ? ["📚", t("rank3")] : ["👀", t("rank4")];
  const msg = ratio >= 0.8 ? t("scoreMsgHi", { name: quiz.creator }) : ratio >= 0.5 ? t("scoreMsgMid", { name: quiz.creator }) : t("scoreMsgLow", { name: quiz.creator });
  const url = `${window.location.origin}/q/${code}`;
  const scoreUrl = `${url}?n=${encodeURIComponent(name.trim())}&s=${r.score}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(t("waScore", { s: r.score, t: r.total, name: quiz.creator }) + " " + scoreUrl)}`;
  const card = `/api/og?${new URLSearchParams({ c: quiz.creator, n: name.trim(), s: String(r.score), t: String(r.total) })}`;
  const mine = r.board.find((b) => b.name.toLowerCase() === name.trim().toLowerCase())?.id;

  return (
    <>
      {confetti && <Confetti />}
      <div className="card anim-in mt-4 p-5 text-center">
        <p className="font-bold">{t("quizBy", { name: quiz.creator })}</p>
        <div className="float mt-2 text-6xl" aria-hidden="true">{emoji}</div>
        <p className="mt-1 text-2xl font-black">{rank}</p>
        <div className="my-1 text-7xl font-black text-[#FF4F7B]"><CountUp to={r.score} />/{r.total}</div>
        <p className="text-lg font-bold">{msg}</p>
        <div className="mt-5 grid gap-3">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-mint">{t("shareScore")}</a>
          <a href={card} download={`score-${r.score}-of-${r.total}.png`} className="btn btn-white">{t("download")}</a>
          <Link href="/" className="btn btn-pink">{t("makeOwn")}</Link>
        </div>
      </div>
      <Board rows={r.board} you={mine} />
      <div className="card mt-5 p-4">
        <h2 className="text-xl font-black">{t("review")}</h2>
        <ol className="mt-3 grid gap-4">
          {quiz.questions.map((q, i) => {
            const ok = answers[i] === r.correct[i];
            const a = q.options[answers[i]], c = q.options[r.correct[i]];
            return (
              <li key={i}>
                <p className="font-bold">{i + 1}. {q.text}</p>
                <p className={`font-bold ${ok ? "text-[#0B7A63]" : "text-[#C21F4A]"}`}>{ok ? "✓" : "✗"} {t("yours")}: {a.e ?? ""} {a.t}</p>
                {!ok && <p className="font-bold">{t("right")}: {c.e ?? ""} {c.t}</p>}
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
