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
    id: "ceg",
    name: "College of Engineering, Guindy (CEG)",
    short_name: "CEG Anna University",
    city: "Chennai",
    tnea_code: "0001",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=85",
    tagline: "India's Oldest & Premier Technical Institution (Estd. 1794)",
  },
  {
    id: "psg",
    name: "PSG College of Technology",
    short_name: "PSG Tech",
    city: "Coimbatore",
    tnea_code: "2006",
    imageUrl: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=85",
    tagline: "Pioneering Technical Excellence & Top Placements in West TN",
  },
  {
    id: "mit",
    name: "Madras Institute of Technology (MIT)",
    short_name: "MIT Chromepet",
    city: "Chennai",
    tnea_code: "0004",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=85",
    tagline: "Alma Mater of Dr. APJ Abdul Kalam • Aeronautical & Automobile Leader",
  },
  {
    id: "ssn",
    name: "Sri Sivasubramaniya Nadar College of Engineering (SSN)",
    short_name: "SSN Chennai",
    city: "Kalavakkam, Chennai",
    tnea_code: "1315",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1600&q=85",
    tagline: "Premier Research & Innovation Hub with Highest NIRF Ranking",
  },
  {
    id: "tce",
    name: "Thiagarajar College of Engineering (TCE)",
    short_name: "TCE Madurai",
    city: "Madurai",
    tnea_code: "5008",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1600&q=85",
    tagline: "South Tamil Nadu's Historic Government-Aided Institution",
  },
  {
    id: "kct",
    name: "Kumaraguru College of Technology (KCT)",
    short_name: "KCT Coimbatore",
    city: "Coimbatore",
    tnea_code: "2712",
    imageUrl: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?auto=format&fit=crop&w=1600&q=85",
    tagline: "Dynamic Autonomous Campus with Global Collaborations & AI Labs",
  },
  {
    id: "skcet",
    name: "Sri Krishna College of Engineering and Technology (SKCET)",
    short_name: "SKCET Coimbatore",
    city: "Coimbatore",
    tnea_code: "2718",
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1600&q=85",
    tagline: "Premier Autonomous Institution with Top Tier Tech Placements",
  },
  {
    id: "bit",
    name: "Bannari Amman Institute of Technology (BIT)",
    short_name: "BIT Sathyamangalam",
    city: "Erode",
    tnea_code: "2702",
    imageUrl: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=1600&q=85",
    tagline: "Green Campus Innovation Leader in Erode District",
  },
  {
    id: "mmc",
    name: "Madras Medical College (MMC)",
    short_name: "MMC Chennai",
    city: "Chennai",
    tnea_code: "MMC",
    imageUrl: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1600&q=85",
    tagline: "India's Apex Medical Training & Healthcare Institution",
  },
  {
    id: "loyola",
    name: "Loyola College (Autonomous)",
    short_name: "Loyola Chennai",
    city: "Chennai",
    tnea_code: "LOYOLA",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=85",
    tagline: "Top NIRF Rank 3 Arts, Science & Commerce College in India",
  },
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
                ? "opacity-90 scale-105 z-10"
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
              className="w-full h-full object-cover object-center brightness-110 contrast-105 saturate-120"
            />
          </div>
        );
      })}

      {/* Sleek Translucent Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080b16]/80 via-[#0e1529]/55 to-[#080b16]/85 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,154,56,0.15),transparent_70%)] z-10" />

      {/* Active College Indicator Badge in Hero */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-20 pointer-events-auto hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/75 border border-white/20 backdrop-blur-md shadow-xl text-[11px] font-medium text-slate-200 transition-all duration-500">
        <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-amber-300 font-bold">Featured Campus:</span>
        <span className="text-white font-semibold truncate max-w-[240px]">
          {activeCollege.short_name} ({activeCollege.city})
        </span>
        {activeCollege.tnea_code !== "MMC" && activeCollege.tnea_code !== "LOYOLA" && (
          <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
            TNEA: {activeCollege.tnea_code}
          </span>
        )}
      </div>

      {/* Slide Navigation Dots at bottom right of hero */}
      <div className="absolute bottom-16 right-8 z-20 pointer-events-auto hidden lg:flex items-center gap-1.5">
        {top10TamilNaduColleges.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setCurrentIndex(i)}
            title={`${c.name} (${c.city})`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentIndex
                ? "w-8 bg-amber-400 shadow-md shadow-amber-400/50"
                : "w-2 bg-white/30 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
