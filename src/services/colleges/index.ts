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
  // If Supabase is connected and configured, we can query live tables, otherwise use verified dataset
  let results = [...allVerifiedInstitutions];

  if (params?.searchQuery) {
    const rawQ = params.searchQuery.trim();
    const q = rawQ.toLowerCase();
    const isCode = /^\d{1,4}$/.test(rawQ);

    // 1. Direct TNEA Code instant lookup
    if (isCode) {
      const codeMatch = findCollegeByTneaCode(rawQ);
      if (codeMatch) {
        return {
          colleges: [codeMatch],
          total: 1,
        };
      }
    }

    const numQ = /^\d+$/.test(rawQ) ? Number(rawQ) : null;

    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.short_name && c.short_name.toLowerCase().includes(q)) ||
        (c.tnea_code && (c.tnea_code.toLowerCase().includes(q) || (numQ !== null && Number(c.tnea_code) === numQ))) ||
        (c.counselling_code && (c.counselling_code.toLowerCase().includes(q) || (numQ !== null && Number(c.counselling_code) === numQ))) ||
        c.city.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        (c.category_name && c.category_name.toLowerCase().includes(q)) ||
        c.courses.some(
          (course) =>
            course.course_name.toLowerCase().includes(q) ||
            (course.specialization && course.specialization.toLowerCase().includes(q))
        )
    );

    // If no static results found, dynamically lookup via AI (supports both name and uncataloged TNEA codes)
    if (results.length === 0 && rawQ.length >= 1) {
      const aiCollege = await fetchCollegeViaGeminiAI(rawQ);
      if (aiCollege) {
        return {
          colleges: [aiCollege],
          total: 1,
        };
      }
    }
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
      if (c.category_slug?.toLowerCase() === stream) return true;
      if (stream === "engineering") {
        return (
          c.category_slug === "engineering" ||
          c.name.toLowerCase().includes("engineering") ||
          c.name.toLowerCase().includes("technology") ||
          c.courses.some((crs) => crs.course_name.toLowerCase().includes("b.e") || crs.course_name.toLowerCase().includes("b.tech"))
        );
      }
      if (stream === "medical") {
        return (
          c.category_slug === "medical" ||
          c.name.toLowerCase().includes("medical") ||
          c.name.toLowerCase().includes("dental") ||
          c.courses.some((crs) => crs.course_name.toLowerCase().includes("mbbs") || crs.course_name.toLowerCase().includes("bds"))
        );
      }
      if (stream === "arts-science") {
        return (
          c.category_slug === "arts-science" ||
          c.name.toLowerCase().includes("arts") ||
          c.name.toLowerCase().includes("science") ||
          c.name.toLowerCase().includes("loyola") ||
          c.courses.some((crs) => crs.course_name.toLowerCase().includes("b.com") || crs.course_name.toLowerCase().includes("b.sc"))
        );
      }
      if (stream === "management") {
        return (
          c.category_slug === "management" ||
          c.name.toLowerCase().includes("management") ||
          c.name.toLowerCase().includes("business") ||
          c.courses.some((crs) => crs.course_name.toLowerCase().includes("mba") || crs.course_name.toLowerCase().includes("bba"))
        );
      }
      if (stream === "law") {
        return (
          c.category_slug === "law" ||
          c.name.toLowerCase().includes("law") ||
          c.courses.some((crs) => crs.course_name.toLowerCase().includes("llb"))
        );
      }
      if (stream === "nursing") {
        return (
          c.category_slug === "nursing" ||
          c.name.toLowerCase().includes("nursing") ||
          c.courses.some((crs) => crs.course_name.toLowerCase().includes("nursing"))
        );
      }
      if (stream === "agriculture") {
        return (
          c.category_slug === "agriculture" ||
          c.name.toLowerCase().includes("agri") ||
          c.courses.some((crs) => crs.course_name.toLowerCase().includes("agri"))
        );
      }
      if (stream === "architecture") {
        return (
          c.category_slug === "architecture" ||
          c.name.toLowerCase().includes("architecture") ||
          c.courses.some((crs) => crs.course_name.toLowerCase().includes("b.arch") || crs.course_name.toLowerCase().includes("architecture"))
        );
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

  if (params?.minNirfRank || params?.maxNirfRank) {
    results = results.filter((c) => {
      if (!c.nirf_ranking) return false;
      if (params.minNirfRank && c.nirf_ranking < params.minNirfRank) return false;
      if (params.maxNirfRank && c.nirf_ranking > params.maxNirfRank) return false;
      return true;
    });
  }

  // Sorting
  if (params?.sortBy === "nirf") {
    results.sort((a, b) => {
      if (!a.nirf_ranking) return 1;
      if (!b.nirf_ranking) return -1;
      return a.nirf_ranking - b.nirf_ranking;
    });
  } else if (params?.sortBy === "name") {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (params?.sortBy === "established_year") {
    results.sort((a, b) => (b.established_year || 0) - (a.established_year || 0));
  }

  const total = results.length;
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);

  return {
    colleges: paginatedResults,
    total,
  };
}

export async function getCollegeBySlug(slug: string): Promise<DetailedCollege | null> {
  const college = allVerifiedInstitutions.find(
    (c) => c.slug.toLowerCase() === slug.toLowerCase() || (c.tnea_code && c.tnea_code.toLowerCase() === slug.toLowerCase())
  );

  if (college) {
    return college;
  }

  // Check TNEA Master Code directory
  const tneaMatch = findCollegeByTneaCode(slug);
  if (tneaMatch) {
    return tneaMatch;
  }

  // If not found in static records, retrieve/generate dynamically via Gemini AI
  return await fetchCollegeViaGeminiAI(slug);
}

export async function getFeaturedColleges(): Promise<DetailedCollege[]> {
  return verifiedColleges.filter((c) => c.is_featured);
}

export async function getCategories(): Promise<Category[]> {
  return verifiedCategories;
}
