import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hyxkrxznmfjsoklspasg.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_E2HEX7vgP_W2Zqgkm32pgA_AbGjGL5S";

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
