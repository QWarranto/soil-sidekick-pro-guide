-- Create table to store professional information per user
CREATE TABLE public.professional_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_name TEXT NOT NULL,
  professional_entity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.professional_info ENABLE ROW LEVEL SECURITY;

-- Users can only read their own professional info
CREATE POLICY "Users can view own professional info"
ON public.professional_info
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their professional info once
CREATE POLICY "Users can insert own professional info"
ON public.professional_info
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_professional_info_user_id ON public.professional_info(user_id);

-- Add comment
COMMENT ON TABLE public.professional_info IS 'Stores the fixed professional name and entity for each user to prevent account sharing';