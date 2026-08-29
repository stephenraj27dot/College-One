import Link from "next/link";
import { verifiedColleges } from "@/lib/data/verifiedTamilNaduData";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, ArrowRight, ShieldCheck, Layers } from "lucide-react";

export const metadata = {
  title: "Academic Courses & Degrees in Tamil Nadu",
  description: "Browse verified engineering, medical, arts, science, and law degree courses in Tamil Nadu. Explore eligibility, career prospects, and offering institutions.",
};

export default function CoursesPage() {
  // Aggregate unique courses from verified Tamil Nadu colleges
  const allCoursesMap = new Map<string, any>();

  verifiedColleges.forEach((col) => {
    col.courses?.forEach((course) => {
      if (!allCoursesMap.has(course.course_name)) {
        allCoursesMap.set(course.course_name, {
          name: course.course_name,
          slug: course.course_slug,
          degree_level: course.degree_level,
          duration_years: course.duration_years,
          specialization: course.specialization,
          eligibility: course.eligibility,
          offeringColleges: [col],
        });
      } else {
        const existing = allCoursesMap.get(course.course_name);
        existing.offeringColleges.push(col);
      }
    });
  });

  const uniqueCourses = Array.from(allCoursesMap.values());

  return (
    <div className="py-10 bg-slate-50 min-h-screen pb-24">
      <Container size="xl" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" className="text-[10px]">
            Academic Catalog
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Courses & Degrees in Tamil Nadu
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Browse accredited undergraduate and postgraduate programs offered across top institutions in Tamil Nadu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueCourses.map((c) => (
            <Card key={c.name} className="p-6 space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px]">
                    {c.degree_level} • {c.duration_years} Years
                  </Badge>
                  <span className="text-[11px] text-blue-600 font-semibold">
                    {c.offeringColleges.length} Top College(s)
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 line-clamp-2">
                  {c.name}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {c.eligibility || "Standard Class 12 Merit Admission via Tamil Nadu Single Window Counselling."}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Offered by:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.offeringColleges.slice(0, 2).map((col: any) => (
                      <Link key={col.id} href={`/colleges/${col.slug}`}>
                        <Badge variant="outline" className="text-[10px] hover:bg-slate-100">
                          {col.short_name || col.name}
                        </Badge>
                      </Link>
                    ))}
                    {c.offeringColleges.length > 2 && (
                      <Badge variant="secondary" className="text-[10px]">
                        +{c.offeringColleges.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link href={`/colleges?search=${encodeURIComponent(c.name)}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1 text-blue-600 border-blue-200 hover:bg-blue-50">
                    <span>Find Offering Colleges</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
