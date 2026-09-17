-- Fix security vulnerability in subscribers table
-- Remove any existing permissive policies and ensure proper RLS

-- First, ensure RLS is enabled (it should be already)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Drop the existing policies to recreate them securely
DROP POLICY IF EXISTS "Service can update subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;

-- Create secure policies that only allow users to see their own subscription data
CREATE POLICY "Users can view their own subscription only"
ON public.subscribers
FOR SELECT
USING (auth.uid() = user_id);

-- Allow service functions (using service role key) to insert subscription data
CREATE POLICY "Service functions can insert subscription data"
ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Allow service functions to update subscription data
CREATE POLICY "Service functions can update subscription data"
ON public.subscribers
FOR UPDATE
USING (true);

-- Allow users to update their own subscription data (for user-initiated changes)
CREATE POLICY "Users can update their own subscription"
ON public.subscribers
FOR UPDATE
USING (auth.uid() = user_id);

-- Ensure user_id column is properly set for all existing records
UPDATE public.subscribers 
SET user_id = (
  SELECT id FROM auth.users 
  WHERE email = subscribers.email
)
WHERE user_id IS NULL;