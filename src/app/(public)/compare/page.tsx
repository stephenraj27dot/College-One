"use client";

import { useState } from "react";
import Link from "next/link";
import { useCompare } from "@/hooks/useCompare";
import { verifiedColleges } from "@/lib/data/verifiedTamilNaduData";
import { DetailedCollege } from "@/types";
import { formatCurrency, formatLpa } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Scale,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Building,
} from "lucide-react";

export default function ComparePage() {
  const { compareList, removeFromCompare, clear, toggleCompare } = useCompare();
  const [selectorOpen, setSelectorOpen] = useState(false);

  const availableColleges = verifiedColleges.filter(
    (c) => !compareList.some((item) => item.id === c.id)
  );

  return (
    <div className="py-10 bg-slate-50 min-h-screen pb-28">
      <Container size="xl" className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="gold" className="text-[10px]">
                Side-by-Side Analysis
              </Badge>
              <Badge variant="default" className="text-[10px] bg-blue-50 text-blue-700">
                Max 4 Colleges
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Compare Tamil Nadu Colleges
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Compare cutoffs, NIRF rankings, fee structures, hostel availability, and verified placement statistics across institutions.
            </p>
          </div>

          {compareList.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All</span>
            </Button>
          )}
        </div>

        {/* Comparison Table / Grid */}
        {compareList.length === 0 ? (
          <Card className="p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Scale className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No Colleges Selected</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add up to 4 colleges from our directory to compare fees, NIRF ranks, TNEA cutoffs, and placements side-by-side.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/colleges">
                <Button variant="primary" size="md" className="font-bold text-xs bg-blue-600">
                  Browse Colleges to Compare
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Quick Add College Bar */}
            {compareList.length < 4 && (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Plus className="h-4 w-4 text-blue-600" />
                  <span>You can compare up to {4 - compareList.length} more college(s)</span>
                </div>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      const selected = verifiedColleges.find((c) => c.id === e.target.value);
                      if (selected) toggleCompare(selected);
                      e.target.value = "";
                    }}
                    defaultValue=""
                    className="h-9 rounded-xl border border-slate-300 bg-slate-50 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    <option value="" disabled>
                      + Add College to Compare
                    </option>
                    {availableColleges.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.district})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Comparison Matrix Table */}
            <div className="rounded-3xl border border-slate-200 bg-white overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="p-4 w-48 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      Parameters
                    </th>
                    {compareList.map((col) => (
                      <th key={col.id} className="p-4 min-w-[220px] align-top">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <Link href={`/colleges/${col.slug}`} className="hover:text-blue-600">
                              <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2">
                                {col.name}
                              </h4>
                            </Link>
                            <span className="text-[11px] text-slate-500 block">
                              {col.city}, {col.district}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromCompare(col.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* TNEA Code */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/40">TNEA Code</td>
                    {compareList.map((col) => (
                      <td key={col.id} className="p-4 font-extrabold text-blue-600">
                        {col.tnea_code || "N/A (Autonomous/Medical)"}
                      </td>
                    ))}
                  </tr>

                  {/* Institution Type */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Institution Type</td>
                    {compareList.map((col) => (
                      <td key={col.id} className="p-4 font-semibold text-slate-900">
                        {col.institution_type}
                      </td>
                    ))}
                  </tr>

                  {/* NIRF Rank */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/40">NIRF Ranking</td>
                    {compareList.map((col) => (
                      <td key={col.id} className="p-4">
                        {col.nirf_ranking ? (
                          <Badge variant="gold" className="font-bold">
                            Rank #{col.nirf_ranking} ({col.nirf_year || 2024})
                          </Badge>
                        ) : (
                          <span className="text-slate-400">Not Ranked / Not Published</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* NAAC Accreditation */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Accreditation</td>
                    {compareList.map((col) => (
                      <td key={col.id} className="p-4 text-slate-700 font-medium">
                        {col.accreditation || "UGC / AICTE"}
                      </td>
                    ))}
                  </tr>

                  {/* Placement Average Package */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Avg Package</td>
                    {compareList.map((col) => (
                      <td key={col.id} className="p-4 font-bold text-slate-900">
                        {formatLpa(col.placement_stats?.average_package_lpa)}
                      </td>
                    ))}
                  </tr>

                  {/* Highest Package */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Highest Package</td>
                    {compareList.map((col) => (
                      <td key={col.id} className="p-4 font-bold text-emerald-600">
                        {formatLpa(col.placement_stats?.highest_package_lpa)}
                      </td>
                    ))}
                  </tr>

                  {/* Annual Tuition Fee */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Tuition Fee (Standard)</td>
                    {compareList.map((col) => (
                      <td key={col.id} className="p-4 font-extrabold text-blue-600">
                        {formatCurrency(col.courses?.[0]?.tuition_fee_per_year)} / yr
                      </td>
                    ))}
                  </tr>

                  {/* Hostel Available */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Hostel Facility</td>
                    {compareList.map((col) => (
                      <td key={col.id} className="p-4">
                        {col.hostel_available ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle2 className="h-4 w-4" /> Available
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400">
                            <XCircle className="h-4 w-4" /> Not Available
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Actions Row */}
                  <tr className="bg-slate-50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-100/60">Action</td>
                    {compareList.map((col) => (
                      <td key={col.id} className="p-4">
                        <Link href={`/colleges/${col.slug}`}>
                          <Button variant="primary" size="sm" className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-700">
                            View Full Profile
                          </Button>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
