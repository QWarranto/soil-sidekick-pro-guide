/**
 * Free Tier Validator - Standardized validation for all free tier API calls
 * 
 * Purpose: Ensure consistent free tier experience across all endpoints
 * - Accepts just county_fips (5-digit code)
 * - Auto-fills county_name and state_code
 * - Same validation rules everywhere
 */

import { createClient } from 'jsr:@supabase/supabase-js@2'

export interface FreeTierValidationResult {
  valid: boolean
  county_fips: string
  county_name?: string
  state_code?: string
  error?: string
}

/**
 * Validates free tier input and auto-fills missing fields
 * 
 * @param county_fips - 5-digit FIPS code (required)
 * @param county_name - Optional, will be auto-filled if missing
 * @param state_code - Optional, will be auto-filled if missing
 * @returns Validation result with auto-filled fields
 */
export async function validateFreeTierInput(
  county_fips: string,
  county_name?: string,
  state_code?: string
): Promise<FreeTierValidationResult> {
  // Basic validation
  if (!county_fips) {
    return {
      valid: false,
      county_fips: '',
      error: 'county_fips is required for free tier access'
    }
  }

  // Validate FIPS format (5 digits)
  const fipsRegex = /^\d{5}$/
  if (!fipsRegex.test(county_fips)) {
    return {
      valid: false,
      county_fips,
      error: 'county_fips must be a 5-digit FIPS code (e.g., 12086 for Miami-Dade, FL)'
    }
  }

  // If county_name and state_code provided, use them
  if (county_name && state_code) {
    return {
      valid: true,
      county_fips,
      county_name: county_name.trim(),
      state_code: state_code.toUpperCase().trim()
    }
  }

  // Auto-fill missing fields from database
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: countyData, error } = await supabase
      .from('county_lookup')
      .select('county_name, state_code')
      .eq('fips_code', county_fips)
      .limit(1)
      .maybeSingle()

    if (error || !countyData) {
      // Fallback: allow without auto-fill for free tier
      return {
        valid: true,
        county_fips,
        county_name: county_name || `County ${county_fips}`,
        state_code: state_code || 'XX'
      }
    }

    return {
      valid: true,
      county_fips,
      county_name: county_name || countyData.county_name,
      state_code: state_code || countyData.state_code
    }

  } catch (error) {
    // Silent fail for free tier - don't block users
    return {
      valid: true,
      county_fips,
      county_name: county_name || `County ${county_fips}`,
      state_code: state_code || 'XX'
    }
  }
}

/**
 * Standardized free tier error response
 */
export function freeTierErrorResponse(error: string, startTime: number) {
  return new Response(
    JSON.stringify({
      error: 'Free tier validation failed',
      message: error,
      suggestion: 'Provide a 5-digit county FIPS code (e.g., 12086 for Miami-Dade, FL)',
      documentation: 'https://github.com/QWarranto/soil-sidekick-pro-guide/blob/main/docs/GETTING_STARTED.md#free-tier-access'
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Response-Time-Ms': String(Date.now() - startTime)
      }
    }
  )
}

/**
 * Standardized free tier success response
 */
export function freeTierSuccessResponse(data: any, startTime: number) {
  return new Response(
    JSON.stringify({
      ...data,
      _metadata: {
        tier: 'free',
        limits: '10 requests/day, basic soil data only',
        upgrade_url: 'https://app.soilsidekickpro.com/pricing',
        response_time_ms: Date.now() - startTime
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Response-Time-Ms': String(Date.now() - startTime),
        'X-Tier': 'free',
        'X-Upgrade-Url': 'https://app.soilsidekickpro.com/pricing'
      }
    }
  )
}