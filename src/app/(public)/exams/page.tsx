import Link from "next/link";
import { verifiedEntranceExams } from "@/lib/data/verifiedTamilNaduData";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, ShieldCheck, ArrowRight, BookOpen } from "lucide-react";

export const metadata = {
  title: "Tamil Nadu Entrance Exams & Counselling 2026",
  description: "Official schedules and details for TNEA, Tamil Nadu MBBS/BDS Medical Counselling, TANCET, and TNDALU Law Admissions 2026.",
};

export default function ExamsPage() {
  return (
    <div className="py-10 bg-slate-50 min-h-screen pb-24">
      <Container size="xl" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" className="text-[10px]">
            Counselling & Allotments
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tamil Nadu Entrance & Counselling Portal 2026
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Important dates, conducting authorities, and single-window admission procedures across Tamil Nadu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {verifiedEntranceExams.map((exam) => (
            <Card key={exam.id} className="p-6 sm:p-7 space-y-5 hover:border-blue-400 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="gold" className="font-bold">
                    {exam.short_name}
                  </Badge>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {exam.exam_level} Level
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {exam.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium">
                    Authority: {exam.conducting_authority}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {exam.description}
                </p>

                {/* Important Dates Timeline */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
                    Important Schedule
                  </span>
                  <div className="space-y-1.5">
                    {exam.important_dates.map((d, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
                        <span className="text-slate-700 font-medium">{d.title}</span>
                        <span className="font-bold text-blue-600">{d.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">

                <Link href={`/colleges`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                    Participating Colleges
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
