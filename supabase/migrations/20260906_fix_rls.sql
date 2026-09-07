-- Fix RLS policies after column cleanup
-- The old policies reference 'is_verified' which was dropped

-- Drop old policies
DROP POLICY IF EXISTS "Allow public read verified colleges" ON public.colleges;
DROP POLICY IF EXISTS "Allow public read universities" ON public.universities;
DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public read courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public read college_courses" ON public.college_courses;
DROP POLICY IF EXISTS "Allow public read cutoff_records" ON public.cutoff_records;
DROP POLICY IF EXISTS "Allow public read placement_statistics" ON public.placement_statistics;
DROP POLICY IF EXISTS "Allow public read locations" ON public.locations;

-- Create new simple policies - all colleges/courses are public read
CREATE POLICY "Allow public read colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Allow public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read college_courses" ON public.college_courses FOR SELECT USING (true);
