/**
 * Security Monitoring Function - Migrated to requestHandler
 * Updated: December 4, 2025 - Phase 2B.5 QC Migration
 * 
 * Provides security metrics and monitoring dashboard with:
 * - Input validation via Zod schema
 * - Admin-only access (requires authentication)
 * - Rate limiting (prevents excessive monitoring queries)
 * - Comprehensive security event analysis
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { securityMonitoringSchema } from '../_shared/validation.ts';
import { logSafe, logError, sanitizeError } from '../_shared/logging-utils.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

requestHandler({
  // Requires authentication - only authenticated users can view security metrics
  requireAuth: true,
  
  // Validation schema
  validationSchema: securityMonitoringSchema,
  
  // Rate limiting: 20 requests per minute (monitoring can be frequent)
  rateLimit: {
    requests: 20,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Use service role for accessing security logs
  useServiceRole: true,
  
  handler: async (ctx) => {
    const { time_range, severity_filter, event_types } = ctx.validatedData;
    
    logSafe('Security monitoring request', { time_range, severity_filter });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Calculate time range
    const now = new Date();
    const timeRangeMs: Record<string, number> = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    
    const startTime = new Date(now.getTime() - (timeRangeMs[time_range] || timeRangeMs['24h']));

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
      .gte('created_at', new Date(now.getTime() - 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    logSafe('Security monitoring completed', { 
      logs_count: (securityLogs || []).length,
      critical_alerts: (criticalAlerts || []).length,
    });

    return {
      time_range,
      metrics,
      system_health: systemHealth,
      critical_alerts: criticalAlerts || [],
      logs_sample: (securityLogs || []).slice(0, 50),
      generated_at: now.toISOString(),
    };
  },
});

function generateSecurityMetrics(logs: any[]) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  // Event type distribution
  const eventTypes = logs.reduce((acc, log) => {
    acc[log.event_type] = (acc[log.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Severity distribution
  const severityDist = logs.reduce((acc, log) => {
    acc[log.severity] = (acc[log.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
      low: hourLogs.filter(l => l.severity === 'low').length,
    });
  }

  // Top IP addresses by event count
  const ipAnalysis = logs.reduce((acc, log) => {
    const ip = log.ip_address || 'unknown';
    if (!acc[ip]) {
      acc[ip] = { count: 0, events: [] as string[] };
    }
    acc[ip].count++;
    acc[ip].events.push(log.event_type);
    return acc;
  }, {} as Record<string, { count: number; events: string[] }>);

  const topIPs = Object.entries(ipAnalysis)
    .map(([ip, data]) => ({
      ip,
      event_count: data.count,
      unique_event_types: [...new Set(data.events)].length,
    }))
    .sort((a, b) => b.event_count - a.event_count)
    .slice(0, 10);

  // Security indicators
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
      critical_events: logs.filter(l => l.severity === 'critical').length,
    },
    trends: {
      events_per_hour: logs.length > 0 ? (logs.length / 24).toFixed(1) : '0',
      most_common_event: Object.entries(eventTypes).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'none',
      risk_level: calculateRiskLevel(logs),
    },
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
      .from('cost_tracking')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())
      .limit(1);

    const dbConnected = !error;
    const recentDbActivity = (recentActivity && recentActivity.length > 0);

    return {
      database_connected: dbConnected,
      recent_database_activity: recentDbActivity,
      last_check: new Date().toISOString(),
      overall_status: dbConnected ? 'HEALTHY' : 'DEGRADED',
    };
  } catch (error) {
    return {
      database_connected: false,
      recent_database_activity: false,
      last_check: new Date().toISOString(),
      overall_status: 'ERROR',
      error: 'Health check failed',
    };
  }
}
