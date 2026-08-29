import { University } from "@/types";
import { verifiedUniversities } from "@/lib/data/verifiedTamilNaduData";

export async function getUniversities(district?: string): Promise<University[]> {
  if (district) {
    return verifiedUniversities.filter(
      (u) => u.district.toLowerCase() === district.toLowerCase()
    );
  }
  return verifiedUniversities;
}

export async function getUniversityBySlug(slug: string): Promise<University | null> {
  const univ = verifiedUniversities.find((u) => u.slug.toLowerCase() === slug.toLowerCase());
  return univ || null;
}
