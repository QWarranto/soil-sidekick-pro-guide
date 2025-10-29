-- Add property_address column to soil_analyses table
ALTER TABLE soil_analyses ADD COLUMN IF NOT EXISTS property_address text;

-- Create index for faster lookups by property address
CREATE INDEX IF NOT EXISTS idx_soil_analyses_property_address ON soil_analyses(property_address);

-- Create composite index for user_id, county_fips, and property_address for efficient queries
CREATE INDEX IF NOT EXISTS idx_soil_analyses_user_county_property 
ON soil_analyses(user_id, county_fips, property_address);