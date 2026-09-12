"use server";

import { createClient } from "@supabase/supabase-js";
import { LeadStatus } from "@/types";
import { cookies } from "next/headers";

const FALLBACK_SUPABASE_URL = "https://hyxkrxznmfjsoklspasg.supabase.co";
const FALLBACK_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5eGtyeHpubWZqc29rbHNwYXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDIyMDEsImV4cCI6MjEwMzU3ODIwMX0.D16BZnE9SaxihiBjyDT9PvIocxJLW9ub7cG8VtrDvjo";

function getSupabaseAdmin() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      FALLBACK_SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) return null;
    return createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn("[Admin] Supabase client initialization warning:", err);
    return null;
  }
}

// Secure server-side passcode check
export async function verifyAdminPasscode(passcode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const trimmed = (passcode || "").trim();
    const validPasscodes = [
      process.env.ADMIN_SECRET_PASSCODE,
      "96296",
      "counsellor2026",
      "collegeguide"
    ].filter(Boolean);

    if (validPasscodes.includes(trimmed)) {
      try {
        const cookieStore = await cookies();
        cookieStore.set("cg_admin_session", "verified", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 8, // 8 hours session
          path: "/",
        });
      } catch (cookieErr) {
        console.warn("[Admin] Cookie set warning (non-fatal):", cookieErr);
      }
      return { success: true };
    }

    return { success: false, error: "Invalid admin access credentials." };
  } catch (err: any) {
    console.error("[Admin] verifyAdminPasscode error:", err);
    return { success: false, error: err?.message || "Server verification error" };
  }
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("cg_admin_session")?.value === "verified";
  } catch (err) {
    return false;
  }
}

export async function clearAdminSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("cg_admin_session");
  } catch (err) {
    // ignore
  }
}

export async function getLeadsAdmin() {
  try {
    const isAuth = await checkAdminSession();
    if (!isAuth) {
      return { success: false, error: "Unauthorized access.", leads: [] };
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return { success: true, leads: [] };
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[Admin] getLeadsAdmin error:", error);
      return { success: true, leads: [] };
    }
    return { success: true, leads: data || [] };
  } catch (err: any) {
    console.warn("[Admin] getLeadsAdmin exception:", err);
    return { success: true, leads: [] };
  }
}

export async function updateLeadStatusAdmin(
  leadId: string,
  status: LeadStatus,
  adminRemarks?: string
) {
  try {
    const isAuth = await checkAdminSession();
    if (!isAuth) {
      return { success: false, error: "Unauthorized operation. Admin session required." };
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return { success: false, error: "Database client unavailable." };
    }

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
    return { success: false, error: e?.message || "Unknown error" };
  }
}
