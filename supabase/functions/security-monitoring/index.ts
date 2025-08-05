import { createClient } from 'jsr:@supabase/supabase-js@2'

// Security utilities (inline)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function sanitizeError(error: any): string {
  if (error.message?.includes('JWT') || error.message?.includes('auth')) {
    return 'Authentication failed';
  }
  if (error.message?.includes('database') || error.message?.includes('SQL')) {
    return 'Database operation failed';
  }
  return 'Service temporarily unavailable';
}

function checkRateLimit(identifier: string, limit: number = 20, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= limit) {
    return false;
  }
  
  entry.count++;
  return true;
}

async function authenticateUser(supabase: any, request: Request): Promise<{ user: any; error?: string }> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Authentication required' };
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return { user: null, error: 'Invalid authentication' };
    }
    
    return { user };
  } catch (error) {
    return { user: null, error: 'Authentication failed' };
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityMetricsRequest {
  time_range?: string; // '1h', '24h', '7d', '30d'
  severity_filter?: 'low' | 'medium' | 'high' | 'critical';
  event_types?: string[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting (stricter for monitoring endpoint)
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIP, 20, 60000)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Too many requests' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // Authenticate user - only admins should access security metrics
    const { user, error: authError } = await authenticateUser(supabase, req);
    
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Authentication required' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestBody = req.method === 'POST' ? await req.json() : {};
    const { time_range = '24h', severity_filter, event_types }: SecurityMetricsRequest = requestBody;

    // Calculate time range
    const now = new Date();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const startTime = new Date(now.getTime() - (timeRangeMs[time_range as keyof typeof timeRangeMs] || timeRangeMs['24h']));

    // Build query filters
    let query = supabase
      .from('security_audit_log')
      .select('*')
      .gte('created_at', startTime.toISOString())
      .order('created_at', { ascending: false });

    if (severity_filter) {
      query = query.eq('severity', severity_filter);
    }

    if (event_types && event_types.length > 0) {
      query = query.in('event_type', event_types);
    }

    const { data: securityLogs, error: logsError } = await query.limit(1000);

    if (logsError) {
      throw new Error(`Failed to fetch security logs: ${logsError.message}`);
    }

    // Generate security metrics
    const metrics = generateSecurityMetrics(securityLogs || []);

    // Get current system health
    const systemHealth = await getSystemHealth(supabase);

    // Recent critical alerts
    const { data: criticalAlerts } = await supabase
      .from('security_audit_log')
      .select('*')
      .eq('severity', 'critical')
      .gte('created_at', new Date(now.getTime() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('created_at', { ascending: false })
      .limit(10);

    const response = {
      success: true,
      time_range,
      metrics,
      system_health: systemHealth,
      critical_alerts: criticalAlerts || [],
      logs_sample: (securityLogs || []).slice(0, 50), // First 50 for detailed view
      generated_at: now.toISOString()
    };

    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      },
    });

  } catch (error) {
    console.error('Error in security monitoring:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: sanitizeError(error)
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      },
    });
  }
});

function generateSecurityMetrics(logs: any[]) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  // Event type distribution
  const eventTypes = logs.reduce((acc, log) => {
    acc[log.event_type] = (acc[log.event_type] || 0) + 1;
    return acc;
  }, {});

  // Severity distribution
  const severityDist = logs.reduce((acc, log) => {
    acc[log.severity] = (acc[log.severity] || 0) + 1;
    return acc;
  }, {});

  // Timeline analysis (hourly buckets for last 24h)
  const timeline = [];
  for (let i = 23; i >= 0; i--) {
    const hourStart = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const hourEnd = new Date(now.getTime() - ((i - 1) * 60 * 60 * 1000));
    
    const hourLogs = logs.filter(log => {
      const logTime = new Date(log.created_at);
      return logTime >= hourStart && logTime < hourEnd;
    });

    timeline.push({
      hour: hourStart.toISOString().substring(0, 13) + ':00',
      total_events: hourLogs.length,
      critical: hourLogs.filter(l => l.severity === 'critical').length,
      high: hourLogs.filter(l => l.severity === 'high').length,
      medium: hourLogs.filter(l => l.severity === 'medium').length,
      low: hourLogs.filter(l => l.severity === 'low').length
    });
  }

  // Top IP addresses by event count
  const ipAnalysis = logs.reduce((acc, log) => {
    const ip = log.ip_address || 'unknown';
    if (!acc[ip]) {
      acc[ip] = { count: 0, events: [] };
    }
    acc[ip].count++;
    acc[ip].events.push(log.event_type);
    return acc;
  }, {});

  const topIPs = Object.entries(ipAnalysis)
    .map(([ip, data]: [string, any]) => ({
      ip,
      event_count: data.count,
      unique_event_types: [...new Set(data.events)].length
    }))
    .sort((a, b) => b.event_count - a.event_count)
    .slice(0, 10);

  // Rate limiting analysis
  const rateLimitEvents = logs.filter(l => l.event_type === 'rate_limit_exceeded');
  const authFailures = logs.filter(l => l.event_type === 'authentication_failure');
  const functionErrors = logs.filter(l => l.event_type === 'function_error');

  // Recent hour analysis
  const recentLogs = logs.filter(log => new Date(log.created_at) >= oneHourAgo);

  return {
    total_events: logs.length,
    recent_hour_events: recentLogs.length,
    event_types: eventTypes,
    severity_distribution: severityDist,
    timeline,
    top_ips: topIPs,
    security_indicators: {
      rate_limit_violations: rateLimitEvents.length,
      authentication_failures: authFailures.length,
      function_errors: functionErrors.length,
      critical_events: logs.filter(l => l.severity === 'critical').length
    },
    trends: {
      events_per_hour: logs.length > 0 ? (logs.length / 24).toFixed(1) : '0',
      most_common_event: Object.entries(eventTypes).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'none',
      risk_level: calculateRiskLevel(logs)
    }
  };
}

function calculateRiskLevel(logs: any[]): string {
  const criticalCount = logs.filter(l => l.severity === 'critical').length;
  const highCount = logs.filter(l => l.severity === 'high').length;
  const authFailures = logs.filter(l => l.event_type === 'authentication_failure').length;
  const rateLimitViolations = logs.filter(l => l.event_type === 'rate_limit_exceeded').length;

  if (criticalCount > 5 || authFailures > 20 || rateLimitViolations > 50) {
    return 'HIGH';
  } else if (criticalCount > 0 || highCount > 10 || authFailures > 5) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}

async function getSystemHealth(supabase: any) {
  try {
    // Check database connectivity and recent activity
    const { data: recentActivity, error } = await supabase
      .from('subscription_usages')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
      .limit(1);

    const dbConnected = !error;
    const recentDbActivity = (recentActivity && recentActivity.length > 0);

    // Check rate limiting store health
    const rateLimitStoreSize = rateLimitStore.size;
    const rateLimitHealthy = rateLimitStoreSize < 1000; // Arbitrary threshold

    return {
      database_connected: dbConnected,
      recent_database_activity: recentDbActivity,
      rate_limit_store_healthy: rateLimitHealthy,
      rate_limit_entries: rateLimitStoreSize,
      last_check: new Date().toISOString(),
      overall_status: (dbConnected && rateLimitHealthy) ? 'HEALTHY' : 'DEGRADED'
    };
  } catch (error) {
    return {
      database_connected: false,
      recent_database_activity: false,
      rate_limit_store_healthy: false,
      rate_limit_entries: 0,
      last_check: new Date().toISOString(),
      overall_status: 'ERROR',
      error: sanitizeError(error)
    };
  }
}