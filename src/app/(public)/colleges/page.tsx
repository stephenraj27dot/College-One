"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DetailedCollege } from "@/types";
import { getColleges } from "@/services/colleges";
import { Container } from "@/components/layout/Container";
import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeFilter } from "@/components/search/CollegeFilter";
import { CollegeSearch } from "@/components/search/CollegeSearch";
import { CompareDrawer } from "@/components/college/CompareDrawer";
import { GuidanceModal } from "@/components/guidance/GuidanceModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useShortlist } from "@/hooks/useShortlist";
import { useCompare } from "@/hooks/useCompare";
import { Heart, Loader2, SearchX, ArrowUpDown } from "lucide-react";
import Link from "next/link";

function CollegesDirectoryContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialDistrict = searchParams.get("district") || "";
  const initialStream = searchParams.get("stream") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedStream, setSelectedStream] = useState(initialStream);
  const [selectedInstitutionType, setSelectedInstitutionType] = useState("");
  const [hostelOnly, setHostelOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "nirf" | "name" | "established_year">("relevance");

  const [colleges, setColleges] = useState<DetailedCollege[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync URL search params when URL changes
  useEffect(() => {
    const s = searchParams.get("search") || "";
    const d = searchParams.get("district") || "";
    const st = searchParams.get("stream") || "";
    setSearchQuery(s);
    setSelectedDistrict(d);
    setSelectedStream(st);
  }, [searchParams]);

  const [selectedCollegeForGuidance, setSelectedCollegeForGuidance] =
    useState<DetailedCollege | null>(null);
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false);

  const { isShortlisted, toggle: toggleShortlist, count: shortlistCount } = useShortlist();
  const {
    compareList,
    isInCompare,
    toggleCompare,
    removeFromCompare,
    clear: clearCompare,
    canAdd,
  } = useCompare();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getColleges({
      searchQuery: searchQuery || undefined,
      district: selectedDistrict || undefined,
      streamSlug: selectedStream || undefined,
      institutionType: selectedInstitutionType || undefined,
      hostelAvailable: hostelOnly || undefined,
      sortBy,
    }).then((res) => {
      if (isMounted) {
        setColleges(res.colleges);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedDistrict, selectedStream, selectedInstitutionType, hostelOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDistrict("");
    setSelectedStream("");
    setSelectedInstitutionType("");
    setHostelOnly(false);
    setSortBy("relevance");
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen pb-36">
      <Container size="xl" className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="gold" className="text-[10px]">
                Tamil Nadu Only
              </Badge>
              <Badge variant="default" className="text-[10px] bg-blue-50 text-blue-700">
                Verified Directory
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Colleges & Higher Educational Institutions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Explore authentic colleges in Tamil Nadu with verified TNEA codes, NAAC accreditations, placement packages, and historical cutoff records.
            </p>
          </div>

          {/* Shortlist link */}
          {shortlistCount > 0 && (
            <Link href="/shortlist">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-rose-300 text-rose-600 hover:bg-rose-50 font-semibold text-xs"
              >
                <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                <span>My Shortlist ({shortlistCount})</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Layout Grid: Sidebar Filters + Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <CollegeFilter
              selectedDistrict={selectedDistrict}
              selectedStream={selectedStream}
              selectedInstitutionType={selectedInstitutionType}
              hostelOnly={hostelOnly}
              onDistrictChange={setSelectedDistrict}
              onStreamChange={setSelectedStream}
              onInstitutionTypeChange={setSelectedInstitutionType}
              onHostelToggle={setHostelOnly}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Main Results Area */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-5">
            {/* Search Bar & Sort Row */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <CollegeSearch value={searchQuery} onChange={setSearchQuery} />
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span>Sort By:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="nirf">NIRF Ranking</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="established_year">Established Year</option>
                </select>
              </div>
            </div>

            {/* Results Count & Filter Indicators */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
              <span>
                Showing <strong className="text-slate-900 font-bold">{colleges.length}</strong> verified institutions in Tamil Nadu
              </span>
              {(selectedDistrict || selectedStream || selectedInstitutionType || hostelOnly || searchQuery) && (
                <span className="text-blue-600 font-semibold">Active Filter Applied</span>
              )}
            </div>

            {/* Grid Content */}
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="text-xs text-slate-500 font-medium">Loading verified institutions...</span>
              </div>
            ) : colleges.length === 0 ? (
              /* Honest Empty State */
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-sm">
                <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <SearchX className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    No Tamil Nadu Colleges Found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    We could not find any verified colleges matching your selected filters. Please adjust your district or stream filters.
                  </p>
                </div>
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  size="sm"
                  className="font-semibold text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {colleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    onOpenGuidanceModal={(c) => {
                      setSelectedCollegeForGuidance(c);
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
            )}
          </div>
        </div>
      </Container>

      {/* Guidance Modal */}
      <GuidanceModal
        isOpen={isGuidanceModalOpen}
        onClose={() => setIsGuidanceModalOpen(false)}
        targetCollege={selectedCollegeForGuidance}
      />

      {/* Compare Floating Drawer */}
      <CompareDrawer
        compareList={compareList}
        onRemove={removeFromCompare}
        onClear={clearCompare}
      />
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <CollegesDirectoryContent />
    </Suspense>
  );
}
