import { NextResponse } from "next/server";
import { addAttempt, clip, getQuiz, leaderboard } from "@/lib/data";

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const quiz = await getQuiz(code);
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    const body = await req.json();
    const name = clip(body?.name, 30);
    const answers: unknown = body?.answers;
    if (!name || !Array.isArray(answers) || answers.length !== quiz.questions.length)
      return NextResponse.json({ error: "Name and all answers are required" }, { status: 400 });
    const score = quiz.questions.reduce((s, q, i) => s + (Number(answers[i]) === q.answer ? 1 : 0), 0);
    await addAttempt(code, name, score, quiz.questions.length);
    return NextResponse.json({ score, total: quiz.questions.length, correct: quiz.questions.map((q) => q.answer), board: await leaderboard(code) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
