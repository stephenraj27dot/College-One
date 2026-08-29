"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Compass, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";

export default function CourseFinderPage() {
  const [stream, setStream] = useState<string | null>(null);
  const [interest, setInterest] = useState<string | null>(null);
  const [careerGoal, setCareerGoal] = useState<string | null>(null);

  const getRecommendations = () => {
    if (stream === "Maths-Biology" || stream === "Pure-Science") {
      if (interest === "Healthcare") {
        return [
          { name: "MBBS (Medicine & Surgery)", degree: "UG • 5.5 Yrs", why: "Strong alignment with Biology & patient healthcare." },
          { name: "B.Sc. Nursing & Paramedical", degree: "UG • 4 Yrs", why: "High clinical demand in Tamil Nadu and global hospital networks." },
          { name: "B.Pharm (Pharmacy)", degree: "UG • 4 Yrs", why: "Opportunities in clinical trials, pharmaceutical R&D, and formulations." },
        ];
      }
      return [
        { name: "B.Tech. Biotechnology / Biomedical", degree: "UG • 4 Yrs", why: "Combines biological engineering with healthcare technology." },
        { name: "B.Sc. (Hons) Agriculture", degree: "UG • 4 Yrs", why: "Affiliated to TNAU with extensive government agronomy roles." },
      ];
    }

    if (stream === "Computer-Maths") {
      if (interest === "Software & AI") {
        return [
          { name: "B.E. Computer Science & Engineering", degree: "UG • 4 Yrs", why: "Flagship engineering discipline with top campus placement record in TN." },
          { name: "B.Tech. AI & Data Science", degree: "UG • 4 Yrs", why: "High demand specialization in machine learning, analytics, and automation." },
          { name: "B.Tech. Information Technology", degree: "UG • 4 Yrs", why: "Industry-aligned software engineering and cloud systems." },
        ];
      }
      return [
        { name: "B.E. Electronics & Communication (ECE)", degree: "UG • 4 Yrs", why: "Versatile degree spanning semiconductor chips, IoT, and software roles." },
        { name: "B.E. Robotics & Automation", degree: "UG • 4 Yrs", why: "Focused on industrial automation and advanced robotics in TN manufacturing corridors." },
      ];
    }

    if (stream === "Commerce-Accountancy") {
      return [
        { name: "B.Com (General / Professional Accounting)", degree: "UG • 3 Yrs", why: "Premier foundation for Chartered Accountancy (CA) and corporate finance." },
        { name: "BBA (Bachelor of Business Administration)", degree: "UG • 3 Yrs", why: "Strong foundation in marketing, operations, and MBA readiness." },
        { name: "5-Year Integrated B.Com LL.B (Honours)", degree: "UG • 5 Yrs", why: "Corporate law specialization governed by TNDALU & Bar Council of India." },
      ];
    }

    return [
      { name: "5-Year Integrated B.A. LL.B (Honours)", degree: "UG • 5 Yrs", why: "Specialized legal education with moot court exposure." },
      { name: "B.A. English / Journalism", degree: "UG • 3 Yrs", why: "Media, content strategy, and civil service preparation." },
    ];
  };

  const recommendations = getRecommendations();

  const handleReset = () => {
    setStream(null);
    setInterest(null);
    setCareerGoal(null);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen pb-24">
      <Container size="lg" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" className="text-[10px]">
            AI Course Advisor
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Smart Course Finder Quiz
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Answer 3 quick questions about your 12th group and interests to discover recommended degree programs in Tamil Nadu.
          </p>
        </div>

        {/* Step 1: 12th Subject Group */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900">
              1. What was your Class 12 / Higher Secondary Stream?
            </h3>
            {stream && (
              <button onClick={handleReset} className="text-xs text-blue-600 flex items-center gap-1 font-semibold">
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              { id: "Computer-Maths", label: "Maths + Computer Science", desc: "Physics, Chemistry, Maths, CS" },
              { id: "Maths-Biology", label: "Maths + Biology", desc: "Physics, Chemistry, Maths, Bio" },
              { id: "Pure-Science", label: "Pure Science", desc: "Physics, Chemistry, Botany, Zoology" },
              { id: "Commerce-Accountancy", label: "Commerce & Accounts", desc: "Commerce, Accountancy, Economics" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setStream(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  stream === opt.id
                    ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{opt.label}</span>
                  {stream === opt.id && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Step 2: Primary Career Interest */}
        {stream && (
          <Card className="p-6 sm:p-8 space-y-4 animate-in fade-in duration-200">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              2. Which domain excites you the most?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { id: "Software & AI", label: "Technology & Software", desc: "Coding, AI algorithms, app development" },
                { id: "Healthcare", label: "Healthcare & Medicine", desc: "Patient care, clinical research, pharmacy" },
                { id: "Business", label: "Finance & Management", desc: "Corporate strategy, investments, law" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setInterest(opt.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    interest === opt.id
                      ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{opt.label}</span>
                    {interest === opt.id && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Recommendations Result */}
        {stream && interest && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-extrabold text-slate-900">
                Recommended Degree Programs for You
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, idx) => (
                <Card key={idx} className="p-5 space-y-3 border-blue-100 bg-white shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <Badge variant="gold" className="text-[10px]">
                      {rec.degree}
                    </Badge>
                    <h4 className="font-extrabold text-base text-slate-900">
                      {rec.name}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rec.why}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <Link href={`/colleges?search=${encodeURIComponent(rec.name.split(" ")[0])}`}>
                      <Button variant="primary" size="sm" className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-700 gap-1">
                        <span>Find Colleges in TN</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
