import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from '../_shared/cors.ts';
import {
  sanitizeError,
  getSecurityHeaders,
  logSecurityIncident,
  validateInput,
  type InputValidationRule,
  type SecurityIncident
} from '../_shared/security-utils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Threat detection patterns
const THREAT_PATTERNS = {
  sql_injection: [
    /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /(\bUNION\b|\bOR\b\s+1\s*=\s*1|\bAND\b\s+1\s*=\s*1)/i,
    /(--|\#|\/\*|\*\/)/,
    /(\bxp_cmdshell\b|\bsp_executesql\b)/i
  ],
  xss_attempt: [
    /<script[^>]*>/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe[^>]*>/i,
    /eval\s*\(/i,
    /expression\s*\(/i
  ],
  path_traversal: [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e%2f/i,
    /%2e%2e%5c/i,
    /\.\.\%2f/i,
    /\.\.\%5c/i
  ],
  command_injection: [
    /(\||&|;|\$\(|\`)/,
    /(\bwget\b|\bcurl\b|\bchmod\b|\brm\b|\bmv\b|\bcp\b)/i,
    /(\bcat\b|\bhead\b|\btail\b|\bless\b|\bmore\b)/i
  ],
  suspicious_headers: [
    'x-forwarded-host',
    'x-original-host',
    'x-rewrite-url'
  ]
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const url = new URL(req.url);
    const method = req.method;

    // Analyze request for threats
    const threats = await analyzeRequest(req);
    
    if (threats.length > 0) {
      // Log all detected threats
      for (const threat of threats) {
        await logSecurityIncident(supabase, threat, req);
      }

      // Determine response based on threat severity
      const highSeverityThreats = threats.filter(t => t.severity === 'critical' || t.severity === 'high');
      
      if (highSeverityThreats.length > 0) {
        return new Response(
          JSON.stringify({ 
            error: 'Request blocked due to security threats',
            incident_id: crypto.randomUUID()
          }),
          {
            status: 403,
            headers: getSecurityHeaders(corsHeaders)
          }
        );
      }
    }

    // If GET request, return threat detection summary
    if (method === 'GET') {
      return await handleGetThreatSummary();
    }

    // If POST request, analyze provided data
    if (method === 'POST') {
      return await handleThreatAnalysis(req);
    }

    return new Response(
      JSON.stringify({ message: 'Threat detection service active' }),
      {
        status: 200,
        headers: getSecurityHeaders(corsHeaders)
      }
    );

  } catch (error) {
    console.error('Threat detection error:', error);
    
    await logSecurityIncident(supabase, {
      incident_type: 'threat_detection_error',
      severity: 'high',
      endpoint: '/enhanced-threat-detection',
      incident_details: { error: error.message }
    }, req);

    return new Response(
      JSON.stringify({ error: sanitizeError(error) }),
      {
        status: 500,
        headers: getSecurityHeaders(corsHeaders)
      }
    );
  }
});

async function analyzeRequest(req: Request): Promise<SecurityIncident[]> {
  const threats: SecurityIncident[] = [];
  const url = new URL(req.url);
  const userAgent = req.headers.get('user-agent') || '';
  
  // Analyze URL for threats
  const urlThreats = detectThreatsInText(url.href, 'url');
  threats.push(...urlThreats);

  // Analyze headers for suspicious patterns
  const headerThreats = analyzeHeaders(req.headers);
  threats.push(...headerThreats);

  // Analyze user agent
  const userAgentThreats = analyzeUserAgent(userAgent);
  threats.push(...userAgentThreats);

  // Analyze request body if present
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const body = await req.clone().text();
      if (body) {
        const bodyThreats = detectThreatsInText(body, 'request_body');
        threats.push(...bodyThreats);
      }
    } catch {
      // Ignore body parsing errors for threat detection
    }
  }

  return threats;
}

function detectThreatsInText(text: string, source: string): SecurityIncident[] {
  const threats: SecurityIncident[] = [];

  // SQL Injection detection
  for (const pattern of THREAT_PATTERNS.sql_injection) {
    if (pattern.test(text)) {
      threats.push({
        incident_type: 'sql_injection_attempt',
        severity: 'critical',
        incident_details: { 
          source, 
          pattern: pattern.toString(),
          matched_text: text.substring(0, 100) // Limit logged text
        }
      });
    }
  }

  // XSS detection
  for (const pattern of THREAT_PATTERNS.xss_attempt) {
    if (pattern.test(text)) {
      threats.push({
        incident_type: 'xss_attempt',
        severity: 'high',
        incident_details: { 
          source, 
          pattern: pattern.toString(),
          matched_text: text.substring(0, 100)
        }
      });
    }
  }

  // Path traversal detection
  for (const pattern of THREAT_PATTERNS.path_traversal) {
    if (pattern.test(text)) {
      threats.push({
        incident_type: 'path_traversal_attempt',
        severity: 'high',
        incident_details: { 
          source, 
          pattern: pattern.toString(),
          matched_text: text.substring(0, 100)
        }
      });
    }
  }

  // Command injection detection
  for (const pattern of THREAT_PATTERNS.command_injection) {
    if (pattern.test(text)) {
      threats.push({
        incident_type: 'command_injection_attempt',
        severity: 'critical',
        incident_details: { 
          source, 
          pattern: pattern.toString(),
          matched_text: text.substring(0, 100)
        }
      });
    }
  }

  return threats;
}

function analyzeHeaders(headers: Headers): SecurityIncident[] {
  const threats: SecurityIncident[] = [];

  // Check for suspicious headers
  for (const suspiciousHeader of THREAT_PATTERNS.suspicious_headers) {
    if (headers.has(suspiciousHeader)) {
      threats.push({
        incident_type: 'suspicious_header',
        severity: 'medium',
        incident_details: { 
          header: suspiciousHeader,
          value: headers.get(suspiciousHeader)
        }
      });
    }
  }

  // Check for header injection attempts
  headers.forEach((value, name) => {
    if (value.includes('\n') || value.includes('\r') || value.includes('\0')) {
      threats.push({
        incident_type: 'header_injection_attempt',
        severity: 'high',
        incident_details: { 
          header: name,
          suspicious_chars: 'Contains newline or null characters'
        }
      });
    }
  });

  return threats;
}

function analyzeUserAgent(userAgent: string): SecurityIncident[] {
  const threats: SecurityIncident[] = [];

  // Known malicious user agents
  const maliciousUserAgents = [
    /sqlmap/i,
    /nessus/i,
    /nikto/i,
    /w3af/i,
    /acunetix/i,
    /netsparker/i,
    /burp/i,
    /masscan/i,
    /nmap/i
  ];

  for (const pattern of maliciousUserAgents) {
    if (pattern.test(userAgent)) {
      threats.push({
        incident_type: 'malicious_user_agent',
        severity: 'high',
        incident_details: { 
          user_agent: userAgent,
          pattern: pattern.toString()
        }
      });
    }
  }

  // Suspicious user agent patterns
  if (userAgent.length > 1000) {
    threats.push({
      incident_type: 'suspicious_user_agent',
      severity: 'medium',
      incident_details: { 
        reason: 'Unusually long user agent',
        length: userAgent.length
      }
    });
  }

  return threats;
}

async function handleGetThreatSummary() {
  try {
    // Get threat summary from the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: incidents, error } = await supabase
      .from('security_incidents')
      .select('incident_type, severity, created_at')
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Aggregate statistics
    const stats = {
      total_incidents: incidents.length,
      critical_incidents: incidents.filter(i => i.severity === 'critical').length,
      high_incidents: incidents.filter(i => i.severity === 'high').length,
      medium_incidents: incidents.filter(i => i.severity === 'medium').length,
      low_incidents: incidents.filter(i => i.severity === 'low').length,
      incident_types: {}
    };

    // Count by incident type
    incidents.forEach(incident => {
      stats.incident_types[incident.incident_type] = 
        (stats.incident_types[incident.incident_type] || 0) + 1;
    });

    return new Response(
      JSON.stringify({ 
        message: 'Threat detection summary for last 24 hours',
        statistics: stats,
        recent_incidents: incidents.slice(0, 10) // Last 10 incidents
      }),
      {
        status: 200,
        headers: getSecurityHeaders(corsHeaders)
      }
    );
  } catch (error) {
    throw new Error(`Failed to get threat summary: ${error.message}`);
  }
}

async function handleThreatAnalysis(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input
    const validationRules: InputValidationRule[] = [
      { field: 'text', type: 'string', required: true, maxLength: 10000 },
      { field: 'source', type: 'string', required: false, maxLength: 100 }
    ];

    const validation = validateInput(body, validationRules);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: validation.errors }),
        {
          status: 400,
          headers: getSecurityHeaders(corsHeaders)
        }
      );
    }

    const threats = detectThreatsInText(
      validation.sanitized.text, 
      validation.sanitized.source || 'user_input'
    );

    // Log detected threats
    for (const threat of threats) {
      await logSecurityIncident(supabase, threat, req);
    }

    return new Response(
      JSON.stringify({ 
        threats_detected: threats.length,
        threats: threats.map(t => ({
          type: t.incident_type,
          severity: t.severity,
          details: t.incident_details
        })),
        risk_level: calculateRiskLevel(threats)
      }),
      {
        status: 200,
        headers: getSecurityHeaders(corsHeaders)
      }
    );
  } catch (error) {
    throw new Error(`Failed to analyze threats: ${error.message}`);
  }
}

function calculateRiskLevel(threats: SecurityIncident[]): string {
  if (threats.some(t => t.severity === 'critical')) return 'critical';
  if (threats.some(t => t.severity === 'high')) return 'high';
  if (threats.some(t => t.severity === 'medium')) return 'medium';
  if (threats.length > 0) return 'low';
  return 'none';
}