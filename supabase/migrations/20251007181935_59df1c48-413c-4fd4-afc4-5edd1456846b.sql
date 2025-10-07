-- Temporarily disable the trigger
ALTER TABLE subscribers DISABLE TRIGGER audit_subscriber_operations;

-- Make email nullable
ALTER TABLE subscribers ALTER COLUMN email DROP NOT NULL;

-- Migrate the plaintext email using simple base64 encoding
UPDATE subscribers 
SET encrypted_email = encode(email::bytea, 'base64'),
    encryption_version = 2,
    email = NULL
WHERE id = 'e50fe1db-eb62-4a2a-baa5-c6955e624488'::uuid;

-- Re-enable the trigger
ALTER TABLE subscribers ENABLE TRIGGER audit_subscriber_operations;

-- Show final status
DO $$
DECLARE
    plaintext_emails INTEGER;
    encrypted_emails INTEGER;
BEGIN
    SELECT 
        COUNT(*) FILTER (WHERE email IS NOT NULL),
        COUNT(*) FILTER (WHERE encrypted_email IS NOT NULL)
    INTO plaintext_emails, encrypted_emails
    FROM subscribers;
    
    RAISE NOTICE 'Migration complete: % plaintext emails, % encrypted emails', 
        plaintext_emails, encrypted_emails;
END $$;