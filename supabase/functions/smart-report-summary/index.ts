/**
 * Smart Report Summary Function
 * Migrated to requestHandler: December 7, 2025 (Phase 3A.3)
 */
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { requestHandler } from '../_shared/request-handler.ts';
import { reportSummarySchema } from '../_shared/validation.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

type ReportSummaryRequest = z.infer<typeof reportSummarySchema>;

requestHandler<ReportSummaryRequest>({
  requireAuth: true,
  requireSubscription: true,
  validationSchema: reportSummarySchema,
  rateLimit: {
    requests: 100,  // 100 summaries per hour
    windowMs: 60 * 60 * 1000,
  },
  handler: async ({ supabaseClient, user, validatedData, startTime }) => {
    const { reportType, reportData } = validatedData;

    // Use Lovable AI Gateway
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const summary = await generateSummaryWithLovableAI(reportType, reportData, lovableApiKey);

    // Track cost
    await supabaseClient.from('cost_tracking').insert({
      service_provider: 'lovable',
      service_type: 'gemini-2.5-flash',
      feature_name: 'smart-report-summary',
      user_id: user.id,
      cost_usd: 0.0005, // Approximate cost per summary
      usage_count: 1,
      request_details: {
        report_type: reportType,
        duration_ms: Date.now() - startTime,
      },
    });

    return { 
      summary,
      modelUsed: summary.modelUsed 
    };
  },
});

async function generateSummaryWithLovableAI(reportType: string, reportData: any, apiKey: string) {
  const systemPrompt = reportType === 'soil' 
    ? getSoilReportSystemPrompt() 
    : reportType === 'water'
    ? getWaterQualitySystemPrompt()
    : getEnvironmentalSystemPrompt();

  const userPrompt = reportType === 'soil'
    ? formatSoilReportData(reportData)
    : reportType === 'water'
    ? formatWaterQualityData(reportData)
    : formatEnvironmentalData(reportData);

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

function getEnvironmentalSystemPrompt(): string {
  return `You are an environmental impact expert generating executive summaries for environmental assessments.

Create a concise, professional executive summary that includes:
1. Overall environmental health assessment (1-2 sentences)
2. Key environmental risks and concerns (2-3 bullet points)
3. Sustainability recommendations (2-3 bullet points)
4. Regulatory and compliance implications (1-2 sentences)

Use clear, factual language suitable for agricultural operations, environmental regulators, and investors.`;
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

function formatEnvironmentalData(data: any): string {
  return `
ENVIRONMENTAL IMPACT DATA:
Location: ${data.county_fips || 'Unknown'}
Runoff Risk Score: ${data.runoff_risk_score || 'Not calculated'}
Contamination Risk: ${data.contamination_risk || 'Not assessed'}
Biodiversity Impact: ${data.biodiversity_impact || 'Not assessed'}
Carbon Footprint Score: ${data.carbon_footprint_score || 'Not calculated'}
Water Body Proximity: ${data.water_body_proximity ? `${data.water_body_proximity} km` : 'Unknown'}

Eco-Friendly Alternatives: ${JSON.stringify(data.eco_friendly_alternatives || [])}
`;
}
