-- Drop legacy plaintext columns from subscribers table
-- These columns have been replaced by encrypted versions (encrypted_email, encrypted_stripe_customer_id)

ALTER TABLE subscribers DROP COLUMN IF EXISTS email;
ALTER TABLE subscribers DROP COLUMN IF EXISTS stripe_customer_id;