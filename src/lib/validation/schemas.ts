import { z } from "zod";

export const counsellingLeadSchema = z.object({
  student_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  preferred_district: z.string().optional(),
  preferred_stream: z.string().optional(),
  preferred_course: z.string().optional(),
  target_college_id: z.string().optional(),
  target_college_name: z.string().optional(),
  cutoff_score: z
    .number()
    .min(50, "Cutoff mark must be between 50 and 200")
    .max(200, "Cutoff mark cannot exceed 200")
    .optional()
    .nullable(),
  community: z
    .enum(["OC", "BC", "BCM", "MBC", "MBC_DNC", "SC", "SCA", "ST"])
    .optional()
    .nullable(),
  budget_range: z.string().optional(),
  student_notes: z.string().max(500, "Message cannot exceed 500 characters").optional(),
});

export const predictorInputSchema = z.object({
  cutoffMarks: z
    .number()
    .min(60, "Cutoff mark must be at least 60")
    .max(200, "Cutoff mark cannot exceed 200"),
  community: z.enum(["OC", "BC", "BCM", "MBC", "MBC_DNC", "SC", "SCA", "ST"]),
  preferredDistrict: z.string().optional(),
  preferredStream: z.string().optional(),
  preferredBranch: z.string().optional(),
  maxAnnualFee: z.number().positive().optional(),
});

export const reviewSubmissionSchema = z.object({
  college_id: z.string().min(1, "College ID is required"),
  author_name: z.string().min(2, "Name must be at least 2 characters"),
  relationship: z.enum(["Current Student", "Alumni", "Faculty", "Parent"]),
  course_name: z.string().min(2, "Course name is required"),
  academic_year: z.string().optional(),
  overall_rating: z.number().min(1).max(5),
  academics_rating: z.number().min(1).max(5).optional(),
  infrastructure_rating: z.number().min(1).max(5).optional(),
  placement_rating: z.number().min(1).max(5).optional(),
  campus_life_rating: z.number().min(1).max(5).optional(),
  title: z.string().min(5, "Review title must be at least 5 characters"),
  review_text: z.string().min(20, "Review must be at least 20 characters"),
  pros: z.string().optional(),
  cons: z.string().optional(),
});
