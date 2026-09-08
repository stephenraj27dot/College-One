import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { AlertTriangle, ShieldCheck, ArrowLeft, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Disclaimer & Cutoff Accuracy | College Guide Tamil Nadu",
  description: "Official educational disclaimer regarding TNEA cutoff predictor algorithms, seat matrix statistics, and admission counselling.",
};

export default function DisclaimerPage() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    "Hello College Guide Team, I have a query regarding your admission disclaimer."
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <Container size="lg">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Public Notice</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Disclaimer
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              Important information regarding our independent advisory status, TNEA cutoff projections, and official government body affiliations.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base max-w-4xl mx-auto">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              1. Non-Government Independent Portal
            </h2>
            <p>
              <strong>College Guide</strong> (collegesguide.in) is an independent, student-first educational information and counselling initiative. We are <strong>not</strong> an official government agency, nor are we directly affiliated with the Government of Tamil Nadu, Anna University, the Directorate of Technical Education (DoTE), or the Tamil Nadu Engineering Admissions (TNEA) committee.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              2. Cutoff Predictor Calculations
            </h2>
            <p>
              All cutoff marks, eligibility predictions, and branch estimates provided on this portal are algorithmic approximations derived from verified past-year general counselling seat matrices and closing ranks. While we strive for extreme mathematical precision:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Cutoffs change from year to year based on student registration numbers, applicant board scores, and choice-filling trends.</li>
              <li>Calculations should be utilized as guidance benchmarks rather than guaranteed admission promises.</li>
              <li>Students are advised to verify their final choices against official TNEA allotment notifications.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              3. Institution Trademarks & Logos
            </h2>
            <p>
              College names, acronyms, and emblems displayed on this platform are property of their respective educational institutions and universities. They are referenced strictly under fair-use provisions for nominative identification, educational comparison, and public directory reporting.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              For any clarification or data verification inquiry, contact <a href={`mailto:${siteConfig.email}`} className="text-blue-600 font-bold hover:underline">{siteConfig.email}</a>.
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Ask Admission Desk</span>
            </a>
          </section>
        </div>
      </Container>
    </div>
  );
}
