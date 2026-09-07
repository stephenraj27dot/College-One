const fs = require('fs');

const coursesMap = JSON.parse(fs.readFileSync('scripts/tnea_428_courses.json', 'utf8'));

const allRawCourses = new Set();
for (const code of Object.keys(coursesMap)) {
  for (const c of coursesMap[code].courses) {
    allRawCourses.add(c);
  }
}

const slugMap = new Map(); // slug -> list of names
for (const name of allRawCourses) {
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!slugMap.has(baseSlug)) {
    slugMap.set(baseSlug, []);
  }
  slugMap.get(baseSlug).push(name);
}

let collisions = 0;
for (const [slug, names] of slugMap.entries()) {
  if (names.length > 1) {
    collisions++;
    console.log(`COLLISION for slug "${slug}":`, names);
  }
}

if (collisions === 0) {
  console.log("Zero slug collisions across all 122 courses!");
} else {
  console.log(`Total collisions: ${collisions}`);
}
