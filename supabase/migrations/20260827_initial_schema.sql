-- ==============================================================================
-- TN College Guide - Production Database Schema (PostgreSQL / Supabase)
-- Strict Scope: Tamil Nadu Only, Row-Level-Security Enabled, Normalized Structure
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone_number TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'counsellor', 'content_manager', 'moderator', 'analyst', 'admin', 'super_admin')),
    avatar_url TEXT,
    community TEXT CHECK (community IN ('OC', 'BC', 'BCM', 'MBC', 'MBC_DNC', 'SC', 'SCA', 'ST')),
    district TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Locations Table (Tamil Nadu Only)
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state TEXT NOT NULL DEFAULT 'Tamil Nadu' CHECK (state = 'Tamil Nadu'),
    district TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode VARCHAR(10),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Universities Table
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    official_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    university_type TEXT NOT NULL CHECK (university_type IN ('State University', 'Central University', 'Deemed University', 'Private University')),
    district TEXT NOT NULL,
    city TEXT NOT NULL,
    established_year INTEGER,
    accreditation TEXT,
    website_url TEXT,
    logo_url TEXT,
    description TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    verification_status TEXT NOT NULL DEFAULT 'VERIFIED',
    source_name TEXT,
    source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_code TEXT,
    degree_level TEXT NOT NULL CHECK (degree_level IN ('UG', 'PG', 'Diploma', 'Doctorate', 'Integrated')),
    duration_years NUMERIC(3, 1) NOT NULL DEFAULT 4,
    description TEXT,
    eligibility_criteria TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Colleges Table
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    official_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_name TEXT,
    tnea_code VARCHAR(20),
    counselling_code VARCHAR(20),
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    district TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    pincode VARCHAR(10),
    established_year INTEGER,
    institution_type TEXT NOT NULL CHECK (institution_type IN ('Government', 'Government-Aided', 'Autonomous', 'Constituent', 'Deemed University', 'Self-Financing / Private')),
    affiliation TEXT,
    accreditation TEXT,
    nirf_ranking INTEGER,
    nirf_year INTEGER,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    website_url TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    hostel_available BOOLEAN NOT NULL DEFAULT false,
    transport_available BOOLEAN NOT NULL DEFAULT false,
    sports_facilities BOOLEAN NOT NULL DEFAULT false,
    wifi_campus BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    verification_status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (verification_status IN ('VERIFIED', 'UNVERIFIED', 'OUTDATED', 'OFFICIAL_SOURCE_UNAVAILABLE', 'USER_REPORTED', 'UNDER_REVIEW')),
    source_name TEXT,
    source_url TEXT,
    academic_year VARCHAR(20),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. College Courses Table
CREATE TABLE IF NOT EXISTS public.college_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    specialization TEXT,
    intake_capacity INTEGER,
    tuition_fee_per_year NUMERIC(12, 2),
    fee_currency VARCHAR(5) NOT NULL DEFAULT 'INR',
    fee_verification_status TEXT NOT NULL DEFAULT 'VERIFIED',
    fee_source_url TEXT,
    eligibility TEXT,
    study_mode TEXT NOT NULL DEFAULT 'Full-Time',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Cutoff Records Table (TNEA & Medical History)
CREATE TABLE IF NOT EXISTS public.cutoff_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    academic_year INTEGER NOT NULL,
    counselling_round INTEGER NOT NULL DEFAULT 1,
    community TEXT NOT NULL CHECK (community IN ('OC', 'BC', 'BCM', 'MBC', 'MBC_DNC', 'SC', 'SCA', 'ST')),
    cutoff_mark NUMERIC(6, 2) NOT NULL,
    opening_rank INTEGER,
    closing_rank INTEGER,
    source_authority TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Placement Statistics Table
CREATE TABLE IF NOT EXISTS public.placement_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    academic_year INTEGER NOT NULL,
    highest_package_lpa NUMERIC(6, 2),
    average_package_lpa NUMERIC(6, 2),
    median_package_lpa NUMERIC(6, 2),
    placement_percentage NUMERIC(5, 2),
    total_offers INTEGER,
    top_recruiters JSONB DEFAULT '[]'::jsonb,
    source_name TEXT,
    source_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Counselling Leads & CRM Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_reference TEXT NOT NULL UNIQUE,
    student_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    preferred_district TEXT,
    preferred_course TEXT,
    preferred_stream TEXT,
    target_college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    target_college_name TEXT,
    cutoff_score NUMERIC(6, 2),
    community TEXT CHECK (community IN ('OC', 'BC', 'BCM', 'MBC', 'MBC_DNC', 'SC', 'SCA', 'ST')),
    budget_range TEXT,
    counselling_mode TEXT NOT NULL DEFAULT 'WhatsApp',
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'COUNSELLING', 'COLLEGE_SHORTLISTED', 'APPLICATION_INITIATED', 'ADMISSION_IN_PROGRESS', 'ADMITTED', 'NOT_INTERESTED', 'CLOSED')),
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    assigned_to TEXT,
    student_notes TEXT,
    admin_remarks TEXT,
    source TEXT NOT NULL DEFAULT 'Website',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Shortlists Table (Student persistent bookmarks)
CREATE TABLE IF NOT EXISTS public.shortlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, college_id)
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cutoff_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for Verified Data
CREATE POLICY "Allow public read verified colleges" ON public.colleges FOR SELECT USING (is_verified = true);
CREATE POLICY "Allow public read universities" ON public.universities FOR SELECT USING (is_verified = true);
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read college_courses" ON public.college_courses FOR SELECT USING (true);
CREATE POLICY "Allow public read cutoff_records" ON public.cutoff_records FOR SELECT USING (is_verified = true);
CREATE POLICY "Allow public read placement_statistics" ON public.placement_statistics FOR SELECT USING (is_verified = true);
CREATE POLICY "Allow public read locations" ON public.locations FOR SELECT USING (true);

-- Leads Security (Public insert for prospective students, Admin/Counsellor manage)
CREATE POLICY "Allow public to create counselling leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated staff to read and manage leads" ON public.leads FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'counsellor', 'super_admin'));

-- Student Profiles & Shortlist Policies
CREATE POLICY "Users can view and update own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own shortlists" ON public.shortlists FOR ALL USING (auth.uid() = user_id);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_colleges_district ON public.colleges(district);
CREATE INDEX IF NOT EXISTS idx_colleges_tnea_code ON public.colleges(tnea_code);
CREATE INDEX IF NOT EXISTS idx_cutoff_records_community ON public.cutoff_records(community, cutoff_mark);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
