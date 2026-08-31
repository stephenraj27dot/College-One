import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollegeBySlug } from "@/services/colleges";
import { verifiedColleges } from "@/lib/data/verifiedTamilNaduData";
import { getCampusImageForCollege } from "@/lib/data/collegeImages";
import { formatCurrency, formatLpa } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WhatsAppButton } from "@/components/guidance/WhatsAppButton";
import {
  MapPin,
  Award,
  TrendingUp,
  Building,
  CheckCircle2,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Users,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Info,
} from "lucide-react";

interface CollegeProfilePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return verifiedColleges.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: CollegeProfilePageProps) {
  const { slug } = await params;
  const college = await getCollegeBySlug(slug);

  if (!college) {
    return {
      title: "College Not Found",
    };
  }

  return {
    title: `${college.name} - Cutoff, Fees, Placements & Admission 2026`,
    description: `Official profile for ${college.official_name}. View TNEA Code ${college.tnea_code || "N/A"}, verified 2024 cutoffs, fee structure, placement salary stats, and admission processes.`,
    openGraph: {
      title: `${college.name} - Tamil Nadu Admissions`,
      description: college.description || undefined,
      images: college.banner_url ? [college.banner_url] : undefined,
    },
  };
}

export default async function CollegeProfilePage({ params }: CollegeProfilePageProps) {
  const { slug } = await params;
  const college = await getCollegeBySlug(slug);

  if (!college) {
    notFound();
  }

  // Structured Data (JSON-LD) for CollegeOrUniversity
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: college.official_name,
    alternateName: college.short_name || college.name,
    description: college.description,
    url: college.website_url,
    address: {
      "@type": "PostalAddress",
      streetAddress: college.address,
      addressLocality: college.city,
      addressRegion: college.district,
      postalCode: college.pincode,
      addressCountry: "IN",
    },
  };

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    `Hi College Guide Team, I need admission guidance and cutoff assistance for ${college.name} (${college.tnea_code ? `TNEA Code: ${college.tnea_code}` : ""}).`
  )}`;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3">
        <Container size="xl">
          <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/colleges" className="hover:text-blue-600">
              Colleges
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/colleges?district=${college.district}`} className="hover:text-blue-600">
              {college.district}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-900 font-semibold truncate max-w-xs">
              {college.short_name || college.name}
            </span>
          </nav>
        </Container>
      </div>

      {/* 2. Hero Banner & College Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="relative h-64 sm:h-80 w-full">
          <img
            src={
              college.banner_url ||
              getCampusImageForCollege(college.tnea_code, college.slug, college.name)
            }
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <Container size="xl" className="relative -mt-24 sm:-mt-28 pb-8 z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            {/* Logo & Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-white p-2 border-2 border-white/20 shadow-2xl overflow-hidden shrink-0">
                <img
                  src={
                    college.logo_url ||
                    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80"
                  }
                  alt={college.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {college.tnea_code && (
                    <Badge variant="gold" className="text-xs font-bold bg-amber-500 text-slate-950">
                      TNEA Counselling Code: {college.tnea_code}
                    </Badge>
                  )}
                  {college.nirf_ranking && (
                    <Badge variant="secondary" className="bg-slate-800 text-amber-300 border-amber-500/40 text-xs">
                      NIRF Ranking #{college.nirf_ranking} ({college.nirf_year || 2024})
                    </Badge>
                  )}
                  <Badge variant="success" className="bg-emerald-500 text-white text-xs">
                    {college.institution_type}
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {college.official_name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                    <span>
                      {college.city}, {college.district} District, Tamil Nadu
                    </span>
                  </div>
                  {college.established_year && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>Estd. {college.established_year}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-blue-400 shrink-0" />
                    <span>{college.affiliation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                <Button variant="whatsapp" size="lg" className="w-full font-bold gap-2 shadow-xl">
                  <span>WhatsApp Admission Desk</span>
                </Button>
              </a>


            </div>
          </div>
        </Container>
      </div>

      {/* 3. Main Profile Content */}
      <Container size="xl" className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Main Details) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview Section */}
            <Card className="p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                About the Institution
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {college.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Accreditation</span>
                  <p className="font-bold text-xs text-slate-900">{college.accreditation || "UGC / AICTE"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Hostel Facilities</span>
                  <p className="font-bold text-xs text-slate-900">
                    {college.hostel_available ? "Boys & Girls Available" : "Not Available"}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Campus Transport</span>
                  <p className="font-bold text-xs text-slate-900">
                    {college.transport_available ? "Buses Across Region" : "Public Transport"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Courses & Fees Matrix */}
            <Card className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Offered Courses & Seat Intake
                </h2>
                <Badge variant="default" className="text-xs">
                  {college.courses?.length || 0} Programs
                </Badge>
              </div>

              <div className="space-y-3">
                {college.courses?.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {course.degree_level} • {course.duration_years} Years
                        </Badge>
                        <span className="text-xs text-emerald-600 font-semibold">
                          {course.study_mode}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {course.course_name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Intake: <strong className="text-slate-800">{course.intake_capacity || "Available"} Seats</strong> | Eligibility: {course.eligibility || "12th Standard"}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 shrink-0 text-right">
                      <span className="text-[11px] text-slate-500">Govt / Standard Tuition</span>
                      <span className="text-sm font-extrabold text-blue-600">
                        {formatCurrency(course.tuition_fee_per_year)} / yr
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Verified TNEA Historical Cutoffs */}
            <Card className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Official Historical Cutoffs
                  </h2>
                  <p className="text-xs text-slate-500">
                    Directorate of Technical Education (DoTE) Tamil Nadu Counselling Allotments
                  </p>
                </div>
                <Badge variant="gold" className="text-xs self-start sm:self-auto">
                  Academic Year 2024
                </Badge>
              </div>

              {college.cutoff_records && college.cutoff_records.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                        <th className="p-3">Course</th>
                        <th className="p-3">Community</th>
                        <th className="p-3">Cutoff Mark (out of 200)</th>
                        <th className="p-3">Rank Range</th>
                        <th className="p-3">Authority Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {college.cutoff_records.map((cut) => (
                        <tr key={cut.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-semibold text-slate-900">
                            {college.courses?.find((c) => c.course_id === cut.course_id)?.course_name || "B.E. Degree"}
                          </td>
                          <td className="p-3">
                            <Badge variant="secondary" className="font-bold">
                              {cut.community}
                            </Badge>
                          </td>
                          <td className="p-3 font-extrabold text-blue-600 text-sm">
                            {cut.cutoff_mark}
                          </td>
                          <td className="p-3 text-slate-600">
                            {cut.opening_rank && cut.closing_rank
                              ? `${cut.opening_rank} - ${cut.closing_rank}`
                              : "Merit Allotment"}
                          </td>
                          <td className="p-3 text-[11px] text-slate-500">
                            {cut.source_authority}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 text-center space-y-1 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">Official Cutoff Data Under Verification</p>
                  <p>Check the TNEA Cutoff Predictor for automated cutoff calculations across communities.</p>
                </div>
              )}

              <div className="pt-2">
                <Link href="/college-predictor">
                  <Button variant="accent" size="sm" className="font-bold text-xs gap-1.5 shadow">
                    <span>Test Your 12th Cutoff on Predictor</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Placements & Top Recruiters */}
            {college.placement_stats && (
              <Card className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Placement Statistics ({college.placement_stats.academic_year})
                  </h2>
                  <Badge variant="success" className="text-xs">
                    {college.placement_stats.placement_percentage}% Placement Rate
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
                    <span className="text-[11px] text-blue-700 font-semibold">Highest Package</span>
                    <p className="text-base sm:text-lg font-extrabold text-blue-900">
                      {formatLpa(college.placement_stats.highest_package_lpa)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                    <span className="text-[11px] text-emerald-700 font-semibold">Average Package</span>
                    <p className="text-base sm:text-lg font-extrabold text-emerald-900">
                      {formatLpa(college.placement_stats.average_package_lpa)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                    <span className="text-[11px] text-amber-700 font-semibold">Median Package</span>
                    <p className="text-base sm:text-lg font-extrabold text-amber-900">
                      {formatLpa(college.placement_stats.median_package_lpa)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-600 font-semibold">Total Offers</span>
                    <p className="text-base sm:text-lg font-extrabold text-slate-900">
                      {college.placement_stats.total_offers || "N/A"}
                    </p>
                  </div>
                </div>

                {college.placement_stats.top_recruiters && college.placement_stats.top_recruiters.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                      Prominent Campus Recruiters
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {college.placement_stats.top_recruiters.map((rec) => (
                        <Badge key={rec} variant="secondary" className="px-3 py-1 text-xs font-semibold">
                          {rec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Campus Facilities */}
            {college.facilities && college.facilities.length > 0 && (
              <Card className="p-6 sm:p-8 space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                  Campus Facilities & Infrastructure
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {college.facilities.map((fac) => (
                    <div key={fac} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column (Sidebar Quick Cards) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Admission Help Card */}
            <Card className="p-6 bg-gradient-to-b from-blue-900 to-slate-900 text-white space-y-4 shadow-xl">
              <div className="space-y-1">
                <Badge variant="gold" className="text-[10px]">
                  Direct Student Desk
                </Badge>
                <h3 className="text-lg font-extrabold">Need Help with Admissions?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Get personalized TNEA cutoff advice, fee structure, and hostel booking guidance for {college.short_name || college.name}.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button variant="whatsapp" size="lg" className="w-full font-bold shadow-lg">
                    Chat on WhatsApp
                  </Button>
                </a>

                <Link href={`/compare`} className="block w-full">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full text-white bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-amber-400 font-bold rounded-2xl text-xs shadow-md transition-all"
                  >
                    Compare with Other TN Colleges
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Contact & Admission Desk Information */}
            <Card className="p-6 space-y-4 text-xs border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-extrabold text-sm text-slate-900">
                  Campus Location & Help Desk
                </h3>
                <Badge variant="success" className="text-[9px]">Official Helpline</Badge>
              </div>

              <div className="space-y-3 text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{college.address || `${college.city}, ${college.district}, Tamil Nadu`}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                  <a href="tel:+919629653312" className="hover:text-emerald-600 font-bold text-slate-900 transition-colors">
                    {siteConfig.phoneDisplay}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                  <a href={`mailto:${siteConfig.email}?subject=Admission%20Inquiry%20-%20${encodeURIComponent(college.name)}`} className="hover:text-blue-600 font-medium text-slate-900 transition-colors">
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                    `Hi College Guide Team, I need admission guidance and cutoff assistance for ${college.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button variant="whatsapp" size="sm" className="w-full font-bold">
                    Direct WhatsApp Admission Desk
                  </Button>
                </a>
              </div>
            </Card>

            {/* Provenance & Verification Metadata */}
            <Card className="p-6 space-y-3 bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Academic Record</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Source: {college.source_name || "Official University & DoTE Portals"}. Last verified for Academic Year {college.academic_year || "2024-2025"}.
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
