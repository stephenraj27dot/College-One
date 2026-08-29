"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { verifiedColleges } from "@/lib/data/verifiedTamilNaduData";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CollegeCard } from "@/components/college/CollegeCard";
import { GuidanceModal } from "@/components/guidance/GuidanceModal";
import { CompareDrawer } from "@/components/college/CompareDrawer";
import { useShortlist } from "@/hooks/useShortlist";
import { useCompare } from "@/hooks/useCompare";
import {
  Search,
  MapPin,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Calculator,
  Compass,
  Cpu,
  Activity,
  HeartPulse,
  Scale,
  BookOpen,
  Sprout,
  Briefcase,
  CheckCircle2,
  Building2,
  GraduationCap,
  Flame,
} from "lucide-react";

import { useEffect } from "react";
import { HeroCollegeSlider } from "@/components/home/HeroCollegeSlider";
import { AnimatedCounter } from "@/components/home/AnimatedCounter";
import { AutoAdmissionModal } from "@/components/guidance/AutoAdmissionModal";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [cutoffMarks, setCutoffMarks] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("BC");
  const [selectedCollegeForGuidance, setSelectedCollegeForGuidance] = useState<any>(null);
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  const { isShortlisted, toggle: toggleShortlist } = useShortlist();
  const {
    compareList,
    isInCompare,
    toggleCompare,
    removeFromCompare,
    clear: clearCompare,
    canAdd,
  } = useCompare();

  const featuredColleges = verifiedColleges.slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  const handlePredictorRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (cutoffMarks) {
      router.push(
        `/college-predictor?cutoff=${encodeURIComponent(cutoffMarks)}&community=${encodeURIComponent(
          selectedCommunity
        )}`
      );
    } else {
      router.push("/college-predictor");
    }
  };

  const getStreamIcon = (slug: string) => {
    switch (slug) {
      case "engineering":
        return <Cpu className="h-6 w-6 text-blue-600" />;
      case "medical":
        return <Activity className="h-6 w-6 text-rose-600" />;
      case "arts-science":
        return <BookOpen className="h-6 w-6 text-indigo-600" />;
      case "management":
        return <Briefcase className="h-6 w-6 text-amber-600" />;
      case "law":
        return <Scale className="h-6 w-6 text-purple-600" />;
      case "nursing":
        return <HeartPulse className="h-6 w-6 text-emerald-600" />;
      case "agriculture":
        return <Sprout className="h-6 w-6 text-green-600" />;
      default:
        return <Compass className="h-6 w-6 text-blue-600" />;
    }
  };

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappDefaultMessage
  )}`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Auto Onboarding Modal on Student Entry */}
      <AutoAdmissionModal />

      {/* 1. Hero Section with Dynamic Top 10 Colleges Background Slider */}
      <section className="relative overflow-hidden bg-[#0e1220] text-white pt-16 pb-32 sm:pt-24 sm:pb-36">
        {/* Dynamic Top 10 Colleges Image Slider with Smooth Cross-fade */}
        <HeroCollegeSlider />

        <Container size="xl" className="relative z-10 flex flex-col items-center text-center">
          {/* Top Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-amber-300 uppercase backdrop-blur-md shadow-sm">
             <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
             TAMIL NADU'S OFFICIAL HIGHER EDUCATION & TNEA PORTAL
          </div>

          {/* Heading */}
          <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black tracking-tight drop-shadow-lg text-white">
            Find Your Dream College with <span className="text-[#f29a38] animate-brand-glow">College Guide</span>
          </h1>

          {/* Subheading */}
          <p className="mb-8 max-w-2xl text-sm sm:text-base md:text-lg text-slate-200 font-medium leading-relaxed drop-shadow-md">
            Explore authentic engineering, medical & arts colleges across Tamil Nadu with verified TNEA cutoffs and direct admission counselling.<br className="hidden sm:inline" />
            <span className="text-[#f29a38] font-bold">Your Path • Our Guide</span>
          </p>

          {/* Search Bar */}
          <form onSubmit={handleHeroSearch} className="w-full max-w-[800px] mb-8">
            <div className="relative flex items-center w-full rounded-[2.5rem] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-white/80 focus-within:border-[#f29a38] focus-within:ring-4 focus-within:ring-[#f29a38]/30 transition-all duration-300">
              <div className="pl-4 text-slate-400">
                <Search className="h-5 w-5 text-[#f29a38]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by TNEA Code (e.g. 0001, 2006, 2718) or College Name..."
                className="flex-1 bg-transparent px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm md:text-base font-semibold"
              />
              <Button type="submit" className="rounded-full bg-gradient-to-r from-[#f29a38] to-[#d98528] hover:from-[#d98528] hover:to-[#b76e1f] text-white px-8 py-3.5 h-auto font-extrabold text-sm md:text-base transition-all duration-300 shadow-md hover:scale-105">
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </div>
          </form>

          {/* Trending Below Search */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] md:text-xs font-bold">
            <span className="text-amber-400 mr-1 uppercase tracking-wide flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-amber-400" /> POPULAR:
            </span>
            <Link href="/college-predictor" className="px-4 py-1.5 rounded-full border border-amber-400/50 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 transition-all hover:scale-105">
              TNEA PREDICTOR 2026
            </Link>
            <Link href="/colleges?district=Chennai" className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-slate-200 transition-all hover:scale-105">
              COLLEGES IN CHENNAI
            </Link>
            <Link href="/colleges?district=Coimbatore" className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-slate-200 transition-all hover:scale-105">
              COLLEGES IN COIMBATORE
            </Link>
            <Link href="/register" className="px-4 py-1.5 rounded-full border border-emerald-400/50 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-all hover:scale-105">
              FREE COUNSELLING
            </Link>
          </div>
        </Container>
      </section>

      {/* Hero Overlapping Cards with On-Scroll Animated Counters */}
      <div className="relative z-20 -mt-12 sm:-mt-14 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {[
            { value: 550, suffix: "+", subtitle: "Engineering Colleges", desc: "Anna University affiliated, government & autonomous colleges in TN.", icon: <Building2 className="h-6 w-6 text-white"/>, color: "bg-[#2563eb]" },
            { value: 38, suffix: "", subtitle: "Districts Covered", desc: "Complete educational coverage across all 38 districts of Tamil Nadu.", icon: <MapPin className="h-6 w-6 text-white"/>, color: "bg-[#7c3aed]" },
            { value: 100, suffix: "+", subtitle: "Degree Programmes", desc: "B.E, B.Tech, MBBS, Arts, Science, Law, and Management courses.", icon: <BookOpen className="h-6 w-6 text-white"/>, color: "bg-[#059669]" },
            { value: 100, suffix: "%", subtitle: "Verified Cutoffs", desc: "Official historical TNEA & DOTE counselling cutoff scores.", icon: <Award className="h-6 w-6 text-white"/>, color: "bg-[#d97706]" },
            {
              isText: true,
              title: "Free",
              subtitle: "Admission Guidance",
              desc: "Dedicated WhatsApp & helpline counselling for students.",
              icon: <img src="/logo.jpg" alt="College Guide" className="w-full h-full object-cover rounded-xl shadow-sm" />,
              color: "bg-white p-0.5"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.15)] p-5 sm:p-6 text-center flex flex-col items-center pt-9 relative hover-lift border border-slate-200">
              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${item.color} flex items-center justify-center border-4 border-white shadow-md transition-transform duration-300 hover:scale-110`}>
                 {item.icon}
              </div>
              <h3 className="text-slate-900 text-2xl sm:text-3xl font-black mb-1">
                {item.isText ? item.title : <AnimatedCounter value={item.value!} suffix={item.suffix} />}
              </h3>
              <p className="text-blue-900 font-extrabold text-xs sm:text-sm mb-2">{item.subtitle}</p>
              <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Explore Academic Streams */}
      <section className="py-14 bg-gradient-to-b from-white via-slate-50 to-slate-100/60 border-b border-slate-200 overflow-hidden">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black tracking-wide uppercase shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-spin" />
                <span>Tamil Nadu Higher Education Disciplines</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Explore by Academic Stream
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Click any stream below to instantly filter verified colleges, cutoffs, and affiliated degree courses across Tamil Nadu.
              </p>
            </div>
            <Link href="/colleges">
              <Button variant="outline" size="sm" className="text-xs font-black gap-1.5 rounded-xl border-slate-300 hover:border-[#f29a38] hover:text-[#f29a38] transition-all">
                <span>View All Colleges</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {siteConfig.popularStreams.map((stream, idx) => {
              const streamMeta: Record<string, { count: string; tag: string; border: string; bg: string; iconBg: string; hoverGlow: string }> = {
                engineering: { count: "550+ Colleges", tag: "Anna Univ / TNEA", border: "border-blue-200 hover:border-blue-500", bg: "bg-blue-50/40 hover:bg-white", iconBg: "bg-blue-100 text-blue-700", hoverGlow: "hover:shadow-blue-500/20" },
                medical: { count: "70+ Colleges", tag: "MGR Univ / NEET", border: "border-rose-200 hover:border-rose-500", bg: "bg-rose-50/40 hover:bg-white", iconBg: "bg-rose-100 text-rose-700", hoverGlow: "hover:shadow-rose-500/20" },
                "arts-science": { count: "600+ Colleges", tag: "Autonomous / State", border: "border-indigo-200 hover:border-indigo-500", bg: "bg-indigo-50/40 hover:bg-white", iconBg: "bg-indigo-100 text-indigo-700", hoverGlow: "hover:shadow-indigo-500/20" },
                management: { count: "250+ Colleges", tag: "MBA / TANCET", border: "border-amber-200 hover:border-amber-500", bg: "bg-amber-50/40 hover:bg-white", iconBg: "bg-amber-100 text-amber-800", hoverGlow: "hover:shadow-amber-500/20" },
                law: { count: "30+ Colleges", tag: "TNDALU / SOEL", border: "border-purple-200 hover:border-purple-500", bg: "bg-purple-50/40 hover:bg-white", iconBg: "bg-purple-100 text-purple-700", hoverGlow: "hover:shadow-purple-500/20" },
                nursing: { count: "180+ Colleges", tag: "INC & Paramedical", border: "border-emerald-200 hover:border-emerald-500", bg: "bg-emerald-50/40 hover:bg-white", iconBg: "bg-emerald-100 text-emerald-700", hoverGlow: "hover:shadow-emerald-500/20" },
                agriculture: { count: "40+ Colleges", tag: "TNAU / ICAR", border: "border-lime-200 hover:border-lime-500", bg: "bg-lime-50/40 hover:bg-white", iconBg: "bg-lime-100 text-lime-800", hoverGlow: "hover:shadow-lime-500/20" },
                architecture: { count: "50+ Colleges", tag: "COA / NATA", border: "border-cyan-200 hover:border-cyan-500", bg: "bg-cyan-50/40 hover:bg-white", iconBg: "bg-cyan-100 text-cyan-800", hoverGlow: "hover:shadow-cyan-500/20" },
              };

              const meta = streamMeta[stream.slug] || {
                count: "Top Verified",
                tag: "Accredited",
                border: "border-slate-200 hover:border-amber-400",
                bg: "bg-slate-50 hover:bg-white",
                iconBg: "bg-amber-100 text-amber-800",
                hoverGlow: "hover:shadow-amber-500/20",
              };

              return (
                <Link
                  key={stream.slug}
                  href={`/colleges?stream=${stream.slug}`}
                  style={{ animationDelay: `${idx * 0.22}s` }}
                  className={`animate-stream-wave group p-5 sm:p-6 rounded-3xl border ${meta.border} ${meta.bg} shadow-sm hover:shadow-xl ${meta.hoverGlow} transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1.5 relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-2xl ${meta.iconBg} flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110`}>
                      {getStreamIcon(stream.slug)}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 bg-white/90 border border-slate-200/80 px-2 py-0.5 rounded-full shadow-2xs">
                      {meta.count}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition-colors leading-tight mb-1">
                      {stream.name}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold pt-1">
                      <span>{meta.tag}</span>
                      <span className="text-amber-600 font-black opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Featured Verified Tamil Nadu Colleges */}
      <section className="py-16 bg-slate-50">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <Badge variant="gold" className="mb-1">
                Top Rated Institutions
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Tamil Nadu Institutions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Accredited colleges with official TNEA codes, NAAC A++ ratings, and strong placement records
              </p>
            </div>
            <Link href="/colleges">
              <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs font-bold gap-1">
                <span>Browse All Colleges</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {featuredColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onOpenGuidanceModal={() => {
                  setSelectedCollegeForGuidance(college);
                  setIsGuidanceModalOpen(true);
                }}
                isShortlisted={isShortlisted(college.id)}
                onShortlistToggle={(c) => toggleShortlist(c.id)}
                isInCompare={isInCompare(college.id)}
                onCompareToggle={toggleCompare}
                compareDisabled={!canAdd && !isInCompare(college.id)}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Explore Tamil Nadu by District & Regional Education Belts */}
      <section className="py-16 bg-slate-900 text-slate-100 border-y border-slate-800 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <Container size="xl" className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-black tracking-wide uppercase shadow-2xs">
                <MapPin className="h-3.5 w-3.5 text-[#f29a38]" />
                <span>Geographical Directory</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Explore Tamil Nadu by District & Education Hubs
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-2xl">
                Navigate all 38 districts of Tamil Nadu. Discover top colleges across Chennai, Kongu Western Belt, Central Delta, and South TN regions.
              </p>
            </div>
            <Link href="/colleges">
              <Button variant="outline" size="sm" className="text-xs font-black gap-1.5 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/15 hover:border-[#f29a38] transition-all">
                <span>View All 38 Districts</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Direct Background-Merged Tamil Nadu District Map */}
            <div className="lg:col-span-5 relative flex items-center justify-center h-full min-h-[420px]">
              {/* Ambient backlight glow behind map */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-blue-600/15 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 w-full h-full max-h-[460px] flex items-center justify-center p-2 group">
                <img
                  src="/tamilnadu-districts-transparent.svg"
                  alt="Tamil Nadu District Map"
                  className="w-full h-full max-h-[440px] object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-hover:scale-105 group-hover:drop-shadow-[0_20px_40px_rgba(242,154,56,0.3)] transition-all duration-500"
                />
              </div>
            </div>

            {/* Right: Looping Wave Animated District Cards */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: "Chennai", region: "North TN Hub", count: "120+ Colleges", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80", border: "hover:border-amber-400" },
                { name: "Coimbatore", region: "Kongu Tech Hub", count: "90+ Colleges", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80", border: "hover:border-blue-400" },
                { name: "Madurai", region: "Temple City Hub", count: "55+ Colleges", img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80", border: "hover:border-rose-400" },
                { name: "Tiruchirappalli", region: "Central Delta", count: "45+ Colleges", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80", border: "hover:border-emerald-400" },
                { name: "Salem", region: "Western Industrial", count: "40+ Colleges", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80", border: "hover:border-purple-400" },
                { name: "Kancheepuram", region: "Auto & Tech Belt", count: "35+ Colleges", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80", border: "hover:border-indigo-400" },
              ].map((district, idx) => (
                <Link
                  key={district.name}
                  href={`/colleges?district=${encodeURIComponent(district.name)}`}
                  style={{ animationDelay: `${idx * 0.25}s` }}
                  className={`animate-stream-wave group relative h-48 rounded-3xl overflow-hidden border border-white/15 ${district.border} shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-4 hover:-translate-y-1.5`}
                >
                  <img
                    src={district.img}
                    alt={district.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  
                  <div className="relative z-10 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-amber-300 font-extrabold">
                      <span className="bg-slate-950/80 px-2 py-0.5 rounded-md border border-white/10">
                        {district.region}
                      </span>
                    </div>
                    <h4 className="font-black text-base sm:text-lg text-white group-hover:text-[#f29a38] transition-colors leading-tight">
                      {district.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold pt-0.5">
                      <span>{district.count}</span>
                      <span className="text-[#f29a38] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Browse →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Free Direct Admission Counselling CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white border-t border-slate-800">
        <Container size="lg">
          <div className="rounded-3xl border border-blue-400/25 bg-white/5 p-8 sm:p-12 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <Badge variant="gold" className="bg-amber-400/20 text-amber-300 border-amber-400/30 font-bold">
                Free Student Support
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Confused About TNEA Choice Filling & Cutoffs?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Speak directly with certified Tamil Nadu admission counsellors. Get step-by-step guidance on cutoff calculations, community rank quotas, and round-wise seat allotments.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-emerald-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> 100% Free Consultation
                </span>
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Verified Seat Matrix
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full md:w-auto">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg" className="w-full sm:w-auto font-black gap-2 shadow-xl h-12 px-6 rounded-2xl">
                  <MessageCircle className="h-5 w-5" />
                  <span>WhatsApp Admission Desk</span>
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsGuidanceModalOpen(true)}
                className="w-full sm:w-auto font-black text-white bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-amber-400 backdrop-blur-md rounded-2xl shadow-xl h-12 px-6 gap-2 transition-all"
              >
                <span>Request Callback</span>
                <ArrowRight className="h-4 w-4 text-[#f29a38]" />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Guidance Modal */}
      <GuidanceModal
        isOpen={isGuidanceModalOpen}
        onClose={() => setIsGuidanceModalOpen(false)}
        targetCollege={selectedCollegeForGuidance}
      />

      {/* Persistent Compare Drawer */}
      <CompareDrawer
        compareList={compareList}
        onRemove={removeFromCompare}
        onClear={clearCompare}
      />
    </div>
  );
}
