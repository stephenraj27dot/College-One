"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Container } from "./Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Menu,
  X,
  Search,
  MessageCircle,
  Instagram,
  Mail,
  ChevronDown,
  ChevronRight,
  Flame,
  Building2,
  BookOpen,
  Cpu,
  Activity,
  Scale,
  Sprout,
  Compass,
  Award,
  Sparkles,
  MapPin,
  Landmark,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { siteConfig } from "@/config/site";

// Top 10 Tamil Nadu Universities
const topTnUniversities = [
  { name: "Anna University", city: "Chennai", type: "Apex Technical State University", slug: "anna-university" },
  { name: "University of Madras", city: "Chennai", type: "State University (Estd. 1857)", slug: "university-of-madras" },
  { name: "Bharathiar University", city: "Coimbatore", type: "State University (West TN)", slug: "bharathiar-university" },
  { name: "Madurai Kamaraj University", city: "Madurai", type: "State University (South TN)", slug: "madurai-kamaraj-university" },
  { name: "Tamil Nadu Agricultural University (TNAU)", city: "Coimbatore", type: "Premier Agri University", slug: "tnau" },
  { name: "The TN Dr. M.G.R. Medical University", city: "Chennai", type: "State Medical University", slug: "mgr-medical" },
  { name: "The TN Dr. Ambedkar Law University", city: "Chennai", type: "Apex Legal University", slug: "tndalu" },
  { name: "Alagappa University", city: "Karaikudi", type: "NAAC A+ Central State", slug: "alagappa-university" },
  { name: "Annamalai University", city: "Chidambaram", type: "Historic State University", slug: "annamalai-university" },
  { name: "Bharathidasan University", city: "Tiruchirappalli", type: "Central TN State University", slug: "bharathidasan-university" },
];

// Top Famous Colleges for Mega Menu
const topFamousColleges = [
  { name: "CEG Anna University", code: "0001", city: "Chennai", slug: "ceg-anna-university-chennai", tag: "Apex Govt" },
  { name: "PSG College of Technology", code: "2006", city: "Coimbatore", slug: "psg-college-of-technology-coimbatore", tag: "Govt-Aided" },
  { name: "MIT Anna University", code: "0004", city: "Chromepet, Chennai", slug: "mit-anna-university-chromepet", tag: "Kalam's Alma Mater" },
  { name: "SSN College of Engineering", code: "1315", city: "Chennai", slug: "ssn-college-of-engineering-chennai", tag: "NIRF Top Autonomous" },
  { name: "Thiagarajar College of Engg (TCE)", code: "5008", city: "Madurai", slug: "thiagarajar-college-of-engineering-madurai", tag: "South TN Leader" },
  { name: "Kumaraguru College of Tech (KCT)", code: "2712", city: "Coimbatore", slug: "kumaraguru-college-of-technology-coimbatore", tag: "AI & Tech Hub" },
  { name: "Sri Krishna SKCET", code: "2718", city: "Coimbatore", slug: "sri-krishna-college-of-engineering-and-technology-coimbatore", tag: "Top Placements" },
  { name: "Loyola College (Autonomous)", code: "LOYOLA", city: "Chennai", slug: "loyola-college-chennai", tag: "NIRF Rank 3 Arts" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  // Close dropdowns on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(headerSearch.trim())}`);
      setActiveDropdown(null);
      setMobileMenuOpen(false);
    }
  };

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappDefaultMessage
  )}`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1e233a] text-slate-200 shadow-md">
      {/* Top Main Bar */}
      <div className="border-b border-white/10 bg-[#1e233a]/95 backdrop-blur-md">
        <Container size="xl">
          <div className="flex h-20 items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-[#f29a38]/80 shadow-md bg-white flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                <Image
                  src="/logo.jpg"
                  alt="College Guide Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-white leading-none group-hover:text-[#f29a38] transition-colors">
                  College <span className="text-[#f29a38] animate-brand-glow">Guide</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 mt-1">
                  Your Path • Our Guide
                </span>
              </div>
            </Link>

            {/* Central Search */}
            <form onSubmit={handleHeaderSearch} className="hidden md:flex flex-1 max-w-2xl relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search colleges (e.g. Loyola, MIT, Sri Krishna, 0001, 2006)..."
                className="w-full h-10 rounded-full pl-10 pr-4 bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:bg-white focus:text-slate-900 focus:ring-2 focus:ring-[#f29a38] text-sm transition-all duration-300"
              />
            </form>

            {/* Right Icons & Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-2 mr-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Admission Help"
                  className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  aria-label="Email Support"
                  className="h-9 w-9 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile"
                  className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center hover:from-amber-500 hover:to-rose-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>

              <Link href="/login">
                <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/15 h-9 px-3.5 text-xs font-bold rounded-xl">
                  Sign In
                </Button>
              </Link>

              <Link href="/register">
                <Button className="bg-[#f29a38] hover:bg-[#d98528] text-white border-0 h-9 px-4 font-bold rounded-xl shadow-[0_2px_12px_rgba(242,154,56,0.4)] hover:shadow-[0_4px_20px_rgba(242,154,56,0.6)] hover:scale-105 transition-all duration-300 text-xs">
                  Register / Apply
                </Button>
              </Link>
            </div>

            {/* Mobile Toggle Button */}
            <div className="lg:hidden flex items-center gap-2">
              <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-white px-2.5 py-1.5 bg-white/10 rounded-xl">
                Sign In
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-200 bg-white/10 hover:bg-white/20 transition-all"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6 text-[#f29a38]" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Desktop Navigation Bar with Rich Animated Mega-Menus */}
      <div className="bg-[#191d32] border-b border-white/5 hidden lg:block relative z-40">
        <Container size="xl">
          <div className="flex h-12 items-center justify-between">
            {/* Left Nav Links with Hover Mega-Menus */}
            <nav className="flex items-center gap-7 text-sm font-semibold h-full">
              <Link href="/" className="text-white hover:text-[#f29a38] transition-colors py-3">
                Home
              </Link>              {/* 1. COLLEGES MEGA MENU TRIGGER */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnter("colleges")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/colleges"
                  className={`flex items-center gap-1.5 transition-colors py-3 ${
                    activeDropdown === "colleges" ? "text-[#f29a38]" : "text-slate-300 hover:text-[#f29a38]"
                  }`}
                >
                  <span>Colleges</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${activeDropdown === "colleges" ? "rotate-180 text-[#f29a38]" : ""}`} />
                </Link>

                {/* Colleges Mega Dropdown Panel - Frosted Dark Glassmorphism */}
                <div
                  className={`absolute top-full left-0 w-[960px] -ml-28 bg-[#161a2e]/96 backdrop-blur-2xl text-slate-100 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.65)] border border-white/15 p-7 z-50 transition-all duration-300 ease-out transform ${
                    activeDropdown === "colleges"
                      ? "opacity-100 translate-y-0 visible pointer-events-auto"
                      : "opacity-0 -translate-y-2 invisible pointer-events-none"
                  }`}
                  onMouseEnter={() => handleMouseEnter("colleges")}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Subtle top amber glow accent line */}
                  <div className="absolute -top-[1px] left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-[#f29a38] to-transparent" />

                  <div className="grid grid-cols-12 gap-7">
                    {/* Col 1: Top Famous Colleges (5 cols) */}
                    <div className="col-span-5 space-y-3.5 border-r border-white/10 pr-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#f29a38]">
                          <Award className="h-4 w-4 text-[#f29a38]" />
                          <span>Top Famous Colleges</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">TNEA / DOTE</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {topFamousColleges.slice(0, 5).map((col) => (
                          <Link
                            key={col.code}
                            href={`/colleges/${col.slug}`}
                            className="group p-2.5 rounded-2xl hover:bg-white/10 border border-white/5 hover:border-amber-400/40 transition-all flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0 flex-1">
                              <span className="font-black text-white group-hover:text-[#f29a38] block text-xs leading-tight transition-colors">
                                {col.name}
                              </span>
                              <span className="text-[10px] text-slate-400 group-hover:text-slate-300 font-semibold mt-0.5 block">
                                {col.city} • Code: <strong className="text-amber-300 font-mono">{col.code}</strong>
                              </span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 shrink-0">
                              {col.tag}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <div className="pt-1">
                        <Link href="/colleges" className="inline-flex items-center gap-1.5 text-xs font-black text-[#f29a38] hover:text-amber-300 hover:underline">
                          <span>Browse all 550+ Tamil Nadu colleges</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Col 2: Categories & Streams (4 cols) */}
                    <div className="col-span-4 space-y-3.5 border-r border-white/10 pr-5">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-400">
                        <Cpu className="h-4 w-4 text-sky-400" />
                        <span>Colleges by Stream</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {[
                          { name: "Engineering & Tech (B.E/B.Tech)", slug: "engineering", count: "550+ Colleges", icon: <Cpu className="h-4 w-4 text-sky-400 shrink-0" /> },
                          { name: "Medical & Dental (MBBS/BDS)", slug: "medical", count: "70+ Colleges", icon: <Activity className="h-4 w-4 text-rose-400 shrink-0" /> },
                          { name: "Arts, Science & Commerce", slug: "arts-science", count: "600+ Colleges", icon: <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" /> },
                          { name: "Law & Legal Studies", slug: "law", count: "30+ Colleges", icon: <Scale className="h-4 w-4 text-purple-400 shrink-0" /> },
                          { name: "Agriculture & Allied", slug: "agriculture", count: "40+ Colleges", icon: <Sprout className="h-4 w-4 text-emerald-400 shrink-0" /> },
                        ].map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/colleges?stream=${cat.slug}`}
                            className="group p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-sky-400/40 transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2.5">
                              {cat.icon}
                              <span className="font-bold text-slate-200 group-hover:text-white text-xs">
                                {cat.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 group-hover:text-sky-300 font-bold bg-white/10 px-2 py-0.5 rounded-md shrink-0">
                              {cat.count}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Col 3: Education Hubs & Predictor (3 cols) */}
                    <div className="col-span-3 space-y-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-400">
                        <MapPin className="h-4 w-4 text-emerald-400" />
                        <span>Top Education Belts</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Tirunelveli", "Vellore"].map((city) => (
                          <Link
                            key={city}
                            href={`/colleges?district=${city}`}
                            className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 text-slate-300 hover:text-emerald-200 font-bold text-[11px] text-center transition-all"
                          >
                            {city}
                          </Link>
                        ))}
                      </div>

                      {/* Quick Predictor Banner Box */}
                      <div className="mt-2 p-3.5 rounded-2xl bg-gradient-to-br from-[#212745] to-[#1a1e36] border border-[#f29a38]/40 shadow-xl text-xs">
                        <div className="flex items-center gap-1.5 font-black text-amber-300 mb-1">
                          <Sparkles className="h-4 w-4 text-[#f29a38]" />
                          <span>TNEA Cutoff Predictor 2026</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug mb-2.5 font-medium">
                          Enter your 12th cutoff score for AI college shortlists.
                        </p>
                        <Link
                          href="/college-predictor"
                          className="inline-flex items-center justify-center w-full gap-1.5 text-[11px] font-black text-white bg-gradient-to-r from-[#f29a38] to-[#d98528] hover:from-[#d98528] hover:to-[#b76e1f] py-2 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
                        >
                          <span>Predict My College</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. UNIVERSITIES MEGA MENU TRIGGER */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnter("universities")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/universities"
                  className={`flex items-center gap-1.5 transition-colors py-3 ${
                    activeDropdown === "universities" ? "text-[#f29a38]" : "text-slate-300 hover:text-[#f29a38]"
                  }`}
                >
                  <span>Universities</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${activeDropdown === "universities" ? "rotate-180 text-[#f29a38]" : ""}`} />
                </Link>

                {/* Universities Dropdown Panel - Frosted Dark Glassmorphism */}
                <div
                  className={`absolute top-full left-0 w-[760px] -ml-28 bg-[#161a2e]/96 backdrop-blur-2xl text-slate-100 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.65)] border border-white/15 p-7 z-50 transition-all duration-300 ease-out transform ${
                    activeDropdown === "universities"
                      ? "opacity-100 translate-y-0 visible pointer-events-auto"
                      : "opacity-0 -translate-y-2 invisible pointer-events-none"
                  }`}
                  onMouseEnter={() => handleMouseEnter("universities")}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Subtle top amber glow accent line */}
                  <div className="absolute -top-[1px] left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-[#f29a38] to-transparent" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#f29a38]">
                        <Landmark className="h-4.5 w-4.5 text-[#f29a38]" />
                        <span>Top 10 Tamil Nadu State & Central Universities</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">Affiliation Authorities</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      {topTnUniversities.map((uni, i) => (
                        <Link
                          key={uni.slug}
                          href={`/colleges?search=${encodeURIComponent(uni.name)}`}
                          className="group p-2.5 rounded-2xl bg-white/5 hover:bg-white/12 border border-white/5 hover:border-amber-400/40 transition-all flex items-start gap-2.5"
                        >
                          <span className="h-6 w-6 rounded-lg bg-white/10 border border-white/15 group-hover:bg-[#f29a38] group-hover:border-[#f29a38] group-hover:text-slate-950 text-amber-400 font-black text-[11px] flex items-center justify-center shrink-0 shadow-sm transition-colors">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="font-black text-white group-hover:text-[#f29a38] block truncate text-xs transition-colors">
                              {uni.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium block truncate mt-0.5">
                              {uni.city} • {uni.type}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Looking for Anna University Affiliated Engineering Cutoffs?
                      </span>
                      <Link href="/college-predictor" className="font-black text-[#f29a38] hover:text-amber-300 hover:underline">
                        Open Predictor →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/college-predictor" prefetch={false} className="text-slate-300 hover:text-[#f29a38] transition-colors py-3">
                TNEA Predictor
              </Link>
              <Link href="/compare" prefetch={false} className="text-slate-300 hover:text-[#f29a38] transition-colors py-3">
                Compare
              </Link>
              <Link href="/course-finder" prefetch={false} className="text-slate-300 hover:text-[#f29a38] transition-colors py-3">
                Course Finder
              </Link>
              <Link href="/register" className="text-[#f29a38] font-bold hover:underline py-3">
                Student Registration 2026
              </Link>
            </nav>

            {/* Right Trending */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center text-[#f29a38] font-bold gap-1 mr-1">
                <Flame className="h-4 w-4" /> Top Hubs:
              </div>
              <Link href="/colleges?district=Chennai" className="px-2.5 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-slate-300">
                Chennai
              </Link>
              <Link href="/colleges?district=Coimbatore" className="px-2.5 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-slate-300">
                Coimbatore
              </Link>
              <Link href="/colleges?district=Madurai" className="px-2.5 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-slate-300">
                Madurai
              </Link>
              <Link href="/colleges?district=Tiruchirappalli" className="px-2.5 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-slate-300">
                Trichy
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Animated Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <aside className="fixed top-0 right-0 bottom-0 z-[9999] w-[85%] max-w-sm bg-[#161a2e] border-l border-white/20 p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header inside mobile drawer */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-amber-400/80 bg-white shadow">
                    <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <span className="font-extrabold text-lg text-white block">
                      College <span className="text-[#f29a38]">Guide</span>
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                      Tamil Nadu Portal
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Search Bar */}
              <form onSubmit={handleHeaderSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Search colleges, codes, cities..."
                  className="w-full h-11 rounded-xl pl-10 pr-3 bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-[#f29a38]"
                />
              </form>

              {/* Navigation Links with Accordion Animations */}
              <div className="space-y-2 text-sm font-semibold">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white transition-colors"
                >
                  <span>Home</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                {/* Colleges Collapsible */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileExpandedSection(mobileExpandedSection === "colleges" ? null : "colleges")}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white transition-colors"
                  >
                    <span>Colleges & Streams</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${mobileExpandedSection === "colleges" ? "rotate-180 text-[#f29a38]" : ""}`} />
                  </button>

                  {mobileExpandedSection === "colleges" && (
                    <div className="pl-4 pr-2 py-2 space-y-2 bg-black/30 border border-white/5 rounded-2xl my-1 text-xs animate-in fade-in duration-200">
                      <Link href="/colleges" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[#f29a38] font-black">
                        Browse All 550+ TN Colleges →
                      </Link>
                      <Link href="/colleges?stream=engineering" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200 hover:text-white font-medium">
                        • Engineering & Tech (Anna Univ)
                      </Link>
                      <Link href="/colleges?stream=medical" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200 hover:text-white font-medium">
                        • Medical & Dental Colleges
                      </Link>
                      <Link href="/colleges?stream=arts-science" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200 hover:text-white font-medium">
                        • Arts, Science & Commerce
                      </Link>
                      <Link href="/colleges?stream=management" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200 hover:text-white font-medium">
                        • Management & MBA
                      </Link>
                      <Link href="/colleges?stream=law" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200 hover:text-white font-medium">
                        • Law & Legal Studies
                      </Link>
                      <Link href="/colleges?stream=nursing" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200 hover:text-white font-medium">
                        • Nursing & Allied Health
                      </Link>
                      <Link href="/colleges?stream=agriculture" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200 hover:text-white font-medium">
                        • Agriculture (TNAU)
                      </Link>
                      <Link href="/colleges?stream=architecture" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200 hover:text-white font-medium">
                        • Architecture (B.Arch)
                      </Link>
                    </div>
                  )}
                </div>

                {/* Universities Collapsible */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileExpandedSection(mobileExpandedSection === "universities" ? null : "universities")}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white transition-colors"
                  >
                    <span>Universities in Tamil Nadu</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${mobileExpandedSection === "universities" ? "rotate-180 text-[#f29a38]" : ""}`} />
                  </button>

                  {mobileExpandedSection === "universities" && (
                    <div className="pl-4 pr-2 py-2 space-y-2 bg-black/30 border border-white/5 rounded-2xl my-1 text-xs animate-in fade-in duration-200">
                      <Link href="/universities" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[#f29a38] font-black">
                        All Tamil Nadu Universities →
                      </Link>
                      {topTnUniversities.slice(0, 6).map((u) => (
                        <Link
                          key={u.slug}
                          href={`/colleges?search=${encodeURIComponent(u.name)}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1 text-slate-200 hover:text-white truncate font-medium"
                        >
                          • {u.name} ({u.city})
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/college-predictor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#f29a38]" />
                    <span>TNEA Cutoff Predictor 2026</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/compare"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white transition-colors"
                >
                  <span>Compare Colleges</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/course-finder"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white transition-colors"
                >
                  <span>Course Finder Quiz</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 transition-colors font-black shadow-sm"
                >
                  <span>Student Registration 2026</span>
                  <Badge variant="gold" className="text-[9px]">FREE</Badge>
                </Link>
              </div>
            </div>

            {/* Bottom Actions inside Mobile Drawer */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Admission Desk</span>
              </a>

              <a
                href={`mailto:${siteConfig.email}`}
                className="w-full inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg"
              >
                <Mail className="h-4 w-4" />
                <span>Email Support ({siteConfig.email})</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-11 border-white/20 bg-white/5 text-white text-xs font-bold rounded-xl hover:bg-white/15">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-11 bg-[#f29a38] hover:bg-[#d98528] text-white text-xs font-black rounded-xl shadow-md">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
