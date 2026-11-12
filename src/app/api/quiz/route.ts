import { NextResponse } from "next/server";
import { createQuiz, validateQuiz } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const v = validateQuiz(await req.json());
    if (typeof v === "string") return NextResponse.json({ error: v }, { status: 400 });
    const code = await createQuiz(v.creator, v.lang, v.questions);
    return NextResponse.json({ code });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not save quiz" }, { status: 500 });
  }
}
