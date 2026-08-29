"use client";

import Link from "next/link";
import { DetailedCollege } from "@/types";
import { formatLpa, formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Award,
  TrendingUp,
  Heart,
  Scale,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";

interface CollegeCardProps {
  college: DetailedCollege;
  onOpenGuidanceModal?: (college: DetailedCollege) => void;
  isShortlisted?: boolean;
  onShortlistToggle?: (college: DetailedCollege) => void;
  isInCompare?: boolean;
  onCompareToggle?: (college: DetailedCollege) => void;
  compareDisabled?: boolean;
}

import { getCampusImageForCollege } from "@/lib/data/collegeImages";

export function CollegeCard({
  college,
  onOpenGuidanceModal,
  isShortlisted = false,
  onShortlistToggle,
  isInCompare = false,
  onCompareToggle,
  compareDisabled = false,
}: CollegeCardProps) {
  // First cutoff record or top courses
  const topCutoff = college.cutoff_records?.[0];
  const primaryCourse = college.courses?.[0];

  const campusImage = getCampusImageForCollege(college.tnea_code, college.slug, college.name);

  return (
    <Card className="group overflow-hidden flex flex-col justify-between hover-lift hover:shadow-2xl hover:border-[#f29a38]/50 transition-all duration-300 rounded-3xl bg-white border border-slate-200 shadow-md">
      <div>
        {/* Top Image Banner & Badges */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          <img
            src={college.banner_url || campusImage}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          {/* Floating Action Buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {onShortlistToggle && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onShortlistToggle(college);
                }}
                className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 shadow-md ${
                  isShortlisted
                    ? "bg-rose-500 text-white shadow-rose-500/40"
                    : "bg-slate-900/70 text-white hover:bg-slate-900"
                }`}
                title={isShortlisted ? "Remove from shortlist" : "Save to shortlist"}
              >
                <Heart className={`h-4 w-4 ${isShortlisted ? "fill-white" : ""}`} />
              </button>
            )}
          </div>

          {/* Bottom Banner Info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {college.tnea_code && (
                <Badge variant="gold" className="text-[10px] font-black bg-amber-500 text-slate-950 border-none shadow-sm">
                  TNEA Code: {college.tnea_code}
                </Badge>
              )}
              {college.nirf_ranking && (
                <Badge variant="secondary" className="bg-slate-900/90 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold shadow-sm">
                  NIRF #{college.nirf_ranking} ({college.nirf_year || 2024})
                </Badge>
              )}
              <Badge variant="success" className="bg-emerald-600 text-white border-none text-[10px] font-bold shadow-sm">
                {college.institution_type}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-700">
                {college.city}, {college.district} District
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-emerald-700 font-bold">
                Tamil Nadu
              </span>
            </div>

            <Link href={`/colleges/${college.slug}`}>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {college.name}
              </h3>
            </Link>

            <p className="text-xs text-slate-600 line-clamp-2 pt-0.5 leading-relaxed font-normal">
              {college.description}
            </p>
          </div>

          {/* Key Metrics Highlight Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-0.5 shadow-2xs">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold">
                <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                <span>Placement Avg</span>
              </div>
              <p className="font-black text-slate-900 text-sm">
                {formatLpa(college.placement_stats?.average_package_lpa)}
              </p>
            </div>

            <div className="p-2.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-0.5 shadow-2xs">
              <div className="flex items-center gap-1 text-[11px] text-amber-900 font-bold">
                <Award className="h-3.5 w-3.5 text-amber-600" />
                <span>Cutoff (OC Gen)</span>
              </div>
              <p className="font-black text-slate-900 text-sm">
                {topCutoff ? `${topCutoff.cutoff_mark} / 200` : "TNEA Merit"}
              </p>
            </div>
          </div>

          {/* Accreditations & Courses */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="truncate max-w-[180px] font-semibold text-slate-700">
              {college.accreditation || "AICTE / UGC Approved"}
            </span>
            <span className="text-blue-700 font-black shrink-0">
              {college.courses?.length || 0} Programs Offered
            </span>
          </div>
        </div>
      </div>

      {/* Footer Action CTAs */}
      <div className="p-4 pt-0 border-t border-slate-100 flex items-center gap-2">
        {onCompareToggle && (
          <Button
            variant={isInCompare ? "accent" : "outline"}
            size="sm"
            disabled={compareDisabled && !isInCompare}
            onClick={() => onCompareToggle(college)}
            className={`text-xs shrink-0 font-bold border-slate-300 ${
              isInCompare ? "bg-[#f29a38] text-slate-950 border-[#f29a38]" : "bg-white text-slate-800 hover:bg-slate-50"
            }`}
            title="Compare up to 4 colleges"
          >
            <Scale className="h-3.5 w-3.5 mr-1" />
            <span>{isInCompare ? "Added" : "Compare"}</span>
          </Button>
        )}

        {onOpenGuidanceModal && (
          <Button
            variant="whatsapp"
            size="sm"
            onClick={() => onOpenGuidanceModal(college)}
            className="text-xs px-2.5 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
            title="WhatsApp Admission Advice"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </Button>
        )}

        <Link href={`/colleges/${college.slug}`} className="flex-1">
          <Button variant="primary" size="sm" className="w-full text-xs font-black gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-xl">
            <span>View Profile</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
