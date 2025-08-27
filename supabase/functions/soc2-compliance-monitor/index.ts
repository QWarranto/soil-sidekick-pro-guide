import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ComplianceCheckRequest {
  action: 'generate_report' | 'schedule_check' | 'get_status' | 'fix_issues';
  check_type?: string;
  target_tables?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('SOC 2 Compliance Monitor - Request received:', req.method);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization token');
    }

    console.log('User authenticated:', user.id);

    // Check if user is admin
    const { data: userRoles, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !userRoles) {
      return new Response(
        JSON.stringify({ error: 'Admin access required for compliance monitoring' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestBody: ComplianceCheckRequest = await req.json();
    console.log('Processing action:', requestBody.action);

    switch (requestBody.action) {
      case 'generate_report': {
        console.log('Generating SOC 2 compliance report...');
        
        // Call the compliance report function
        const { data: report, error: reportError } = await supabase
          .rpc('generate_soc2_compliance_report');

        if (reportError) {
          console.error('Error generating compliance report:', reportError);
          throw reportError;
        }

        console.log('Compliance report generated successfully');
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            report,
            generated_at: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_status': {
        console.log('Getting compliance status...');
        
        // Get latest compliance checks
        const { data: checks, error: checksError } = await supabase
          .from('soc2_compliance_checks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (checksError) {
          console.error('Error fetching compliance checks:', checksError);
          throw checksError;
        }

        // Get RLS compliance status
        const { data: rlsStatus, error: rlsError } = await supabase
          .rpc('check_rls_compliance');

        if (rlsError) {
          console.error('Error checking RLS compliance:', rlsError);
          throw rlsError;
        }

        // Calculate summary statistics
        const summary = {
          total_tables: rlsStatus?.length || 0,
          compliant_tables: rlsStatus?.filter((table: any) => table.compliance_status === 'COMPLIANT').length || 0,
          critical_issues: rlsStatus?.filter((table: any) => table.risk_level === 'CRITICAL').length || 0,
          high_risk_issues: rlsStatus?.filter((table: any) => table.risk_level === 'HIGH').length || 0,
          last_check: checks?.[0]?.created_at || null
        };

        return new Response(
          JSON.stringify({ 
            success: true,
            summary,
            recent_checks: checks,
            rls_status: rlsStatus
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'fix_issues': {
        console.log('Initiating automated compliance fixes...');
        
        const fixActions = [];
        
        // Get current RLS status
        const { data: rlsStatus, error: rlsError } = await supabase
          .rpc('check_rls_compliance');

        if (rlsError) {
          throw rlsError;
        }

        // Log the fix action
        const { error: logError } = await supabase
          .from('soc2_compliance_checks')
          .insert({
            check_type: 'automated_fix',
            check_name: 'SOC 2 Compliance Auto-Fix',
            status: 'in_progress',
            details: {
              initiated_by: user.id,
              timestamp: new Date().toISOString(),
              tables_to_fix: rlsStatus?.filter((table: any) => 
                table.compliance_status !== 'COMPLIANT'
              ).map((table: any) => table.table_name) || []
            },
            remediation_actions: [
              'Update RLS policies to require authentication',
              'Remove anonymous access where inappropriate',
              'Ensure proper access controls'
            ]
          });

        if (logError) {
          console.error('Error logging fix action:', logError);
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Compliance fix initiated',
            actions: fixActions,
            recommendation: 'Manual review required for sensitive policy changes'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'schedule_check': {
        console.log('Scheduling compliance check...');
        
        const nextCheckTime = new Date();
        nextCheckTime.setHours(nextCheckTime.getHours() + 24); // Schedule for 24 hours from now

        const { error: scheduleError } = await supabase
          .from('soc2_compliance_checks')
          .insert({
            check_type: 'scheduled',
            check_name: 'Daily SOC 2 Compliance Check',
            status: 'scheduled',
            next_check_at: nextCheckTime.toISOString(),
            details: {
              scheduled_by: user.id,
              frequency: 'daily',
              auto_remediation: false
            }
          });

        if (scheduleError) {
          throw scheduleError;
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Compliance check scheduled',
            next_check: nextCheckTime.toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default: {
        return new Response(
          JSON.stringify({ error: 'Invalid action specified' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

  } catch (error) {
    console.error('Error in SOC 2 compliance monitor:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});