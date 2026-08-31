import { CollegeFilterParams, DetailedCollege, Category } from "@/types";
import { verifiedColleges, verifiedCategories } from "@/lib/data/verifiedTamilNaduData";
import { tn38DistrictsColleges } from "@/lib/data/tn38DistrictsColleges";
import { findCollegeByTneaCode } from "@/lib/data/tneaMasterCodes";
import { createClient } from "@/lib/supabase/client";
import { fetchCollegeViaGeminiAI } from "../aiCollegeService";

const allVerifiedInstitutions = [...verifiedColleges, ...tn38DistrictsColleges];

export async function getColleges(
  params?: CollegeFilterParams
): Promise<{ colleges: DetailedCollege[]; total: number }> {
  const supabase = createClient();

  // Fetch all colleges from the database
  const { data: dbColleges, error } = await supabase
    .from("colleges")
    .select("*");

  if (error) {
    console.error("Error fetching colleges from Supabase:", error);
    return { colleges: [], total: 0 };
  }

  // Map to DetailedCollege format required by the frontend
  let results: DetailedCollege[] = (dbColleges || []).map((c: any) => ({
    ...c,
    courses: [],
    facilities: [],
  }));

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
        c.district.toLowerCase().includes(q)
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
      // We know all seeded colleges from the database are Engineering colleges.
      if (stream === "engineering") {
        return true;
      }
      // For any other stream like medical, arts-science, management, etc., return false
      // since the current database only has TNEA Engineering colleges.
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
  // Increase limit drastically to show all colleges as requested (scrolling)
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
  const supabase = createClient();

  const { data, error } = await supabase
    .from("colleges")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!error && data) {
    return {
      ...(data as any),
      courses: [],
      facilities: [],
    };
  }

  // Check if they passed a TNEA code as the slug
  const { data: codeData, error: codeError } = await supabase
    .from("colleges")
    .select("*")
    .eq("tnea_code", slug)
    .single();

  if (!codeError && codeData) {
    return {
      ...(codeData as any),
      courses: [],
      facilities: [],
    };
  }

  // If not found in db, fallback to Gemini AI
  return await fetchCollegeViaGeminiAI(slug);
}

export async function getFeaturedColleges(): Promise<DetailedCollege[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("colleges")
    .select("*")
    .eq("is_featured", true);
    
  if (error || !data) return [];
  
  return data.map((c: any) => ({
    ...c,
    courses: [],
    facilities: [],
  }));
}

export async function getCategories(): Promise<Category[]> {
  return verifiedCategories;
}
