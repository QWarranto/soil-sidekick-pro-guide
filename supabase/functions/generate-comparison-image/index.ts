import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authenticateApiKey, logSecurityEvent } from "../_shared/security-utils.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Authenticate using API key
    const authResult = await authenticateApiKey(supabase, req);
    
    if (authResult.error) {
      await logSecurityEvent(supabase, {
        event_type: "comparison_image_auth_failed",
        details: { error: authResult.error },
      }, req);
      
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = authResult.user?.id;
    console.log("Authenticated generate-comparison-image request", { userId });

    const { baseline, enhanced, plantName, metrics } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a compelling Before/After comparison infographic prompt
    const prompt = `Create a professional side-by-side "Before vs After" infographic comparing basic plant identification with LeafEngines enhanced identification.

LEFT SIDE (Before - Basic ID):
- Title: "Generic Plant ID"
- Plant identified: "${plantName}"
- Confidence: ${Math.round(baseline.confidence * 100)}%
- Simple text result only
- Plain, minimal design
- Muted colors, basic layout
- Single data point shown

RIGHT SIDE (After - LeafEngines):
- Title: "LeafEngines Enhanced"
- Plant identified: "${plantName}"
- Confidence: ${Math.round(enhanced.confidence * 100)}%
- Rich environmental data visualized
- Vibrant green and teal colors
- Show icons for: soil analysis, water quality, climate data, care recommendations
- Show "+${metrics.additionalDataPoints} data points" badge
- Professional, modern design with data visualization elements

Style: Clean infographic, professional business presentation quality, 16:9 aspect ratio landscape, white background, clear division between Before/After, use green accent colors for the enhanced side. Include leaf/plant iconography.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Image generation error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Image generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log cost tracking with authenticated user
    await supabase.from("cost_tracking").insert({
      service_provider: "lovable_ai",
      service_type: "image_generation",
      feature_name: "comparison_infographic",
      cost_usd: 0.01,
      usage_count: 1,
      user_id: userId,
      request_details: {
        plantName,
        baselineConfidence: baseline.confidence,
        enhancedConfidence: enhanced.confidence,
      },
    });

    // Log successful access
    await logSecurityEvent(supabase, {
      event_type: "comparison_image_success",
      details: { userId, plantName },
    }, req);

    return new Response(JSON.stringify({ 
      success: true, 
      imageUrl,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Image generation error:", error);
    
    await logSecurityEvent(supabase, {
      event_type: "comparison_image_error",
      details: { error: error.message },
    }, req);
    
    return new Response(JSON.stringify({ 
      error: "Image generation failed" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
