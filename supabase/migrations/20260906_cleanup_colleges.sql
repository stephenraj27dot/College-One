-- SQL script to clean up unwanted columns from the colleges table to make it more structured and aligned with the PDF data.
-- You can run this in your Supabase SQL editor if you want to permanently drop the fields.

ALTER TABLE public.colleges
  DROP COLUMN IF EXISTS logo_url,
  DROP COLUMN IF EXISTS banner_url,
  DROP COLUMN IF EXISTS website_url,
  DROP COLUMN IF EXISTS contact_phone,
  DROP COLUMN IF EXISTS contact_email,
  DROP COLUMN IF EXISTS hostel_available,
  DROP COLUMN IF EXISTS transport_available,
  DROP COLUMN IF EXISTS sports_facilities,
  DROP COLUMN IF EXISTS wifi_campus,
  DROP COLUMN IF EXISTS is_featured,
  DROP COLUMN IF EXISTS is_verified,
  DROP COLUMN IF EXISTS verification_status,
  DROP COLUMN IF EXISTS source_name,
  DROP COLUMN IF EXISTS source_url,
  DROP COLUMN IF EXISTS academic_year,
  DROP COLUMN IF EXISTS verified_at,
  DROP COLUMN IF EXISTS affiliation,
  DROP COLUMN IF EXISTS accreditation,
  DROP COLUMN IF EXISTS nirf_ranking,
  DROP COLUMN IF EXISTS nirf_year,
  DROP COLUMN IF EXISTS description;
