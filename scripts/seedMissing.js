const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedMissing() {
  const pdfColleges = require('./pdf_colleges.json');
  const coursesMap = require('./parsed_courses.json');

  // Fetch all existing TNEA codes from DB
  let allDbColleges = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('colleges')
      .select('tnea_code')
      .range(from, from + 999);
    if (error) { console.error(error); break; }
    allDbColleges = allDbColleges.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }
  const existingCodes = new Set(allDbColleges.map(c => c.tnea_code).filter(Boolean));
  console.log(`Existing codes in DB: ${existingCodes.size}`);

  // Find missing colleges
  const missing = pdfColleges.filter(c => !existingCodes.has(c.tnea_code));
  console.log(`Missing colleges to insert: ${missing.length}`);

  if (missing.length === 0) {
    console.log('✅ Nothing to insert, all colleges are present!');
    return;
  }

  // Insert missing colleges
  const collegesToInsert = missing.map(c => ({
    name: c.name,
    official_name: c.name,
    slug: c.slug + '-' + c.tnea_code, // ensure unique slug
    tnea_code: c.tnea_code,
    district: c.district,
    city: c.city,
    institution_type: c.institution_type
  }));

  // Insert in batches of 50
  let insertedCount = 0;
  for (let i = 0; i < collegesToInsert.length; i += 50) {
    const batch = collegesToInsert.slice(i, i + 50);
    const { data, error } = await supabase.from('colleges').insert(batch).select();
    if (error) {
      console.error(`Error inserting batch ${i}:`, error);
      // Try one-by-one for this batch
      for (const college of batch) {
        const { data: single, error: singleErr } = await supabase.from('colleges').insert(college).select();
        if (singleErr) {
          console.error(`  Failed: [${college.tnea_code}] ${college.name}: ${singleErr.message}`);
        } else {
          insertedCount++;
        }
      }
    } else {
      insertedCount += data.length;
    }
  }
  console.log(`Inserted ${insertedCount} missing colleges.`);

  // Now link courses for the newly inserted colleges
  // Fetch all colleges again to get IDs
  let allColleges = [];
  from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('colleges')
      .select('id, tnea_code')
      .range(from, from + 999);
    if (error) { console.error(error); break; }
    allColleges = allColleges.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }

  // Fetch all courses to get slug-to-id mapping
  const { data: allCourses, error: courseErr } = await supabase.from('courses').select('id, slug, name');
  if (courseErr) { console.error(courseErr); return; }

  const courseNameToId = {};
  for (const c of allCourses) {
    courseNameToId[c.name] = c.id;
    // Also map by slug
    courseNameToId[c.slug] = c.id;
  }

  // Find new courses that don't exist yet
  const existingCourseNames = new Set(allCourses.map(c => c.name));
  const newCourseNames = new Set();
  for (const code of Object.keys(coursesMap)) {
    for (const courseName of coursesMap[code].courses) {
      if (!existingCourseNames.has(courseName)) {
        newCourseNames.add(courseName);
      }
    }
  }

  if (newCourseNames.size > 0) {
    const seenSlugs = new Set(allCourses.map(c => c.slug));
    const newCourses = [];
    for (const name of newCourseNames) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!seenSlugs.has(slug)) {
        seenSlugs.add(slug);
        newCourses.push({ name, slug, degree_level: 'UG', is_active: true });
      }
    }
    if (newCourses.length > 0) {
      const { data: insertedNew, error: newErr } = await supabase.from('courses').insert(newCourses).select();
      if (newErr) {
        console.error('Error inserting new courses:', newErr);
      } else {
        for (const c of insertedNew) {
          courseNameToId[c.name] = c.id;
        }
        console.log(`Inserted ${insertedNew.length} new courses.`);
      }
    }
  }

  // Link colleges to courses
  const codeToCollegeId = {};
  for (const c of allColleges) {
    if (c.tnea_code) codeToCollegeId[c.tnea_code] = c.id;
  }

  const links = [];
  for (const code of Object.keys(coursesMap)) {
    const collegeId = codeToCollegeId[code];
    if (!collegeId) continue;
    for (const courseName of coursesMap[code].courses) {
      const courseId = courseNameToId[courseName];
      if (courseId) {
        links.push({ college_id: collegeId, course_id: courseId });
      }
    }
  }

  // Remove existing links first to avoid duplicates
  // Insert in batches
  let linkCount = 0;
  for (let i = 0; i < links.length; i += 500) {
    const batch = links.slice(i, i + 500);
    const { error: linkErr } = await supabase.from('college_courses').upsert(batch, { onConflict: 'college_id,course_id', ignoreDuplicates: true });
    if (linkErr) {
      // Try inserting ignoring errors
      for (const link of batch) {
        const { error: singleErr } = await supabase.from('college_courses').insert(link);
        if (!singleErr) linkCount++;
      }
    } else {
      linkCount += batch.length;
    }
  }
  console.log(`Linked ${linkCount} college-course pairs.`);

  // Final verification
  const { count } = await supabase.from('colleges').select('*', { count: 'exact', head: true });
  console.log(`\n✅ Final total colleges in DB: ${count}`);
}

seedMissing().catch(console.error);
