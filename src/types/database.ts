export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole =
  | "student"
  | "counsellor"
  | "content_manager"
  | "moderator"
  | "analyst"
  | "admin"
  | "super_admin";

export type VerificationStatus =
  | "VERIFIED"
  | "UNVERIFIED"
  | "OUTDATED"
  | "OFFICIAL_SOURCE_UNAVAILABLE"
  | "USER_REPORTED"
  | "UNDER_REVIEW";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "COUNSELLING"
  | "COLLEGE_SHORTLISTED"
  | "APPLICATION_INITIATED"
  | "ADMISSION_IN_PROGRESS"
  | "ADMITTED"
  | "NOT_INTERESTED"
  | "CLOSED";

export type LeadPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type CommunityCategory =
  | "OC"
  | "BC"
  | "BCM"
  | "MBC"
  | "MBC_DNC"
  | "SC"
  | "SCA"
  | "ST";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
  role: UserRole;
  avatar_url?: string | null;
  community?: CommunityCategory | null;
  district?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  state: string; // Strictly "Tamil Nadu"
  district: string;
  city: string;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface University {
  id: string;
  name: string;
  official_name: string;
  slug: string;
  university_type: "State University" | "Central University" | "Deemed University" | "Private University";
  district: string;
  city: string;
  established_year: number;
  accreditation: string | null;
  website_url: string | null;
  logo_url: string | null;
  description: string | null;
  is_verified: boolean;
  verification_status: VerificationStatus;
  source_name: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  category_id: string;
  category_slug?: string;
  name: string;
  slug: string;
  short_code: string | null;
  degree_level: "UG" | "PG" | "Diploma" | "Doctorate" | "Integrated";
  duration_years: number;
  description: string | null;
  eligibility_criteria: string | null;
  career_prospects: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface College {
  id: string;
  name: string;
  official_name: string;
  slug: string;
  short_name: string | null;
  tnea_code: string | null;
  counselling_code: string | null;
  university_id: string | null;
  location_id: string | null;
  district: string;
  city: string;
  address: string | null;
  pincode: string | null;
  established_year: number | null;
  institution_type: "Government" | "Government-Aided" | "Autonomous" | "Constituent" | "Deemed University" | "Self-Financing / Private";
  affiliation: string | null;
  accreditation: string | null; // e.g. NAAC A++, NBA
  nirf_ranking: number | null;
  nirf_year: number | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  website_url: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  hostel_available: boolean;
  transport_available: boolean;
  sports_facilities: boolean;
  wifi_campus: boolean;
  is_featured: boolean;
  is_verified: boolean;
  verification_status: VerificationStatus;
  source_name: string | null;
  source_url: string | null;
  academic_year: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CollegeCourse {
  id: string;
  college_id: string;
  course_id: string;
  specialization: string | null;
  intake_capacity: number | null;
  tuition_fee_per_year: number | null;
  fee_currency: string;
  fee_verification_status: VerificationStatus;
  fee_source_url: string | null;
  eligibility: string | null;
  study_mode: "Full-Time" | "Part-Time" | "Distance";
  created_at: string;
}

export interface CutoffRecord {
  id: string;
  college_id: string;
  course_id: string;
  academic_year: number; // e.g. 2024, 2023
  counselling_round: number;
  community: CommunityCategory;
  cutoff_mark: number; // out of 200 for TNEA
  opening_rank: number | null;
  closing_rank: number | null;
  source_authority: string; // e.g. "DOTE Tamil Nadu / TNEA"
  is_verified: boolean;
  created_at: string;
}

export interface PlacementStatistic {
  id: string;
  college_id: string;
  academic_year: number;
  highest_package_lpa: number | null;
  average_package_lpa: number | null;
  median_package_lpa: number | null;
  placement_percentage: number | null;
  total_offers: number | null;
  top_recruiters: string[];
  source_name: string | null;
  source_url: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface EntranceExam {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  conducting_authority: string;
  description: string | null;
  application_link: string | null;
  counselling_portal: string | null;
  exam_level: "State" | "National";
  streams: string[];
  important_dates: {
    title: string;
    date: string;
    is_tentative: boolean;
  }[];
  is_active: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  college_id: string;
  user_id: string;
  author_name: string;
  relationship: "Current Student" | "Alumni" | "Faculty" | "Parent";
  course_name: string | null;
  academic_year: string | null;
  overall_rating: number; // 1-5
  academics_rating: number | null;
  infrastructure_rating: number | null;
  placement_rating: number | null;
  campus_life_rating: number | null;
  title: string;
  review_text: string;
  pros: string | null;
  cons: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  moderation_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CounsellingLead {
  id: string;
  lead_reference: string;
  student_name: string;
  phone_number: string;
  email: string | null;
  preferred_district: string | null;
  preferred_course: string | null;
  preferred_stream: string | null;
  target_college_id: string | null;
  target_college_name?: string | null;
  cutoff_score: number | null;
  community: CommunityCategory | null;
  budget_range: string | null;
  counselling_mode: "WhatsApp" | "Call" | "Direct Visit";
  status: LeadStatus;
  priority: LeadPriority;
  assigned_to: string | null;
  student_notes: string | null;
  admin_remarks: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface ShortlistRecord {
  id: string;
  user_id: string;
  college_id: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile };
      locations: { Row: Location };
      universities: { Row: University };
      categories: { Row: Category };
      courses: { Row: Course };
      colleges: { Row: College };
      college_courses: { Row: CollegeCourse };
      cutoff_records: { Row: CutoffRecord };
      placement_statistics: { Row: PlacementStatistic };
      entrance_exams: { Row: EntranceExam };
      reviews: { Row: Review };
      leads: { Row: CounsellingLead };
      shortlists: { Row: ShortlistRecord };
    };
  };
}
