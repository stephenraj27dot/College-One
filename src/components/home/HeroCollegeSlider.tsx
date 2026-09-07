"use client";

import { useState, useEffect } from "react";
import { MapPin, Building, Sparkles } from "lucide-react";

import allColleges from "@/lib/data/allColleges.json";

export interface TopCollegeSlide {
  id: string;
  name: string;
  short_name: string;
  city: string;
  tnea_code: string;
  imageUrl: string;
  tagline: string;
}

export const top10TamilNaduColleges: TopCollegeSlide[] = allColleges
  .filter((c: any) => c.is_featured)
  .slice(0, 10)
  .map((c: any) => ({
    id: c.id,
    name: c.name,
    short_name: c.short_name || c.name,
    city: c.city || "",
    tnea_code: c.tnea_code || "N/A",
    imageUrl: c.banner_url || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
    tagline: c.accreditation || "Top College"
  }));

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


    </div>
  );
}
