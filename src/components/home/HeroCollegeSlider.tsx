"use client";

import { useState, useEffect } from "react";
import { MapPin, Building, Sparkles } from "lucide-react";

export interface TopCollegeSlide {
  id: string;
  name: string;
  short_name: string;
  city: string;
  tnea_code: string;
  imageUrl: string;
  tagline: string;
}

export const top10TamilNaduColleges: TopCollegeSlide[] = [
  {
    id: "col-ceg-1",
    name: "College of Engineering, Guindy (CEG)",
    short_name: "CEG Anna University",
    city: "Chennai",
    tnea_code: "1",
    imageUrl: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=85",
    tagline: "NIRF #13 | Benchmark for Engineering Excellence"
  },
  {
    id: "col-act-2",
    name: "Alagappa Chettiar College of Technology (ACT)",
    short_name: "ACT Tech Anna Univ",
    city: "Chennai",
    tnea_code: "2",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=85",
    tagline: "Premier Chemical, Bio & Polymer Tech Campus"
  },
  {
    id: "col-mit-4",
    name: "Madras Institute of Technology (MIT)",
    short_name: "MIT Chromepet",
    city: "Chengalpattu",
    tnea_code: "4",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85",
    tagline: "Alma Mater of Dr. APJ Abdul Kalam | Aeronautical & Auto Hub"
  },
  {
    id: "col-psg-2006",
    name: "PSG College of Technology (Autonomous)",
    short_name: "PSG Tech",
    city: "Coimbatore",
    tnea_code: "2006",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=85",
    tagline: "Top Private Engineering Benchmark in South India"
  },
  {
    id: "col-gct-2005",
    name: "Government College of Technology (GCT)",
    short_name: "GCT Coimbatore",
    city: "Coimbatore",
    tnea_code: "2005",
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1600&q=85",
    tagline: "Historic Pioneer in Government Technical Education"
  },
  {
    id: "col-cit-2007",
    name: "Coimbatore Institute of Technology (CIT)",
    short_name: "CIT Coimbatore",
    city: "Coimbatore",
    tnea_code: "2007",
    imageUrl: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1600&q=85",
    tagline: "NAAC A Grade | Autonomous Premier Research Hub"
  },
  {
    id: "col-ssn-1315",
    name: "Sri Sivasubramaniya Nadar College of Engineering (SSN)",
    short_name: "SSN Kalavakkam",
    city: "Kanchipuram",
    tnea_code: "1315",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=85",
    tagline: "Top NIRF Ranked Elite Research & Industry Placements"
  },
  {
    id: "col-rec-1211",
    name: "Rajalakshmi Engineering College (Autonomous)",
    short_name: "REC Thandalam",
    city: "Chennai",
    tnea_code: "1211",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1600&q=85",
    tagline: "NAAC A++ Grade | Tier-1 Placements & AI Centres"
  },
  {
    id: "col-kongu-2711",
    name: "Kongu Engineering College (Autonomous)",
    short_name: "KEC Perundurai",
    city: "Erode",
    tnea_code: "2711",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1600&q=85",
    tagline: "NAAC A++ Grade | Kongu Region Technical Beacon"
  },
  {
    id: "col-kct-2712",
    name: "Kumaraguru College of Technology (Autonomous)",
    short_name: "KCT Coimbatore",
    city: "Coimbatore",
    tnea_code: "2712",
    imageUrl: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?auto=format&fit=crop&w=1600&q=85",
    tagline: "World-Class Forge Innovation Labs & Campus Ecosystem"
  }
];

export function HeroCollegeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload all 10 images on mount for instant zero-lag transitions
  useEffect(() => {
    top10TamilNaduColleges.forEach((college) => {
      const img = new Image();
      img.src = college.imageUrl;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % top10TamilNaduColleges.length);
    }, 5000); // 5-second relaxed pace

    return () => clearInterval(timer);
  }, []);

  const activeCollege = top10TamilNaduColleges[currentIndex];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background Images with continuous smooth Ken-Burns cross-fade */}
      {top10TamilNaduColleges.map((college, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={college.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isActive
                ? "opacity-100 scale-105 z-10"
                : "opacity-0 scale-100 z-0 pointer-events-none"
            }`}
            style={{
              transitionDuration: "1400ms",
            }}
          >
            <img
              src={college.imageUrl}
              alt={college.name}
              loading={idx === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover object-center brightness-105 contrast-105 saturate-110"
            />
          </div>
        );
      })}

      {/* Balanced, vivid gradient overlays: Keep campus images vibrant & bright while ensuring sharp text contrast */}
      <div className="absolute inset-0 bg-slate-950/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1220] via-transparent to-[#0e1220]/60 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(14,18,32,0.55)_100%)] z-10" />

      {/* Real-time Dynamic Active College Caption Badge in Bottom Right */}
      {activeCollege && (
        <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-black text-amber-400 tracking-wide flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>TNEA CODE: {activeCollege.tnea_code}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80">{activeCollege.city}</span>
            </span>
            <span className="text-xs font-bold text-white tracking-tight line-clamp-1 max-w-[280px]">
              {activeCollege.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
