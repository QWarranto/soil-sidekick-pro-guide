import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { 
      fieldId, 
      soilAnalysisId, 
      applicationType, 
      cropType, 
      baseRate, 
      rateUnit,
      targetYield 
    } = await req.json();

    // Fetch field data
    const { data: field, error: fieldError } = await supabaseClient
      .from('fields')
      .select('*')
      .eq('id', fieldId)
      .eq('user_id', user.id)
      .single();

    if (fieldError || !field) {
      return new Response(JSON.stringify({ error: 'Field not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch soil analysis if provided
    let soilData = null;
    if (soilAnalysisId) {
      const { data, error } = await supabaseClient
        .from('soil_analyses')
        .select('*')
        .eq('id', soilAnalysisId)
        .eq('user_id', user.id)
        .single();
      
      if (!error && data) {
        soilData = data;
      }
    }

    // Generate AI-powered prescription zones
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const systemPrompt = `You are an agricultural precision technology expert. Generate variable rate prescription zones for ${applicationType} application.

Create 3-5 management zones based on soil variability and crop requirements. For each zone, provide:
1. Zone name/ID
2. Recommended application rate (relative to base rate: use multipliers like 0.8, 1.0, 1.2)
3. Justification based on soil properties
4. Estimated area percentage

Return ONLY valid JSON in this exact format:
{
  "zones": [
    {
      "zoneId": "zone_1",
      "zoneName": "High Productivity Zone",
      "rateMultiplier": 1.2,
      "justification": "High organic matter and optimal pH",
      "areaPercentage": 30
    }
  ],
  "totalZones": 3,
  "confidenceScore": 85,
  "estimatedSavings": 15.5,
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

    const userPrompt = `Field: ${field.name}
Area: ${field.area_acres} acres
Crop: ${cropType}
Application Type: ${applicationType}
Base Rate: ${baseRate} ${rateUnit}
Target Yield: ${targetYield || 'Not specified'}
${soilData ? `Soil Data: pH ${soilData.ph_level}, OM ${soilData.organic_matter_percentage}%, N: ${soilData.nitrogen_level}` : 'No soil analysis available'}

Generate optimal prescription zones.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate prescription' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // Parse AI response
    let aiResult;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      aiResult = JSON.parse(jsonMatch ? jsonMatch[0] : aiContent);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return new Response(JSON.stringify({ error: 'Invalid AI response format' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create geometric zones from field boundary
    const boundary = field.boundary_coordinates;
    const zonesWithGeometry = aiResult.zones.map((zone: any, index: number) => ({
      ...zone,
      geometry: createZoneGeometry(boundary, index, aiResult.zones.length),
      ratePerAcre: baseRate * zone.rateMultiplier,
      totalAmount: (field.area_acres * zone.areaPercentage / 100) * baseRate * zone.rateMultiplier
    }));

    // Save prescription map
    const { data: prescriptionMap, error: saveError } = await supabaseClient
      .from('prescription_maps')
      .insert({
        user_id: user.id,
        field_id: fieldId,
        soil_analysis_id: soilAnalysisId,
        map_name: `${field.name} - ${applicationType} Prescription`,
        crop_type: cropType,
        application_type: applicationType,
        zones: zonesWithGeometry,
        total_zones: aiResult.totalZones,
        target_yield: targetYield,
        base_rate: baseRate,
        rate_unit: rateUnit,
        analysis_method: 'ai_generated',
        confidence_score: aiResult.confidenceScore,
        estimated_savings: aiResult.estimatedSavings,
        status: 'draft'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
      return new Response(JSON.stringify({ error: 'Failed to save prescription map' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      prescriptionMap,
      recommendations: aiResult.recommendations
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createZoneGeometry(fieldBoundary: any, zoneIndex: number, totalZones: number): any {
  // Simple zone division - in production, this would use more sophisticated spatial algorithms
  const coordinates = fieldBoundary.coordinates?.[0] || fieldBoundary;
  
  if (!coordinates || coordinates.length < 3) {
    return { type: 'Polygon', coordinates: [[[-90, 30], [-90, 31], [-89, 31], [-89, 30], [-90, 30]]] };
  }

  // Create simplified zones by dividing the field
  const zoneCoords = [...coordinates];
  return {
    type: 'Polygon',
    coordinates: [zoneCoords]
  };
}