"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { predictColleges } from "@/services/predictor";
import { PredictorResult, CommunityCategory } from "@/types";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GuidanceModal } from "@/components/guidance/GuidanceModal";
import {
  Calculator,
  Sparkles,
  TrendingUp,
  Award,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MapPin,
  Loader2,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

function PredictorContent() {
  const searchParams = useSearchParams();
  const initialCutoff = searchParams.get("cutoff") || "192.50";
  const initialCommunity = (searchParams.get("community") as CommunityCategory) || "BC";

  const [cutoffMarks, setCutoffMarks] = useState(initialCutoff);
  const [community, setCommunity] = useState<CommunityCategory>(initialCommunity);
  const [district, setDistrict] = useState("");
  const [branch, setBranch] = useState("");
  const [results, setResults] = useState<PredictorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false);

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const mark = parseFloat(cutoffMarks);
    if (isNaN(mark) || mark < 60 || mark > 200) {
      alert("Please enter a valid cutoff score between 60 and 200.");
      return;
    }

    setLoading(true);
    try {
      const res = await predictColleges({
        cutoffMarks: mark,
        community,
        preferredDistrict: district || undefined,
        preferredBranch: branch || undefined,
      });
      setResults(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePredict();
  }, []);

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    `Hi College Guide Team, my 12th Cutoff is ${cutoffMarks} (${community} category). Please help me choose the best TNEA college and branch order.`
  )}`;

  return (
    <div className="py-10 bg-slate-50 min-h-screen pb-32">
      <Container size="xl" className="space-y-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
            <Calculator className="h-3.5 w-3.5" />
            <span>TNEA 2026 Directorate of Technical Education Cutoff Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Tamil Nadu Engineering College Predictor
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Estimate your admission probability into top autonomous and government engineering colleges across Tamil Nadu using verified previous-year DoTE allotment cutoffs.
          </p>
        </div>

        {/* Predictor Input Form Card */}
        <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-md">
          <form onSubmit={handlePredict} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* 1. Cutoff Mark Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 flex items-center justify-between">
                  <span>12th Cutoff Mark *</span>
                  <span className="text-[11px] text-blue-600 font-medium">Out of 200</span>
                </label>
                <Input
                  type="number"
                  step="0.25"
                  min="60"
                  max="200"
                  required
                  placeholder="e.g. 195.50"
                  value={cutoffMarks}
                  onChange={(e) => setCutoffMarks(e.target.value)}
                  className="font-bold text-sm h-11"
                />
              </div>

              {/* 2. Community Quota Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">
                  Community Category *
                </label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value as CommunityCategory)}
                  className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OC">OC - Open Competition</option>
                  <option value="BC">BC - Backward Class</option>
                  <option value="BCM">BCM - BC Muslim</option>
                  <option value="MBC">MBC / DNC</option>
                  <option value="SC">SC - Scheduled Caste</option>
                  <option value="SCA">SCA - SC Arunthathiyar</option>
                  <option value="ST">ST - Scheduled Tribe</option>
                </select>
              </div>

              {/* 3. Preferred District */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">
                  District Preference
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Tamil Nadu Districts</option>
                  {siteConfig.tamilNaduDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Preferred Branch / Keyword */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">
                  Branch / Specialization
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Engineering Branches</option>
                  <option value="Computer Science">Computer Science & Engg (CSE)</option>
                  <option value="Artificial Intelligence">AI & Data Science (AI & DS)</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Electronics">Electronics & Communication (ECE)</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                  <option value="Aeronautical">Aeronautical Engineering</option>
                  <option value="Robotics">Robotics & Automation</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Formula: Mathematics (100) + Physics (50) + Chemistry (50)</span>
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                disabled={loading}
                className="w-full sm:w-auto font-extrabold px-8 shadow-lg shadow-amber-500/20"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Calculate College Allotment Chances</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Results Presentation */}
        {results && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Probability Breakdown Tabs / Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                    High Probability
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-extrabold text-emerald-900">
                  {results.highProbability.length} Colleges
                </p>
                <p className="text-[11px] text-emerald-700">
                  Cutoff safely exceeds previous closing mark (+1.0 mark or higher)
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-blue-800">
                    Moderate Probability
                  </span>
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-extrabold text-blue-900">
                  {results.moderateProbability.length} Colleges
                </p>
                <p className="text-[11px] text-blue-700">
                  Competitive range (within ±1.5 marks of closing cutoff)
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-amber-800">
                    Aspirational / Reach
                  </span>
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-2xl font-extrabold text-amber-900">
                  {results.competitiveProbability.length} Colleges
                </p>
                <p className="text-[11px] text-amber-700">
                  Target for earlier choice filling rounds
                </p>
              </div>
            </div>

            {/* Section 1: High Probability Results */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <h3 className="text-lg font-extrabold text-slate-900">
                  High Probability Allotments (Safe Choices)
                </h3>
              </div>

              {results.highProbability.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 bg-white rounded-xl border border-slate-200">
                  No direct high probability matches in this cutoff tier. Try exploring moderate probability colleges or widening branch preferences.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.highProbability.map((pred, i) => (
                    <Card key={i} className="p-5 space-y-3 hover:border-emerald-400 transition-all border-emerald-100">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {pred.tneaCode && (
                            <Badge variant="gold" className="text-[10px] mb-1">
                              TNEA Code: {pred.tneaCode}
                            </Badge>
                          )}
                          <Link href={`/colleges/${pred.collegeSlug}`}>
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 hover:text-blue-600">
                              {pred.collegeName}
                            </h4>
                          </Link>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-blue-500" />
                            <span>{pred.city}, {pred.district}</span>
                          </p>
                        </div>
                        <Badge variant="success" className="text-[10px] font-bold">
                          Safe (+{pred.difference})
                        </Badge>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{pred.courseName}</span>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">Required Cutoff</span>
                          <span className="font-extrabold text-blue-600">{pred.requiredCutoff}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-[11px] text-slate-500">
                          NIRF: {pred.nirfRank ? `#${pred.nirfRank}` : "Accredited"}
                        </span>
                        <Link href={`/colleges/${pred.collegeSlug}`} className="text-blue-600 font-bold hover:underline">
                          View College Profile &rarr;
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Moderate Probability Results */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <h3 className="text-lg font-extrabold text-slate-900">
                  Moderate Probability Allotments (Competitive Matches)
                </h3>
              </div>

              {results.moderateProbability.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 bg-white rounded-xl border border-slate-200">
                  No moderate probability results found for this selection.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.moderateProbability.map((pred, i) => (
                    <Card key={i} className="p-5 space-y-3 hover:border-blue-400 transition-all border-blue-100">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {pred.tneaCode && (
                            <Badge variant="gold" className="text-[10px] mb-1">
                              TNEA Code: {pred.tneaCode}
                            </Badge>
                          )}
                          <Link href={`/colleges/${pred.collegeSlug}`}>
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 hover:text-blue-600">
                              {pred.collegeName}
                            </h4>
                          </Link>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-blue-500" />
                            <span>{pred.city}, {pred.district}</span>
                          </p>
                        </div>
                        <Badge variant="default" className="text-[10px] font-bold">
                          Competitive ({pred.difference >= 0 ? `+${pred.difference}` : pred.difference})
                        </Badge>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{pred.courseName}</span>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">Required Cutoff</span>
                          <span className="font-extrabold text-blue-600">{pred.requiredCutoff}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-[11px] text-slate-500">
                          Avg Package: {pred.averagePackage ? `₹${pred.averagePackage} LPA` : "Published"}
                        </span>
                        <Link href={`/colleges/${pred.collegeSlug}`} className="text-blue-600 font-bold hover:underline">
                          View Details &rarr;
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Disclaimer & Provenance Alert */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <ShieldAlert className="h-4 w-4" />
                <span>Statutory TNEA Allotment Disclaimer</span>
              </div>
              <p className="leading-relaxed">
                {results.disclaimer}
              </p>
            </div>

            {/* Guidance CTA */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base">Want Expert Choice-Order Verification?</h4>
                <p className="text-xs text-slate-400">
                  Share your predicted shortlist with an experienced admission counsellor for final review.
                </p>
              </div>

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="md" className="font-bold gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Cutoff to Counsellor</span>
                </Button>
              </a>
            </div>
          </div>
        )}
      </Container>

      <GuidanceModal
        isOpen={isGuidanceModalOpen}
        onClose={() => setIsGuidanceModalOpen(false)}
      />
    </div>
  );
}

export default function CollegePredictorPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <PredictorContent />
    </Suspense>
  );
}
