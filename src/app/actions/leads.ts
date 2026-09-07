"use server";

import { createClient } from "@supabase/supabase-js";
import { LeadStatus } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize Supabase with the service role key to bypass RLS for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function updateLeadStatusAdmin(
  leadId: string,
  status: LeadStatus,
  adminRemarks?: string
) {
  try {
    console.log(`[Admin] Updating lead ${leadId} to status ${status}`);
    
    const { data, error } = await supabaseAdmin.from("leads").update({
      status,
      admin_remarks: adminRemarks || null,
      updated_at: new Date().toISOString(),
    }).eq("id", leadId).select();

    if (error) {
      console.error("[Admin] Failed to update lead:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (e: any) {
    console.error("[Admin] Exception updating lead:", e);
    return { success: false, error: e.message || "Unknown error" };
  }
}
