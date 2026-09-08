import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ShieldCheck, Lock, EyeOff, UserCheck, ArrowLeft, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | College Guide Tamil Nadu",
  description: "Learn how College Guide protects student privacy and handles inquiry data with strict confidentiality.",
};

export default function PrivacyPolicyPage() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    "Hello College Guide Team, I have a query regarding your Privacy Policy."
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
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Data Protection</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Privacy Policy
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              We respect your privacy. Discover how College Guide collects, protects, and handles student information in accordance with Indian data privacy standards.
            </p>

            <p className="text-xs text-slate-400 pt-2">
              Effective Date: <span className="text-emerald-300 font-semibold">September 2026</span>
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">1</span>
                Information We Collect
              </h2>
              <p>
                College Guide collects only the minimal information required to assist students with their college admissions and cutoff analysis:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Counselling Information:</strong> Name, WhatsApp phone number, email address, preferred district, and academic stream when you voluntarily submit a guidance request.</li>
                <li><strong>Academic Benchmarks:</strong> TNEA cutoff marks and community category (OC, BC, BCM, MBC, SC, SCA, ST) entered for eligibility evaluation.</li>
                <li><strong>Technical Usage:</strong> Non-personally identifiable analytical data (device type, browser, page views) to enhance site performance.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">2</span>
                How We Use Your Data
              </h2>
              <p>We use the collected information exclusively to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Calculate tailored TNEA college lists based on your cutoff score and category rank.</li>
                <li>Facilitate direct WhatsApp or telephonic consultation with certified admission experts.</li>
                <li>Notify you regarding upcoming counselling rounds, seat matrix releases, and verification deadlines.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">3</span>
                Zero Spam & Data Security Guarantee
              </h2>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <Lock className="h-4 w-4 shrink-0" />
                  <span>Our Confidentiality Pledge</span>
                </div>
                <p>
                  We do not sell, rent, or trade your personal information to third-party telemarketers. All inquiries submitted to College Guide are stored securely with encrypted access restricted solely to authorized admission staff.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">4</span>
                Your Rights & Data Removal
              </h2>
              <p>
                You have the complete right at any time to request the deletion or update of your inquiry records from our system. Simply reach out via email to <a href={`mailto:${siteConfig.email}`} className="text-blue-600 font-bold hover:underline">{siteConfig.email}</a> or send a WhatsApp message to our admission desk.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Contact Our Privacy Officer
              </h2>
              <p>
                If you have questions regarding our privacy practices or data handling, please contact:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium space-y-1">
                <p>Email: <a href={`mailto:${siteConfig.email}`} className="text-blue-600 font-bold hover:underline">{siteConfig.email}</a></p>
                <p>WhatsApp Helpdesk: <span className="font-bold text-slate-800">{siteConfig.phoneDisplay}</span></p>
                <p>Region: Tamil Nadu, India</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-500" />
                <span>Privacy Highlights</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>No selling or renting of student phone numbers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Inquiries used strictly for counselling assistance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Instant opt-out and deletion upon request.</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/terms"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View Terms & Conditions →
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-6 rounded-3xl space-y-3 shadow-xs">
              <h4 className="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Verified & Secure</span>
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Connect directly with certified Tamil Nadu admission counsellors in complete confidence.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Admission Support</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
