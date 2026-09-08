import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { FileText, ShieldAlert, CheckCircle2, HelpCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms and Conditions | College Guide Tamil Nadu",
  description: "Read the Terms and Conditions for using College Guide's college discovery, TNEA cutoff predictor, and educational counselling portal.",
};

export default function TermsPage() {
  const lastUpdated = "September 2026";
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    "Hello College Guide Team, I have a query regarding your Terms & Conditions."
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <Container size="lg">
        {/* Breadcrumb & Navigation */}
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
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5" />
              <span>Legal Terms</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Terms & Conditions
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              Please read these terms carefully before accessing or using College Guide Tamil Nadu. By using our platform, cutoff predictor, or admission advisory services, you agree to comply with these terms.
            </p>
            
            <p className="text-xs text-slate-400 pt-2">
              Last Updated: <span className="text-amber-300 font-semibold">{lastUpdated}</span>
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Legal Content */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
            {/* 1. Acceptance */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs font-black">1</span>
                Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or utilizing the web portal <strong>College Guide</strong> (<Link href="/" className="text-blue-600 hover:underline">collegesguide.in</Link>), you agree to be legally bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you should immediately discontinue use of this website.
              </p>
            </section>

            {/* 2. Platform Purpose & Scope */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs font-black">2</span>
                Purpose and Scope of Services
              </h2>
              <p>
                College Guide is an independent informational and counselling discovery platform dedicated exclusively to higher education across the 38 districts of Tamil Nadu. Our offerings include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Catalog of Tamil Nadu engineering, medical, arts, and science colleges.</li>
                <li>TNEA Cutoff Predictor algorithms calculated based on historical counselling data.</li>
                <li>Side-by-side college comparison tools and branch matrix calculators.</li>
                <li>Complimentary admission counselling and inquiry forwarding to qualified advisors.</li>
              </ul>
            </section>

            {/* 3. TNEA Cutoffs & Data Accuracy Disclaimer */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs font-black">3</span>
                Predictor & Cutoff Data Disclaimer
              </h2>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>Important Disclaimer on Cutoff Predictions</span>
                </div>
                <p>
                  Cutoff predictions and eligibility recommendations provided by the College Guide algorithm are strictly indicative benchmarks calculated from official Directorate of Technical Education (DoTE) and Anna University historical counselling seat matrices. Real-world cutoffs fluctuate each academic year based on student demand, high school board score distributions, and reservation shifts.
                </p>
              </div>
              <p>
                College Guide does not guarantee admission into any specific institution or programme based on predictor results. Official admissions remain exclusively under the authority of the respective examination bodies and universities.
              </p>
            </section>

            {/* 4. Student Conduct & Information Submission */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs font-black">4</span>
                Student Inquiries & User Responsibility
              </h2>
              <p>
                When submitting your name, contact phone number, cutoff marks, or preferred community quota for counselling:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>You agree to provide authentic and truthful information.</li>
                <li>You consent to our verified counselling team contacting you via WhatsApp, telephone, or email to assist with your educational inquiries.</li>
                <li>You agree not to submit fraudulent contact details, malicious code, or automated bots to the platform.</li>
              </ul>
            </section>

            {/* 5. Intellectual Property Rights */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs font-black">5</span>
                Intellectual Property & Trademarks
              </h2>
              <p>
                The design, layout, codebase, branding, logo, and aggregated data analysis on College Guide are protected by applicable intellectual property and copyright laws. Logos, college emblems, or institutional names referenced on the website belong to their respective universities or autonomous bodies and are used purely for educational identification and directory reporting purposes.
              </p>
            </section>

            {/* 6. Limitation of Liability */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs font-black">6</span>
                Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, College Guide and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this platform, including but not limited to admission choices, seat allotments, fee structures, or educational decisions made by users.
              </p>
            </section>

            {/* 7. Governing Law */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs font-black">7</span>
                Governing Law and Jurisdiction
              </h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with the platform shall be subject to the exclusive jurisdiction of the competent courts in Tamil Nadu, India.
              </p>
            </section>

            {/* 8. Contact & Modifications */}
            <section className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Modifications & Contact
              </h2>
              <p>
                We reserve the right to modify or replace these terms at any time. Changes will take effect immediately upon posting to this page.
              </p>
              <p>
                For questions or clarifications regarding our terms, reach us at:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium space-y-1">
                <p>Email: <a href={`mailto:${siteConfig.email}`} className="text-blue-600 font-bold hover:underline">{siteConfig.email}</a></p>
                <p>Helpline: <span className="font-bold text-slate-800">{siteConfig.phoneDisplay}</span></p>
                <p>Headquarters: Tamil Nadu, India</p>
              </div>
            </section>
          </div>

          {/* Quick Legal Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>At A Glance</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>College Guide is an independent educational portal, not an official government agency.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>TNEA Cutoff Predictor tools provide historical estimates, not guaranteed allotments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>Your counselling inquiries are handled strictly under our zero-spam privacy policy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>All college trademarks belong to their respective institutions.</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  href="/privacy"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View Privacy Policy →
                </Link>
                <Link
                  href="/disclaimer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View Admission Disclaimer →
                </Link>
              </div>
            </div>

            {/* Admission Helpline Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-3xl space-y-3 shadow-xs">
              <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                <span>Need Assistance?</span>
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Have questions about our portal or need one-on-one admission advice for Tamil Nadu colleges?
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Contact Admission Desk</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
