import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hyxkrxznmfjsoklspasg.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_publishable_E2HEX7vgP_W2Zqgkm32pgA_AbGjGL5S";

const supabase = createClient(supabaseUrl, supabaseKey);

async function addMissingColleges() {
  console.log("Adding missing colleges...");

  const missingCodes = ['5545','5546','4986','4925','3477','2777','2768','2368','2378','2361','1428','1400','1339','1235','1232','1203','5','1','2','3'];
  const rawText = fs.readFileSync(path.join(__dirname, "vacancy_matrix_extracted.txt"), "utf8");
  const lines = rawText.split('\r\n').reverse();

  const missingColleges = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const collegeMatch = line.match(/^College (\d+)/);
    if (collegeMatch && missingCodes.includes(collegeMatch[1])) {
      let name = lines[i+1].trim();
      if (lines[i+2] && !lines[i+2].includes('----Page') && !lines[i+2].includes('Vacancy Matrix')) {
          name = name + ' ' + lines[i+2].trim();
      }
      // Extract district if possible, or just default to unknown
      let district = "Unknown";
      const parts = name.split(",");
      if (parts.length > 1) {
          district = parts[parts.length - 1].trim().replace(/\d/g, '').replace(".", "").trim();
      }
      
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      missingColleges.push({ 
          tnea_code: collegeMatch[1], 
          name, 
          slug,
          city: district,
          district: district,
          institution_type: "Unknown",
          established_year: 2000
      });
    }
  }

  console.log(`Extracted ${missingColleges.length} missing colleges. Inserting...`);
  
  for (const c of missingColleges) {
      const { error } = await supabase.from("colleges").upsert(c, { onConflict: "tnea_code" });
      if (error) {
          console.error("Error inserting", c.tnea_code, error.message);
      } else {
          console.log(`Inserted college ${c.tnea_code}: ${c.name}`);
      }
  }
  
  console.log("Done! You can now re-run the course seeder to populate courses for these newly added colleges.");
}

addMissingColleges().catch(console.error);
