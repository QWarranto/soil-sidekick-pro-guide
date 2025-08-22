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

    // Use reliable GPT models with fallback chain
    const openaiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('GPT5_API_KEY');
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let summary;
    let lastError;
    
    // Try GPT-4.1 first (most reliable)
    try {
      summary = await generateSummaryWithGPT4_1(reportType, reportData, openaiKey);
    } catch (gpt4_1Error) {
      console.log('GPT-4.1 failed, trying GPT-5:', gpt4_1Error);
      lastError = gpt4_1Error;
      
      // Fallback to GPT-5
      try {
        summary = await generateSummaryWithGPT5(reportType, reportData, openaiKey);
      } catch (gpt5Error) {
        console.log('GPT-5 failed, falling back to GPT-4o-mini:', gpt5Error);
        lastError = gpt5Error;
        
        // Final fallback to GPT-4o-mini
        try {
          summary = await generateSummaryWithGPT4Mini(reportType, reportData, openaiKey);
        } catch (finalError) {
          console.error('All models failed:', finalError);
          throw new Error(`All AI models failed. Last error: ${finalError.message}`);
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      summary,
      modelUsed: summary.modelUsed || 'gpt-4o' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in smart-report-summary:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateSummaryWithGPT4_1(reportType: string, reportData: any, apiKey: string) {
  const systemPrompt = reportType === 'soil' 
    ? getSoilReportSystemPrompt() 
    : getWaterQualitySystemPrompt();

  const userPrompt = reportType === 'soil'
    ? formatSoilReportData(reportData)
    : formatWaterQualityData(reportData);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_completion_tokens: 800
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GPT-4.1 API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    modelUsed: 'gpt-4.1-2025-04-14'
  };
}

async function generateSummaryWithGPT5(reportType: string, reportData: any, apiKey: string) {
  const systemPrompt = reportType === 'soil' 
    ? getSoilReportSystemPrompt() 
    : getWaterQualitySystemPrompt();

  const userPrompt = reportType === 'soil'
    ? formatSoilReportData(reportData)
    : formatWaterQualityData(reportData);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_completion_tokens: 800
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GPT-5 API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    modelUsed: 'gpt-5-mini-2025-08-07'
  };
}

async function generateSummaryWithGPT4Mini(reportType: string, reportData: any, apiKey: string) {
  const systemPrompt = reportType === 'soil' 
    ? getSoilReportSystemPrompt() 
    : getWaterQualitySystemPrompt();

  const userPrompt = reportType === 'soil'
    ? formatSoilReportData(reportData)
    : formatWaterQualityData(reportData);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GPT-4o-mini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    modelUsed: 'gpt-4o-mini'
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