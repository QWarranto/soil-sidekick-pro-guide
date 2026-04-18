import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticateUser } from "../_shared/security-utils.ts";

const sensorReadingSchema = z.object({
  sensor_id: z.string().min(1).max(100),
  field_id: z.string().max(100).optional(),
  timestamp: z.string().datetime().optional(),
  readings: z.object({
    moisture_percent: z.number().min(0).max(100).optional(),
    temperature_c: z.number().min(-50).max(80).optional(),
    ph: z.number().min(0).max(14).optional(),
    electrical_conductivity: z.number().min(0).optional(),
  }),
});

type SensorReading = z.infer<typeof sensorReadingSchema>;

interface QualityAssessment {
  sensor_id: string;
  drift_detected: boolean;
  drift_percentage: number | null;
  drift_details: Record<string, unknown> | null;
  staleness_warning: boolean;
  days_since_calibration: number | null;
  confidence_score: number;
  confidence_factors: string[];
  quality_grade: string;
  recommendations: string[];
}

// USDA reference ranges for sanity checks
const REFERENCE_RANGES = {
  moisture_percent: { min: 5, max: 95, typical_min: 15, typical_max: 75 },
  temperature_c: { min: -10, max: 55, typical_min: 2, typical_max: 40 },
  ph: { min: 3.5, max: 10, typical_min: 5.5, typical_max: 8.5 },
  electrical_conductivity: { min: 0, max: 16, typical_min: 0.1, typical_max: 4 },
};

const DRIFT_THRESHOLD_PERCENT = 10;
const CALIBRATION_WARNING_DAYS = 180;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Also support API key auth
    const apiKey = req.headers.get("x-api-key");

    let rawInput: unknown;
    try {
      rawInput = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Support single reading or batch
    const isBatch = Array.isArray(rawInput);
    const readings = isBatch ? rawInput : [rawInput];

    const results: QualityAssessment[] = [];

    for (const reading of readings) {
      const parsed = sensorReadingSchema.safeParse(reading);
      if (!parsed.success) {
        return new Response(JSON.stringify({
          error: "Validation failed",
          details: parsed.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", "),
        }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const assessment = await assessDataQuality(supabase, user.id, parsed.data);
      results.push(assessment);

      // Store assessment
      await supabase.from("sensor_data_quality").insert({
        user_id: user.id,
        sensor_id: parsed.data.sensor_id,
        field_id: parsed.data.field_id,
        reading_timestamp: parsed.data.timestamp || new Date().toISOString(),
        raw_values: parsed.data.readings,
        drift_detected: assessment.drift_detected,
        drift_percentage: assessment.drift_percentage,
        drift_details: assessment.drift_details,
        staleness_warning: assessment.staleness_warning,
        days_since_calibration: assessment.days_since_calibration,
        confidence_score: assessment.confidence_score,
        confidence_factors: assessment.confidence_factors,
        quality_grade: assessment.quality_grade,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      assessments: isBatch ? results : results[0],
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Sensor data quality error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function assessDataQuality(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  reading: SensorReading
): Promise<QualityAssessment> {
  const factors: string[] = [];
  const recommendations: string[] = [];
  let confidence = 100;
  let driftDetected = false;
  let driftPercentage: number | null = null;
  let driftDetails: Record<string, unknown> | null = null;
  let stalenessWarning = false;
  let daysSinceCalibration: number | null = null;

  // 1. Check calibration staleness
  const { data: calibration } = await supabase
    .from("sensor_calibration_log")
    .select("*")
    .eq("sensor_id", reading.sensor_id)
    .eq("user_id", userId)
    .eq("status", "active")
    .order("last_calibrated_at", { ascending: false })
    .limit(1)
    .single();

  if (calibration) {
    const lastCal = new Date(calibration.last_calibrated_at);
    const now = new Date();
    daysSinceCalibration = Math.floor((now.getTime() - lastCal.getTime()) / (1000 * 60 * 60 * 24));
    const interval = calibration.calibration_interval_days || CALIBRATION_WARNING_DAYS;

    if (daysSinceCalibration > interval) {
      stalenessWarning = true;
      const overdueDays = daysSinceCalibration - interval;
      // Degrade confidence by 2% per week overdue, max 40%
      const penalty = Math.min(40, Math.floor(overdueDays / 7) * 2);
      confidence -= penalty;
      factors.push(`Calibration overdue by ${overdueDays} days (-${penalty}% confidence)`);
      recommendations.push(`Recalibrate sensor ${reading.sensor_id} — last calibrated ${daysSinceCalibration} days ago`);
    } else if (daysSinceCalibration > interval * 0.8) {
      factors.push(`Calibration due in ${interval - daysSinceCalibration} days`);
      recommendations.push(`Schedule calibration for sensor ${reading.sensor_id} soon`);
    }
  } else {
    // No calibration record at all
    stalenessWarning = true;
    confidence -= 15;
    factors.push("No calibration record found (-15% confidence)");
    recommendations.push(`Register calibration for sensor ${reading.sensor_id}`);
  }

  // 2. Drift detection against historical baselines
  const { data: recentReadings } = await supabase
    .from("sensor_data_quality")
    .select("raw_values")
    .eq("sensor_id", reading.sensor_id)
    .eq("user_id", userId)
    .order("reading_timestamp", { ascending: false })
    .limit(20);

  if (recentReadings && recentReadings.length >= 5) {
    const driftResult = detectDrift(reading.readings, recentReadings.map(r => r.raw_values as Record<string, number>));
    if (driftResult.detected) {
      driftDetected = true;
      driftPercentage = driftResult.maxDrift;
      driftDetails = driftResult.details;
      const penalty = Math.min(30, Math.floor(driftResult.maxDrift / 5) * 5);
      confidence -= penalty;
      factors.push(`Drift detected: ${driftResult.maxDrift.toFixed(1)}% deviation (-${penalty}% confidence)`);
      recommendations.push(`Sensor ${reading.sensor_id} shows ${driftResult.maxDrift.toFixed(1)}% drift — verify readings against a reference instrument`);
    }
  }

  // 3. Range validation against USDA reference
  for (const [param, value] of Object.entries(reading.readings)) {
    if (value === undefined || value === null) continue;
    const ref = REFERENCE_RANGES[param as keyof typeof REFERENCE_RANGES];
    if (!ref) continue;

    if (value < ref.min || value > ref.max) {
      confidence -= 20;
      factors.push(`${param} (${value}) outside physical range [${ref.min}-${ref.max}] — likely sensor error`);
      recommendations.push(`Check ${param} sensor — reading of ${value} is physically implausible`);
    } else if (value < ref.typical_min || value > ref.typical_max) {
      confidence -= 5;
      factors.push(`${param} (${value}) outside typical range [${ref.typical_min}-${ref.typical_max}]`);
    }
  }

  confidence = Math.max(0, Math.min(100, confidence));
  const grade = confidence >= 90 ? "A" : confidence >= 75 ? "B" : confidence >= 60 ? "C" : confidence >= 40 ? "D" : "F";

  return {
    sensor_id: reading.sensor_id,
    drift_detected: driftDetected,
    drift_percentage: driftPercentage,
    drift_details: driftDetails,
    staleness_warning: stalenessWarning,
    days_since_calibration: daysSinceCalibration,
    confidence_score: confidence,
    confidence_factors: factors,
    quality_grade: grade,
    recommendations,
  };
}

function detectDrift(
  current: Record<string, number | undefined>,
  history: Record<string, number>[]
): { detected: boolean; maxDrift: number; details: Record<string, unknown> } {
  const details: Record<string, unknown> = {};
  let maxDrift = 0;

  for (const param of Object.keys(current)) {
    const currentVal = current[param];
    if (currentVal === undefined || currentVal === null) continue;

    const historicalValues = history
      .map(h => h[param])
      .filter((v): v is number => v !== undefined && v !== null);

    if (historicalValues.length < 3) continue;

    const mean = historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;
    if (mean === 0) continue;

    const deviation = Math.abs((currentVal - mean) / mean) * 100;
    details[param] = { current: currentVal, historical_mean: Number(mean.toFixed(2)), deviation_pct: Number(deviation.toFixed(1)) };

    if (deviation > DRIFT_THRESHOLD_PERCENT) {
      maxDrift = Math.max(maxDrift, deviation);
    }
  }

  return { detected: maxDrift > DRIFT_THRESHOLD_PERCENT, maxDrift: Number(maxDrift.toFixed(1)), details };
}
