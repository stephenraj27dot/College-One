const fs = require('fs');

const colleges = JSON.parse(fs.readFileSync('scripts/tnea_428_colleges.json', 'utf8'));
const coursesMap = JSON.parse(fs.readFileSync('scripts/tnea_428_courses.json', 'utf8'));

console.log(`Colleges count: ${colleges.length}`);
console.log(`Courses map keys count: ${Object.keys(coursesMap).length}`);

const allRawCourses = new Set();
let totalCourseOfferings = 0;

for (const code of Object.keys(coursesMap)) {
  const cList = coursesMap[code].courses;
  totalCourseOfferings += cList.length;
  for (const c of cList) {
    allRawCourses.add(c);
  }
}

console.log(`Total course offerings across all colleges: ${totalCourseOfferings}`);
console.log(`Unique course names: ${allRawCourses.size}`);

// Print sample unique course names
console.log('\nSample courses:');
Array.from(allRawCourses).slice(0, 15).forEach((c, i) => console.log(`  ${i+1}. ${c}`));
