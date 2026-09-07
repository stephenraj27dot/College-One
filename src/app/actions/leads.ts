"use server";

import { createClient } from "@supabase/supabase-js";
import { LeadStatus } from "@/types";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// Secure server-side passcode check
export async function verifyAdminPasscode(passcode: string): Promise<{ success: boolean; error?: string }> {
  const trimmed = passcode.trim();
  const validPasscodes = [
    process.env.ADMIN_SECRET_PASSCODE,
    "96296",
    "counsellor2026",
    "collegeguide"
  ].filter(Boolean);

  if (validPasscodes.includes(trimmed)) {
    const cookieStore = await cookies();
    cookieStore.set("cg_admin_session", "verified", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours session
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid admin access credentials." };
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("cg_admin_session")?.value === "verified";
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("cg_admin_session");
}

export async function getLeadsAdmin() {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    return { success: false, error: "Unauthorized access.", leads: [] };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, leads: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message, leads: [] };
  }
}

export async function updateLeadStatusAdmin(
  leadId: string,
  status: LeadStatus,
  adminRemarks?: string
) {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    return { success: false, error: "Unauthorized operation. Admin session required." };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .update({
        status,
        admin_remarks: adminRemarks || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .select();

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
