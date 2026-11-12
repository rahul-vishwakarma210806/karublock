import type { Metadata } from "next";
import { getQuiz, clip } from "@/lib/data";
import Play from "@/components/Play";

type P = { params: Promise<{ code: string }>; searchParams: Promise<{ n?: string; s?: string }> };

export async function generateMetadata({ params, searchParams }: P): Promise<Metadata> {
  const { code } = await params;
  const { n, s } = await searchParams;
  const quiz = await getQuiz(code).catch(() => null);
  if (!quiz) return { title: "Best Friend Test" };
  const q = new URLSearchParams({ c: quiz.creator, t: String(quiz.questions.length) });
  if (s !== undefined && /^\d{1,2}$/.test(s)) { q.set("s", s); q.set("n", clip(n, 24)); }
  const title = `How well do you know ${quiz.creator}?`;
  return { title, openGraph: { title, images: [`/api/og?${q}`] } };
}

export default async function Page({ params }: P) {
  const { code } = await params;
  return <Play code={code} />;
}
