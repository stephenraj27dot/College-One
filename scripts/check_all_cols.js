const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAllCols() {
  const { data, error } = await supabase.from('colleges').select('*').limit(1);
  if (data && data[0]) {
    console.log('All college columns:');
    console.log(Object.keys(data[0]));
  } else {
    console.log('Error or empty:', error);
  }
}

checkAllCols().catch(console.error);
