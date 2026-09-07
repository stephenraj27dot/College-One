const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixRLS() {
  // Drop old policy that references is_verified
  const { error: dropErr } = await supabase.rpc('exec_sql', {
    sql_query: 'DROP POLICY IF EXISTS "Allow public read verified colleges" ON public.colleges;'
  });
  
  if (dropErr) {
    console.log('exec_sql not available, using REST API approach instead...');
    
    // Alternative: Use the management API via fetch
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const sqlStatements = [
      'DROP POLICY IF EXISTS "Allow public read verified colleges" ON public.colleges;',
      'CREATE POLICY "Allow public read colleges" ON public.colleges FOR SELECT USING (true);'
    ];
    
    for (const sql of sqlStatements) {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`
        },
        body: JSON.stringify({ sql_query: sql })
      });
      
      if (!res.ok) {
        const text = await res.text();
        console.log(`SQL failed: ${sql}\nResponse: ${text}`);
      } else {
        console.log(`SQL OK: ${sql}`);
      }
    }
  } else {
    console.log('Dropped old policy.');
    
    const { error: createErr } = await supabase.rpc('exec_sql', {
      sql_query: 'CREATE POLICY "Allow public read colleges" ON public.colleges FOR SELECT USING (true);'
    });
    
    if (createErr) console.error('Create policy error:', createErr);
    else console.log('Created new policy.');
  }
  
  // Test with anon key
  const anonSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const { data, error } = await anonSupabase.from('colleges').select('name, tnea_code').eq('tnea_code', '1203');
  console.log('\nAnon key test for code 1203:');
  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));
}

fixRLS().catch(console.error);
