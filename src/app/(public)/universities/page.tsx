import Link from "next/link";
import { verifiedUniversities } from "@/lib/data/verifiedTamilNaduData";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Globe, ExternalLink, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Top Universities in Tamil Nadu",
  description: "Explore premier state and central universities in Tamil Nadu including Anna University, University of Madras, TN MGR Medical University, TNAU, and TNDALU.",
};

export default function UniversitiesPage() {
  return (
    <div className="py-10 bg-slate-50 min-h-screen pb-24">
      <Container size="xl" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" className="text-[10px]">
            Statutory Bodies & Universities
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tamil Nadu Universities
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Discover premier state and public universities governing higher education, research, and collegiate affiliations across Tamil Nadu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedUniversities.map((univ) => (
            <Card key={univ.id} className="p-6 space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="success" className="text-[10px]">
                    {univ.university_type}
                  </Badge>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Estd. {univ.established_year}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {univ.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>{univ.city}, Tamil Nadu</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {univ.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <span className="font-bold text-[10px] uppercase text-slate-400 block">Accreditation</span>
                  <p className="font-semibold">{univ.accreditation || "UGC Recognized"}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <Link href={`/colleges?search=${encodeURIComponent(univ.name)}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-700">
                    View Affiliated Colleges
                  </Button>
                </Link>
                {univ.website_url && (
                  <a href={univ.website_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="text-xs px-2.5" title="Official Website">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
