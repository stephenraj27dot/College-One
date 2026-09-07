const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectSchema() {
  console.log('Checking Supabase connection and tables...');
  
  // Test colleges
  const { data: colleges, error: colErr } = await supabase
    .from('colleges')
    .select('*')
    .limit(2);
  console.log('Colleges table sample:', colleges ? colleges[0] : null, 'Error:', colErr);

  // Test courses
  const { data: courses, error: crErr } = await supabase
    .from('courses')
    .select('*')
    .limit(2);
  console.log('Courses table sample:', courses ? courses[0] : null, 'Error:', crErr);

  // Test college_courses
  const { data: collegeCourses, error: ccErr } = await supabase
    .from('college_courses')
    .select('*')
    .limit(2);
  console.log('College_courses table sample:', collegeCourses ? collegeCourses[0] : null, 'Error:', ccErr);
}

inspectSchema().catch(console.error);
