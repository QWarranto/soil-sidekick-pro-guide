import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { reportType, reportData } = await req.json();

    if (!reportType || !reportData) {
      throw new Error('Missing reportType or reportData');
    }

    // Use Lovable AI Gateway
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const summary = await generateSummaryWithLovableAI(reportType, reportData, lovableApiKey);

    return new Response(JSON.stringify({ 
      success: true, 
      summary,
      modelUsed: summary.modelUsed 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in smart-report-summary:', error);
    
    // Handle rate limiting and payment errors
    if (error.message?.includes('429') || error.message?.includes('rate limit')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again in a moment.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (error.message?.includes('402') || error.message?.includes('payment')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'AI service requires additional credits. Please contact support.' 
      }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateSummaryWithLovableAI(reportType: string, reportData: any, apiKey: string) {
  const systemPrompt = reportType === 'soil' 
    ? getSoilReportSystemPrompt() 
    : getWaterQualitySystemPrompt();

  const userPrompt = reportType === 'soil'
    ? formatSoilReportData(reportData)
    : formatWaterQualityData(reportData);

  console.log(`Generating ${reportType} summary using Lovable AI Gateway`);

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Lovable AI Gateway error:', response.status, errorText);
    throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Summary generated successfully');
  
  return {
    content: data.choices[0].message.content,
    modelUsed: 'google/gemini-2.5-flash'
  };
}

function getSoilReportSystemPrompt(): string {
  return `You are an expert agricultural consultant generating executive summaries for soil analysis reports. 

Create a concise, professional executive summary that includes:
1. Overall soil health assessment (1-2 sentences)
2. Key findings and critical issues (2-3 bullet points)
3. Priority recommendations (2-3 bullet points)
4. Economic/business impact (1-2 sentences)

Use clear, actionable language suitable for farmers, landowners, and agricultural lenders. Focus on practical implications and ROI considerations.`;
}

function getWaterQualitySystemPrompt(): string {
  return `You are a water quality expert generating executive summaries for water quality reports.

Create a concise, professional executive summary that includes:
1. Overall water safety assessment (1-2 sentences)
2. Key contaminant findings and violations (2-3 bullet points)
3. Health considerations and recommendations (2-3 bullet points)
4. Property/lending implications (1-2 sentences)

Use clear, factual language suitable for property owners, agricultural operations, and lenders. Focus on health, safety, and property value implications.`;
}

function formatSoilReportData(data: any): string {
  return `
SOIL ANALYSIS DATA:
Location: ${data.county_name}, ${data.state_code}
pH Level: ${data.ph_level || 'Not available'}
Organic Matter: ${data.organic_matter || 'Not available'}%
Nitrogen: ${data.nitrogen_level || 'Not available'}
Phosphorus: ${data.phosphorus_level || 'Not available'}
Potassium: ${data.potassium_level || 'Not available'}
Current Recommendations: ${data.recommendations || 'None provided'}
Analysis Date: ${data.created_at}

Additional Data: ${JSON.stringify(data.analysis_data || {})}
`;
}

function formatWaterQualityData(data: any): string {
  const contaminants = data.contaminants || [];
  const violations = contaminants.filter((c: any) => c.violation);
  
  return `
WATER QUALITY DATA:
Utility: ${data.utility_name}
System ID: ${data.pwsid}
Source Type: ${data.source_type}
System Type: ${data.system_type}
Population Served: ${data.population_served?.toLocaleString() || 'Unknown'}
Overall Grade: ${data.grade}
Last Tested: ${data.last_tested}

CONTAMINANTS (${contaminants.length} tested):
${contaminants.map((c: any) => 
  `- ${c.name}: ${c.level} ${c.unit} (MCL: ${c.mcl} ${c.unit}) ${c.violation ? '⚠️ VIOLATION' : '✓ Safe'}`
).join('\n')}

VIOLATIONS: ${violations.length} found
Territory Type: ${data.territory_type}
Regulatory Authority: ${data.regulatory_authority}
`;
}
