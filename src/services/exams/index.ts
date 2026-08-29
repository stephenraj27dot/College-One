import { EntranceExam } from "@/types";
import { verifiedEntranceExams } from "@/lib/data/verifiedTamilNaduData";

export async function getEntranceExams(stream?: string): Promise<EntranceExam[]> {
  if (stream) {
    return verifiedEntranceExams.filter((e) =>
      e.streams.some((s) => s.toLowerCase().includes(stream.toLowerCase()))
    );
  }
  return verifiedEntranceExams;
}

export async function getExamBySlug(slug: string): Promise<EntranceExam | null> {
  const exam = verifiedEntranceExams.find((e) => e.slug.toLowerCase() === slug.toLowerCase());
  return exam || null;
}
