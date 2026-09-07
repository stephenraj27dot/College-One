const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const anonClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAnonMutation() {
  console.log("Testing anonymous update/delete permissions...");
  // Test if update is allowed
  const { data, error } = await anonClient.from('leads').update({ status: 'CONTACTED' }).eq('id', '00000000-0000-0000-0000-000000000000').select();
  console.log('Anon update test error:', error ? error.message : 'Update allowed without error!');
}

testAnonMutation().catch(console.error);
