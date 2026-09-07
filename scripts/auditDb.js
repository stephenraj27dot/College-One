const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function audit() {
  const pdfColleges = require('./pdf_colleges.json');
  
  // Build PDF map: code -> college
  const pdfMap = {};
  for (const c of pdfColleges) {
    pdfMap[c.tnea_code] = c;
  }

  // Fetch ALL colleges from DB
  let allDbColleges = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('colleges')
      .select('id, tnea_code, name, district, city, institution_type')
      .range(from, from + 999);
    if (error) { console.error(error); break; }
    allDbColleges = allDbColleges.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }

  // Build DB map: code -> list of colleges (there might be duplicates)
  const dbMap = {};
  for (const c of allDbColleges) {
    if (!c.tnea_code) continue;
    if (!dbMap[c.tnea_code]) dbMap[c.tnea_code] = [];
    dbMap[c.tnea_code].push(c);
  }

  // Find mismatches: same code but different name
  const mismatches = [];
  const duplicates = [];
  const notInPdf = [];
  
  for (const [code, dbEntries] of Object.entries(dbMap)) {
    if (dbEntries.length > 1) {
      duplicates.push({ code, entries: dbEntries });
    }
    
    const pdfEntry = pdfMap[code];
    if (pdfEntry) {
      // Check if DB has the correct college for this code
      const hasCorrect = dbEntries.some(db => 
        db.name.toLowerCase().trim() === pdfEntry.name.toLowerCase().trim()
      );
      if (!hasCorrect) {
        mismatches.push({
          code,
          pdf_name: pdfEntry.name,
          pdf_district: pdfEntry.district,
          db_names: dbEntries.map(e => `${e.name} (${e.district})`),
        });
      }
    } else {
      // Code exists in DB but not in PDF
      for (const entry of dbEntries) {
        notInPdf.push({ code, name: entry.name, district: entry.district, id: entry.id });
      }
    }
  }

  console.log('=== DUPLICATE CODES (multiple colleges with same TNEA code) ===');
  console.log(`Found ${duplicates.length} duplicate codes:`);
  for (const d of duplicates) {
    console.log(`\n  Code: ${d.code}`);
    for (const e of d.entries) {
      console.log(`    - [${e.id}] ${e.name} (${e.district})`);
    }
  }

  console.log('\n\n=== NAME MISMATCHES (PDF name != DB name for same code) ===');
  console.log(`Found ${mismatches.length} mismatches:`);
  for (const m of mismatches) {
    console.log(`\n  Code: ${m.code}`);
    console.log(`    PDF:  ${m.pdf_name} (${m.pdf_district})`);
    console.log(`    DB:   ${m.db_names.join(', ')}`);
  }

  console.log('\n\n=== CODES IN DB BUT NOT IN PDF (old/extra data) ===');
  console.log(`Found ${notInPdf.length} extra entries:`);
  for (const e of notInPdf) {
    console.log(`  [${e.code}] ${e.name} (${e.district})`);
  }

  console.log('\n\n=== SUMMARY ===');
  console.log(`PDF total: ${pdfColleges.length}`);
  console.log(`DB total: ${allDbColleges.length}`);
  console.log(`Duplicates: ${duplicates.length} codes`);
  console.log(`Mismatches: ${mismatches.length}`);
  console.log(`Extra (not in PDF): ${notInPdf.length}`);
}

audit().catch(console.error);
