-- Create seasonal task categories enum
CREATE TYPE task_category AS ENUM (
  'soil_preparation',
  'planting',
  'fertilization',
  'irrigation',
  'pest_management',
  'harvesting',
  'equipment_maintenance',
  'cover_crops',
  'soil_testing',
  'record_keeping',
  'other'
);

-- Create task status enum
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'skipped', 'cancelled');

-- Create recurrence pattern enum
CREATE TYPE recurrence_pattern AS ENUM ('annual', 'seasonal', 'monthly', 'custom');

-- Seasonal task templates library (pre-defined tasks)
CREATE TABLE public.seasonal_task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name TEXT NOT NULL,
  category task_category NOT NULL,
  description TEXT,
  typical_season TEXT, -- 'spring', 'summer', 'fall', 'winter', or specific months
  typical_timing_notes TEXT, -- e.g., "2 weeks before last frost"
  estimated_duration_hours NUMERIC,
  recommended_for_crops TEXT[], -- array of crop types
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User's task instances
CREATE TABLE public.user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE, -- optional link to specific field
  task_name TEXT NOT NULL,
  category task_category NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  
  -- Scheduling
  scheduled_date DATE,
  due_date DATE,
  completed_date DATE,
  estimated_duration_hours NUMERIC,
  actual_duration_hours NUMERIC,
  
  -- Recurrence
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern recurrence_pattern,
  recurrence_config JSONB, -- stores custom recurrence rules
  parent_task_id UUID REFERENCES public.user_tasks(id) ON DELETE SET NULL, -- links to original recurring task
  
  -- Details
  crops_involved TEXT[],
  location_notes TEXT,
  weather_conditions JSONB,
  
  -- Tracking
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_from_template_id UUID REFERENCES public.seasonal_task_templates(id) ON DELETE SET NULL
);

-- Task completion history with learnings
CREATE TABLE public.task_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_task_id UUID NOT NULL REFERENCES public.user_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Completion details
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completion_notes TEXT,
  what_worked TEXT, -- learnings: what went well
  what_didnt_work TEXT, -- learnings: what to improve
  recommendations_for_next_time TEXT,
  
  -- Results
  outcome_rating INTEGER CHECK (outcome_rating >= 1 AND outcome_rating <= 5), -- 1-5 star rating
  yield_notes TEXT,
  cost_incurred NUMERIC,
  
  -- Context
  weather_during_task JSONB,
  photos JSONB, -- array of photo URLs if needed
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seasonal_task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seasonal_task_templates (public read, admin write)
CREATE POLICY "Task templates are viewable by everyone"
  ON public.seasonal_task_templates FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage task templates"
  ON public.seasonal_task_templates FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- RLS Policies for user_tasks
CREATE POLICY "Users can view their own tasks"
  ON public.user_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
  ON public.user_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.user_tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.user_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for task_history
CREATE POLICY "Users can view their own task history"
  ON public.task_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own task history"
  ON public.task_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own task history"
  ON public.task_history FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_user_tasks_user_id ON public.user_tasks(user_id);
CREATE INDEX idx_user_tasks_field_id ON public.user_tasks(field_id);
CREATE INDEX idx_user_tasks_status ON public.user_tasks(status);
CREATE INDEX idx_user_tasks_scheduled_date ON public.user_tasks(scheduled_date);
CREATE INDEX idx_user_tasks_category ON public.user_tasks(category);
CREATE INDEX idx_task_history_user_task_id ON public.task_history(user_task_id);
CREATE INDEX idx_task_history_user_id ON public.task_history(user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seasonal_task_templates_updated_at
  BEFORE UPDATE ON public.seasonal_task_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_tasks_updated_at
  BEFORE UPDATE ON public.user_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate recurring tasks
CREATE OR REPLACE FUNCTION generate_recurring_tasks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function can be called periodically to create new task instances
  -- from recurring task templates for the upcoming season/year
  INSERT INTO public.user_tasks (
    user_id,
    field_id,
    task_name,
    category,
    description,
    status,
    priority,
    is_recurring,
    recurrence_pattern,
    recurrence_config,
    parent_task_id,
    crops_involved,
    created_from_template_id
  )
  SELECT 
    ut.user_id,
    ut.field_id,
    ut.task_name,
    ut.category,
    ut.description,
    'pending'::task_status,
    ut.priority,
    ut.is_recurring,
    ut.recurrence_pattern,
    ut.recurrence_config,
    ut.id, -- link back to parent
    ut.crops_involved,
    ut.created_from_template_id
  FROM public.user_tasks ut
  WHERE ut.is_recurring = true
    AND ut.status = 'completed'
    AND ut.recurrence_pattern = 'annual'
    -- Only generate if no pending task exists for next year
    AND NOT EXISTS (
      SELECT 1 FROM public.user_tasks ut2
      WHERE ut2.parent_task_id = ut.id
        AND ut2.status = 'pending'
        AND ut2.scheduled_date > now()
    );
END;
$$;

-- Insert some starter task templates
INSERT INTO public.seasonal_task_templates (task_name, category, description, typical_season, typical_timing_notes, estimated_duration_hours, recommended_for_crops, priority) VALUES
('Soil Testing', 'soil_testing', 'Collect soil samples and send for analysis to determine nutrient levels and pH', 'fall', 'Early fall or late winter, before spring planting', 2, ARRAY['all crops'], 'high'),
('Spring Soil Preparation', 'soil_preparation', 'Till or prepare beds, incorporate compost and amendments based on soil test results', 'spring', '2-4 weeks before planting, when soil is workable', 8, ARRAY['all crops'], 'high'),
('Frost Protection Setup', 'soil_preparation', 'Set up row covers, cold frames, or other frost protection for early season crops', 'spring', 'Before last expected frost date', 3, ARRAY['Tomatoes', 'Peppers', 'Lettuce'], 'medium'),
('Spring Planting - Cool Season Crops', 'planting', 'Plant cool season crops like lettuce, peas, spinach, and brassicas', 'spring', '4-6 weeks before last frost', 6, ARRAY['Lettuce', 'Spinach', 'Peas', 'Broccoli'], 'high'),
('Spring Planting - Warm Season Crops', 'planting', 'Plant warm season crops like tomatoes, peppers, squash after frost danger passes', 'spring', '1-2 weeks after last frost when soil warms', 8, ARRAY['Tomatoes', 'Peppers', 'Corn', 'Squash'], 'high'),
('Install Irrigation System', 'irrigation', 'Set up drip irrigation or sprinkler systems for the growing season', 'spring', 'Before or immediately after planting', 6, ARRAY['all crops'], 'high'),
('First Fertilizer Application', 'fertilization', 'Apply starter fertilizer or side-dress established plants', 'spring', '2-3 weeks after planting', 3, ARRAY['all crops'], 'medium'),
('Mulching', 'soil_preparation', 'Apply mulch around plants to conserve moisture and suppress weeds', 'spring', 'After plants are established, 3-4 weeks after planting', 4, ARRAY['all crops'], 'medium'),
('Pest Scouting', 'pest_management', 'Walk fields and inspect plants for early signs of pest or disease issues', 'spring', 'Weekly throughout growing season', 1, ARRAY['all crops'], 'high'),
('Mid-Season Fertilization', 'fertilization', 'Side-dress or foliar feed crops during peak growth', 'summer', 'Mid-season, when plants are actively growing', 3, ARRAY['Tomatoes', 'Corn', 'Peppers', 'Squash'], 'medium'),
('Irrigation Monitoring', 'irrigation', 'Check soil moisture and adjust irrigation schedules based on weather', 'summer', 'Weekly or as needed during hot weather', 1, ARRAY['all crops'], 'high'),
('Summer Succession Planting', 'planting', 'Plant second round of fast-maturing crops for continuous harvest', 'summer', 'Every 2-3 weeks through mid-summer', 3, ARRAY['Lettuce', 'Carrots', 'Beans'], 'medium'),
('Harvest - Early Crops', 'harvesting', 'Harvest spring-planted cool season crops', 'summer', 'As crops reach maturity, typically 60-90 days after planting', 4, ARRAY['Lettuce', 'Peas', 'Spinach'], 'high'),
('Harvest - Main Season Crops', 'harvesting', 'Harvest main season vegetables at peak ripeness', 'summer', 'Throughout summer into fall', 6, ARRAY['Tomatoes', 'Peppers', 'Corn', 'Squash'], 'critical'),
('Fall Soil Amendment', 'soil_preparation', 'Add compost, manure, or cover crop to rebuild soil for next season', 'fall', 'After harvest is complete', 6, ARRAY['all crops'], 'high'),
('Cover Crop Planting', 'cover_crops', 'Plant cover crops like winter rye, clover, or vetch to protect and improve soil', 'fall', '4-6 weeks before first frost', 4, ARRAY['all crops'], 'high'),
('Equipment Winterization', 'equipment_maintenance', 'Clean, service, and store tractors, tillers, and irrigation equipment for winter', 'fall', 'Before first hard freeze', 6, ARRAY['all crops'], 'medium'),
('End of Season Records', 'record_keeping', 'Document what worked, what didn''t, yields, varieties, and notes for next year', 'fall', 'After final harvest', 2, ARRAY['all crops'], 'high'),
('Winter Planning', 'record_keeping', 'Review last season, order seeds, plan crop rotations for next year', 'winter', 'During winter months', 4, ARRAY['all crops'], 'medium'),
('Equipment Maintenance', 'equipment_maintenance', 'Service and repair equipment during off-season', 'winter', 'Throughout winter as needed', 8, ARRAY['all crops'], 'medium');