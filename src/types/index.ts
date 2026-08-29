import {
  College,
  CollegeCourse,
  PlacementStatistic,
  CutoffRecord,
  Review,
  Category,
  University,
  EntranceExam,
  CommunityCategory,
  VerificationStatus,
  CounsellingLead,
  LeadStatus,
  LeadPriority,
} from "./database";

export * from "./database";

export interface DetailedCollegeCourse extends CollegeCourse {
  course_name: string;
  course_slug: string;
  degree_level: string;
  duration_years: number;
}

export interface DetailedCollege extends College {
  category_slug?: string;
  category_name?: string;
  university_name?: string;
  courses: DetailedCollegeCourse[];
  placement_stats?: PlacementStatistic | null;
  cutoff_records?: CutoffRecord[];
  reviews?: Review[];
  facilities: string[];
  average_rating?: number;
  total_reviews?: number;
}

export interface CollegeFilterParams {
  searchQuery?: string;
  district?: string;
  city?: string;
  streamSlug?: string;
  degreeLevel?: string;
  institutionType?: string;
  hostelAvailable?: boolean;
  minNirfRank?: number;
  maxNirfRank?: number;
  accreditation?: string;
  minFees?: number;
  maxFees?: number;
  sortBy?: "relevance" | "nirf" | "name" | "established_year" | "rating";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PredictorInput {
  cutoffMarks: number; // e.g. 192.5
  community: CommunityCategory; // OC, BC, BCM, MBC, SC, SCA, ST
  preferredDistrict?: string;
  preferredStream?: string;
  preferredBranch?: string;
  maxAnnualFee?: number;
}

export interface PredictorPrediction {
  collegeId: string;
  collegeName: string;
  collegeSlug: string;
  tneaCode: string | null;
  district: string;
  city: string;
  courseName: string;
  courseSlug: string;
  degreeLevel: string;
  requiredCutoff: number;
  studentCutoff: number;
  difference: number;
  probability: "HIGH" | "MODERATE" | "COMPETITIVE";
  community: CommunityCategory;
  nirfRank: number | null;
  placementRate: number | null;
  averagePackage: number | null;
  isAutonomous: boolean;
  historicalAcademicYear: number;
}

export interface PredictorResult {
  studentCutoff: number;
  community: CommunityCategory;
  totalMatches: number;
  highProbability: PredictorPrediction[];
  moderateProbability: PredictorPrediction[];
  competitiveProbability: PredictorPrediction[];
  disclaimer: string;
}

export interface CompareCollegeItem {
  college: DetailedCollege;
}
