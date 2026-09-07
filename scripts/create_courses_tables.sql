-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_code TEXT,
    degree_level TEXT NOT NULL DEFAULT 'UG',
    duration_years INTEGER NOT NULL DEFAULT 4,
    description TEXT,
    eligibility_criteria TEXT,
    career_prospects JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create college_courses table
CREATE TABLE IF NOT EXISTS public.college_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    specialization TEXT,
    intake_capacity INTEGER,
    tuition_fee_per_year INTEGER,
    fee_currency TEXT DEFAULT 'INR',
    fee_verification_status TEXT DEFAULT 'UNVERIFIED',
    fee_source_url TEXT,
    eligibility TEXT,
    study_mode TEXT DEFAULT 'Full-Time',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(college_id, course_id)
);

-- RLS Policies
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read access on college_courses" ON public.college_courses FOR SELECT USING (true);
