import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { verifiedColleges } from "@/lib/data/verifiedTamilNaduData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (siteConfig.url || "https://collegesguide.in").replace(/\/$/, "");

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/colleges`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/college-predictor`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/universities`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/exams`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/course-finder`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guidance`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic College Profiles
  const collegeRoutes: MetadataRoute.Sitemap = verifiedColleges.map((college) => ({
    url: `${baseUrl}/colleges/${college.slug}`,
    lastModified: new Date(college.updated_at || new Date()),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...routes, ...collegeRoutes];
}
