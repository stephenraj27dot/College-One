const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCount() {
  const { count } = await supabase.from('college_courses').select('*', { count: 'exact', head: true });
  console.log('Exact count in college_courses:', count);
}

checkCount().catch(console.error);
