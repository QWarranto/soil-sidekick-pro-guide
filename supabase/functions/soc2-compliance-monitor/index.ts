import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('SOC 2 Compliance Monitor function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user (admin required for compliance monitoring)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin
    const { data: userRoles, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');

    if (roleError || !userRoles || userRoles.length === 0) {
      console.error('Admin access required');
      return new Response(JSON.stringify({ error: 'Admin privileges required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, ...requestData } = await req.json();
    console.log('Processing action:', action);

    switch (action) {
      case 'run_compliance_check': {
        console.log('Running comprehensive SOC 2 compliance check');
        
        // Generate SOC 2 compliance report
        const { data: report, error: reportError } = await supabase
          .rpc('generate_soc2_compliance_report');

        if (reportError) {
          console.error('Error generating compliance report:', reportError);
          return new Response(JSON.stringify({ error: 'Failed to generate compliance report' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Get RLS compliance details
        const { data: rlsDetails, error: rlsError } = await supabase
          .rpc('check_rls_compliance');

        if (rlsError) {
          console.error('Error checking RLS compliance:', rlsError);
        }

        // Get recent security incidents
        const { data: incidents, error: incidentsError } = await supabase
          .from('security_incidents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (incidentsError) {
          console.error('Error fetching security incidents:', incidentsError);
        }

        // Get authentication security metrics
        const { data: authMetrics, error: authError } = await supabase
          .from('auth_security_log')
          .select('event_type, success, risk_score, created_at')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        if (authError) {
          console.error('Error fetching auth metrics:', authError);
        }

        const complianceResult = {
          ...report,
          detailed_findings: {
            rls_compliance: rlsDetails || [],
            recent_incidents: incidents || [],
            auth_security_metrics: {
              total_events: authMetrics?.length || 0,
              failed_logins: authMetrics?.filter(m => m.event_type === 'login_fail').length || 0,
              successful_logins: authMetrics?.filter(m => m.event_type === 'login_success').length || 0,
              high_risk_events: authMetrics?.filter(m => m.risk_score > 50).length || 0,
            }
          },
          last_updated: new Date().toISOString()
        };

        console.log('Compliance check completed successfully');
        return new Response(JSON.stringify(complianceResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_compliance_history': {
        console.log('Fetching compliance check history');
        
        const { data: history, error: historyError } = await supabase
          .from('soc2_compliance_checks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (historyError) {
          console.error('Error fetching compliance history:', historyError);
          return new Response(JSON.stringify({ error: 'Failed to fetch compliance history' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ history }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create_compliance_audit_entry': {
        console.log('Creating compliance audit entry');
        
        const {
          compliance_domain,
          control_objective,
          test_procedure,
          evidence_collected,
          finding_status,
          risk_level,
          corrective_actions,
          responsible_party,
          target_completion_date
        } = requestData;

        const { data: auditEntry, error: auditError } = await supabase
          .from('compliance_audit_log')
          .insert({
            user_id: user.id,
            compliance_domain,
            control_objective,
            test_procedure,
            evidence_collected,
            finding_status,
            risk_level,
            corrective_actions,
            responsible_party,
            target_completion_date
          })
          .select()
          .single();

        if (auditError) {
          console.error('Error creating audit entry:', auditError);
          return new Response(JSON.stringify({ error: 'Failed to create audit entry' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ audit_entry: auditEntry }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'schedule_compliance_monitoring': {
        console.log('Scheduling automated compliance monitoring');
        
        // Create scheduled compliance checks
        const scheduledChecks = [
          {
            check_type: 'automated',
            check_name: 'Daily RLS Policy Review',
            status: 'scheduled',
            next_check_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
            remediation_actions: ['Review RLS policies', 'Check for anonymous access']
          },
          {
            check_type: 'automated',
            check_name: 'Weekly Security Incident Review',
            status: 'scheduled',
            next_check_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            remediation_actions: ['Analyze security incidents', 'Update security measures']
          },
          {
            check_type: 'automated',
            check_name: 'Monthly Compliance Assessment',
            status: 'scheduled',
            next_check_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            remediation_actions: ['Generate comprehensive report', 'Review all controls']
          }
        ];

        const { data: scheduled, error: scheduleError } = await supabase
          .from('soc2_compliance_checks')
          .insert(scheduledChecks)
          .select();

        if (scheduleError) {
          console.error('Error scheduling compliance checks:', scheduleError);
          return new Response(JSON.stringify({ error: 'Failed to schedule compliance monitoring' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ scheduled_checks: scheduled }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        console.error('Unknown action:', action);
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Error in SOC 2 compliance monitor:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});