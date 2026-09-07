const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearData() {
  console.log('Clearing colleges...');
  const { error: collegesError } = await supabase
    .from('colleges')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
    
  if (collegesError) {
    console.error('Error clearing colleges:', collegesError);
  } else {
    console.log('Colleges cleared.');
  }

  console.log('Clearing courses...');
  const { error: coursesError } = await supabase
    .from('courses')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
    
  if (coursesError) {
    console.error('Error clearing courses:', coursesError);
  } else {
    console.log('Courses cleared.');
  }
}

clearData().then(() => console.log('Done')).catch(console.error);
