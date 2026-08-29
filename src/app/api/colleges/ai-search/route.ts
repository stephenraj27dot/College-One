import { NextRequest, NextResponse } from "next/server";
import { fetchCollegeViaGeminiAI } from "@/services/aiCollegeService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || searchParams.get("query");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ success: false, message: "Query too short" }, { status: 400 });
  }

  try {
    const college = await fetchCollegeViaGeminiAI(q);
    if (college) {
      return NextResponse.json({ success: true, college });
    }
    return NextResponse.json({ success: false, message: "College not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
