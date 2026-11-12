import { NextResponse } from "next/server";
import { getQuiz, leaderboard, publicQuiz } from "@/lib/data";

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const quiz = await getQuiz(code);
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    return NextResponse.json({ quiz: publicQuiz(quiz), board: await leaderboard(code) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
