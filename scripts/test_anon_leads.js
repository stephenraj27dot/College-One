const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const anonClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAnonLeads() {
  console.log("Testing anonymous access to 'leads' table...");
  const { data, error } = await anonClient.from('leads').select('*').limit(2);
  console.log('Anon select leads:', { count: data ? data.length : 0, error });
}

testAnonLeads().catch(console.error);
