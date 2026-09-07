const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanSeed() {
  const pdfColleges = require('./pdf_colleges.json');
  const coursesMap = require('./parsed_courses.json');

  // ============ STEP 1: Clear everything ============
  console.log('🗑️  Clearing ALL old data...');
  await supabase.from('college_courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('colleges').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ All old data cleared.');

  // ============ STEP 2: Insert courses ============
  console.log('\n📚 Inserting courses...');
  const allCoursesSet = new Set();
  for (const code of Object.keys(coursesMap)) {
    for (const c of coursesMap[code].courses) {
      allCoursesSet.add(c);
    }
  }

  const seenSlugs = new Set();
  const coursesToInsert = [];
  for (const name of allCoursesSet) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!seenSlugs.has(slug)) {
      seenSlugs.add(slug);
      coursesToInsert.push({ name, slug, degree_level: 'UG', is_active: true });
    }
  }

  const { data: insertedCourses, error: courseErr } = await supabase
    .from('courses')
    .insert(coursesToInsert)
    .select();

  if (courseErr) {
    console.error('❌ Error inserting courses:', courseErr);
    process.exit(1);
  }

  const slugToId = {};
  for (const c of insertedCourses) {
    slugToId[c.slug] = c.id;
  }
  console.log(`✅ Inserted ${insertedCourses.length} unique courses.`);

  // ============ STEP 3: Insert ONLY PDF colleges ============
  console.log('\n🏫 Inserting PDF colleges...');
  
  // Handle duplicate slugs by appending tnea_code
  const slugCount = {};
  for (const c of pdfColleges) {
    const slug = c.slug;
    slugCount[slug] = (slugCount[slug] || 0) + 1;
  }

  const collegesToInsert = pdfColleges.map(c => {
    let slug = c.slug;
    if (slugCount[slug] > 1) {
      slug = `${slug}-${c.tnea_code}`;
    }
    return {
      name: c.name,
      official_name: c.name,
      slug: slug,
      tnea_code: c.tnea_code,
      district: c.district,
      city: c.city,
      institution_type: c.institution_type,
    };
  });

  // Insert in batches of 50
  let insertedColleges = [];
  for (let i = 0; i < collegesToInsert.length; i += 50) {
    const batch = collegesToInsert.slice(i, i + 50);
    const { data, error } = await supabase.from('colleges').insert(batch).select();
    if (error) {
      console.error(`❌ Error at batch ${i}:`, error);
      // Try one by one
      for (const college of batch) {
        const { data: single, error: singleErr } = await supabase.from('colleges').insert(college).select();
        if (singleErr) {
          console.error(`  FAILED: [${college.tnea_code}] ${college.name}: ${singleErr.message}`);
        } else if (single) {
          insertedColleges = insertedColleges.concat(single);
        }
      }
    } else if (data) {
      insertedColleges = insertedColleges.concat(data);
    }
  }
  console.log(`✅ Inserted ${insertedColleges.length} colleges from PDF.`);

  // ============ STEP 4: Link colleges to courses ============
  console.log('\n🔗 Linking colleges to courses...');
  const codeToId = {};
  for (const c of insertedColleges) {
    if (c.tnea_code) codeToId[c.tnea_code] = c.id;
  }

  const links = [];
  for (const code of Object.keys(coursesMap)) {
    const collegeId = codeToId[code];
    if (!collegeId) continue;
    for (const courseName of coursesMap[code].courses) {
      const slug = courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (slugToId[slug]) {
        links.push({ college_id: collegeId, course_id: slugToId[slug] });
      }
    }
  }

  let linkCount = 0;
  for (let i = 0; i < links.length; i += 500) {
    const batch = links.slice(i, i + 500);
    const { error } = await supabase.from('college_courses').insert(batch);
    if (error) {
      console.error(`❌ Error at link batch ${i}:`, error);
    } else {
      linkCount += batch.length;
    }
  }
  console.log(`✅ Linked ${linkCount} college-course pairs.`);

  // ============ STEP 5: Verify ============
  console.log('\n🔍 Verifying...');
  const { count: cCount } = await supabase.from('colleges').select('*', { count: 'exact', head: true });
  const { count: crCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
  const { count: ccCount } = await supabase.from('college_courses').select('*', { count: 'exact', head: true });

  console.log(`\n📊 FINAL DATABASE STATUS:`);
  console.log(`   Colleges: ${cCount} (PDF had ${pdfColleges.length})`);
  console.log(`   Courses: ${crCount}`);
  console.log(`   College-Course Links: ${ccCount}`);

  if (cCount === pdfColleges.length) {
    console.log(`\n🎉 PERFECT! All ${pdfColleges.length} PDF colleges are in the database. Zero miss, zero extras!`);
  } else {
    console.log(`\n⚠️  Count mismatch: DB has ${cCount}, PDF has ${pdfColleges.length}`);
  }
}

cleanSeed().catch(console.error);
