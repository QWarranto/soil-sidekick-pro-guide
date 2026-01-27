import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate, Link } from 'react-router-dom';

export default function PricingNew() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(priceId);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'month',
      description: 'Basic data access with limited features and community support',
      icon: Shield,
      features: [
        'Basic data access',
        'Limited features',
        'Community support'
      ],
      limitations: [
        'No AI analysis',
        'No visual crop analysis',
        'No priority support',
        'No ADAPT integration'
      ],
      cta: 'Get Started Free',
      popular: false,
      priceId: null
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '$29',
      period: 'month',
      description: 'Professional-grade analysis with unlimited counties, enhanced reporting, and expert consultation support',
      icon: Zap,
      features: [
        'Unlimited county access with smart caching',
        'AI-powered soil & water analysis (10/month)',
        'Professional PDF & CSV export reports',
        'Smart seasonal planning calendar',
        'Unlimited seasonal task creation & tracking',
        'Task history tracking & field assignment',
        'Annual recurring tasks & email reminders',
        'Priority email support & expert consultation',
        'Basic field mapping and boundary tools',
        'Historical data tracking & trends',
        'Mobile-optimized dashboard access'
      ],
      limitations: [
        'Limited AI usage (10/month)',
        'No visual crop analysis',
        'No advanced task recurring patterns',
        'No task learnings or AI recommendations',
        'No ADAPT integration'
      ],
      cta: 'Start Starter Plan',
      popular: false,
      priceId: 'price_starter_monthly'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$79',
      period: 'month',
      description: 'Unlimited AI features with visual crop analysis and advanced task intelligence',
      icon: Crown,
      features: [
        'Unlimited AI-powered soil & water analysis',
        'Visual crop analysis with satellite data',
        'AI-powered VRT prescription maps',
        'Advanced analytics & carbon tracking',
        'Complete seasonal task management suite',
        'Advanced recurring tasks (seasonal/monthly/custom)',
        'Task completion learnings & AI recommendations',
        'Year-over-year task comparison & insights',
        'Task export & custom reporting',
        'Unlimited email reminders & notifications',
        'Priority support & consultation',
        'Full field mapping & boundary tools'
      ],
      limitations: [
        'Basic VRT export formats only',
        'No ADAPT integration',
        'No team collaboration features',
        'No API access'
      ],
      cta: 'Start Pro Plan',
      popular: true,
      priceId: 'price_pro_monthly'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$149',
      period: 'month',
      description: 'Complete solution with ADAPT integration, team collaboration, and API access',
      icon: Sparkles,
      features: [
        'Everything in Pro, plus:',
        'Full ADAPT Standard 1.0 integration',
        'VRT prescription map export (ADAPT, Shapefile, ISO-XML)',
        'Team task collaboration & assignment',
        'Custom task templates & workflows',
        'Task management API access',
        'Multi-user farm management',
        'Advanced team analytics & reporting',
        'Dedicated account manager',
        '99.9% SLA with enterprise support',
        'Custom integrations & white-label options'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      priceId: 'price_enterprise_monthly'
    }
  ];

  const getCurrentPlanStatus = (planId: string) => {
    if (!user) return null;
    if (subscription?.tier === planId) return 'current';
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">SoilSidekick Pro</span> Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Scale your agricultural success with AI-powered insights and comprehensive farm management tools
          </p>
          <div className="flex gap-4 justify-center mb-6">
            <Button variant="outline" onClick={() => window.location.href = '/features'}>
              View Detailed Feature Comparison
            </Button>
            <Button variant="outline" asChild>
              <Link to="/leafengines-api">
                <ArrowRight className="mr-2 h-4 w-4" />
                View API Documentation
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/developer-sandbox">
                Try Developer Sandbox
              </Link>
            </Button>
          </div>
          
          {subscription?.isTrialActive && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Free trial ends {new Date(subscription.trialEndsAt!).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const currentStatus = getCurrentPlanStatus(plan.id);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-primary border-2 shadow-lg' : ''} ${
                  currentStatus === 'current' ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                
                {currentStatus === 'current' && (
                  <Badge className="absolute -top-3 right-4 bg-green-500">
                    Current Plan
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                     <div className={`p-3 rounded-full ${
                      plan.id === 'free' ? 'bg-gray-100' :
                      plan.id === 'starter' ? 'bg-blue-100' :
                      plan.id === 'pro' ? 'bg-primary/10' : 'bg-purple-100'
                    }`}>
                       <Icon className={`h-6 w-6 ${
                         plan.id === 'free' ? 'text-gray-600' :
                         plan.id === 'starter' ? 'text-blue-600' :
                         plan.id === 'pro' ? 'text-primary' : 'text-purple-600'
                       }`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="font-semibold text-sm text-green-700">Included Features:</div>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="space-y-3 pt-3 border-t">
                      <div className="font-semibold text-sm text-red-700">Limitations:</div>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-red-500 mr-2 mt-0.5">×</span>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    className="w-full mt-6" 
                    variant={plan.popular ? "default" : "outline"}
                    disabled={loading === plan.priceId || currentStatus === 'current'}
                    onClick={() => {
                      if (plan.id === 'free' && !user) {
                        navigate('/auth');
                      } else if (plan.priceId) {
                        handleSubscribe(plan.priceId, plan.name);
                      }
                    }}
                  >
                    {loading === plan.priceId ? (
                      'Loading...'
                    ) : currentStatus === 'current' ? (
                      'Current Plan'
                    ) : plan.id === 'free' && !user ? (
                      <>Sign Up Free <ArrowRight className="ml-1 h-4 w-4" /></>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do I get API access?</h3>
                <p className="text-muted-foreground">
                  Generate a free sandbox key instantly from your <Link to="/api-keys" className="text-primary hover:underline">API Key Management</Link> dashboard. For production use, request access to paid tiers and our team will review your application.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground">
                  Yes! Cancel your subscription anytime with no cancellation fees. 
                  You'll retain access to Pro features until the end of your billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What makes SoilSidekick Pro different?</h3>
                <p className="text-muted-foreground">
                  We're the only platform combining real-time satellite data, AI-powered soil analysis, 
                  and carbon credit tracking in one simple interface. No GIS expertise required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Do you offer volume discounts?</h3>
                <p className="text-muted-foreground">
                  Yes! Enterprise customers receive custom pricing based on farm size, number of users, 
                  and required integrations. Contact our sales team for a personalized quote.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}