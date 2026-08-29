import { CounsellingLead, LeadStatus, LeadPriority } from "@/types";
import { counsellingLeadSchema } from "@/lib/validation/schemas";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

// Clean in-memory buffer for real student leads only (no dummy data)
let leadsStore: CounsellingLead[] = [];

export async function submitCounsellingLead(
  data: z.infer<typeof counsellingLeadSchema>
): Promise<{ success: boolean; leadReference: string; message: string }> {
  const validated = counsellingLeadSchema.parse(data);

  const newRef = `CG-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  const newLead: CounsellingLead = {
    id: `lead-${Date.now()}`,
    lead_reference: newRef,
    student_name: validated.student_name,
    phone_number: validated.phone_number,
    email: validated.email || null,
    preferred_district: validated.preferred_district || null,
    preferred_course: validated.preferred_course || null,
    preferred_stream: validated.preferred_stream || null,
    target_college_id: validated.target_college_id || null,
    target_college_name: validated.target_college_name || null,
    cutoff_score: validated.cutoff_score || null,
    community: validated.community || null,
    budget_range: validated.budget_range || null,
    counselling_mode: "WhatsApp",
    status: "NEW",
    priority: validated.cutoff_score && validated.cutoff_score >= 190 ? "HIGH" : "MEDIUM",
    assigned_to: null,
    student_notes: validated.student_notes || null,
    admin_remarks: null,
    source: "Website Form / Direct Guidance",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  leadsStore.unshift(newLead);

  try {
    const supabase = createClient() as any;
    await supabase.from("leads").insert({
      lead_reference: newRef,
      student_name: validated.student_name,
      phone_number: validated.phone_number,
      email: validated.email || null,
      preferred_district: validated.preferred_district || null,
      preferred_course: validated.preferred_course || null,
      preferred_stream: validated.preferred_stream || null,
      cutoff_score: validated.cutoff_score || null,
      community: validated.community || null,
      status: "NEW",
      source: "College Guide Admission Portal",
    });
  } catch (e) {
    console.log("Supabase lead sync notice:", e);
  }

  return {
    success: true,
    leadReference: newRef,
    message: "Your guidance request has been submitted. Our admission expert will contact you shortly.",
  };
}

export async function getAllLeads(): Promise<CounsellingLead[]> {
  try {
    const supabase = createClient() as any;
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        lead_reference: d.lead_reference,
        student_name: d.student_name,
        phone_number: d.phone_number,
        email: d.email,
        preferred_district: d.preferred_district,
        preferred_course: d.preferred_course,
        preferred_stream: d.preferred_stream,
        target_college_id: d.target_college_id,
        target_college_name: d.target_college_name,
        cutoff_score: d.cutoff_score ? Number(d.cutoff_score) : null,
        community: d.community,
        budget_range: d.budget_range,
        counselling_mode: "WhatsApp",
        status: d.status || "NEW",
        priority: (d.priority as any) || "MEDIUM",
        assigned_to: d.assigned_to,
        student_notes: d.student_notes,
        admin_remarks: d.admin_remarks,
        source: d.source || "Website Form",
        created_at: d.created_at,
        updated_at: d.updated_at || d.created_at,
      }));
    }
  } catch (e) {
    console.log("Supabase lead fetch notice:", e);
  }
  return leadsStore;
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  adminRemarks?: string
): Promise<boolean> {
  const lead = leadsStore.find((l) => l.id === leadId);
  if (lead) {
    lead.status = status;
    if (adminRemarks !== undefined) lead.admin_remarks = adminRemarks;
    lead.updated_at = new Date().toISOString();
  }

  try {
    const supabase = createClient() as any;
    await supabase.from("leads").update({
      status,
      admin_remarks: adminRemarks || null,
      updated_at: new Date().toISOString(),
    }).eq("id", leadId);
  } catch (e) {
    console.log("Supabase lead update notice:", e);
  }

  return true;
}
