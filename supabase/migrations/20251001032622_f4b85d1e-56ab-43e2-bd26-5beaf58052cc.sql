-- Add usage quotas for task management features across subscription tiers

-- Free tier task limits
INSERT INTO public.usage_quotas (tier, feature_name, monthly_limit) VALUES
('free', 'task_creation', 10),
('free', 'task_templates_view', -1),
('free', 'task_recurring', 0);

-- Starter tier task limits
INSERT INTO public.usage_quotas (tier, feature_name, monthly_limit) VALUES
('starter', 'task_creation', -1),
('starter', 'task_templates_full', -1),
('starter', 'task_history', -1),
('starter', 'task_recurring_annual', -1),
('starter', 'task_field_assignment', -1),
('starter', 'task_reminders', 50);

-- Pro tier task limits (unlimited everything)
INSERT INTO public.usage_quotas (tier, feature_name, monthly_limit) VALUES
('pro', 'task_creation', -1),
('pro', 'task_templates_full', -1),
('pro', 'task_history', -1),
('pro', 'task_recurring_advanced', -1),
('pro', 'task_field_assignment', -1),
('pro', 'task_reminders', -1),
('pro', 'task_learnings', -1),
('pro', 'task_year_comparison', -1),
('pro', 'task_smart_recommendations', -1),
('pro', 'task_export', -1);

-- Enterprise tier task limits (all pro features plus team/API)
INSERT INTO public.usage_quotas (tier, feature_name, monthly_limit) VALUES
('enterprise', 'task_creation', -1),
('enterprise', 'task_templates_full', -1),
('enterprise', 'task_history', -1),
('enterprise', 'task_recurring_advanced', -1),
('enterprise', 'task_field_assignment', -1),
('enterprise', 'task_reminders', -1),
('enterprise', 'task_learnings', -1),
('enterprise', 'task_year_comparison', -1),
('enterprise', 'task_smart_recommendations', -1),
('enterprise', 'task_export', -1),
('enterprise', 'task_team_collaboration', -1),
('enterprise', 'task_api_access', -1);