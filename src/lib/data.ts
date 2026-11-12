import { randomBytes } from "crypto";

export type Opt = { t: string; e?: string; img?: string };
export type Q = { text: string; options: Opt[]; answer: number };
export type Quiz = { code: string; creator: string; lang: "en" | "hi"; questions: Q[]; createdAt: string };
export type Attempt = { id: string; code: string; name: string; score: number; total: number; createdAt: string };

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
const useSb = !!(SB_URL && SB_KEY);

// In-memory fallback so the app works with zero setup (resets on restart).
const g = globalThis as unknown as { __kb?: { quizzes: Map<string, Quiz>; attempts: Attempt[] } };
g.__kb ||= { quizzes: new Map(), attempts: [] };
const mem = g.__kb;

async function sb(path: string, init: RequestInit = {}) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=representation", ...(init.headers || {}) },
  });
  if (!r.ok) throw new Error(`Supabase: ${await r.text()}`);
  return r.json();
}

const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const newCode = () => Array.from(randomBytes(7), (b) => ALPHABET[b % ALPHABET.length]).join("");

export async function createQuiz(creator: string, lang: "en" | "hi", questions: Q[]): Promise<string> {
  const code = newCode();
  if (useSb) await sb("quizzes", { method: "POST", body: JSON.stringify({ code, creator, lang, questions }) });
  else mem.quizzes.set(code, { code, creator, lang, questions, createdAt: new Date().toISOString() });
  return code;
}

export async function getQuiz(code: string): Promise<Quiz | null> {
  if (!/^[a-z0-9]{4,12}$/.test(code)) return null;
  if (!useSb) return mem.quizzes.get(code) ?? null;
  const rows = await sb(`quizzes?code=eq.${code}&select=*`);
  const r = rows[0];
  return r ? { code: r.code, creator: r.creator, lang: r.lang, questions: r.questions, createdAt: r.created_at } : null;
}

export async function addAttempt(code: string, name: string, score: number, total: number) {
  if (useSb) await sb("attempts", { method: "POST", body: JSON.stringify({ code, name, score, total }) });
  else mem.attempts.push({ id: randomBytes(6).toString("hex"), code, name, score, total, createdAt: new Date().toISOString() });
}

// Best score per player name, highest first.
export async function leaderboard(code: string, limit = 20): Promise<Attempt[]> {
  let rows: Attempt[];
  if (!useSb) rows = mem.attempts.filter((a) => a.code === code);
  else {
    const r = await sb(`attempts?code=eq.${code}&select=*&order=score.desc,created_at.asc&limit=300`);
    rows = r.map((x: any) => ({ id: x.id, code: x.code, name: x.name, score: x.score, total: x.total, createdAt: x.created_at }));
  }
  rows.sort((a, b) => b.score - a.score || a.createdAt.localeCompare(b.createdAt));
  const seen = new Set<string>();
  return rows.filter((a) => { const k = a.name.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, limit);
}

export const publicQuiz = (q: Quiz) => ({ code: q.code, creator: q.creator, lang: q.lang, questions: q.questions.map((x) => ({ text: x.text, options: x.options })) });

export const clip = (s: unknown, n: number) => String(s ?? "").trim().slice(0, n);

const IMG = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/;
const MAX_IMG = 40_000;
const MAX_TOTAL_IMG = 1_000_000;

export function validateQuiz(body: any): { creator: string; lang: "en" | "hi"; questions: Q[] } | string {
  const creator = clip(body?.creator, 40);
  if (!creator) return "Name is required";
  const lang = body?.lang === "hi" ? "hi" : "en";
  if (!Array.isArray(body?.questions) || body.questions.length < 3 || body.questions.length > 15) return "Add between 3 and 15 questions";
  let imgTotal = 0;
  const questions: Q[] = [];
  for (const q of body.questions) {
    const text = clip(q?.text, 200);
    const raw: any[] = Array.isArray(q?.options) ? q.options.slice(0, 4) : [];
    const options: Opt[] = [];
    for (const o of raw) {
      const t = clip(o?.t, 80);
      if (!t) continue;
      const opt: Opt = { t };
      const e = clip(o?.e, 8);
      if (e) opt.e = e;
      if (typeof o?.img === "string" && o.img.length <= MAX_IMG && IMG.test(o.img)) { opt.img = o.img; imgTotal += o.img.length; }
      options.push(opt);
    }
    const answer = Number(q?.answer);
    if (!text || options.length < 2 || !Number.isInteger(answer) || answer < 0 || answer >= options.length) return "Every question needs text, 2+ options and a correct answer";
    questions.push({ text, options, answer });
  }
  if (imgTotal > MAX_TOTAL_IMG) return "Too many photos. Use fewer photos.";
  return { creator, lang, questions };
}
