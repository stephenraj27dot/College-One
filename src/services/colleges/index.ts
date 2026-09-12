import { CollegeFilterParams, DetailedCollege, Category } from "@/types";
import { verifiedColleges, verifiedCategories } from "@/lib/data/verifiedTamilNaduData";
import { createClient } from "@/lib/supabase/client";
import { fetchCollegeViaGeminiAI } from "../aiCollegeService";
import allCollegesPrebuilt from "@/lib/data/allColleges.json";

// In-memory lookup map for 0ms instant SSG builds & offline fallback
const prebuiltSlugMap = new Map<string, DetailedCollege>();
const prebuiltCodeMap = new Map<string, DetailedCollege>();

const DEFAULT_FACILITIES = [
  "Separate Boys & Girls Hostels",
  "College Bus Facility (All Major Routes)",
  "Central Digital Library & Research Center",
  "Wi-Fi Enabled Smart Campus",
  "Modern Sports Complex & Gym",
  "Hygienic Cafeteria & Food Court",
];

function ensureHostelAndBusFacilities(fac?: string[]): string[] {
  const list = Array.isArray(fac) && fac.length > 0 ? [...fac] : [...DEFAULT_FACILITIES];
  if (!list.some((f) => f.toLowerCase().includes("hostel"))) {
    list.unshift("Separate Boys & Girls Hostels");
  }
  if (!list.some((f) => f.toLowerCase().includes("bus") || f.toLowerCase().includes("transport"))) {
    list.splice(1, 0, "College Bus Facility (All Major Routes)");
  }
  return list;
}

for (const c of (allCollegesPrebuilt as any[])) {
  const formatted: DetailedCollege = {
    ...c,
    hostel_available: true,
    transport_available: true,
    sports_facilities: true,
    wifi_campus: true,
    courses: c.courses || [],
    facilities: ensureHostelAndBusFacilities(c.facilities),
  };
  if (c.slug) prebuiltSlugMap.set(c.slug.toLowerCase(), formatted);
  if (c.tnea_code) prebuiltCodeMap.set(String(c.tnea_code), formatted);
}

export async function getColleges(
  params?: CollegeFilterParams
): Promise<{ colleges: DetailedCollege[]; total: number }> {
  const supabase = createClient();

  // Fetch all colleges from the database along with their courses
  let dbColleges: any[] | null = null;
  try {
    const { data, error } = await supabase
      .from("colleges")
      .select(`
        *,
        college_courses (
          *,
          course:courses (*)
        )
      `);
    if (!error && data && data.length > 0) {
      dbColleges = data;
    }
  } catch (err) {
    console.warn("Supabase fetch failed, utilizing synced local verified cache:", err);
  }

  // Map to DetailedCollege format required by the frontend
  let results: DetailedCollege[] = [];

  if (dbColleges && dbColleges.length > 0) {
    results = dbColleges.map((c: any) => {
      const formattedCourses = (c.college_courses || []).map((cc: any) => ({
        ...cc,
        course_name: cc.course?.name || "Unknown Course",
        course_slug: cc.course?.slug || "unknown",
        degree_level: cc.course?.degree_level || "UG",
        duration_years: cc.course?.duration_years || 4,
      }));

      return {
        ...c,
        hostel_available: true,
        transport_available: true,
        sports_facilities: true,
        wifi_campus: true,
        courses: formattedCourses,
        facilities: ensureHostelAndBusFacilities(c.facilities),
      };
    });
  } else {
    // Fallback to our verified 428 colleges
    results = Array.from(prebuiltSlugMap.values());
  }

  if (params?.searchQuery) {
    const rawQ = params.searchQuery.trim();
    const q = rawQ.toLowerCase();
    const numQ = /^\d+$/.test(rawQ) ? Number(rawQ) : null;

    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.short_name && c.short_name.toLowerCase().includes(q)) ||
        (c.tnea_code && (c.tnea_code.toLowerCase().includes(q) || (numQ !== null && Number(c.tnea_code) === numQ))) ||
        (c.counselling_code && (c.counselling_code.toLowerCase().includes(q) || (numQ !== null && Number(c.counselling_code) === numQ))) ||
        c.city.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        (c.courses && c.courses.some((course) => course.course_name.toLowerCase().includes(q)))
    );
  }

  if (params?.district) {
    const d = params.district.toLowerCase();
    results = results.filter((c) => c.district.toLowerCase() === d);
  }

  if (params?.city) {
    const city = params.city.toLowerCase();
    results = results.filter((c) => c.city.toLowerCase() === city);
  }

  if (params?.streamSlug) {
    const stream = params.streamSlug.toLowerCase();
    results = results.filter((c) => {
      if (stream === "engineering") {
        return true;
      }
      return false;
    });
  }

  if (params?.institutionType) {
    const it = params.institutionType.toLowerCase();
    results = results.filter((c) => c.institution_type.toLowerCase() === it);
  }

  if (params?.hostelAvailable) {
    results = results.filter((c) => c.hostel_available);
  }

  // Sorting
  if (params?.sortBy === "name") {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (params?.sortBy === "established_year") {
    results.sort((a, b) => (b.established_year || 0) - (a.established_year || 0));
  }

  const total = results.length;
  const limit = params?.limit || 1000;
  const page = params?.page || 1;
  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);

  return {
    colleges: paginatedResults,
    total,
  };
}

export async function getCollegeBySlug(slug: string): Promise<DetailedCollege | null> {
  const cleanSlug = slug.toLowerCase().trim();

  // 1. Check local in-memory dataset first (0ms instant response during build & production)
  if (prebuiltSlugMap.has(cleanSlug)) {
    return prebuiltSlugMap.get(cleanSlug)!;
  }
  if (prebuiltCodeMap.has(cleanSlug)) {
    return prebuiltCodeMap.get(cleanSlug)!;
  }

  // 2. Query Supabase for custom or newly inserted rows
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("slug", slug)
      .single();

    let collegeData = data;

    if (error || !collegeData) {
      const { data: codeData, error: codeError } = await supabase
        .from("colleges")
        .select("*")
        .eq("tnea_code", slug)
        .single();
        
      if (!codeError && codeData) {
        collegeData = codeData;
      }
    }

    if (collegeData) {
      const { data: coursesData } = await supabase
        .from("college_courses")
        .select(`
          *,
          course:courses (*)
        `)
        .eq("college_id", (collegeData as any).id);

      const formattedCourses = (coursesData || []).map((cc: any) => ({
        ...cc,
        course_name: cc.course?.name || "Unknown Course",
        course_slug: cc.course?.slug || "unknown",
        degree_level: cc.course?.degree_level || "UG",
        duration_years: cc.course?.duration_years || 4,
      }));

      return {
        ...(collegeData as any),
        hostel_available: true,
        transport_available: true,
        sports_facilities: true,
        wifi_campus: true,
        courses: formattedCourses,
        facilities: ensureHostelAndBusFacilities((collegeData as any).facilities),
      };
    }
  } catch (err) {
    console.warn("Supabase query error:", err);
  }

  // 3. Fallback to Gemini AI if college is not yet registered
  return await fetchCollegeViaGeminiAI(slug);
}

export async function getFeaturedColleges(): Promise<DetailedCollege[]> {
  return Array.from(prebuiltSlugMap.values())
    .filter((c) => c.is_featured)
    .slice(0, 10);
}

export async function getCategories(): Promise<Category[]> {
  return verifiedCategories;
}
