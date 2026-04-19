
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any prior versions of these jobs (idempotent)
DO $$
DECLARE j RECORD;
BEGIN
  FOR j IN SELECT jobid FROM cron.job WHERE jobname IN ('endpoint-activity-snapshot-hourly','endpoint-activity-digest-6h') LOOP
    PERFORM cron.unschedule(j.jobid);
  END LOOP;
END $$;

SELECT cron.schedule(
  'endpoint-activity-snapshot-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/endpoint-activity-snapshot',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6Ik9KU0Z3eS9xVnRsK0xidXAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z254a29lcXp2dWV5cHd6dnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjI2NDIsImV4cCI6MjA2ODMzODY0Mn0.OLDBmIyM2jb6mu05DzHNYhzXY4-x_cTgi8COR45-NZ8"}'::jsonb,
    body := jsonb_build_object('time', now())
  ) AS request_id;
  $$
);

SELECT cron.schedule(
  'endpoint-activity-digest-6h',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/endpoint-activity-digest',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6Ik9KU0Z3eS9xVnRsK0xidXAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z254a29lcXp2dWV5cHd6dnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjI2NDIsImV4cCI6MjA2ODMzODY0Mn0.OLDBmIyM2jb6mu05DzHNYhzXY4-x_cTgi8COR45-NZ8"}'::jsonb,
    body := jsonb_build_object('time', now())
  ) AS request_id;
  $$
);
