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
  property_address: z.string().min(1).max(500).trim().optional(),
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

// ============================================
// Phase 2B: Authentication & Security Schemas
// Added: December 4, 2025
// ============================================

// Trial auth schema - public endpoint with rate limiting
export const trialAuthSchema = z.object({
  email: emailSchema,
  action: z.enum(['create_trial', 'verify_trial'], {
    errorMap: () => ({ message: 'Action must be create_trial or verify_trial' })
  }),
  trialDuration: z.number().int().min(1).max(30).optional(), // Days, default 10
  sessionToken: z.string().min(1).max(500).optional(), // Server-signed token for verification
});

// External auth validation schema - validates before auth
export const externalAuthSchema = z.object({
  token: z.string().min(1).max(1000),
  email: emailSchema,
  provider: z.enum(['soilcertify', 'partner_api', 'oauth']).optional().default('soilcertify'),
  metadata: z.record(z.any()).optional(),
});

// Sign-in notification schema
export const signinNotificationSchema = z.object({
  email: emailSchema,
  userName: z.string().max(200).optional(),
  ipAddress: z.string().max(45).optional(), // IPv6 max length
  userAgent: z.string().max(500).optional(),
  timestamp: z.string().datetime().optional(),
});

// Security monitoring schema - admin only
export const securityMonitoringSchema = z.object({
  time_range: z.enum(['1h', '24h', '7d', '30d']).optional().default('24h'),
  severity_filter: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  event_types: z.array(z.string().max(100)).optional(),
});

// ============================================
// Phase 3A: AI/ML Validation Schemas
// Added: December 7, 2025 (prep for December 9)
// ============================================

// GPT-5 Chat schema
export const gpt5ChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().min(1).max(50000),
  })).min(1).max(100),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  max_tokens: z.number().int().min(1).max(8000).optional().default(2000),
  stream: z.boolean().optional().default(false),
});

// Smart report summary schema
export const reportSummarySchema = z.object({
  reportType: z.enum(['soil', 'water', 'environmental'], {
    errorMap: () => ({ message: 'Report type must be soil, water, or environmental' })
  }),
  reportData: z.record(z.any()),
  maxLength: z.number().int().min(100).max(5000).optional(),
});

// Seasonal planning assistant schema
export const seasonalPlanningSchema = z.object({
  location: z.object({
    county_fips: fipsCodeSchema.optional(),
    county_name: z.string().max(100),
    state_code: stateCodeSchema,
    fips_code: fipsCodeSchema.optional(),
  }),
  soilData: z.record(z.any()).optional(),
  planningType: z.enum(['rotation', 'planting', 'harvest', 'cover-crop', 'general']),
  cropPreferences: z.record(z.any()).optional(),
  timeframe: z.enum(['season', 'year', 'multi-year']).optional().default('year'),
});

// Alpha Earth satellite analysis schema  
export const satelliteAnalysisSchema = z.object({
  analysis_id: z.string().min(1).max(100),
  county_fips: fipsCodeSchema,
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  soil_data: z.record(z.any()),
  water_body_data: z.record(z.any()).optional(),
});

// ============================================
// Phase 3B: Data Services Validation Schemas
// Added: December 9, 2025 (early prep for December 10)
// ============================================

// Live Agricultural Data schema
export const liveAgDataSchema = z.object({
  county_fips: fipsCodeSchema,
  county_name: z.string().min(1).max(100).trim(),
  state_code: stateCodeSchema,
  data_types: z.array(z.enum(['weather', 'soil', 'crop', 'environmental'])).min(1).max(4),
});

// Hierarchical FIPS Cache schema
export const fipsCacheSchema = z.object({
  county_fips: fipsCodeSchema,
  data_sources: z.array(z.enum(['usda_soil', 'noaa_weather', 'epa_water', 'census_demographics'])).min(1),
  fallback_levels: z.array(z.number().int().min(1).max(4)).optional().default([1, 2, 3, 4]),
  force_refresh: z.boolean().optional().default(false),
});

// Geo Consumption Analytics schema
export const geoAnalyticsSchema = z.object({
  action_type: z.string().min(1).max(100),
  county_fips: fipsCodeSchema,
  usage_metadata: z.record(z.any()).optional().default({}),
  session_data: z.object({
    duration: z.number().optional(),
    features: z.array(z.string()).optional(),
    search_terms: z.array(z.string()).optional(),
    export_attempted: z.boolean().optional(),
  }).optional().default({}),
});

// Territorial Water Analytics schema
export const waterAnalyticsSchema = z.object({
  territory_type: z.enum(['state', 'territory', 'compact_state']).optional(),
  epa_region: z.string().max(50).optional(),
  date_range: z.object({
    start_date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    end_date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  }).optional(),
});

// LeafEngines Query schema (for API key authenticated requests)
export const leafEnginesSchema = z.object({
  location: z.object({
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    address: z.string().max(500).optional(),
    county_fips: fipsCodeSchema.optional(),
  }),
  plant: z.object({
    common_name: z.string().max(200).optional(),
    scientific_name: z.string().max(200).optional(),
    plant_id: z.string().max(100).optional(),
    care_requirements: z.object({
      sun_exposure: z.enum(['full_sun', 'partial_shade', 'full_shade']).optional(),
      water_needs: z.enum(['low', 'medium', 'high']).optional(),
      soil_ph_range: z.object({ min: z.number(), max: z.number() }).optional(),
      hardiness_zones: z.array(z.string()).optional(),
    }).optional(),
  }),
  options: z.object({
    include_satellite_data: z.boolean().optional(),
    include_water_quality: z.boolean().optional(),
    include_recommendations: z.boolean().optional(),
  }).optional(),
});

// ============================================
// Phase 4A: Specialized Function Validation Schemas
// Added: December 12, 2025
// ============================================

// Carbon Credit Calculator schema
export const carbonCreditSchema = z.object({
  field_name: z.string().min(1).max(200).trim(),
  field_size_acres: z.number().positive().max(100000),
  soil_organic_matter: z.number().min(0).max(100).optional(),
  soil_analysis_id: uuidSchema.optional(),
  verification_type: z.enum(['self_reported', 'third_party', 'satellite']).optional().default('self_reported'),
});

// VRT Prescription Generator schema
export const vrtPrescriptionSchema = z.object({
  fieldId: uuidSchema,
  soilAnalysisId: uuidSchema.optional(),
  applicationType: z.enum(['nitrogen', 'phosphorus', 'potassium', 'lime', 'herbicide', 'fungicide', 'insecticide']),
  cropType: z.string().min(1).max(100).trim(),
  baseRate: z.number().positive(),
  rateUnit: z.string().min(1).max(50).trim(),
  targetYield: z.number().positive().optional(),
});

// ADAPT Soil Export schema
export const adaptExportSchema = z.object({
  soilAnalysisIds: z.array(uuidSchema).min(1).max(100),
  format: z.enum(['adapt_1.0', 'adapt_2.0', 'geojson']).optional().default('adapt_1.0'),
  integrationId: uuidSchema.optional(),
});

// Enhanced Threat Detection schema
export const threatDetectionSchema = z.object({
  event_type: z.string().min(1).max(100),
  source_ip: z.string().max(45).optional(),
  user_agent: z.string().max(500).optional(),
  metadata: z.record(z.any()).optional(),
  severity_override: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

// SOC2 Compliance Monitor schema
export const soc2ComplianceSchema = z.object({
  action: z.enum(['run_compliance_check', 'get_compliance_history', 'create_compliance_audit_entry', 'schedule_compliance_monitoring']),
  check_type: z.enum(['automated', 'manual', 'scheduled']).optional(),
  details: z.record(z.any()).optional(),
});

// ============================================
// Phase 4B: Public Endpoint Validation Schemas
// Added: December 16, 2025
// ============================================

// Mapbox Token schema - public endpoint with minimal validation
export const mapboxTokenSchema = z.object({
  sessionId: z.string().max(100).optional(),
  requestOrigin: z.string().max(500).optional(),
}).optional();

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
