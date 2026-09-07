const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findGaps() {
  // Fetch all TNEA codes from DB
  let allColleges = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('colleges')
      .select('tnea_code, name')
      .range(from, from + 999);
    if (error) { console.error(error); break; }
    allColleges = allColleges.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }

  const codes = allColleges
    .map(c => c.tnea_code)
    .filter(c => c && /^\d{4}$/.test(c))
    .map(Number)
    .sort((a, b) => a - b);

  const codeSet = new Set(codes);

  // Known ranges from the PDF (4 digit codes)
  // Find gaps where consecutive codes differ by more than expected
  console.log(`Total numeric 4-digit codes in DB: ${codes.length}`);
  console.log(`Range: ${codes[0]} to ${codes[codes.length - 1]}`);

  // Check specific codes the user mentioned
  const checkCodes = [1203, 1204, 1206];
  for (const code of checkCodes) {
    const padded = String(code).padStart(4, '0');
    const found = allColleges.find(c => c.tnea_code === padded || c.tnea_code === String(code));
    console.log(`Code ${code}: ${found ? found.name : 'MISSING'}`);
  }

  // Find all codes between 1200-1250 to check for gaps
  console.log('\nCodes 1200-1250:');
  for (let i = 1200; i <= 1250; i++) {
    const padded = String(i).padStart(4, '0');
    const found = allColleges.find(c => c.tnea_code === padded || c.tnea_code === String(i));
    if (found) {
      console.log(`  ${i}: ${found.name}`);
    }
  }

  // Count total
  const { count } = await supabase.from('colleges').select('*', { count: 'exact', head: true });
  console.log(`\nTotal colleges in DB: ${count}`);
}

findGaps().catch(console.error);
