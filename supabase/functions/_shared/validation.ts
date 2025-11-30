/**
 * Unified Input Validation with Zod
 * Provides type-safe validation for all edge function inputs
 */

import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Common validation schemas
export const emailSchema = z.string().email().max(255).trim();
export const fipsCodeSchema = z.string().regex(/^\d{5}$/, 'County FIPS must be exactly 5 digits');
export const stateCodeSchema = z.string().regex(/^[A-Z]{2}$/, 'State code must be 2 uppercase letters');
export const uuidSchema = z.string().uuid();
export const urlSchema = z.string().url().max(2048);

// Geographic validation schemas
export const countyLookupSchema = z.object({
  county_fips: fipsCodeSchema,
  county_name: z.string().min(1).max(100).trim(),
  state_code: stateCodeSchema,
  property_address: z.string().min(1).max(500).trim().optional(),
  force_refresh: z.boolean().optional(),
});

export const locationSchema = z.object({
  county_fips: fipsCodeSchema,
  state_code: stateCodeSchema.optional(),
  county_name: z.string().max(100).trim().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// API request schemas
export const agriculturalIntelligenceSchema = z.object({
  query: z.string().min(1).max(5000).trim(),
  context: z.object({
    county_fips: fipsCodeSchema.optional(),
    soil_data: z.any().optional(),
    user_location: z.string().max(200).optional(),
  }).optional(),
  useGPT5: z.boolean().optional(),
});

export const waterQualitySchema = z.object({
  county_fips: fipsCodeSchema,
  state_code: stateCodeSchema.optional(),
  force_refresh: z.boolean().optional(),
});

export const soilDataSchema = z.object({
  county_fips: fipsCodeSchema,
  county_name: z.string().min(1).max(100).trim(),
  state_code: stateCodeSchema,
  property_address: z.string().min(1).max(500).trim(),
  force_refresh: z.boolean().optional(),
});

export const environmentalImpactSchema = z.object({
  analysis_id: z.string().min(1).max(100),
  county_fips: fipsCodeSchema,
  soil_data: z.record(z.any()),
  proposed_treatments: z.array(z.record(z.any())).optional(),
});

export const plantingCalendarSchema = z.object({
  county_fips: fipsCodeSchema,
  crop_type: z.string().min(1).max(100),
  soil_data: z.record(z.any()).optional(),
  climate_preferences: z.record(z.any()).optional(),
  sustainability_goals: z.array(z.string()).optional(),
});

// Cost tracking schemas
export const costTrackingSchema = z.object({
  service_provider: z.enum(['openai', 'supabase', 'usda', 'google_earth', 'census', 'epa']),
  service_type: z.string().min(1).max(100),
  usage_amount: z.number().min(0),
  feature_name: z.string().min(1).max(100),
  request_details: z.record(z.any()).optional(),
});

// Security incident schemas
export const securityIncidentSchema = z.object({
  incident_type: z.string().min(1).max(100),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  source_ip: z.string().max(45).optional(),
  user_agent: z.string().max(500).optional(),
  endpoint: z.string().max(200).optional(),
  incident_details: z.record(z.any()).optional(),
});

// Rate limit configuration schema
export const rateLimitConfigSchema = z.object({
  tier: z.enum(['free', 'starter', 'professional', 'enterprise']),
  requests_per_minute: z.number().int().positive(),
  requests_per_hour: z.number().int().positive(),
  requests_per_day: z.number().int().positive(),
});

// Rate limit tracking schema
export const rateLimitTrackingSchema = z.object({
  identifier: z.string().min(1), // user_id or IP address
  endpoint: z.string().min(1),
  window_start: z.string().datetime(),
  window_end: z.string().datetime(),
  request_count: z.number().int().nonnegative().default(0),
});

// Payment & Subscription validation schemas
export const checkoutSchema = z.object({
  plan: z.enum(['starter', 'pro', 'enterprise'], {
    errorMap: () => ({ message: 'Plan must be starter, pro, or enterprise' })
  }),
  interval: z.enum(['month', 'year'], {
    errorMap: () => ({ message: 'Interval must be month or year' })
  }),
});

export const customerPortalSchema = z.object({
  // No specific fields required - just validates request structure
  returnUrl: urlSchema.optional(),
});

export const subscriptionCheckSchema = z.object({
  // No specific fields required - user ID comes from auth token
  forceRefresh: z.boolean().optional(),
});

/**
 * Validate and parse input data against a schema
 * Returns validated data or throws descriptive error
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('; ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw error;
  }
}

/**
 * Safely parse input without throwing
 * Returns { success: true, data } or { success: false, error }
 */
export function safeValidateInput<T>(schema: z.ZodSchema<T>, data: unknown): 
  { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('; ');
      return { success: false, error: `Validation failed: ${errorMessages}` };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}
