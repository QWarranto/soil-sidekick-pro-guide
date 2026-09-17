-- Enable the pgcrypto extension for encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verify the extension is working
SELECT pgp_sym_encrypt('test', 'key') IS NOT NULL as pgcrypto_working;