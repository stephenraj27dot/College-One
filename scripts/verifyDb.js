const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  // Load PDF colleges
  const pdfColleges = require('./pdf_colleges.json');
  const pdfCodes = new Set(pdfColleges.map(c => c.tnea_code));
  
  console.log(`PDF-la total colleges: ${pdfColleges.length}`);
  console.log(`PDF-la unique TNEA codes: ${pdfCodes.size}`);
  
  // Fetch ALL colleges from database
  let allDbColleges = [];
  let from = 0;
  const batchSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('colleges')
      .select('tnea_code, name')
      .range(from, from + batchSize - 1);
    if (error) { console.error(error); break; }
    allDbColleges = allDbColleges.concat(data);
    if (data.length < batchSize) break;
    from += batchSize;
  }
  
  const dbCodes = new Set(allDbColleges.map(c => c.tnea_code).filter(Boolean));
  console.log(`\nDatabase-la total colleges: ${allDbColleges.length}`);
  console.log(`Database-la unique TNEA codes: ${dbCodes.size}`);
  
  // Find missing colleges (in PDF but NOT in DB)
  const missing = [];
  for (const college of pdfColleges) {
    if (!dbCodes.has(college.tnea_code)) {
      missing.push(college);
    }
  }
  
  if (missing.length === 0) {
    console.log('\n✅ ALL PDF colleges are in the database! Onnum miss aagala!');
  } else {
    console.log(`\n❌ ${missing.length} colleges MISSING from database:`);
    for (const m of missing) {
      console.log(`  - [${m.tnea_code}] ${m.name} (${m.district})`);
    }
  }
}

verify().catch(console.error);
