"use client";

import { useShortlist } from "@/hooks/useShortlist";
import { verifiedColleges } from "@/lib/data/verifiedTamilNaduData";
import { Container } from "@/components/layout/Container";
import { CollegeCard } from "@/components/college/CollegeCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ShortlistPage() {
  const { shortlist, toggle, isLoaded } = useShortlist();

  const shortlistedColleges = verifiedColleges.filter((c) =>
    shortlist.includes(c.id)
  );

  return (
    <div className="py-10 bg-slate-50 min-h-screen pb-28">
      <Container size="xl" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="gold" className="text-[10px]">
                Student Dashboard
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                {shortlistedColleges.length} Saved
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              My Saved Tamil Nadu Colleges
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your bookmarked institutions for TNEA choice filling and admission applications.
            </p>
          </div>

          <Link href="/colleges">
            <Button variant="primary" size="sm" className="text-xs font-bold bg-blue-600 hover:bg-blue-700">
              + Discover More Colleges
            </Button>
          </Link>
        </div>

        {!isLoaded ? (
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : shortlistedColleges.length === 0 ? (
          <Card className="p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="h-16 w-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Your Shortlist is Empty</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click the heart icon on any college card across the platform to save and track your favorite institutions.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/colleges">
                <Button variant="primary" size="md" className="font-bold text-xs bg-blue-600">
                  Explore Tamil Nadu Colleges
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlistedColleges.map((col) => (
              <CollegeCard
                key={col.id}
                college={col}
                isShortlisted={true}
                onShortlistToggle={(c) => toggle(c.id)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
