const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testColumns() {
  const { data, error } = await supabase.from('colleges').select('raw_address_source, institution_type_inferred').limit(1);
  console.log('Select test columns:', error ? error.message : 'Columns exist!');
}

testColumns().catch(console.error);
