import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CensusCounty {
  GEOID: string;
  NAME: string;
  STATE: string;
  [key: string]: string;
}

interface StateInfo {
  code: string;
  name: string;
  fips: string;
}

// US State mapping for FIPS codes to state names and abbreviations
const stateMapping: Record<string, StateInfo> = {
  '01': { code: 'AL', name: 'Alabama', fips: '01' },
  '02': { code: 'AK', name: 'Alaska', fips: '02' },
  '04': { code: 'AZ', name: 'Arizona', fips: '04' },
  '05': { code: 'AR', name: 'Arkansas', fips: '05' },
  '06': { code: 'CA', name: 'California', fips: '06' },
  '08': { code: 'CO', name: 'Colorado', fips: '08' },
  '09': { code: 'CT', name: 'Connecticut', fips: '09' },
  '10': { code: 'DE', name: 'Delaware', fips: '10' },
  '11': { code: 'DC', name: 'District of Columbia', fips: '11' },
  '12': { code: 'FL', name: 'Florida', fips: '12' },
  '13': { code: 'GA', name: 'Georgia', fips: '13' },
  '15': { code: 'HI', name: 'Hawaii', fips: '15' },
  '16': { code: 'ID', name: 'Idaho', fips: '16' },
  '17': { code: 'IL', name: 'Illinois', fips: '17' },
  '18': { code: 'IN', name: 'Indiana', fips: '18' },
  '19': { code: 'IA', name: 'Iowa', fips: '19' },
  '20': { code: 'KS', name: 'Kansas', fips: '20' },
  '21': { code: 'KY', name: 'Kentucky', fips: '21' },
  '22': { code: 'LA', name: 'Louisiana', fips: '22' },
  '23': { code: 'ME', name: 'Maine', fips: '23' },
  '24': { code: 'MD', name: 'Maryland', fips: '24' },
  '25': { code: 'MA', name: 'Massachusetts', fips: '25' },
  '26': { code: 'MI', name: 'Michigan', fips: '26' },
  '27': { code: 'MN', name: 'Minnesota', fips: '27' },
  '28': { code: 'MS', name: 'Mississippi', fips: '28' },
  '29': { code: 'MO', name: 'Missouri', fips: '29' },
  '30': { code: 'MT', name: 'Montana', fips: '30' },
  '31': { code: 'NE', name: 'Nebraska', fips: '31' },
  '32': { code: 'NV', name: 'Nevada', fips: '32' },
  '33': { code: 'NH', name: 'New Hampshire', fips: '33' },
  '34': { code: 'NJ', name: 'New Jersey', fips: '34' },
  '35': { code: 'NM', name: 'New Mexico', fips: '35' },
  '36': { code: 'NY', name: 'New York', fips: '36' },
  '37': { code: 'NC', name: 'North Carolina', fips: '37' },
  '38': { code: 'ND', name: 'North Dakota', fips: '38' },
  '39': { code: 'OH', name: 'Ohio', fips: '39' },
  '40': { code: 'OK', name: 'Oklahoma', fips: '40' },
  '41': { code: 'OR', name: 'Oregon', fips: '41' },
  '42': { code: 'PA', name: 'Pennsylvania', fips: '42' },
  '44': { code: 'RI', name: 'Rhode Island', fips: '44' },
  '45': { code: 'SC', name: 'South Carolina', fips: '45' },
  '46': { code: 'SD', name: 'South Dakota', fips: '46' },
  '47': { code: 'TN', name: 'Tennessee', fips: '47' },
  '48': { code: 'TX', name: 'Texas', fips: '48' },
  '49': { code: 'UT', name: 'Utah', fips: '49' },
  '50': { code: 'VT', name: 'Vermont', fips: '50' },
  '51': { code: 'VA', name: 'Virginia', fips: '51' },
  '53': { code: 'WA', name: 'Washington', fips: '53' },
  '54': { code: 'WV', name: 'West Virginia', fips: '54' },
  '55': { code: 'WI', name: 'Wisconsin', fips: '55' },
  '56': { code: 'WY', name: 'Wyoming', fips: '56' },
  '72': { code: 'PR', name: 'Puerto Rico', fips: '72' }
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting comprehensive county population from Census Bureau API...');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const censusApiKey = Deno.env.get('CENSUS_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if counties already exist
    const { count: existingCount } = await supabase
      .from('counties')
      .select('*', { count: 'exact', head: true });

    if (existingCount && existingCount > 100) {
      console.log(`Counties already populated (${existingCount} records)`);
      return new Response(
        JSON.stringify({ 
          message: `Counties already populated with ${existingCount} records`,
          inserted: 0,
          total: existingCount
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all counties from Census Bureau API using the more comprehensive endpoint
    const apiUrl = censusApiKey 
      ? `https://api.census.gov/data/2021/pep/population?get=NAME,STATE&for=county:*&key=${censusApiKey}`
      : `https://api.census.gov/data/2021/pep/population?get=NAME,STATE&for=county:*`;
    
    console.log('Fetching counties from Census Bureau Population API...');
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Census API error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();
    console.log(`Received ${rawData.length} records from Census API`);

    // Skip header row and process data - Population API format: [NAME, STATE, state, county]
    const countyRecords = rawData.slice(1).map((row: string[]) => {
      const [countyName, stateFips, stateCode, countyCode] = row;
      const stateInfo = stateMapping[stateFips];
      
      if (!stateInfo) {
        console.warn(`Unknown state FIPS: ${stateFips} for county ${countyName}`);
        return null;
      }

      // Create FIPS code by combining state and county codes
      const fipsCode = `${stateFips}${countyCode.padStart(3, '0')}`;

      // Clean county name (remove "County" suffix if present)
      let cleanCountyName = countyName;
      if (cleanCountyName.endsWith(' County')) {
        cleanCountyName = cleanCountyName.replace(' County', '');
      }
      if (cleanCountyName.endsWith(' Parish')) {
        cleanCountyName = cleanCountyName.replace(' Parish', '');
      }
      if (cleanCountyName.endsWith(' Borough')) {
        cleanCountyName = cleanCountyName.replace(' Borough', '');
      }

      return {
        county_name: cleanCountyName,
        state_name: stateInfo.name,
        state_code: stateInfo.code,
        fips_code: fipsCode
      };
    }).filter(Boolean); // Remove null entries

    console.log(`Processed ${countyRecords.length} valid county records`);

    // Check for existing counties to avoid duplicates
    const { data: existingCounties } = await supabase
      .from('counties')
      .select('fips_code');

    const existingFips = new Set(existingCounties?.map(c => c.fips_code) || []);
    const newCounties = countyRecords.filter(county => !existingFips.has(county.fips_code));

    console.log(`Inserting ${newCounties.length} new counties...`);

    if (newCounties.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'All counties already exist in database',
          inserted: 0,
          total: existingCounties?.length || 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert counties in batches to avoid timeout
    const batchSize = 100;
    let totalInserted = 0;

    for (let i = 0; i < newCounties.length; i += batchSize) {
      const batch = newCounties.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(newCounties.length / batchSize)}...`);
      
      const { error } = await supabase
        .from('counties')
        .insert(batch);

      if (error) {
        console.error(`Batch insert error:`, error);
        throw error;
      }

      totalInserted += batch.length;
    }

    console.log(`Successfully inserted ${totalInserted} counties`);

    return new Response(
      JSON.stringify({
        message: `Successfully populated ${totalInserted} counties from Census Bureau API`,
        inserted: totalInserted,
        total: totalInserted + (existingCounties?.length || 0)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in populate-counties function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to populate counties from Census Bureau API',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});