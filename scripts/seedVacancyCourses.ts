import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hyxkrxznmfjsoklspasg.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_publishable_E2HEX7vgP_W2Zqgkm32pgA_AbGjGL5S";

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedVacancyCourses() {
  console.log("🚀 Starting Vacancy Matrix Courses Seeding...");

  // Load the reversed pdf text
  const rawText = fs.readFileSync(path.join(__dirname, "vacancy_matrix_extracted.txt"), "utf8");
  const lines = rawText.split('\r\n').reverse();

  // Load existing colleges from DB
  const { data: colleges, error } = await supabase.from("colleges").select("id, tnea_code, name");
  if (error) {
    console.error("Failed to load colleges:", error);
    return;
  }
  const collegeMap = new Map(colleges.map((c: any) => [c.tnea_code, c.id]));

  let currentCollege = null;
  let foundBranches = 0;
  
  const collegeCourseMap = new Map<string, Array<{code: string, name: string}>>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const collegeMatch = line.match(/^College (\d+)/);
    if (collegeMatch) {
      currentCollege = collegeMatch[1];
    }
    
    const branchRowMatch = line.match(/^(-?\s*[A-Z]{2}|-?[A-Z\s]+)\s+(.*?)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
    if (branchRowMatch) {
       let col = currentCollege;
       if (!col) {
          // If a page break split the table, look forward to find the associated College
          for (let j = i; j < lines.length; j++) {
             const cm = lines[j].match(/^College (\d+)/);
             if (cm) { col = cm[1]; break; }
          }
       }
       
       let branchCode = branchRowMatch[1].replace("-", "").trim();
       let branchName = branchRowMatch[2].trim();
       
       // Handle multi-line branch names
       if (!branchName || branchName.length < 3) {
           let nextLine = (lines[i-1] || '').trim(); 
           let prevLine = (lines[i+1] || '').trim(); 
           branchName = (nextLine + ' ' + prevLine).trim();
       }

       // Clean up weird artifacts
       branchName = branchName.replace(/\s+/g, ' ');
       
       if (col) {
           foundBranches++;
           if (!collegeCourseMap.has(col)) {
               collegeCourseMap.set(col, []);
           }
           collegeCourseMap.get(col)!.push({ code: branchCode, name: branchName });
       }
    }
  }

  console.log(`Parsed ${foundBranches} branch records for ${collegeCourseMap.size} colleges.`);

  // Find all unique courses
  const uniqueCourses = new Map<string, string>(); // course name -> short code
  for (const courses of collegeCourseMap.values()) {
    for (const c of courses) {
      if (!uniqueCourses.has(c.name)) {
          uniqueCourses.set(c.name, c.code);
      }
    }
  }

  console.log(`Found ${uniqueCourses.size} unique courses.`);

  const { data: categories } = await supabase.from("categories").select("id").eq("slug", "engineering").single();
  const categoryId = categories?.id || null;

  // Insert unique courses to DB
  const courseInsertMap = new Map<string, string>(); // course name -> course UUID
  for (const [courseName, shortCode] of uniqueCourses.entries()) {
    const slug = courseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    const { data: existingCourse } = await supabase.from("courses").select("id").eq("slug", slug).single();
    
    if (existingCourse) {
      courseInsertMap.set(courseName, existingCourse.id);
    } else {
      const { data: newCourse, error: insertErr } = await supabase.from("courses").insert({
        name: courseName,
        slug,
        short_code: shortCode,
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

    for (const course of courses) {
      const courseId = courseInsertMap.get(course.name);
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

seedVacancyCourses().catch(console.error);
