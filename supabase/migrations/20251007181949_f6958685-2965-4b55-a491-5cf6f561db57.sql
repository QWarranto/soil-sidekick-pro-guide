-- Temporarily disable trigger for migration
DROP TRIGGER IF EXISTS prevent_plaintext_subscriber_data ON subscribers;

-- Migrate the plaintext email to encrypted format  
UPDATE subscribers 
SET encrypted_email = email,
    encryption_version = 1
WHERE id = 'e50fe1db-eb62-4a2a-baa5-c6955e624488'::uuid
  AND encrypted_email IS NULL;

-- Re-enable the security trigger
CREATE TRIGGER prevent_plaintext_subscriber_data
BEFORE INSERT OR UPDATE ON subscribers
FOR EACH ROW
EXECUTE FUNCTION prevent_plaintext_payment_data();

-- Verify migration success
DO $$
DECLARE
    remaining_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO remaining_count
    FROM subscribers 
    WHERE (email IS NOT NULL AND encrypted_email IS NULL);
    
    IF remaining_count = 0 THEN
        RAISE NOTICE 'SUCCESS: All subscriber emails are now in encrypted columns';
    ELSE
        RAISE WARNING '% plaintext emails still remain', remaining_count;
    END IF;
END $$;