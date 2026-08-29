"use client";

import Link from "next/link";
import { DetailedCollege } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";

interface CompareDrawerProps {
  compareList: DetailedCollege[];
  onRemove: (collegeId: string) => void;
  onClear: () => void;
}

export function CompareDrawer({
  compareList,
  onRemove,
  onClear,
}: CompareDrawerProps) {
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-700 text-white backdrop-blur-lg shadow-2xl p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Count & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white">Compare Colleges</h4>
              <Badge variant="gold" className="text-[10px]">
                {compareList.length} / 4 Selected
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">
              Side-by-side analysis of cutoffs, NIRF rankings, fees & placements
            </p>
          </div>
        </div>

        {/* Center Thumbnail Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {compareList.map((col) => (
            <div
              key={col.id}
              className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
            >
              <span className="font-semibold truncate max-w-[120px] sm:max-w-[160px]">
                {col.short_name || col.name}
              </span>
              <button
                onClick={() => onRemove(col.id)}
                className="text-slate-400 hover:text-rose-400 p-0.5 rounded"
                title="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-rose-400 font-medium px-2 py-1 flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>

          <Link href="/compare">
            <Button variant="accent" size="sm" className="font-bold gap-1 shadow-lg">
              <span>Compare Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
