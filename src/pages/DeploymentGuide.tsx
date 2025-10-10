import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft, 
  Leaf, 
  LogOut,
  Rocket,
  Server,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Terminal,
  Globe,
  Lock,
  Eye,
  Bug,
  FileText
} from 'lucide-react';

const DeploymentGuide = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      {/* Header */}
      <header className="border-b glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackHome}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">SoilSidekick Pro</span>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 slide-in-up">
            <h1 className="text-4xl font-bold mb-4 text-white">
              <Rocket className="inline h-10 w-10 mb-2 mr-2" />
              Production Deployment Guide
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Complete guide to deploying, monitoring, and troubleshooting SoilSidekick Pro in production
            </p>
          </div>

          {/* Quick Reference Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="card-elevated">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Live in Minutes</CardTitle>
                    <CardDescription>One-click deployment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Deploy via Lovable dashboard - automatic SSL, CDN, and global distribution included.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-secondary" />
                  <div>
                    <CardTitle className="text-lg">Full Monitoring</CardTitle>
                    <CardDescription>Built-in observability</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Edge function logs, database analytics, auth tracking, and security audit trails.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-8 w-8 text-accent" />
                  <div>
                    <CardTitle className="text-lg">SOC 2 Ready</CardTitle>
                    <CardDescription>Enterprise security</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built-in compliance monitoring, encryption, audit logging, and access controls.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="deployment" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Deployment Tab */}
            <TabsContent value="deployment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-6 w-6" />
                    Production Deployment Steps
                  </CardTitle>
                  <CardDescription>
                    Deploy SoilSidekick Pro to production environment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="step1">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Step 1: Deploy via Lovable
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Deploy Your Application</h4>
                          <ol className="text-sm text-muted-foreground space-y-2">
                            <li>1. Click <strong>Publish</strong> button in top right of Lovable editor</li>
                            <li>2. Your app deploys to <code>yourproject.lovable.app</code></li>
                            <li>3. SSL certificate auto-provisions (HTTPS enabled)</li>
                            <li>4. Updates deploy automatically on each publish</li>
                          </ol>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                          <p className="text-sm text-blue-900 dark:text-blue-100">
                            <strong>Note:</strong> Your Supabase backend (wzgnxkoeqzvueypwzvyn) is already in production mode.
                            All edge functions and database tables are live.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="step2">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-blue-600" />
                          Step 2: Connect Custom Domain (Optional)
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Add Your Custom Domain</h4>
                          <ol className="text-sm text-muted-foreground space-y-2">
                            <li>1. Go to Project Settings → Domains in Lovable</li>
                            <li>2. Click <strong>Connect Domain</strong></li>
                            <li>3. Enter your domain (e.g., soilsidekickpro.com)</li>
                            <li>4. Add DNS records at your registrar:
                              <ul className="ml-6 mt-2 space-y-1">
                                <li>• Type: A</li>
                                <li>• Name: @ (root) or www</li>
                                <li>• Value: 185.158.133.1</li>
                              </ul>
                            </li>
                            <li>5. Wait for DNS propagation (up to 48 hours)</li>
                            <li>6. SSL auto-provisions via Let's Encrypt</li>
                          </ol>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900">
                          <p className="text-sm text-orange-900 dark:text-orange-100">
                            <strong>Requires:</strong> Paid Lovable plan to connect custom domains
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="step3">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-purple-600" />
                          Step 3: Verify Supabase Configuration
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Production Checklist</h4>
                          <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                              <div>
                                <strong>RLS Policies:</strong> Run security scan to verify Row Level Security on all tables
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                              <div>
                                <strong>Auth Settings:</strong> Configure email confirmations in Supabase Auth settings
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                              <div>
                                <strong>Edge Functions:</strong> Verify all 30+ functions deployed and configured
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                              <div>
                                <strong>Secrets:</strong> Ensure all API keys set in Supabase dashboard
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                              <div>
                                <strong>Backups:</strong> Enable automatic database backups
                              </div>
                            </li>
                          </ul>
                        </div>
                        <Button variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/settings/general', '_blank')}>
                          Open Supabase Dashboard
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Monitoring Tab */}
            <TabsContent value="monitoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-6 w-6" />
                    Production Monitoring Tools
                  </CardTitle>
                  <CardDescription>
                    Monitor performance, errors, and user activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Terminal className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Edge Function Logs</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Real-time logs for all 30+ edge functions with filtering and search
                      </p>
                      <Button size="sm" variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/functions', '_blank')}>
                        View Function Logs
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Database className="h-5 w-5 text-secondary" />
                        <h4 className="font-semibold">Database Analytics</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Query performance, slow queries, connection pool stats
                      </p>
                      <Button size="sm" variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/logs/postgres-logs', '_blank')}>
                        View DB Logs
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Lock className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold">Auth Activity</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Login attempts, failures, session events, rate limiting
                      </p>
                      <Button size="sm" variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/auth/users', '_blank')}>
                        View Auth Logs
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold">Audit Tables</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Query audit logs directly: auth_security_log, security_incidents
                      </p>
                      <Button size="sm" variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/sql/new', '_blank')}>
                        SQL Editor
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Useful SQL Queries</h4>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="bg-background p-2 rounded">
                        -- Recent trial login failures<br/>
                        SELECT * FROM auth_security_log<br/>
                        WHERE event_type = 'login_fail'<br/>
                        ORDER BY created_at DESC LIMIT 50;
                      </div>
                      <div className="bg-background p-2 rounded">
                        -- County lookup errors<br/>
                        SELECT * FROM security_incidents<br/>
                        WHERE endpoint LIKE '%county-lookup%'<br/>
                        ORDER BY created_at DESC;
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Troubleshooting Tab */}
            <TabsContent value="troubleshooting" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-6 w-6" />
                    Troubleshooting Common Issues
                  </CardTitle>
                  <CardDescription>
                    Solutions for production errors and debugging strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="county-lookup">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                          County Lookup Not Working
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="text-sm space-y-2">
                          <p className="font-semibold">Common Causes:</p>
                          <ul className="ml-6 space-y-1 text-muted-foreground">
                            <li>• RLS policies blocking access to counties table</li>
                            <li>• Edge function cold start delays</li>
                            <li>• Rate limiting or IP blocks</li>
                          </ul>

                          <p className="font-semibold mt-3">Debugging Steps:</p>
                          <ol className="ml-6 space-y-1 text-muted-foreground">
                            <li>1. Check edge function logs for errors</li>
                            <li>2. Verify RLS policies on counties table</li>
                            <li>3. Test with authenticated user</li>
                            <li>4. Check rate_limit_tracking table</li>
                          </ol>

                          <div className="bg-muted p-3 rounded mt-3">
                            <p className="font-mono text-xs">
                              Check logs at:<br/>
                              <a href="https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/functions/county-lookup/logs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                County Lookup Function Logs →
                              </a>
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="trial-login">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                          Trial User Login Errors
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="text-sm space-y-2">
                          <p className="font-semibold">Common Causes:</p>
                          <ul className="ml-6 space-y-1 text-muted-foreground">
                            <li>• Edge function cold starts (first click fails)</li>
                            <li>• JWT verification mismatches</li>
                            <li>• Trial record not created properly</li>
                            <li>• Expired trial periods</li>
                          </ul>

                          <p className="font-semibold mt-3">Debugging Steps:</p>
                          <ol className="ml-6 space-y-1 text-muted-foreground">
                            <li>1. Check trial-auth function logs</li>
                            <li>2. Query trial_users table for email</li>
                            <li>3. Verify trial_end dates</li>
                            <li>4. Check auth_security_log for failures</li>
                          </ol>

                          <div className="bg-muted p-3 rounded mt-3">
                            <p className="font-mono text-xs">
                              SELECT * FROM trial_users<br/>
                              WHERE email = 'user@example.com';
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="slow-performance">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-yellow-600" />
                          Slow Performance Issues
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="text-sm space-y-2">
                          <p className="font-semibold">Check These Areas:</p>
                          <ul className="ml-6 space-y-1 text-muted-foreground">
                            <li>• Database query performance (use EXPLAIN ANALYZE)</li>
                            <li>• Missing database indexes</li>
                            <li>• Edge function cold starts</li>
                            <li>• External API timeouts (EPA, USDA, Google Earth Engine)</li>
                            <li>• Large dataset transfers</li>
                          </ul>

                          <p className="font-semibold mt-3">Optimization Steps:</p>
                          <ol className="ml-6 space-y-1 text-muted-foreground">
                            <li>1. Add indexes on frequently queried columns</li>
                            <li>2. Enable caching for static data</li>
                            <li>3. Use materialized views for complex queries</li>
                            <li>4. Monitor cost_tracking table for expensive operations</li>
                          </ol>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-6 w-6" />
                    Security & Compliance
                  </CardTitle>
                  <CardDescription>
                    SOC 2 Type 1 compliance monitoring and security best practices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-4 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-2">SOC 2 Type 1 Compliant</h4>
                        <p className="text-sm text-muted-foreground">
                          SoilSidekick Pro is built with SOC 2 Type 1 security controls including:
                          encryption at rest/transit, comprehensive audit logging, RLS policies, and access controls.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Security Monitoring
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Real-time threat detection</li>
                        <li>• Automated security scans</li>
                        <li>• Audit trail compliance</li>
                        <li>• Failed login tracking</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Data Protection
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Payment data encryption (AES-256)</li>
                        <li>• Email address encryption</li>
                        <li>• Row Level Security (RLS)</li>
                        <li>• 7-year audit retention</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Run Security Compliance Checks</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use these SQL functions to verify security posture:
                    </p>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="bg-background p-2 rounded">
                        SELECT * FROM check_rls_compliance();
                      </div>
                      <div className="bg-background p-2 rounded">
                        SELECT generate_soc2_compliance_report();
                      </div>
                      <div className="bg-background p-2 rounded">
                        SELECT check_payment_data_security_compliance();
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Security Best Practices</h4>
                    <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                      <li>• Rotate API keys every 90 days</li>
                      <li>• Review security_incidents table weekly</li>
                      <li>• Enable email confirmations for new users</li>
                      <li>• Monitor failed login attempts</li>
                      <li>• Backup database regularly</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DeploymentGuide;
