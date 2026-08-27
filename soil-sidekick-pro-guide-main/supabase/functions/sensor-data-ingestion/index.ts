import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// HIVEMQ Configuration
const HIVEMQ_HOST = '5b63a89881fd46d9af394bf11bb4206b.s1.eu.hivemq.cloud';
const HIVEMQ_PORT = 8883;
const HIVEMQ_USERNAME = 'Vallc200';
const HIVEMQ_PASSWORD = Deno.env.get('HIVEMQ_PASSWORD');

// Validation Schema for Skyline Sensor Data
const SensorReadingSchema = z.object({
  metric: z.string(),
  value: z.number(),
  unit: z.string(),
  confidence: z.number().min(0).max(1).optional(),
  timestamp: z.string().datetime(),
});

const SensorDataPayloadSchema = z.object({
  device_id: z.string().min(1),
  device_type: z.enum(['mmwave_radar', 'quantum_rf', 'precision_timing']),
  timestamp: z.string().datetime(),
  readings: z.array(SensorReadingSchema).min(1),
  metadata: z.object({
    firmware_version: z.string(),
    battery_level: z.number().min(0).max(100).optional(),
    signal_strength: z.number().optional(),
  }),
});

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supabase Client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const ingestionId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    // Parse request body
    const rawBody = await req.json();

    // Validate payload
    const validationResult = SensorDataPayloadSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      // Log validation failure
      await logAuditEvent({
        ingestion_id: ingestionId,
        device_id: rawBody.device_id || 'unknown',
        validation_status: 'failed',
        error: validationResult.error.message,
        processing_time_ms: Date.now() - startTime,
      });

      return new Response(
        JSON.stringify({
          error: 'Invalid payload',
          details: validationResult.error.issues,
          ingestion_id: ingestionId,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const payload = validationResult.data;

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store sensor readings (batch insert for efficiency)
    const readingsToInsert = payload.readings.map(reading => ({
      device_id: payload.device_id,
      timestamp: reading.timestamp,
      metric: reading.metric,
      value: reading.value,
      unit: reading.unit,
      confidence: reading.confidence,
      received_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from('sensor_readings')
      .insert(readingsToInsert);

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    // Update device last_seen
    await supabase
      .from('sensor_devices')
      .upsert({
        device_id: payload.device_id,
        device_type: payload.device_type,
        firmware_version: payload.metadata.firmware_version,
        battery_level: payload.metadata.battery_level,
        signal_strength: payload.metadata.signal_strength,
        last_seen_at: new Date().toISOString(),
        status: 'active',
      }, {
        onConflict: 'device_id',
      });

    // Log successful ingestion
    await logAuditEvent({
      ingestion_id: ingestionId,
      device_id: payload.device_id,
      validation_status: 'success',
      readings_count: payload.readings.length,
      processing_time_ms: Date.now() - startTime,
    });

    // Return 202 Accepted (async processing complete)
    return new Response(
      JSON.stringify({
        ingestion_id: ingestionId,
        queued_at: new Date().toISOString(),
        processed_readings: payload.readings.length,
        estimated_processing_ms: Date.now() - startTime,
        status: 'success',
      }),
      {
        status: 202,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    // Log error
    await logAuditEvent({
      ingestion_id: ingestionId,
      device_id: 'unknown',
      validation_status: 'error',
      error: error.message,
      processing_time_ms: Date.now() - startTime,
    });

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        ingestion_id: ingestionId,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper function for audit logging
async function logAuditEvent(event: {
  ingestion_id: string;
  device_id: string;
  validation_status: string;
  error?: string;
  readings_count?: number;
  processing_time_ms: number;
}) {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabase.from('sensor_audit_log').insert({
      ingestion_id: event.ingestion_id,
      device_id: event.device_id,
      validation_status: event.validation_status,
      error_message: event.error,
      readings_count: event.readings_count,
      processing_time_ms: event.processing_time_ms,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Failed to log audit event:', e);
  }
}
