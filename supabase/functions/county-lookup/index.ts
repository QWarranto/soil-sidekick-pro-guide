/**
 * County Lookup Edge Function
 * Public endpoint with rate limiting for searching counties by name
 * 
 * Updated: February 5, 2026 - Added database caching for sub-100ms latency
 */

import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { requestHandler } from '../_shared/request-handler.ts';

const CACHE_TTL_MS = 3600000; // 1 hour - counties don't change

function buildCacheKey(term: string): string {
  return `county_search:${term.toLowerCase().trim()}`;
}

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
    const cacheKey = buildCacheKey(cleanTerm);

    // Check database cache first (faster than full county search)
    const { data: cachedData, error: cacheError } = await supabaseClient
      .from('fips_data_cache')
      .select('cached_data, access_count')
      .eq('cache_key', cacheKey)
      .eq('data_source', 'county_lookup')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (cacheError) {
      console.log('[Cache] Read error:', cacheError.message);
    }

    if (cachedData?.cached_data) {
      console.log(`[Cache] HIT: "${cleanTerm}"`);
      return { results: cachedData.cached_data, cached: true };
    }

    console.log('County lookup request (cache miss):', { cleanTerm });

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

    // Cache the results in database
    const { error: insertError } = await supabaseClient
      .from('fips_data_cache')
      .upsert({
        cache_key: cacheKey,
        data_source: 'county_lookup',
        county_fips: 'search',
        cached_data: results,
        cache_level: 1,
        expires_at: new Date(Date.now() + CACHE_TTL_MS).toISOString(),
        access_count: 1,
        last_accessed: new Date().toISOString(),
        created_at: new Date().toISOString()
      }, { onConflict: 'cache_key,data_source' });
    
    if (insertError) {
      console.error('[Cache] SET failed:', insertError.message);
    } else {
      console.log(`[Cache] SET: "${cleanTerm}"`);
    }

    return { results, cached: false };
  },
});
