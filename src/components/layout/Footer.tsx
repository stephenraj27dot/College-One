import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "./Container";
import { GraduationCap, ShieldCheck, MapPin, Phone, Mail, MessageCircle, Instagram } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappDefaultMessage
  )}`;

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">100% Tamil Nadu Exclusive</h4>
                <p className="text-xs text-slate-400">Strictly verified colleges & universities in TN.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Official TNEA Cutoff Data</h4>
                <p className="text-xs text-slate-400">Accurate historical counselling records & seat matrix.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Direct WhatsApp Admission Support</h4>
                <p className="text-xs text-slate-400">Free, unbiased counselling for students & parents.</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Links */}
      <div className="py-12">
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Col */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-11 w-11 rounded-full overflow-hidden border border-amber-400/50 bg-white flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpg"
                    alt="College Guide Logo"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl text-white">
                    College <span className="text-[#f29a38]">Guide</span>
                  </span>
                  <span className="text-[9px] tracking-widest uppercase font-semibold text-slate-400">
                    Your Path • Our Guide
                  </span>
                </div>
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Tamil Nadu&apos;s authoritative educational discovery and admission intelligence platform. We catalog colleges, historical cutoffs, verified NIRF rankings, and placement records across all 38 districts of Tamil Nadu.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="gold" className="text-[10px]">
                  Government & Autonomous Focus
                </Badge>
                <Badge variant="success" className="text-[10px]">
                  Zero Dummy Data Guarantee
                </Badge>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Discovery Tools</h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/colleges" className="hover:text-white transition-colors">
                    Tamil Nadu Colleges
                  </Link>
                </li>
                <li>
                  <Link href="/college-predictor" className="hover:text-white transition-colors text-amber-300 font-semibold">
                    TNEA Cutoff Predictor 2026
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="hover:text-white transition-colors">
                    Compare Colleges
                  </Link>
                </li>
                <li>
                  <Link href="/course-finder" className="hover:text-white transition-colors">
                    Course Finder Quiz
                  </Link>
                </li>
                <li>
                  <Link href="/universities" className="hover:text-white transition-colors">
                    Tamil Nadu Universities
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular TN Districts */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Top Education Hubs</h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/colleges?district=Chennai" className="hover:text-white transition-colors">
                    Colleges in Chennai
                  </Link>
                </li>
                <li>
                  <Link href="/colleges?district=Coimbatore" className="hover:text-white transition-colors">
                    Colleges in Coimbatore
                  </Link>
                </li>
                <li>
                  <Link href="/colleges?district=Madurai" className="hover:text-white transition-colors">
                    Colleges in Madurai
                  </Link>
                </li>
                <li>
                  <Link href="/colleges?district=Tiruchirappalli" className="hover:text-white transition-colors">
                    Colleges in Trichy
                  </Link>
                </li>
                <li>
                  <Link href="/colleges?district=Salem" className="hover:text-white transition-colors">
                    Colleges in Salem
                  </Link>
                </li>
              </ul>
            </div>

            {/* Direct Contact & Help */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Admission Desk</h5>
              <div className="space-y-2.5 text-xs text-slate-400">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Tamil Nadu, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                  <a href={`tel:+919629653312`} className="hover:text-emerald-400 transition-colors font-semibold">
                    {siteConfig.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-blue-400 transition-colors">
                    {siteConfig.email}
                  </a>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all duration-300 font-semibold hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-400" />
                    <span>WhatsApp Desk</span>
                  </a>
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-gradient-to-r hover:from-amber-500 hover:to-rose-600 hover:text-white transition-all duration-300 font-semibold hover:scale-105"
                  >
                    <Instagram className="h-4 w-4 text-rose-400" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} College Guide. Dedicated exclusively to higher education in Tamil Nadu.</p>
            <div className="flex items-center gap-4">
              <span>Data Integrity Policy: Verified Records Only</span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
