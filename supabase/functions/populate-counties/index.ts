import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Comprehensive county data for major US states
    const sampleCounties = [
      // California
      { county_name: 'Los Angeles', state_name: 'California', state_code: 'CA', fips_code: '06037' },
      { county_name: 'San Diego', state_name: 'California', state_code: 'CA', fips_code: '06073' },
      { county_name: 'Orange', state_name: 'California', state_code: 'CA', fips_code: '06059' },
      { county_name: 'Riverside', state_name: 'California', state_code: 'CA', fips_code: '06065' },
      { county_name: 'San Bernardino', state_name: 'California', state_code: 'CA', fips_code: '06071' },
      { county_name: 'Santa Clara', state_name: 'California', state_code: 'CA', fips_code: '06085' },
      { county_name: 'Alameda', state_name: 'California', state_code: 'CA', fips_code: '06001' },
      { county_name: 'Sacramento', state_name: 'California', state_code: 'CA', fips_code: '06067' },
      { county_name: 'Fresno', state_name: 'California', state_code: 'CA', fips_code: '06019' },
      { county_name: 'Kern', state_name: 'California', state_code: 'CA', fips_code: '06029' },
      { county_name: 'San Francisco', state_name: 'California', state_code: 'CA', fips_code: '06075' },
      { county_name: 'Ventura', state_name: 'California', state_code: 'CA', fips_code: '06111' },
      
      // Texas
      { county_name: 'Harris', state_name: 'Texas', state_code: 'TX', fips_code: '48201' },
      { county_name: 'Dallas', state_name: 'Texas', state_code: 'TX', fips_code: '48113' },
      { county_name: 'Tarrant', state_name: 'Texas', state_code: 'TX', fips_code: '48439' },
      { county_name: 'Bexar', state_name: 'Texas', state_code: 'TX', fips_code: '48029' },
      { county_name: 'Travis', state_name: 'Texas', state_code: 'TX', fips_code: '48453' },
      { county_name: 'Collin', state_name: 'Texas', state_code: 'TX', fips_code: '48085' },
      { county_name: 'Hidalgo', state_name: 'Texas', state_code: 'TX', fips_code: '48215' },
      { county_name: 'El Paso', state_name: 'Texas', state_code: 'TX', fips_code: '48141' },
      { county_name: 'Fort Bend', state_name: 'Texas', state_code: 'TX', fips_code: '48157' },
      { county_name: 'Montgomery', state_name: 'Texas', state_code: 'TX', fips_code: '48339' },
      
      // Florida
      { county_name: 'Miami-Dade', state_name: 'Florida', state_code: 'FL', fips_code: '12086' },
      { county_name: 'Broward', state_name: 'Florida', state_code: 'FL', fips_code: '12011' },
      { county_name: 'Palm Beach', state_name: 'Florida', state_code: 'FL', fips_code: '12099' },
      { county_name: 'Hillsborough', state_name: 'Florida', state_code: 'FL', fips_code: '12057' },
      { county_name: 'Orange', state_name: 'Florida', state_code: 'FL', fips_code: '12095' },
      { county_name: 'Pinellas', state_name: 'Florida', state_code: 'FL', fips_code: '12103' },
      { county_name: 'Duval', state_name: 'Florida', state_code: 'FL', fips_code: '12031' },
      { county_name: 'Lee', state_name: 'Florida', state_code: 'FL', fips_code: '12071' },
      { county_name: 'Polk', state_name: 'Florida', state_code: 'FL', fips_code: '12105' },
      
      // New York
      { county_name: 'New York', state_name: 'New York', state_code: 'NY', fips_code: '36061' },
      { county_name: 'Kings', state_name: 'New York', state_code: 'NY', fips_code: '36047' },
      { county_name: 'Queens', state_name: 'New York', state_code: 'NY', fips_code: '36081' },
      { county_name: 'Suffolk', state_name: 'New York', state_code: 'NY', fips_code: '36103' },
      { county_name: 'Bronx', state_name: 'New York', state_code: 'NY', fips_code: '36005' },
      { county_name: 'Nassau', state_name: 'New York', state_code: 'NY', fips_code: '36059' },
      { county_name: 'Westchester', state_name: 'New York', state_code: 'NY', fips_code: '36119' },
      { county_name: 'Erie', state_name: 'New York', state_code: 'NY', fips_code: '36029' },
      { county_name: 'Monroe', state_name: 'New York', state_code: 'NY', fips_code: '36055' },
      
      // Pennsylvania
      { county_name: 'Philadelphia', state_name: 'Pennsylvania', state_code: 'PA', fips_code: '42101' },
      { county_name: 'Allegheny', state_name: 'Pennsylvania', state_code: 'PA', fips_code: '42003' },
      { county_name: 'Montgomery', state_name: 'Pennsylvania', state_code: 'PA', fips_code: '42091' },
      { county_name: 'Bucks', state_name: 'Pennsylvania', state_code: 'PA', fips_code: '42017' },
      { county_name: 'Chester', state_name: 'Pennsylvania', state_code: 'PA', fips_code: '42029' },
      { county_name: 'Delaware', state_name: 'Pennsylvania', state_code: 'PA', fips_code: '42045' },
      { county_name: 'Lancaster', state_name: 'Pennsylvania', state_code: 'PA', fips_code: '42071' },
      { county_name: 'York', state_name: 'Pennsylvania', state_code: 'PA', fips_code: '42133' },
      
      // Illinois
      { county_name: 'Cook', state_name: 'Illinois', state_code: 'IL', fips_code: '17031' },
      { county_name: 'DuPage', state_name: 'Illinois', state_code: 'IL', fips_code: '17043' },
      { county_name: 'Lake', state_name: 'Illinois', state_code: 'IL', fips_code: '17097' },
      { county_name: 'Will', state_name: 'Illinois', state_code: 'IL', fips_code: '17197' },
      { county_name: 'Kane', state_name: 'Illinois', state_code: 'IL', fips_code: '17089' },
      { county_name: 'McHenry', state_name: 'Illinois', state_code: 'IL', fips_code: '17111' },
      { county_name: 'Winnebago', state_name: 'Illinois', state_code: 'IL', fips_code: '17201' },
      
      // Ohio
      { county_name: 'Cuyahoga', state_name: 'Ohio', state_code: 'OH', fips_code: '39035' },
      { county_name: 'Franklin', state_name: 'Ohio', state_code: 'OH', fips_code: '39049' },
      { county_name: 'Hamilton', state_name: 'Ohio', state_code: 'OH', fips_code: '39061' },
      { county_name: 'Montgomery', state_name: 'Ohio', state_code: 'OH', fips_code: '39113' },
      { county_name: 'Summit', state_name: 'Ohio', state_code: 'OH', fips_code: '39153' },
      { county_name: 'Lucas', state_name: 'Ohio', state_code: 'OH', fips_code: '39095' },
      { county_name: 'Butler', state_name: 'Ohio', state_code: 'OH', fips_code: '39017' },
      
      // Georgia
      { county_name: 'Fulton', state_name: 'Georgia', state_code: 'GA', fips_code: '13121' },
      { county_name: 'Gwinnett', state_name: 'Georgia', state_code: 'GA', fips_code: '13135' },
      { county_name: 'DeKalb', state_name: 'Georgia', state_code: 'GA', fips_code: '13089' },
      { county_name: 'Cobb', state_name: 'Georgia', state_code: 'GA', fips_code: '13067' },
      { county_name: 'Clayton', state_name: 'Georgia', state_code: 'GA', fips_code: '13063' },
      { county_name: 'Cherokee', state_name: 'Georgia', state_code: 'GA', fips_code: '13057' },
      { county_name: 'Forsyth', state_name: 'Georgia', state_code: 'GA', fips_code: '13117' },
      
      // North Carolina
      { county_name: 'Mecklenburg', state_name: 'North Carolina', state_code: 'NC', fips_code: '37119' },
      { county_name: 'Wake', state_name: 'North Carolina', state_code: 'NC', fips_code: '37183' },
      { county_name: 'Guilford', state_name: 'North Carolina', state_code: 'NC', fips_code: '37081' },
      { county_name: 'Forsyth', state_name: 'North Carolina', state_code: 'NC', fips_code: '37067' },
      { county_name: 'Durham', state_name: 'North Carolina', state_code: 'NC', fips_code: '37063' },
      { county_name: 'Cumberland', state_name: 'North Carolina', state_code: 'NC', fips_code: '37051' },
      { county_name: 'Union', state_name: 'North Carolina', state_code: 'NC', fips_code: '37179' },
      
      // Michigan
      { county_name: 'Wayne', state_name: 'Michigan', state_code: 'MI', fips_code: '26163' },
      { county_name: 'Oakland', state_name: 'Michigan', state_code: 'MI', fips_code: '26125' },
      { county_name: 'Macomb', state_name: 'Michigan', state_code: 'MI', fips_code: '26099' },
      { county_name: 'Kent', state_name: 'Michigan', state_code: 'MI', fips_code: '26081' },
      { county_name: 'Genesee', state_name: 'Michigan', state_code: 'MI', fips_code: '26049' },
      { county_name: 'Washtenaw', state_name: 'Michigan', state_code: 'MI', fips_code: '26161' },
      { county_name: 'Ingham', state_name: 'Michigan', state_code: 'MI', fips_code: '26065' },
      
      // New Jersey
      { county_name: 'Bergen', state_name: 'New Jersey', state_code: 'NJ', fips_code: '34003' },
      { county_name: 'Middlesex', state_name: 'New Jersey', state_code: 'NJ', fips_code: '34023' },
      { county_name: 'Essex', state_name: 'New Jersey', state_code: 'NJ', fips_code: '34013' },
      { county_name: 'Hudson', state_name: 'New Jersey', state_code: 'NJ', fips_code: '34017' },
      { county_name: 'Monmouth', state_name: 'New Jersey', state_code: 'NJ', fips_code: '34025' },
      { county_name: 'Ocean', state_name: 'New Jersey', state_code: 'NJ', fips_code: '34029' },
      { county_name: 'Union', state_name: 'New Jersey', state_code: 'NJ', fips_code: '34039' },
      
      // Virginia
      { county_name: 'Fairfax', state_name: 'Virginia', state_code: 'VA', fips_code: '51059' },
      { county_name: 'Virginia Beach City', state_name: 'Virginia', state_code: 'VA', fips_code: '51810' },
      { county_name: 'Norfolk City', state_name: 'Virginia', state_code: 'VA', fips_code: '51710' },
      { county_name: 'Chesapeake City', state_name: 'Virginia', state_code: 'VA', fips_code: '51550' },
      { county_name: 'Prince William', state_name: 'Virginia', state_code: 'VA', fips_code: '51153' },
      { county_name: 'Loudoun', state_name: 'Virginia', state_code: 'VA', fips_code: '51107' },
      { county_name: 'Newport News City', state_name: 'Virginia', state_code: 'VA', fips_code: '51700' },
      
      // Washington
      { county_name: 'King', state_name: 'Washington', state_code: 'WA', fips_code: '53033' },
      { county_name: 'Pierce', state_name: 'Washington', state_code: 'WA', fips_code: '53053' },
      { county_name: 'Snohomish', state_name: 'Washington', state_code: 'WA', fips_code: '53061' },
      { county_name: 'Spokane', state_name: 'Washington', state_code: 'WA', fips_code: '53063' },
      { county_name: 'Clark', state_name: 'Washington', state_code: 'WA', fips_code: '53011' },
      { county_name: 'Thurston', state_name: 'Washington', state_code: 'WA', fips_code: '53067' },
      { county_name: 'Kitsap', state_name: 'Washington', state_code: 'WA', fips_code: '53035' },
      
      // Arizona
      { county_name: 'Maricopa', state_name: 'Arizona', state_code: 'AZ', fips_code: '04013' },
      { county_name: 'Pima', state_name: 'Arizona', state_code: 'AZ', fips_code: '04019' },
      { county_name: 'Pinal', state_name: 'Arizona', state_code: 'AZ', fips_code: '04021' },
      { county_name: 'Mohave', state_name: 'Arizona', state_code: 'AZ', fips_code: '04015' },
      { county_name: 'Yavapai', state_name: 'Arizona', state_code: 'AZ', fips_code: '04025' },
      { county_name: 'Coconino', state_name: 'Arizona', state_code: 'AZ', fips_code: '04005' },
      { county_name: 'Yuma', state_name: 'Arizona', state_code: 'AZ', fips_code: '04027' },
      
      // Massachusetts
      { county_name: 'Middlesex', state_name: 'Massachusetts', state_code: 'MA', fips_code: '25017' },
      { county_name: 'Worcester', state_name: 'Massachusetts', state_code: 'MA', fips_code: '25027' },
      { county_name: 'Essex', state_name: 'Massachusetts', state_code: 'MA', fips_code: '25009' },
      { county_name: 'Suffolk', state_name: 'Massachusetts', state_code: 'MA', fips_code: '25025' },
      { county_name: 'Norfolk', state_name: 'Massachusetts', state_code: 'MA', fips_code: '25021' },
      { county_name: 'Bristol', state_name: 'Massachusetts', state_code: 'MA', fips_code: '25005' },
      { county_name: 'Plymouth', state_name: 'Massachusetts', state_code: 'MA', fips_code: '25023' },
      
      // Tennessee
      { county_name: 'Shelby', state_name: 'Tennessee', state_code: 'TN', fips_code: '47157' },
      { county_name: 'Davidson', state_name: 'Tennessee', state_code: 'TN', fips_code: '47037' },
      { county_name: 'Knox', state_name: 'Tennessee', state_code: 'TN', fips_code: '47093' },
      { county_name: 'Hamilton', state_name: 'Tennessee', state_code: 'TN', fips_code: '47065' },
      { county_name: 'Rutherford', state_name: 'Tennessee', state_code: 'TN', fips_code: '47149' },
      { county_name: 'Williamson', state_name: 'Tennessee', state_code: 'TN', fips_code: '47187' },
      { county_name: 'Montgomery', state_name: 'Tennessee', state_code: 'TN', fips_code: '47125' },
      
      // Indiana
      { county_name: 'Marion', state_name: 'Indiana', state_code: 'IN', fips_code: '18097' },
      { county_name: 'Lake', state_name: 'Indiana', state_code: 'IN', fips_code: '18089' },
      { county_name: 'Allen', state_name: 'Indiana', state_code: 'IN', fips_code: '18003' },
      { county_name: 'Hamilton', state_name: 'Indiana', state_code: 'IN', fips_code: '18057' },
      { county_name: 'St. Joseph', state_name: 'Indiana', state_code: 'IN', fips_code: '18141' },
      { county_name: 'Vanderburgh', state_name: 'Indiana', state_code: 'IN', fips_code: '18163' },
      { county_name: 'Hendricks', state_name: 'Indiana', state_code: 'IN', fips_code: '18063' },
      
      // Missouri
      { county_name: 'St. Louis', state_name: 'Missouri', state_code: 'MO', fips_code: '29189' },
      { county_name: 'Jackson', state_name: 'Missouri', state_code: 'MO', fips_code: '29095' },
      { county_name: 'St. Charles', state_name: 'Missouri', state_code: 'MO', fips_code: '29183' },
      { county_name: 'Jefferson', state_name: 'Missouri', state_code: 'MO', fips_code: '29099' },
      { county_name: 'Clay', state_name: 'Missouri', state_code: 'MO', fips_code: '29047' },
      { county_name: 'Greene', state_name: 'Missouri', state_code: 'MO', fips_code: '29077' },
      { county_name: 'Platte', state_name: 'Missouri', state_code: 'MO', fips_code: '29165' },
      
      // Maryland
      { county_name: 'Montgomery', state_name: 'Maryland', state_code: 'MD', fips_code: '24031' },
      { county_name: 'Prince Georges', state_name: 'Maryland', state_code: 'MD', fips_code: '24033' },
      { county_name: 'Baltimore', state_name: 'Maryland', state_code: 'MD', fips_code: '24005' },
      { county_name: 'Anne Arundel', state_name: 'Maryland', state_code: 'MD', fips_code: '24003' },
      { county_name: 'Howard', state_name: 'Maryland', state_code: 'MD', fips_code: '24027' },
      { county_name: 'Baltimore City', state_name: 'Maryland', state_code: 'MD', fips_code: '24510' },
      { county_name: 'Harford', state_name: 'Maryland', state_code: 'MD', fips_code: '24025' },
      
      // Wisconsin
      { county_name: 'Milwaukee', state_name: 'Wisconsin', state_code: 'WI', fips_code: '55079' },
      { county_name: 'Dane', state_name: 'Wisconsin', state_code: 'WI', fips_code: '55025' },
      { county_name: 'Waukesha', state_name: 'Wisconsin', state_code: 'WI', fips_code: '55133' },
      { county_name: 'Brown', state_name: 'Wisconsin', state_code: 'WI', fips_code: '55009' },
      { county_name: 'Racine', state_name: 'Wisconsin', state_code: 'WI', fips_code: '55101' },
      { county_name: 'Outagamie', state_name: 'Wisconsin', state_code: 'WI', fips_code: '55087' },
      { county_name: 'Winnebago', state_name: 'Wisconsin', state_code: 'WI', fips_code: '55139' },
      
      // Minnesota
      { county_name: 'Hennepin', state_name: 'Minnesota', state_code: 'MN', fips_code: '27053' },
      { county_name: 'Ramsey', state_name: 'Minnesota', state_code: 'MN', fips_code: '27123' },
      { county_name: 'Dakota', state_name: 'Minnesota', state_code: 'MN', fips_code: '27037' },
      { county_name: 'Anoka', state_name: 'Minnesota', state_code: 'MN', fips_code: '27003' },
      { county_name: 'Washington', state_name: 'Minnesota', state_code: 'MN', fips_code: '27163' },
      { county_name: 'Olmsted', state_name: 'Minnesota', state_code: 'MN', fips_code: '27109' },
      { county_name: 'Scott', state_name: 'Minnesota', state_code: 'MN', fips_code: '27139' },
      
      // Colorado
      { county_name: 'Denver', state_name: 'Colorado', state_code: 'CO', fips_code: '08031' },
      { county_name: 'El Paso', state_name: 'Colorado', state_code: 'CO', fips_code: '08041' },
      { county_name: 'Jefferson', state_name: 'Colorado', state_code: 'CO', fips_code: '08059' },
      { county_name: 'Arapahoe', state_name: 'Colorado', state_code: 'CO', fips_code: '08005' },
      { county_name: 'Adams', state_name: 'Colorado', state_code: 'CO', fips_code: '08001' },
      { county_name: 'Boulder', state_name: 'Colorado', state_code: 'CO', fips_code: '08013' },
      { county_name: 'Larimer', state_name: 'Colorado', state_code: 'CO', fips_code: '08069' },
      
      // Alabama
      { county_name: 'Jefferson', state_name: 'Alabama', state_code: 'AL', fips_code: '01073' },
      { county_name: 'Mobile', state_name: 'Alabama', state_code: 'AL', fips_code: '01097' },
      { county_name: 'Madison', state_name: 'Alabama', state_code: 'AL', fips_code: '01089' },
      { county_name: 'Montgomery', state_name: 'Alabama', state_code: 'AL', fips_code: '01101' },
      { county_name: 'Tuscaloosa', state_name: 'Alabama', state_code: 'AL', fips_code: '01125' },
      { county_name: 'Baldwin', state_name: 'Alabama', state_code: 'AL', fips_code: '01003' },
      { county_name: 'Shelby', state_name: 'Alabama', state_code: 'AL', fips_code: '01117' },
      
      // South Carolina
      { county_name: 'Greenville', state_name: 'South Carolina', state_code: 'SC', fips_code: '45045' },
      { county_name: 'Richland', state_name: 'South Carolina', state_code: 'SC', fips_code: '45079' },
      { county_name: 'Charleston', state_name: 'South Carolina', state_code: 'SC', fips_code: '45019' },
      { county_name: 'Lexington', state_name: 'South Carolina', state_code: 'SC', fips_code: '45063' },
      { county_name: 'Spartanburg', state_name: 'South Carolina', state_code: 'SC', fips_code: '45083' },
      { county_name: 'Horry', state_name: 'South Carolina', state_code: 'SC', fips_code: '45051' },
      { county_name: 'York', state_name: 'South Carolina', state_code: 'SC', fips_code: '45091' },
      
      // Louisiana
      { county_name: 'Orleans', state_name: 'Louisiana', state_code: 'LA', fips_code: '22071' },
      { county_name: 'Jefferson', state_name: 'Louisiana', state_code: 'LA', fips_code: '22051' },
      { county_name: 'East Baton Rouge', state_name: 'Louisiana', state_code: 'LA', fips_code: '22033' },
      { county_name: 'Caddo', state_name: 'Louisiana', state_code: 'LA', fips_code: '22017' },
      { county_name: 'Lafayette', state_name: 'Louisiana', state_code: 'LA', fips_code: '22055' },
      { county_name: 'Calcasieu', state_name: 'Louisiana', state_code: 'LA', fips_code: '22019' },
      { county_name: 'Tangipahoa', state_name: 'Louisiana', state_code: 'LA', fips_code: '22105' },
      
      // Kentucky
      { county_name: 'Jefferson', state_name: 'Kentucky', state_code: 'KY', fips_code: '21111' },
      { county_name: 'Fayette', state_name: 'Kentucky', state_code: 'KY', fips_code: '21067' },
      { county_name: 'Kenton', state_name: 'Kentucky', state_code: 'KY', fips_code: '21117' },
      { county_name: 'Boone', state_name: 'Kentucky', state_code: 'KY', fips_code: '21015' },
      { county_name: 'Warren', state_name: 'Kentucky', state_code: 'KY', fips_code: '21227' },
      { county_name: 'Daviess', state_name: 'Kentucky', state_code: 'KY', fips_code: '21059' },
      { county_name: 'Campbell', state_name: 'Kentucky', state_code: 'KY', fips_code: '21037' },
      
      // Oregon
      { county_name: 'Multnomah', state_name: 'Oregon', state_code: 'OR', fips_code: '41051' },
      { county_name: 'Washington', state_name: 'Oregon', state_code: 'OR', fips_code: '41067' },
      { county_name: 'Clackamas', state_name: 'Oregon', state_code: 'OR', fips_code: '41005' },
      { county_name: 'Lane', state_name: 'Oregon', state_code: 'OR', fips_code: '41039' },
      { county_name: 'Marion', state_name: 'Oregon', state_code: 'OR', fips_code: '41047' },
      { county_name: 'Jackson', state_name: 'Oregon', state_code: 'OR', fips_code: '41029' },
      { county_name: 'Yamhill', state_name: 'Oregon', state_code: 'OR', fips_code: '41071' },
      
      // Oklahoma
      { county_name: 'Oklahoma', state_name: 'Oklahoma', state_code: 'OK', fips_code: '40109' },
      { county_name: 'Tulsa', state_name: 'Oklahoma', state_code: 'OK', fips_code: '40143' },
      { county_name: 'Cleveland', state_name: 'Oklahoma', state_code: 'OK', fips_code: '40027' },
      { county_name: 'Comanche', state_name: 'Oklahoma', state_code: 'OK', fips_code: '40031' },
      { county_name: 'Canadian', state_name: 'Oklahoma', state_code: 'OK', fips_code: '40017' },
      { county_name: 'Payne', state_name: 'Oklahoma', state_code: 'OK', fips_code: '40119' },
      { county_name: 'Rogers', state_name: 'Oklahoma', state_code: 'OK', fips_code: '40131' },
      
      // Connecticut
      { county_name: 'Fairfield', state_name: 'Connecticut', state_code: 'CT', fips_code: '09001' },
      { county_name: 'Hartford', state_name: 'Connecticut', state_code: 'CT', fips_code: '09003' },
      { county_name: 'New Haven', state_name: 'Connecticut', state_code: 'CT', fips_code: '09009' },
      { county_name: 'New London', state_name: 'Connecticut', state_code: 'CT', fips_code: '09011' },
      { county_name: 'Litchfield', state_name: 'Connecticut', state_code: 'CT', fips_code: '09005' },
      { county_name: 'Middlesex', state_name: 'Connecticut', state_code: 'CT', fips_code: '09007' },
      { county_name: 'Tolland', state_name: 'Connecticut', state_code: 'CT', fips_code: '09013' },
      
      // Iowa (Agricultural)
      { county_name: 'Polk', state_name: 'Iowa', state_code: 'IA', fips_code: '19153' },
      { county_name: 'Linn', state_name: 'Iowa', state_code: 'IA', fips_code: '19113' },
      { county_name: 'Scott', state_name: 'Iowa', state_code: 'IA', fips_code: '19163' },
      { county_name: 'Johnson', state_name: 'Iowa', state_code: 'IA', fips_code: '19103' },
      { county_name: 'Black Hawk', state_name: 'Iowa', state_code: 'IA', fips_code: '19013' },
      { county_name: 'Woodbury', state_name: 'Iowa', state_code: 'IA', fips_code: '19193' },
      { county_name: 'Dubuque', state_name: 'Iowa', state_code: 'IA', fips_code: '19061' },
      { county_name: 'Story', state_name: 'Iowa', state_code: 'IA', fips_code: '19169' },
      { county_name: 'Pottawattamie', state_name: 'Iowa', state_code: 'IA', fips_code: '19155' },
      { county_name: 'Dallas', state_name: 'Iowa', state_code: 'IA', fips_code: '19049' },
      
      // Arkansas
      { county_name: 'Pulaski', state_name: 'Arkansas', state_code: 'AR', fips_code: '05119' },
      { county_name: 'Washington', state_name: 'Arkansas', state_code: 'AR', fips_code: '05143' },
      { county_name: 'Benton', state_name: 'Arkansas', state_code: 'AR', fips_code: '05007' },
      { county_name: 'Jefferson', state_name: 'Arkansas', state_code: 'AR', fips_code: '05069' },
      { county_name: 'Faulkner', state_name: 'Arkansas', state_code: 'AR', fips_code: '05045' },
      { county_name: 'Craighead', state_name: 'Arkansas', state_code: 'AR', fips_code: '05031' },
      { county_name: 'Sebastian', state_name: 'Arkansas', state_code: 'AR', fips_code: '05131' },
      
      // Mississippi
      { county_name: 'Hinds', state_name: 'Mississippi', state_code: 'MS', fips_code: '28049' },
      { county_name: 'Harrison', state_name: 'Mississippi', state_code: 'MS', fips_code: '28047' },
      { county_name: 'DeSoto', state_name: 'Mississippi', state_code: 'MS', fips_code: '28033' },
      { county_name: 'Jackson', state_name: 'Mississippi', state_code: 'MS', fips_code: '28059' },
      { county_name: 'Madison', state_name: 'Mississippi', state_code: 'MS', fips_code: '28089' },
      { county_name: 'Rankin', state_name: 'Mississippi', state_code: 'MS', fips_code: '28121' },
      { county_name: 'Lee', state_name: 'Mississippi', state_code: 'MS', fips_code: '28081' },
      
      // Kansas
      { county_name: 'Johnson', state_name: 'Kansas', state_code: 'KS', fips_code: '20091' },
      { county_name: 'Sedgwick', state_name: 'Kansas', state_code: 'KS', fips_code: '20173' },
      { county_name: 'Shawnee', state_name: 'Kansas', state_code: 'KS', fips_code: '20177' },
      { county_name: 'Wyandotte', state_name: 'Kansas', state_code: 'KS', fips_code: '20209' },
      { county_name: 'Douglas', state_name: 'Kansas', state_code: 'KS', fips_code: '20045' },
      { county_name: 'Leavenworth', state_name: 'Kansas', state_code: 'KS', fips_code: '20103' },
      { county_name: 'Riley', state_name: 'Kansas', state_code: 'KS', fips_code: '20161' },
      
      // Nebraska
      { county_name: 'Douglas', state_name: 'Nebraska', state_code: 'NE', fips_code: '31055' },
      { county_name: 'Lancaster', state_name: 'Nebraska', state_code: 'NE', fips_code: '31109' },
      { county_name: 'Sarpy', state_name: 'Nebraska', state_code: 'NE', fips_code: '31153' },
      { county_name: 'Hall', state_name: 'Nebraska', state_code: 'NE', fips_code: '31079' },
      { county_name: 'Buffalo', state_name: 'Nebraska', state_code: 'NE', fips_code: '31019' },
      { county_name: 'Dodge', state_name: 'Nebraska', state_code: 'NE', fips_code: '31053' },
      { county_name: 'Lincoln', state_name: 'Nebraska', state_code: 'NE', fips_code: '31111' },
      
      // Nevada
      { county_name: 'Clark', state_name: 'Nevada', state_code: 'NV', fips_code: '32003' },
      { county_name: 'Washoe', state_name: 'Nevada', state_code: 'NV', fips_code: '32031' },
      { county_name: 'Carson City', state_name: 'Nevada', state_code: 'NV', fips_code: '32510' },
      { county_name: 'Lyon', state_name: 'Nevada', state_code: 'NV', fips_code: '32019' },
      { county_name: 'Nye', state_name: 'Nevada', state_code: 'NV', fips_code: '32023' },
      { county_name: 'Douglas', state_name: 'Nevada', state_code: 'NV', fips_code: '32005' },
      { county_name: 'Elko', state_name: 'Nevada', state_code: 'NV', fips_code: '32007' },
    ];

    console.log(`Populating ${sampleCounties.length} counties...`);

    // Check if counties already exist
    const { data: existingCounties } = await supabase
      .from('counties')
      .select('fips_code');

    const existingFips = new Set(existingCounties?.map(c => c.fips_code) || []);
    const newCounties = sampleCounties.filter(county => !existingFips.has(county.fips_code));

    if (newCounties.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'Counties already populated', 
          total: sampleCounties.length,
          existing: existingCounties?.length || 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert new counties
    const { data, error } = await supabase
      .from('counties')
      .insert(newCounties)
      .select();

    if (error) {
      console.error('Error inserting counties:', error);
      throw error;
    }

    console.log(`Successfully inserted ${data?.length || 0} new counties`);

    return new Response(
      JSON.stringify({ 
        message: 'Counties populated successfully',
        inserted: data?.length || 0,
        total: sampleCounties.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in populate-counties function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to populate counties' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});