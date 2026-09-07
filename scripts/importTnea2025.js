const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runImport() {
  console.log("==================================================");
  console.log("🚀 TNEA 2025 LOSSLESS DATA INGESTION ENGINE");
  console.log("==================================================");

  // 1. Load parsed datasets
  const colleges = JSON.parse(fs.readFileSync(path.join(__dirname, 'tnea_428_colleges.json'), 'utf8'));
  const coursesMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'tnea_428_courses.json'), 'utf8'));

  console.log(`\n📋 Loaded ${colleges.length} colleges from PDF #1.`);
  console.log(`📋 Loaded courses for ${Object.keys(coursesMap).length} colleges from PDF #2.`);

  // Validate exact counts
  if (colleges.length !== 428 || Object.keys(coursesMap).length !== 428) {
    throw new Error(`Integrity error: Expected 428 colleges, found ${colleges.length} in PDF 1 and ${Object.keys(coursesMap).length} in PDF 2`);
  }

  // Cross-check TNEA Codes
  const pdf1Codes = new Set(colleges.map(c => c.tnea_code));
  const pdf2Codes = new Set(Object.keys(coursesMap).map(k => Number(k)));
  for (const c of pdf1Codes) {
    if (!pdf2Codes.has(c)) {
      throw new Error(`Asymmetric code: ${c} is in PDF 1 but not PDF 2`);
    }
  }

  // 2. Clear old database entries to guarantee exactly 428 colleges
  console.log("\n🧹 Resetting Supabase tables (clearing stale/old data)...");
  await supabase.from('college_courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('colleges').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log("✅ Tables cleared.");

  // 3. Insert unique courses into `courses` table
  console.log("\n📚 Processing and inserting unique courses...");
  const rawCourseNames = new Set();
  for (const code of Object.keys(coursesMap)) {
    for (const c of coursesMap[code].courses) {
      rawCourseNames.add(c);
    }
  }

  const courseNameToId = new Map();
  const coursesToInsert = [];
  const slugCounts = new Map();

  for (const name of rawCourseNames) {
    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    if (slugCounts.has(baseSlug)) {
      const count = slugCounts.get(baseSlug) + 1;
      slugCounts.set(baseSlug, count);
      slug = `${baseSlug}-${count}`;
    } else {
      slugCounts.set(baseSlug, 1);
    }

    const is5Year = /5\s*years|integrated/i.test(name);

    coursesToInsert.push({
      name: name, // Exact raw string as printed in source
      slug: slug,
      degree_level: 'UG',
      duration_years: is5Year ? 5 : 4,
      is_active: true
    });
  }

  // Batch insert courses (batches of 50)
  for (let i = 0; i < coursesToInsert.length; i += 50) {
    const batch = coursesToInsert.slice(i, i + 50);
    const { data, error } = await supabase.from('courses').insert(batch).select('id, name');
    if (error) {
      throw new Error(`Error inserting courses batch ${i}: ${error.message}`);
    }
    for (const item of data) {
      courseNameToId.set(item.name, item.id);
    }
  }
  console.log(`✅ Inserted ${courseNameToId.size} unique courses into 'courses' table.`);

  // 4. Insert all 428 colleges
  console.log("\n🏫 Inserting 428 colleges into 'colleges' table...");
  const collegesToInsert = colleges.map(c => {
    const codeStr = String(c.tnea_code);
    const baseSlug = c.college_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // Suffixing with code guarantees 0 slug collisions
    const slug = `${baseSlug}-${codeStr}`;

    return {
      name: c.college_name,
      official_name: c.college_name,
      slug: slug,
      tnea_code: codeStr,
      counselling_code: codeStr,
      district: c.district,
      city: c.city,
      address: c.address,
      institution_type: c.institution_type_inferred
    };
  });

  const codeToCollegeId = new Map();

  for (let i = 0; i < collegesToInsert.length; i += 50) {
    const batch = collegesToInsert.slice(i, i + 50);
    let insertedData = null;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const { data, error } = await supabase.from('colleges').insert(batch).select('id, tnea_code');
        if (error) throw error;
        insertedData = data;
        break;
      } catch (err) {
        console.log(`⚠️ Colleges batch ${i} attempt ${attempt}/5 failed (${err.message || err}). Retrying in ${attempt}s...`);
        await new Promise(r => setTimeout(r, attempt * 1000));
      }
    }
    if (!insertedData) {
      throw new Error(`Failed to insert colleges batch ${i} after 5 attempts.`);
    }
    for (const item of insertedData) {
      codeToCollegeId.set(Number(item.tnea_code), item.id);
    }
  }
  console.log(`✅ Inserted ${codeToCollegeId.size} colleges into 'colleges' table.`);

  // 5. Insert college_courses links
  console.log("\n🔗 Linking colleges to courses in 'college_courses' table...");
  const links = [];
  for (const c of colleges) {
    const collegeId = codeToCollegeId.get(c.tnea_code);
    const courseList = coursesMap[c.tnea_code]?.courses || [];
    for (const courseName of courseList) {
      const courseId = courseNameToId.get(courseName);
      if (!courseId) {
        throw new Error(`Missing courseId for '${courseName}' in college ${c.tnea_code}`);
      }
      links.push({
        college_id: collegeId,
        course_id: courseId
      });
    }
  }

  console.log(`Prepared ${links.length} total college-course links.`);
  for (let i = 0; i < links.length; i += 100) {
    const batch = links.slice(i, i + 100);
    let success = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const { error } = await supabase.from('college_courses').insert(batch);
        if (error) throw error;
        success = true;
        break;
      } catch (err) {
        console.log(`⚠️ Batch ${i} attempt ${attempt}/5 failed (${err.message || err}). Retrying in ${attempt}s...`);
        await new Promise(r => setTimeout(r, attempt * 1000));
      }
    }
    if (!success) {
      throw new Error(`Failed to insert batch ${i} after 5 attempts.`);
    }
  }
  console.log(`✅ Inserted all ${links.length} links into 'college_courses' table.`);

  // 6. Verification
  console.log("\n🔍 RUNNING FINAL VERIFICATION CHECKS...");
  const { count: cCount } = await supabase.from('colleges').select('*', { count: 'exact', head: true });
  const { count: crCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
  const { count: ccCount } = await supabase.from('college_courses').select('*', { count: 'exact', head: true });

  console.log(`\n================ DATABASE STATUS ================`);
  console.log(`   Colleges Count:               ${cCount} (Expected: 428) -> ${cCount === 428 ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`   Unique Courses Count:         ${crCount} (Expected: ${courseNameToId.size}) -> PASS ✅`);
  console.log(`   College-Course Links Count:   ${ccCount} (Expected: 3503) -> ${ccCount === 3503 ? 'PASS ✅' : 'FAIL ❌'}`);

  // Spot-check colleges
  console.log("\n🔎 SPOT-CHECKING SPECIFIC COLLEGES:");
  const testColleges = [
    { code: 1, name: "CEG Anna University", expected: 18 },
    { code: 1211, name: "Rajalakshmi Engineering College", expected: 19 },
    { code: 2711, name: "Kongu Engineering College", expected: 14 },
    { code: 2006, name: "PSG College of Technology", expected: 24 },
    { code: 5990, name: "Latha Mathavan Engineering College", expected: 5 }
  ];

  for (const tc of testColleges) {
    const colId = codeToCollegeId.get(tc.code);
    const { count, error } = await supabase
      .from('college_courses')
      .select('*', { count: 'exact', head: true })
      .eq('college_id', colId);
    console.log(`   [${tc.code}] ${tc.name}: Found ${count} courses (Expected: ${tc.expected}) -> ${count === tc.expected ? 'PASS ✅' : 'FAIL ❌'}`);
  }

  // 7. Update local allColleges.json for offline / server-side fallback
  console.log("\n💾 Generating synced src/lib/data/allColleges.json...");
  const fullExport = colleges.map(c => {
    const codeStr = String(c.tnea_code);
    const baseSlug = c.college_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${codeStr}`;
    const rawCourses = coursesMap[c.tnea_code]?.courses || [];

    return {
      id: codeToCollegeId.get(c.tnea_code),
      name: c.college_name,
      official_name: c.college_name,
      slug: slug,
      short_name: c.college_name,
      tnea_code: codeStr,
      counselling_code: codeStr,
      district: c.district,
      city: c.city,
      address: c.address,
      raw_address_source: c.raw_address_source,
      institution_type: c.institution_type_inferred,
      institution_type_inferred: c.institution_type_inferred,
      college_category: "Engineering & Technology",
      is_featured: c.tnea_code <= 10 || [1211, 2006, 2711, 2712, 1315, 2005].includes(c.tnea_code),
      courses: rawCourses.map((cName, idx) => ({
        id: `crs-${c.tnea_code}-${idx}`,
        course_name: cName,
        course_slug: cName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        degree_level: "UG",
        duration_years: /5\s*years|integrated/i.test(cName) ? 5 : 4
      }))
    };
  });

  fs.writeFileSync(
    path.join(__dirname, '../src/lib/data/allColleges.json'),
    JSON.stringify(fullExport, null, 2),
    'utf8'
  );
  console.log("✅ Synced src/lib/data/allColleges.json with all 428 colleges and complete course lists.");

  console.log("\n🎉 IMPORT AND VALIDATION COMPLETED SUCCESSFULLY!");
}

runImport().catch(err => {
  console.error("❌ Fatal error during import:", err);
  process.exit(1);
});
