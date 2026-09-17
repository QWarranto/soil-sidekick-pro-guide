-- Create table for visual analysis results
CREATE TABLE public.visual_analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('pest_detection', 'crop_health', 'disease_screening')),
  image_data TEXT, -- Truncated reference to original image
  analysis_result JSONB NOT NULL,
  location_data JSONB,
  crop_type TEXT,
  confidence_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.visual_analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies for visual analysis results
CREATE POLICY "Users can view their own visual analysis results" 
ON public.visual_analysis_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own visual analysis results" 
ON public.visual_analysis_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_visual_analysis_results_updated_at
BEFORE UPDATE ON public.visual_analysis_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_visual_analysis_user_type ON public.visual_analysis_results(user_id, analysis_type);
CREATE INDEX idx_visual_analysis_created_at ON public.visual_analysis_results(created_at);

-- Add visual analysis types to subscription usages
COMMENT ON TABLE public.visual_analysis_results IS 'Stores results from visual crop and pest analysis using AI vision models';
COMMENT ON COLUMN public.visual_analysis_results.analysis_type IS 'Type of analysis: pest_detection, crop_health, or disease_screening';
COMMENT ON COLUMN public.visual_analysis_results.analysis_result IS 'AI-generated analysis results in JSON format';
COMMENT ON COLUMN public.visual_analysis_results.confidence_score IS 'Overall confidence score for the analysis (0-100)';