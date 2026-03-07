
-- Create programs table
CREATE TABLE public.programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region_city TEXT NOT NULL,
  region_district TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  target_gender TEXT DEFAULT '여성',
  target_household TEXT DEFAULT '1인가구',
  target_income TEXT,
  target_age TEXT,
  support_detail TEXT NOT NULL,
  cost TEXT NOT NULL,
  how_to_apply TEXT NOT NULL,
  apply_period TEXT,
  apply_url TEXT,
  contact TEXT,
  status TEXT DEFAULT '신청가능',
  source_url TEXT,
  keywords TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth needed for browsing programs)
CREATE POLICY "Programs are publicly readable"
  ON public.programs FOR SELECT
  USING (true);

-- Create indexes for common queries
CREATE INDEX idx_programs_region_city ON public.programs (region_city);
CREATE INDEX idx_programs_category ON public.programs (category);
CREATE INDEX idx_programs_status ON public.programs (status);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
