/// <reference types="node" />
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hyxkrxznmfjsoklspasg.supabase.co";
// NOTE: We need service role key to delete all rows easily without RLS blocking, 
// but if anon key has delete permissions we can try it.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_E2HEX7vgP_W2Zqgkm32pgA_AbGjGL5S";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("🚀 Starting Database Clearance and PDF Data Seeding...");

  try {
    // 1. Delete all existing colleges
    console.log("🧹 Clearing existing colleges table...");
    // Supabase JS requires at least one filter for delete. We can filter by id is not null, or slug not equal to 'something-impossible'
    const { error: deleteError } = await supabase
      .from("colleges")
      .delete()
      .neq("slug", "impossible-slug-to-delete-all");

    if (deleteError) {
      console.error("❌ Failed to clear colleges. Make sure your Anon key has DELETE permissions, or use a Service Role key.");
      console.error(deleteError);
      return;
    }
    console.log("✅ Cleared existing colleges.");

    // 2. Read parsed PDF data
    const dataPath = path.join(process.cwd(), "scripts", "pdf_colleges.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const parsedColleges = JSON.parse(rawData);

    console.log(`📊 Found ${parsedColleges.length} colleges in PDF data.`);

    // 3. Format records for insertion
    const records = parsedColleges.map((c: any) => ({
      slug: c.slug,
      name: c.name,
      short_name: c.name,
      official_name: c.name,
      tnea_code: c.tnea_code,
      counselling_code: c.tnea_code,
      district: c.district,
      city: c.city,
      address: `${c.city}, ${c.district} District, Tamil Nadu`,
      pincode: "",
      established_year: null,
      institution_type: c.institution_type,
      affiliation: "Anna University", // Most TNEA engineering colleges are Anna Univ affiliated
      accreditation: "",
      nirf_ranking: null,
      nirf_year: null,
      description: `${c.name} (TNEA Code: ${c.tnea_code}) is an engineering institution located in ${c.city}, ${c.district} District.`,
      logo_url: "/logo.jpg",
      banner_url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
      website_url: "",
      contact_phone: "",
      contact_email: "",
      hostel_available: false,
      transport_available: false,
      sports_facilities: false,
      wifi_campus: false,
      is_featured: false,
      is_verified: true,
      verification_status: "VERIFIED",
      source_name: "TNEA Official Directory",
      academic_year: "2024-2025",
    }));

    // Filter out duplicates
    const uniqueRecords = [];
    const seenSlugs = new Set();
    for (const r of records) {
      if (!seenSlugs.has(r.slug)) {
        seenSlugs.add(r.slug);
        uniqueRecords.push(r);
      }
    }

    console.log(`📊 Total Unique Colleges to seed: ${uniqueRecords.length}`);

    // Insert in batches of 25
    const batchSize = 25;
    let totalSuccess = 0;

    for (let i = 0; i < uniqueRecords.length; i += batchSize) {
      const batch = uniqueRecords.slice(i, i + batchSize);
      const { data, error } = await supabase.from("colleges").upsert(batch, { onConflict: "slug" });

      if (error) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
      } else {
        totalSuccess += batch.length;
        console.log(`✅ Seeded batch ${Math.floor(i / batchSize) + 1} (${totalSuccess} / ${uniqueRecords.length} colleges)`);
      }
    }

    console.log(`🎉 Complete! Successfully seeded ${totalSuccess} colleges from the PDF.`);

  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

run();
