import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hyxkrxznmfjsoklspasg.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5eGtyeHpubWZqc29rbHNwYXNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODAwMjIwMSwiZXhwIjoyMTAzNTc4MjAxfQ.frO9xDsdIOtEh-jLYAdpkj__cqcJlIylBiq7-telisE";

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedNewVacancyPdf() {
  console.log("🚀 Starting New Vacancy Matrix Courses Seeding...");

  // Load the new pdf text
  const rawText = fs.readFileSync(path.join(__dirname, "new_vacancy_matrix_extracted.txt"), "utf8");
  
  // Find all course rows using the multi-line capable regex
  const matches = [...rawText.matchAll(/(?:\n|^)\s*(\d{1,4})[\s\S]{1,100}?([A-Z]{2})(?:[\s\S]{1,100}?)?\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/g)];
  
  console.log(`Found ${matches.length} branch rows in the new PDF text.`);

  const lines = rawText.split('\r\n');
  const collegeMapExtracted = new Map<string, string>(); // code -> name
  const collegeCourseMap = new Map<string, Array<{code: string, name: string}>>();
  
  // Read existing courses to map their names easily
  const { data: dbAllCourses } = await supabase.from("courses").select("short_code, name");
  const knownCourseNames = new Map(dbAllCourses?.map(c => [c.short_code, c.name]) || []);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Find lines that start with college code and branch code
    if (line.match(/^\d{1,4}\s+[A-Z]{2}/)) {
        const rowMatch = line.match(/^(\d{1,4})\s+([A-Z]{2})(?:\s+(.*?))?\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
        if (rowMatch) {
            const code = rowMatch[1];
            let branchCode = rowMatch[2];
            let branchName = rowMatch[3] || "";
            
            // Extract the college name from previous lines
            let cname = lines[i-1] || "";
            if (lines[i-2] && !lines[i-2].includes('Page ') && !lines[i-2].includes('BRANCH')) {
                cname = lines[i-2] + ' ' + cname;
            }
            
            cname = cname.replace("COLLEGE NAME", "").replace("CODE", "").replace("BRANCH", "").trim();
            if (cname.length > 5) {
                collegeMapExtracted.set(code, cname);
            }
            
            // Clean branch name
            if (!branchName || branchName.length < 3) {
                // If branch name is empty on this line, check the previous line (since sometimes it splits)
                let prevLine = lines[i-1] || "";
                if (prevLine.length > 3 && !prevLine.match(/^\d/) && !prevLine.includes('CODE')) {
                    branchName = prevLine.trim();
                } else if (knownCourseNames.has(branchCode)) {
                    branchName = knownCourseNames.get(branchCode)!;
                } else {
                    branchName = "Unknown Engineering";
                }
            }
            branchName = branchName.trim();
            
            if (!collegeCourseMap.has(code)) {
                collegeCourseMap.set(code, []);
            }
            collegeCourseMap.get(code)!.push({ code: branchCode, name: branchName });
        }
    }
  }

  console.log(`Parsed ${collegeMapExtracted.size} unique colleges.`);

  // Load existing colleges from DB
  const { data: dbColleges, error } = await supabase.from("colleges").select("id, tnea_code");
  if (error) {
    console.error("Failed to load colleges:", error);
    return;
  }
  const dbCollegeCodeMap = new Map(dbColleges.map((c: any) => [c.tnea_code, c.id]));
  
  const { data: categories } = await supabase.from("categories").select("id").eq("slug", "engineering").single();
  const categoryId = categories?.id || null;

  // Insert missing colleges
  let newCollegesCount = 0;
  for (const [code, name] of collegeMapExtracted.entries()) {
      if (!dbCollegeCodeMap.has(code)) {
          let district = "Unknown";
          const parts = name.split(",");
          if (parts.length > 1) {
              district = parts[parts.length - 1].trim().replace(/\d/g, '').replace(".", "").replace("-", "").trim();
          }
          
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + code;

          const { data: newCollege, error: insErr } = await supabase.from("colleges").upsert({ 
              tnea_code: code, 
              name, 
              slug,
              city: district,
              district: district,
              institution_type: "Unknown",
              established_year: 2000
          }, { onConflict: "slug" }).select("id").single();
          
          if (insErr) {
              console.error("Error inserting missing college:", code, insErr.message);
          } else if (newCollege) {
              console.log(`Added missing college: ${code} - ${name}`);
              dbCollegeCodeMap.set(code, newCollege.id);
              newCollegesCount++;
          }
      }
  }
  console.log(`Added ${newCollegesCount} new colleges to DB.`);

  // Find all unique courses
  const uniqueCourses = new Map<string, string>(); // course name -> short code
  for (const courses of collegeCourseMap.values()) {
    for (const c of courses) {
      if (!uniqueCourses.has(c.name)) {
          uniqueCourses.set(c.name, c.code);
      }
    }
  }

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

  // Insert college_courses
  let insertCount = 0;
  for (const [code, courses] of collegeCourseMap.entries()) {
    const collegeId = dbCollegeCodeMap.get(code);
    if (!collegeId) {
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
        } else {
           console.error("Rel insert err:", relErr.message);
        }
      }
    }
  }

  console.log(`🎉 Complete! Inserted/verified ${insertCount} college-course relationships for the NEW PDF!`);
}

seedNewVacancyPdf().catch(console.error);
