"use client";

import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw, Building2, MapPin, Layers, Home } from "lucide-react";

interface CollegeFilterProps {
  selectedDistrict: string;
  selectedStream: string;
  selectedInstitutionType: string;
  hostelOnly: boolean;
  onDistrictChange: (val: string) => void;
  onStreamChange: (val: string) => void;
  onInstitutionTypeChange: (val: string) => void;
  onHostelToggle: (val: boolean) => void;
  onReset: () => void;
}

export function CollegeFilter({
  selectedDistrict,
  selectedStream,
  selectedInstitutionType,
  hostelOnly,
  onDistrictChange,
  onStreamChange,
  onInstitutionTypeChange,
  onHostelToggle,
  onReset,
}: CollegeFilterProps) {
  const institutionTypes = [
    "Government",
    "Government-Aided",
    "Autonomous",
    "Constituent",
    "Deemed University",
    "Self-Financing / Private",
  ];

  const hasFilters =
    Boolean(selectedDistrict) ||
    Boolean(selectedStream) ||
    Boolean(selectedInstitutionType) ||
    hostelOnly;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-6 shadow-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600" />
          <h3 className="font-extrabold text-sm text-slate-900">
            Filter Colleges
          </h3>
        </div>
        {hasFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Stream / Category Filter */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5 text-blue-500" />
          <span>Academic Stream</span>
        </label>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onStreamChange("")}
            className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              selectedStream === ""
                ? "bg-blue-600 text-white font-bold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Academic Streams
          </button>
          {siteConfig.popularStreams.map((s) => (
            <button
              key={s.slug}
              onClick={() => onStreamChange(s.slug)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                selectedStream === s.slug
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tamil Nadu District Filter */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <MapPin className="h-3.5 w-3.5 text-blue-500" />
          <span>TN District</span>
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All 38 Districts (Tamil Nadu)</option>
          {siteConfig.tamilNaduDistricts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Institution Type Filter */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Building2 className="h-3.5 w-3.5 text-blue-500" />
          <span>Institution Type</span>
        </label>
        <select
          value={selectedInstitutionType}
          onChange={(e) => onInstitutionTypeChange(e.target.value)}
          className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Institution Types</option>
          {institutionTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Campus Facility Toggles */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Campus Facilities
        </label>
        <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hostelOnly}
            onChange={(e) => onHostelToggle(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Hostel Accommodations Available</span>
        </label>
      </div>
    </div>
  );
}
