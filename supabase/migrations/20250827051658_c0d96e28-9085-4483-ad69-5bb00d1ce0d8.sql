-- Enable pgcrypto extension for encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Now run the data migration to encrypt existing plaintext data
SELECT public.migrate_subscriber_data_to_encrypted();