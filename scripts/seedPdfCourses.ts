import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedPdfCourses() {
  console.log("🚀 Starting Courses Seeding...");

  // Load the reversed pdf text
  const rawText = fs.readFileSync(path.join(__dirname, "pdf_courses_extracted.txt"), "utf8");
  const lines = rawText.split('\r\n').reverse();

  // Load existing colleges from DB
  const { data: colleges, error } = await supabase.from("colleges").select("id, tnea_code, name");
  if (error) {
    console.error("Failed to load colleges:", error);
    return;
  }
  const collegeMap = new Map(colleges.map((c: any) => [c.tnea_code, c.id]));

  let currentCode: string | null = null;
  let currentCourses: string[] = [];
  let inCoursesBlock = false;

  const collegeCourseMap = new Map<string, string[]>();

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for college header
    const codeMatch = trimmed.match(/\[Code: (\d+)\]/);
    if (codeMatch) {
      if (currentCode && currentCourses.length > 0) {
        collegeCourseMap.set(currentCode, [...currentCourses]);
      }
      currentCode = codeMatch[1];
      currentCourses = [];
      inCoursesBlock = false;
      continue;
    }

    // Check for Courses block start
    if (trimmed.startsWith("Courses:")) {
      inCoursesBlock = true;
      let coursesText = trimmed.replace("Courses:", "").trim();
      if (coursesText.includes("Course data not available") || coursesText.includes("Not furnished")) {
        inCoursesBlock = false;
        continue;
      }
      coursesText.split(",").map(c => c.trim()).filter(c => c).forEach(c => currentCourses.push(c));
      continue;
    }

    // Continue courses block
    if (inCoursesBlock && trimmed.length > 0 && !trimmed.includes("•")) {
      // It's a continuation of courses
      trimmed.split(",").map(c => c.trim()).filter(c => c).forEach(c => currentCourses.push(c));
    } else if (inCoursesBlock && (trimmed.length === 0 || trimmed.includes("•"))) {
      inCoursesBlock = false;
    }
  }

  // push last college
  if (currentCode && currentCourses.length > 0) {
    collegeCourseMap.set(currentCode, [...currentCourses]);
  }

  console.log(`Parsed courses for ${collegeCourseMap.size} colleges.`);

  // Find all unique courses
  const uniqueCourses = new Set<string>();
  for (const courses of collegeCourseMap.values()) {
    for (const c of courses) {
      uniqueCourses.add(c);
    }
  }

  console.log(`Found ${uniqueCourses.size} unique courses.`);

  // Get a category ID for Engineering
  const { data: categories } = await supabase.from("categories").select("id").eq("slug", "engineering").single();
  const categoryId = categories?.id || null;

  // Insert unique courses to DB
  const courseInsertMap = new Map<string, string>(); // course name -> course UUID
  for (const courseName of uniqueCourses) {
    const slug = courseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    const { data: existingCourse } = await supabase.from("courses").select("id").eq("slug", slug).single();
    
    if (existingCourse) {
      courseInsertMap.set(courseName, existingCourse.id);
    } else {
      const { data: newCourse, error: insertErr } = await supabase.from("courses").insert({
        name: courseName,
        slug,
        category_id: categoryId,
        degree_level: "UG",
        duration_years: 4
      }).select("id").single();
      
      if (insertErr) {
        console.error(`Failed to insert course ${courseName}:`, insertErr.message);
      } else if (newCourse) {
        courseInsertMap.set(courseName, newCourse.id);
      }
    }
  }

  console.log("All courses ensured in DB.");

  // Insert college_courses
  let insertCount = 0;
  for (const [code, courses] of collegeCourseMap.entries()) {
    const collegeId = collegeMap.get(code);
    if (!collegeId) {
      console.warn(`College not found in DB for code: ${code}`);
      continue;
    }

    for (const courseName of courses) {
      const courseId = courseInsertMap.get(courseName);
      if (courseId) {
        const { error: relErr } = await supabase.from("college_courses").upsert({
          college_id: collegeId,
          course_id: courseId
        }, { onConflict: "college_id, course_id" });

        if (!relErr) {
          insertCount++;
        }
      }
    }
  }

  console.log(`🎉 Complete! Inserted ${insertCount} college-course relationships.`);
}

seedPdfCourses().catch(console.error);
