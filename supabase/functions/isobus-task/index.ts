import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// ─── DDI Mappings (ISO 11783 Data Dictionary Identifiers) ───

const DDI_MAPPINGS: Record<string, { ddi: string; name: string; unit: string; resolution: number }> = {
  ApplicationRate:     { ddi: '0001', name: 'Setpoint Volume Per Area Application Rate', unit: 'mm³/m²', resolution: 0.01 },
  SeedRate:            { ddi: '0011', name: 'Setpoint Count Per Area Seeding Rate', unit: '/m²', resolution: 1 },
  Yield:               { ddi: '0074', name: 'Actual Mass Per Area Yield', unit: 'mg/m²', resolution: 1 },
  WorkingWidth:        { ddi: '0043', name: 'Actual Working Width', unit: 'mm', resolution: 1 },
  FuelConsumption:     { ddi: '008A', name: 'Instantaneous Fuel Consumption Per Area', unit: 'mm³/m²', resolution: 0.01 },
  NitrogenRate:        { ddi: '0002', name: 'Setpoint Mass Per Area Application Rate', unit: 'mg/m²', resolution: 1 },
  PhosphorusRate:      { ddi: '0002', name: 'Setpoint Mass Per Area Application Rate', unit: 'mg/m²', resolution: 1 },
  PotassiumRate:       { ddi: '0002', name: 'Setpoint Mass Per Area Application Rate', unit: 'mg/m²', resolution: 1 },
  SprayPressure:       { ddi: '004E', name: 'Setpoint Spray Application Pressure', unit: 'Pa', resolution: 1 },
  GroundSpeed:         { ddi: '0086', name: 'Machine Speed', unit: 'mm/s', resolution: 1 },
  WorkState:           { ddi: '0041', name: 'Actual Work State', unit: '', resolution: 1 },
}

// ─── ADAPT 1.0 Input Types ───

interface ADAPTInput {
  grower?: { id: string; name: string; contact?: string };
  farm?: { id: string; name: string; growerId?: string };
  field: {
    id: string;
    name: string;
    area_acres?: number;
    boundary?: { type: string; coordinates: number[][][] };
  };
  operation: {
    type: 'fertilizer_application' | 'seeding' | 'spraying' | 'harvest' | 'tillage' | 'custom';
    description?: string;
    startTime?: string;
    endTime?: string;
    product?: { name: string; rate: number; rateUnit: string; ddiKey?: string };
    prescriptionZones?: PrescriptionZone[];
  };
  equipment?: {
    id: string;
    name: string;
    workingWidth_m?: number;
    connectorType?: string;
  };
}

interface PrescriptionZone {
  zoneId: string;
  rate: number;
  rateUnit: string;
  geometry?: { type: string; coordinates: number[][][] };
  ddiKey?: string;
}

// ─── ISO-XML v4.3 Builder ───

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildTaskDataXml(input: ADAPTInput): string {
  const lines: string[] = []
  lines.push('<?xml version="1.0" encoding="UTF-8"?>')
  lines.push('<ISO11783_TaskData VersionMajor="4" VersionMinor="3" ManagementSoftwareManufacturer="SoilSidekick Pro" ManagementSoftwareVersion="1.0" DataTransferOrigin="1">')

  // CUS (Customer / Grower)
  const growerId = input.grower?.id || 'CUS-1'
  const growerName = input.grower?.name || 'Default Grower'
  lines.push(`  <CUS A="${escapeXml(growerId)}" B="${escapeXml(growerName)}" />`)

  // FRM (Farm)
  const farmId = input.farm?.id || 'FRM-1'
  const farmName = input.farm?.name || 'Default Farm'
  lines.push(`  <FRM A="${escapeXml(farmId)}" B="${escapeXml(farmName)}" I="${escapeXml(growerId)}" />`)

  // PFD (Partfield / Field)
  const fieldId = input.field.id
  const fieldName = input.field.name
  const areaValue = input.field.area_acres ? Math.round(input.field.area_acres * 4046.86) : 0 // acres → m²
  lines.push(`  <PFD A="${escapeXml(fieldId)}" C="${escapeXml(fieldName)}" D="${areaValue}" E="${escapeXml(farmId)}">`)

  // PLN (Polygon / Field Boundary)
  if (input.field.boundary?.coordinates) {
    lines.push('    <PLN A="1" B="1">')
    for (const ring of input.field.boundary.coordinates) {
      lines.push('      <LSG A="1">')
      for (const coord of ring) {
        const lat = Math.round(coord[1] * 1e7)
        const lng = Math.round(coord[0] * 1e7)
        lines.push(`        <PNT A="2" C="${lat}" D="${lng}" />`)
      }
      lines.push('      </LSG>')
    }
    lines.push('    </PLN>')
  }
  lines.push('  </PFD>')

  // PDT (Product)
  if (input.operation.product) {
    lines.push(`  <PDT A="PDT-1" B="${escapeXml(input.operation.product.name)}" />`)
  }

  // DVC (Device / Equipment)
  if (input.equipment) {
    lines.push(`  <DVC A="${escapeXml(input.equipment.id)}" B="${escapeXml(input.equipment.name)}" D="FF000000000000FF" F="00000000">`)
    if (input.equipment.workingWidth_m) {
      const widthMm = Math.round(input.equipment.workingWidth_m * 1000)
      lines.push(`    <DPD A="0043" B="${widthMm}" C="0043" />`)
    }
    lines.push('  </DVC>')
  }

  // TSK (Task)
  const taskStatus = input.operation.endTime ? '4' : '1' // 4=completed, 1=planned
  const opDesc = input.operation.description || `${input.operation.type} task`
  lines.push(`  <TSK A="TSK-1" B="${escapeXml(opDesc)}" G="${taskStatus}" E="${escapeXml(farmId)}" F="${escapeXml(fieldId)}">`)

  // OTP (Operation Tech Practice) 
  if (input.operation.startTime) {
    lines.push(`    <OTP A="${escapeXml(input.operation.startTime)}" />`)
  }

  // TLG (Time Log)
  if (input.operation.startTime) {
    lines.push(`    <TLG A="TLG00001" B="2">`)
    if (input.operation.product) {
      const ddiKey = input.operation.product.ddiKey || getDefaultDDI(input.operation.type)
      const ddi = DDI_MAPPINGS[ddiKey]?.ddi || '0001'
      lines.push(`      <DLV A="${ddi}" B="${Math.round(input.operation.product.rate)}" />`)
    }
    lines.push('    </TLG>')
  }

  // GRD (Grid / Prescription) for zones
  if (input.operation.prescriptionZones && input.operation.prescriptionZones.length > 0) {
    lines.push('    <GRD A="0" B="0" C="0" D="0" E="1" F="1" G="1" I="2">')
    for (const zone of input.operation.prescriptionZones) {
      const ddiKey = zone.ddiKey || input.operation.product?.ddiKey || getDefaultDDI(input.operation.type)
      const ddi = DDI_MAPPINGS[ddiKey]?.ddi || '0001'
      lines.push(`      <TZN A="${escapeXml(zone.zoneId)}">`)
      lines.push(`        <PDV A="${ddi}" B="${Math.round(zone.rate)}" E="PDT-1" />`)

      // Zone geometry
      if (zone.geometry?.coordinates) {
        lines.push('        <PLN A="1" B="6">')
        for (const ring of zone.geometry.coordinates) {
          lines.push('          <LSG A="1">')
          for (const coord of ring) {
            const lat = Math.round(coord[1] * 1e7)
            const lng = Math.round(coord[0] * 1e7)
            lines.push(`            <PNT A="2" C="${lat}" D="${lng}" />`)
          }
          lines.push('          </LSG>')
        }
        lines.push('        </PLN>')
      }
      lines.push('      </TZN>')
    }
    lines.push('    </GRD>')
  }

  lines.push('  </TSK>')
  lines.push('</ISO11783_TaskData>')

  return lines.join('\n')
}

function getDefaultDDI(operationType: string): string {
  const defaults: Record<string, string> = {
    fertilizer_application: 'ApplicationRate',
    seeding: 'SeedRate',
    spraying: 'ApplicationRate',
    harvest: 'Yield',
    tillage: 'WorkingWidth',
    custom: 'ApplicationRate',
  }
  return defaults[operationType] || 'ApplicationRate'
}

// ─── Validation ───

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateInput(input: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Input must be a JSON object'], warnings: [] }
  }

  const data = input as Record<string, unknown>

  // Field is required
  if (!data.field || typeof data.field !== 'object') {
    errors.push('field object is required')
  } else {
    const field = data.field as Record<string, unknown>
    if (!field.id || typeof field.id !== 'string') errors.push('field.id (string) is required')
    if (!field.name || typeof field.name !== 'string') errors.push('field.name (string) is required')
    if (field.boundary) {
      const b = field.boundary as Record<string, unknown>
      if (!b.coordinates || !Array.isArray(b.coordinates)) warnings.push('field.boundary.coordinates should be a coordinate array')
    }
  }

  // Operation is required
  if (!data.operation || typeof data.operation !== 'object') {
    errors.push('operation object is required')
  } else {
    const op = data.operation as Record<string, unknown>
    const validTypes = ['fertilizer_application', 'seeding', 'spraying', 'harvest', 'tillage', 'custom']
    if (!op.type || !validTypes.includes(op.type as string)) {
      errors.push(`operation.type must be one of: ${validTypes.join(', ')}`)
    }
    if (op.product) {
      const p = op.product as Record<string, unknown>
      if (!p.name) warnings.push('operation.product.name is recommended')
      if (p.rate === undefined) warnings.push('operation.product.rate is recommended')
    }
    if (op.prescriptionZones && Array.isArray(op.prescriptionZones)) {
      for (let i = 0; i < (op.prescriptionZones as unknown[]).length; i++) {
        const z = (op.prescriptionZones as Record<string, unknown>[])[i]
        if (!z.zoneId) errors.push(`prescriptionZones[${i}].zoneId is required`)
        if (z.rate === undefined) errors.push(`prescriptionZones[${i}].rate is required`)
      }
    }
  }

  // Optional checks
  if (!data.grower) warnings.push('grower is recommended for full ADAPT compliance')
  if (!data.farm) warnings.push('farm is recommended for full ADAPT compliance')
  if (!data.equipment) warnings.push('equipment info recommended for ISOBUS compatibility')

  return { valid: errors.length === 0, errors, warnings }
}

// ─── Main Handler ───

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname.split('/').filter(Boolean)
  const subRoute = path[path.length - 1]

  try {
    // GET /isobus-task/ddi-mappings — public, no auth needed
    if (req.method === 'GET' && subRoute === 'ddi-mappings') {
      return new Response(
        JSON.stringify({
          standard: 'ISO 11783 (ISOBUS)',
          version: '4.3',
          mappings: DDI_MAPPINGS,
          count: Object.keys(DDI_MAPPINGS).length,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Auth required for convert & validate
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token)

    if (claimsError || !claimsData?.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = claimsData.user.id

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use POST for convert/validate, GET for ddi-mappings.' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()

    // POST /isobus-task/validate
    if (subRoute === 'validate') {
      const result = validateInput(body)
      return new Response(
        JSON.stringify({
          ...result,
          standard: 'ADAPT 1.0 → ISO-XML v4.3',
          checkedAt: new Date().toISOString(),
        }),
        { status: result.valid ? 200 : 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /isobus-task — Convert ADAPT → ISO-XML
    const validation = validateInput(body)
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: validation.errors }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const format = url.searchParams.get('format') || 'xml'
    const xml = buildTaskDataXml(body as ADAPTInput)

    // Log usage
    await supabase.from('adapt_api_usage').insert({
      user_id: userId,
      endpoint: '/isobus-task',
      request_type: 'convert',
      data_type: 'iso_xml_v43',
      subscription_tier: 'api',
      success: true,
    }).catch(() => {}) // non-blocking

    if (format === 'json') {
      return new Response(
        JSON.stringify({
          success: true,
          standard: 'ISO 11783',
          version: '4.3',
          format: 'TASKDATA.XML',
          xml,
          warnings: validation.warnings,
          generatedAt: new Date().toISOString(),
          generatedBy: 'SoilSidekick Pro',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-ISO-Standard': 'ISO-11783-v4.3' } }
      )
    }

    // Default: return raw XML
    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Content-Disposition': 'attachment; filename="TASKDATA.XML"',
        'X-ISO-Standard': 'ISO-11783-v4.3',
      },
    })

  } catch (error) {
    console.error('isobus-task error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
