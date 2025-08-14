import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

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
      period: 'forever',
      description: 'Perfect for getting started with basic agricultural data',
      icon: Shield,
      features: [
        '50 county lookups per month',
        '2 PDF reports per month',
        'Basic soil data access',
        'Simple planting calendar',
        'Community support',
        '14-day trial of paid features'
      ],
      limitations: [
        'No AI soil analysis',
        'No visual crop analysis',
        'No carbon credit calculations',
        'Limited water quality data'
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
      description: 'Ideal for small farms and individual growers',
      icon: Zap,
      features: [
        'Everything in Free',
        '5 AI soil analyses per month',
        '3 carbon credit calculations',
        '200 county lookups per month',
        '10 PDF reports per month',
        '2 water quality tests',
        'Email support',
        '14-day free trial'
      ],
      limitations: [
        'No visual crop analysis',
        'Limited advanced features'
      ],
      cta: 'Start Free Trial',
      popular: true,
      priceId: 'price_starter_monthly'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$79',
      period: 'month',
      description: 'Perfect for commercial farms and agricultural consultants',
      icon: Crown,
      features: [
        'Everything in Starter',
        'Unlimited AI soil analyses',
        '50 visual crop analyses per month',
        'Unlimited county lookups',
        '100 PDF reports per month',
        '25 water quality tests',
        '50 carbon credit calculations',
        'Advanced analytics dashboard',
        'Priority email support',
        '14-day free trial'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: false,
      priceId: 'price_pro_monthly'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$149',
      period: 'month',
      description: 'For large farms and agricultural organizations',
      icon: Sparkles,
      features: [
        'Everything in Pro',
        'Unlimited all features',
        'ADAPT Standard 1.0 integration',
        'Custom feature development',
        'Dedicated account manager',
        'Phone support',
        'SLA guarantee',
        'Custom reporting',
        'White-label options'
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
                      plan.id === 'pro' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        plan.id === 'free' ? 'text-gray-600' :
                        plan.id === 'starter' ? 'text-blue-600' :
                        plan.id === 'pro' ? 'text-green-600' : 'text-purple-600'
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
                <h3 className="font-semibold mb-2">What happens during the free trial?</h3>
                <p className="text-muted-foreground">
                  All new accounts get a 14-day free trial with access to your chosen plan's features. 
                  After the trial, free users keep access to basic features with usage limits.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                  and billing is prorated.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What happens if I exceed my usage limits?</h3>
                <p className="text-muted-foreground">
                  When you reach your monthly limit, you'll be prompted to upgrade. Your data is never lost, 
                  and you can access all features immediately after upgrading.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What is ADAPT Standard 1.0 integration?</h3>
                <p className="text-muted-foreground">
                  ADAPT is the industry standard for agricultural data exchange. Our integration allows 
                  seamless data sharing with major farm management systems and equipment manufacturers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}