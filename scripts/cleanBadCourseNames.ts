import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hyxkrxznmfjsoklspasg.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5eGtyeHpubWZqc29rbHNwYXNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODAwMjIwMSwiZXhwIjoyMTAzNTc4MjAxfQ.frO9xDsdIOtEh-jLYAdpkj__cqcJlIylBiq7-telisE";
const supabase = createClient(supabaseUrl, supabaseKey);

// Fallback manual mapping for common engineering branches
const courseMap: Record<string, string> = {
  "CE": "Civil Engineering",
  "CS": "Computer Science and Engineering",
  "EC": "Electronics and Communication Engineering",
  "EE": "Electrical and Electronics Engineering",
  "ME": "Mechanical Engineering",
  "IT": "Information Technology",
  "AD": "Artificial Intelligence and Data Science",
  "AM": "Artificial Intelligence and Machine Learning",
  "CB": "Computer Science and Business Systems",
  "SC": "Computer Science and Engineering (Cyber Security)",
  "BM": "Biomedical Engineering",
  "BT": "Biotechnology",
  "AE": "Aeronautical Engineering",
  "AG": "Agricultural Engineering",
  "CH": "Chemical Engineering",
  "FT": "Food Technology",
  "AU": "Automobile Engineering",
  "EI": "Electronics and Instrumentation Engineering",
  "RO": "Robotics and Automation",
  "MZ": "Mechatronics Engineering",
  "MD": "Medical Electronics",
  "PH": "Pharmaceutical Technology",
  "TT": "Textile Technology",
  "PT": "Polymer Technology",
  "PE": "Petrochemical Engineering",
  "PC": "Petrochemical Technology",
  "PL": "Plastic Technology",
  "EV": "Electronics Engineering (VLSI Design)",
  "AL": "Artificial Intelligence and Machine Learning",
  "CD": "Computer Science and Engineering (Data Science)",
  "CJ": "Computer Science and Engineering (IoT)",
  "CG": "Computer Science and Design",
  "CW": "Computer Science and Engineering (Network)",
  "ES": "Electronics and Computer Engineering",
  "SF": "Safety and Fire Engineering",
  "PR": "Production Engineering",
  "IE": "Industrial Engineering",
  "TX": "Textile Engineering",
  "MC": "Mechatronics",
  "MR": "Marine Engineering",
  "NA": "Naval Architecture",
  "MT": "Metallurgical Engineering",
  "MN": "Mining Engineering",
  "GI": "Geo Informatics",
  "EN": "Environmental Engineering",
  "SE": "Science and Engineering",
  "EM": "Engineering (Mechanical)",
  "RM": "Robotics and Manufacturing",
  "RA": "Robotics and Automation",
  "AR": "Architecture",
};

async function cleanCourses() {
  console.log("Fetching all courses to clean...");
  const { data, error } = await supabase.from("courses").select("id, name, short_code");
  if (error) {
    console.error("Failed to fetch courses:", error);
    return;
  }

  console.log(`Found ${data.length} courses to inspect.`);
  let updatedCount = 0;

  for (const course of data) {
    let newName = course.name;
    let needsUpdate = false;

    // Check if the name has an address in it
    if (course.name.match(/\d{5,6}/) || course.name.match(/Taluk|District|Pin|\. |,| - /i) || course.name.length > 50) {
      
      // Try to get from the map first
      if (courseMap[course.short_code]) {
        newName = courseMap[course.short_code];
      } else {
        // Fallback: extract the last text after a dot or multiple spaces
        const parts = course.name.split(/\.|\s{2,}/);
        const lastPart = parts[parts.length - 1].trim();
        if (lastPart.length > 3) {
          newName = lastPart;
        }
      }
      
      // Capitalize properly
      if (newName === newName.toUpperCase()) {
        newName = newName.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      }
      
      needsUpdate = true;
    }
    
    // Check if it's completely uppercase, if so, title case it
    if (!needsUpdate && course.name === course.name.toUpperCase() && course.name.length > 3) {
      newName = course.name.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      needsUpdate = true;
    }

    // Force map override if it's a known bad one
    if (courseMap[course.short_code] && courseMap[course.short_code] !== newName) {
       newName = courseMap[course.short_code];
       needsUpdate = true;
    }

    if (needsUpdate && newName !== course.name) {
      console.log(`Cleaning [${course.short_code}]: "${course.name}" -> "${newName}"`);
      await supabase.from("courses").update({ name: newName }).eq("id", course.id);
      updatedCount++;
    }
  }

  console.log(`Successfully cleaned ${updatedCount} courses!`);
}

cleanCourses();
