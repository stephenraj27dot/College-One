import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Loading data...');
  const collegesDump = JSON.parse(fs.readFileSync(path.join(__dirname, '../all_colleges_dump.json'), 'utf8'));
  const coursesMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'parsed_courses.json'), 'utf8'));

  console.log('Clearing old data...');
  await supabase.from('college_courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('colleges').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('Inserting courses...');
  // Extract all unique courses
  const allCoursesSet = new Set<string>();
  for (const code of Object.keys(coursesMap)) {
    const courses = coursesMap[code].courses;
    for (const c of courses) {
      allCoursesSet.add(c);
    }
  }

  const courseNameToId: Record<string, string> = {};
  const seenSlugs = new Set<string>();
  const coursesToInsert = [];
  
  for (const name of Array.from(allCoursesSet)) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!seenSlugs.has(slug)) {
      seenSlugs.add(slug);
      coursesToInsert.push({ name, slug, degree_level: 'UG', is_active: true });
    }
  }

  const slugToId: Record<string, string> = {};
  if (coursesToInsert.length > 0) {
    const { data: insertedCourses, error: courseErr } = await supabase
      .from('courses')
      .insert(coursesToInsert)
      .select();

    if (courseErr) {
      console.error('Error inserting courses:', courseErr);
      process.exit(1);
    }

    for (const c of insertedCourses) {
      slugToId[c.slug] = c.id;
    }
    console.log(`Inserted ${insertedCourses.length} unique courses.`);
  }

  console.log('Inserting colleges...');
  const collegesToInsert = [];
  
  for (const college of collegesDump) {
    // Filter out unwanted columns to keep it clean and structured
    // Only keeping data that was requested / came from PDF
    collegesToInsert.push({
      name: college.name,
      official_name: college.official_name || college.name,
      slug: college.slug,
      short_name: college.short_name,
      tnea_code: college.tnea_code,
      district: college.district,
      city: college.city,
      address: college.address,
      pincode: college.pincode,
      institution_type: college.institution_type
    });
  }

  const { data: insertedColleges, error: collErr } = await supabase
    .from('colleges')
    .insert(collegesToInsert)
    .select();

  if (collErr) {
    console.error('Error inserting colleges:', collErr);
    process.exit(1);
  }

  console.log(`Inserted ${insertedColleges.length} colleges.`);

  console.log('Linking colleges to courses...');
  const collegeCoursesToInsert = [];
  for (const college of insertedColleges) {
    if (college.tnea_code && coursesMap[college.tnea_code]) {
      const collegeCourses = coursesMap[college.tnea_code].courses;
      for (const courseName of collegeCourses) {
        const slug = courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (slugToId[slug]) {
          collegeCoursesToInsert.push({
            college_id: college.id,
            course_id: slugToId[slug]
          });
        }
      }
    }
  }

  if (collegeCoursesToInsert.length > 0) {
    // Insert in batches of 1000
    for (let i = 0; i < collegeCoursesToInsert.length; i += 1000) {
      const batch = collegeCoursesToInsert.slice(i, i + 1000);
      const { error: ccErr } = await supabase.from('college_courses').insert(batch);
      if (ccErr) {
        console.error(`Error inserting college_courses batch ${i}:`, ccErr);
      }
    }
    console.log(`Inserted ${collegeCoursesToInsert.length} college_course links.`);
  }

  console.log('Database successfully seeded and structured!');
}

seed().catch(console.error);
