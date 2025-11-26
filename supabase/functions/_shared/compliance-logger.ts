/**
 * Compliance Logging Utilities
 * Activates and manages the comprehensive audit log infrastructure
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';

export interface ComplianceLogEntry {
  table_name: string;
  operation: string;
  user_id?: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
  changed_fields?: string[];
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  compliance_tags?: string[];
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
}

export interface SOC2ComplianceCheck {
  check_type: 'automated' | 'manual' | 'scheduled';
  check_name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  details?: any;
  compliance_score?: number;
  remediation_actions?: string[];
}

/**
 * Log a comprehensive audit entry
 */
export async function logComplianceAudit(
  supabase: any,
  entry: ComplianceLogEntry
): Promise<void> {
  try {
    await supabase.from('comprehensive_audit_log').insert({
      table_name: entry.table_name,
      operation: entry.operation,
      user_id: entry.user_id,
      record_id: entry.record_id,
      old_values: entry.old_values,
      new_values: entry.new_values,
      changed_fields: entry.changed_fields,
      risk_level: entry.risk_level || 'medium',
      compliance_tags: entry.compliance_tags || [],
      metadata: entry.metadata || {},
      ip_address: entry.ip_address,
      user_agent: entry.user_agent,
      session_id: entry.session_id,
    });
  } catch (error) {
    console.error('[COMPLIANCE] Failed to log audit entry:', error);
  }
}

/**
 * Log SOC2 compliance check
 */
export async function logSOC2ComplianceCheck(
  supabase: any,
  check: SOC2ComplianceCheck
): Promise<void> {
  try {
    await supabase.from('soc2_compliance_checks').insert({
      check_type: check.check_type,
      check_name: check.check_name,
      status: check.status,
      details: check.details,
      compliance_score: check.compliance_score,
      remediation_actions: check.remediation_actions || [],
      last_checked_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[COMPLIANCE] Failed to log SOC2 check:', error);
  }
}

/**
 * Log data access for compliance
 */
export async function logDataAccess(
  supabase: any,
  {
    user_id,
    table_name,
    record_id,
    access_type,
    ip_address,
    user_agent,
  }: {
    user_id?: string;
    table_name: string;
    record_id?: string;
    access_type: 'read' | 'write' | 'delete';
    ip_address?: string;
    user_agent?: string;
  }
): Promise<void> {
  await logComplianceAudit(supabase, {
    table_name,
    operation: `DATA_ACCESS_${access_type.toUpperCase()}`,
    user_id,
    record_id,
    risk_level: access_type === 'delete' ? 'high' : 'medium',
    compliance_tags: ['DATA_ACCESS', 'AUDIT_TRAIL', access_type.toUpperCase()],
    metadata: {
      access_timestamp: new Date().toISOString(),
      access_type,
    },
    ip_address,
    user_agent,
  });
}

/**
 * Log external API call for compliance
 */
export async function logExternalAPICall(
  supabase: any,
  {
    provider,
    endpoint,
    user_id,
    success,
    cost_usd,
    response_time_ms,
    error_message,
  }: {
    provider: string;
    endpoint: string;
    user_id?: string;
    success: boolean;
    cost_usd?: number;
    response_time_ms?: number;
    error_message?: string;
  }
): Promise<void> {
  await logComplianceAudit(supabase, {
    table_name: 'external_api_calls',
    operation: 'API_CALL',
    user_id,
    risk_level: success ? 'low' : 'medium',
    compliance_tags: ['API_USAGE', 'COST_TRACKING', provider.toUpperCase()],
    metadata: {
      provider,
      endpoint,
      success,
      cost_usd,
      response_time_ms,
      error_message,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Run automated compliance scan
 */
export async function runComplianceScan(supabase: any): Promise<{
  score: number;
  issues: string[];
  recommendations: string[];
}> {
  try {
    // Check RLS compliance
    const { data: rlsData } = await supabase.rpc('check_rls_compliance');
    
    // Check SOC2 compliance
    const { data: soc2Data } = await supabase.rpc('generate_soc2_compliance_report');
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Analyze RLS compliance
    if (rlsData) {
      const criticalIssues = rlsData.filter((r: any) => r.risk_level === 'CRITICAL');
      const highRiskIssues = rlsData.filter((r: any) => r.risk_level === 'HIGH');
      
      score -= criticalIssues.length * 10;
      score -= highRiskIssues.length * 5;

      if (criticalIssues.length > 0) {
        issues.push(`${criticalIssues.length} tables without RLS enabled`);
        recommendations.push('Enable RLS on all public tables immediately');
      }

      if (highRiskIssues.length > 0) {
        issues.push(`${highRiskIssues.length} tables with overly permissive policies`);
        recommendations.push('Review and tighten RLS policies');
      }
    }

    // Log the scan
    await logSOC2ComplianceCheck(supabase, {
      check_type: 'automated',
      check_name: 'Comprehensive Compliance Scan',
      status: 'completed',
      compliance_score: Math.max(0, score),
      details: {
        rls_compliance: rlsData,
        soc2_compliance: soc2Data,
        scan_timestamp: new Date().toISOString(),
      },
      remediation_actions: recommendations,
    });

    return {
      score: Math.max(0, score),
      issues,
      recommendations,
    };
  } catch (error) {
    console.error('[COMPLIANCE] Scan failed:', error);
    return {
      score: 0,
      issues: ['Compliance scan failed'],
      recommendations: ['Investigate scan failure and retry'],
    };
  }
}
