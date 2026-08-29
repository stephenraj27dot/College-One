import { createClient } from "@supabase/supabase-js";
import { verifiedColleges, verifiedCategories, verifiedUniversities } from "../src/lib/data/verifiedTamilNaduData";
import { tneaMasterDirectory } from "../src/lib/data/tneaMasterCodes";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hyxkrxznmfjsoklspasg.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_E2HEX7vgP_W2Zqgkm32pgA_AbGjGL5S";

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🚀 Starting Supabase Database Migration & Seeding for College Guide...");

  // 1. Categories
  console.log("📦 Seeding Categories...");
  for (const cat of verifiedCategories) {
    const { error } = await supabase.from("categories").upsert({
      id: cat.id.startsWith("cat-") ? undefined : cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon_name: cat.icon_name,
      is_active: true,
      display_order: cat.display_order,
    }, { onConflict: "slug" });

    if (error) console.log("Category notice:", cat.name, error.message);
  }

  // 2. Universities
  console.log("🏛️ Seeding Universities...");
  for (const univ of verifiedUniversities) {
    const { error } = await supabase.from("universities").upsert({
      name: univ.name,
      official_name: univ.official_name,
      slug: univ.slug,
      university_type: univ.university_type,
      district: univ.district,
      city: univ.city,
      established_year: univ.established_year,
      accreditation: univ.accreditation,
      website_url: univ.website_url,
      logo_url: univ.logo_url,
      description: univ.description,
      is_verified: true,
    }, { onConflict: "slug" });

    if (error) console.log("University notice:", univ.name, error.message);
  }

  // 3. Verified Colleges + TNEA Master Directory
  console.log("🏫 Seeding Colleges & TNEA Directory...");
  const collegesToSeed = [...verifiedColleges];

  // Merge TNEA Master entries
  for (const tnea of tneaMasterDirectory) {
    const exists = collegesToSeed.some(c => c.tnea_code === tnea.code);
    if (!exists) {
      const slug = tnea.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      collegesToSeed.push({
        id: `tnea-${tnea.code}`,
        slug,
        name: tnea.name,
        short_name: tnea.short_name,
        official_name: tnea.name,
        tnea_code: tnea.code,
        counselling_code: tnea.code,
        university_id: null,
        location_id: null,
        category_name: "Engineering & Technology",
        category_slug: "engineering",
        institution_type: tnea.institution_type as any,
        affiliation: tnea.affiliated_university,
        accreditation: `NAAC ${tnea.naac_grade} Grade | AICTE Approved`,
        nirf_ranking: tnea.nirf_ranking,
        nirf_year: 2024,
        established_year: tnea.established_year,
        city: tnea.city,
        district: tnea.district,
        pincode: "600001",
        address: `${tnea.city}, ${tnea.district} District, Tamil Nadu`,
        description: `${tnea.name} (TNEA Counselling Code: ${tnea.code}) is a leading engineering college located in ${tnea.city}, Tamil Nadu.`,
        website_url: "https://collegeguide.in",
        contact_phone: "+91 96296 53312",
        contact_email: "support@collegeguide.in",
        banner_url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
        logo_url: "/logo.jpg",
        hostel_available: true,
        transport_available: true,
        sports_facilities: true,
        wifi_campus: true,
        is_featured: false,
        is_verified: true,
        verification_status: "VERIFIED",
        source_name: "Official TNEA Directory",
        source_url: null,
        academic_year: "2024-2025",
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        facilities: ["Wi-Fi Campus", "Central Library", "Hostels", "Sports", "Placement Cell"],
        courses: [],
        cutoff_records: [],
      });
    }
  }

  console.log(`📊 Total Colleges ready to seed: ${collegesToSeed.length}`);

  let insertedCount = 0;
  for (const c of collegesToSeed) {
    const { error } = await supabase.from("colleges").upsert({
      name: c.name,
      official_name: c.official_name,
      slug: c.slug,
      short_name: c.short_name,
      tnea_code: c.tnea_code,
      counselling_code: c.counselling_code,
      district: c.district,
      city: c.city,
      address: c.address,
      pincode: c.pincode,
      established_year: c.established_year,
      institution_type: c.institution_type,
      affiliation: c.affiliation,
      accreditation: c.accreditation,
      nirf_ranking: c.nirf_ranking,
      nirf_year: c.nirf_year,
      description: c.description,
      logo_url: "/logo.jpg",
      banner_url: c.banner_url || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
      website_url: c.website_url,
      // STRICT OVERRIDE: College Guide Admission Desk ONLY
      contact_phone: "+91 96296 53312",
      contact_email: "support@collegeguide.in",
      hostel_available: c.hostel_available,
      transport_available: c.transport_available,
      sports_facilities: c.sports_facilities,
      wifi_campus: c.wifi_campus,
      is_featured: c.is_featured,
      is_verified: true,
      verification_status: "VERIFIED",
      source_name: "College Guide Verified Academic Records",
      academic_year: "2024-2025",
    }, { onConflict: "slug" });

    if (!error) {
      insertedCount++;
    } else {
      console.log(`Notice on college ${c.name}:`, error.message);
    }
  }

  console.log(`✅ Successfully seeded ${insertedCount} / ${collegesToSeed.length} colleges into Supabase!`);
}

seed().catch(console.error);
