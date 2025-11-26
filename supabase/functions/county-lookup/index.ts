import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { validateInput } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const countySearchSchema = z.object({
  term: z.string().min(2).max(60).trim(),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { term } = validateInput(countySearchSchema, body);

    // Sanitization
    const cleanTerm = term.replace(/[,;'"<>]/g, '').trim();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('County lookup request:', { cleanTerm })

    // Primary: search by county name
    const { data: countyData, error: countyError } = await supabase
      .from('counties')
      .select('id, county_name, state_name, state_code, fips_code')
      .ilike('county_name', `%${cleanTerm}%`)
      .limit(50)

    if (countyError) {
      console.error('County name search error:', countyError)
      throw countyError
    }

    let allResults = countyData ?? []

    // If few results, also search by state name
    if (allResults.length < 5) {
      const { data: stateData, error: stateError } = await supabase
        .from('counties')
        .select('id, county_name, state_name, state_code, fips_code')
        .ilike('state_name', `%${cleanTerm}%`)
        .limit(50)

      if (stateError) {
        console.error('State name search error:', stateError)
        throw stateError
      }

      const existing = new Set(allResults.map((c) => c.id))
      const deduped = (stateData ?? []).filter((c) => !existing.has(c.id))
      allResults = [...allResults, ...deduped]
    }

    // Cap to 10 items
    const results = allResults.slice(0, 10)

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('county-lookup error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to search counties' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})