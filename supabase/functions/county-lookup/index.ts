/**
 * County Lookup Edge Function
 * Public endpoint with rate limiting for searching counties by name
 * 
 * Updated: December 6, 2025 - Added rate limiting via requestHandler pattern
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { requestHandler } from '../_shared/request-handler.ts';

const countySearchSchema = z.object({
  term: z.string().min(2).max(60).trim(),
});

type CountySearchInput = z.infer<typeof countySearchSchema>;

requestHandler<CountySearchInput>({
  requireAuth: false,
  validationSchema: countySearchSchema,
  rateLimit: {
    requests: 60,    // 60 requests per minute per IP
    windowMs: 60000, // 1 minute window
  },
  useServiceRole: true,
  handler: async ({ supabaseClient, validatedData }) => {
    const { term } = validatedData;
    
    // Sanitization - remove potentially dangerous characters
    const cleanTerm = term.replace(/[,;'"<>]/g, '').trim();

    console.log('County lookup request:', { cleanTerm });

    // Primary: search by county name
    const { data: countyData, error: countyError } = await supabaseClient
      .from('counties')
      .select('id, county_name, state_name, state_code, fips_code')
      .ilike('county_name', `%${cleanTerm}%`)
      .limit(50);

    if (countyError) {
      console.error('County name search error:', countyError);
      throw countyError;
    }

    let allResults = countyData ?? [];

    // If few results, also search by state name
    if (allResults.length < 5) {
      const { data: stateData, error: stateError } = await supabaseClient
        .from('counties')
        .select('id, county_name, state_name, state_code, fips_code')
        .ilike('state_name', `%${cleanTerm}%`)
        .limit(50);

      if (stateError) {
        console.error('State name search error:', stateError);
        throw stateError;
      }

      const existing = new Set(allResults.map((c: any) => c.id));
      const deduped = (stateData ?? []).filter((c: any) => !existing.has(c.id));
      allResults = [...allResults, ...deduped];
    }

    // Cap to 10 items
    const results = allResults.slice(0, 10);

    return { results };
  },
});
