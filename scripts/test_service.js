const { getColleges, getCollegeBySlug } = require('../src/services/colleges');

// Test in node
async function testService() {
  const { colleges, total } = await getColleges();
  console.log(`getColleges() returned ${colleges.length} colleges (total: ${total})`);
  
  // Check courses on first 5 colleges
  for (let i = 0; i < 5; i++) {
    const c = colleges[i];
    console.log(`  [${c.tnea_code}] ${c.name}: ${c.courses?.length || 0} courses`);
  }

  // Spot check specific colleges via getCollegeBySlug
  const testCodes = ['1', '1211', '2711', '2006', '5990'];
  for (const code of testCodes) {
    const col = await getCollegeBySlug(code);
    console.log(`getCollegeBySlug(${code}) -> [${col?.tnea_code}] ${col?.name}: ${col?.courses?.length} courses`);
  }
}

testService().catch(console.error);
