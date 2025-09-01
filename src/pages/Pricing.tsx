import React, { useEffect, useState } from "react";
import { ArrowLeft, Check, Star, Zap, RefreshCw, Settings, Leaf, LogOut } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const { user, signOut, subscriptionData, refreshSubscription } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleBackHome = () => {
    navigate('/');
  };

  useEffect(() => {
    // Handle success/canceled redirects from Stripe
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Subscription successful!",
        description: "Welcome to your new plan. Refreshing subscription status...",
      });
      setTimeout(() => {
        refreshSubscription();
      }, 2000);
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        title: "Subscription canceled",
        description: "You can try again anytime.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast, refreshSubscription]);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Basic data access with limited features and community support',
      icon: <Leaf className="h-6 w-6" />,
      badge: 'Free',
      badgeVariant: 'secondary' as const,
      features: [
        'Basic data access',
        'Limited features',
        'Community support'
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 29,
      yearlyPrice: 290,
      description: 'Professional-grade analysis with unlimited counties, enhanced reporting, and expert consultation support',
      icon: <Zap className="h-6 w-6" />,
      badge: 'Popular',
      badgeVariant: 'default' as const,
      features: [
        'Unlimited county access with smart caching',
        'AI-powered soil & water analysis (10/month)',
        'Professional PDF & CSV export reports',
        'Smart seasonal planning calendar',
        'Priority email support & expert consultation',
        'Basic field mapping and boundary tools',
        'Historical data tracking & trends',
        'Mobile-optimized dashboard access'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 79,
      yearlyPrice: 790,
      description: 'Unlimited AI features with visual crop analysis and advanced analytics',
      icon: <Star className="h-6 w-6" />,
      badge: 'Best Value',
      badgeVariant: 'default' as const,
      features: [
        'Unlimited AI features',
        'Visual crop analysis',
        'Advanced analytics',
        'Priority support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 149,
      yearlyPrice: 1490,
      description: 'Complete solution with ADAPT integration and dedicated support',
      icon: <Settings className="h-6 w-6" />,
      badge: 'Full Suite',
      badgeVariant: 'outline' as const,
      features: [
        'ADAPT integration',
        'Custom features',
        'Dedicated support'
      ]
    }
  ];

  const whitelabelPlans = [
    {
      id: 'partner',
      name: 'Partner — White-Label',
      monthlyPrice: 199.99,
      yearlyPrice: 1999.99,
      description: 'Turn-key agricultural intelligence for resellers & integrators',
      icon: <Settings className="h-6 w-6" />,
      badge: 'Reseller Ready',
      badgeVariant: 'default' as const,
      features: [
        'Complete white-label rebrand capability',
        'Custom domain & SSL hosting included',
        'Your logo, colors, and brand messaging',
        'Reseller dashboard with client management',
        '50k API calls per month included',
        'Revenue-share model: 60/40 split',
        'Dedicated onboarding & training',
        'Marketing materials & sales support',
        'Custom ADAPT integrations',
        'Priority technical support',
        'Co-branded partnership opportunities'
      ]
    },
    {
      id: 'enterprise-white-label',
      name: 'Enterprise — Custom Platform',
      monthlyPrice: 999.99,
      yearlyPrice: 9999.99,
      description: 'Fully customized agricultural intelligence platform',
      icon: <Zap className="h-6 w-6" />,
      badge: 'Custom Build',
      badgeVariant: 'outline' as const,
      features: [
        'Completely custom platform development',
        'Your brand identity throughout',
        'Custom domain & infrastructure',
        'Unlimited API calls & storage',
        'Custom feature development',
        'Multi-tenant architecture',
        'Advanced analytics & reporting',
        'Custom ADAPT workflows',
        'Dedicated development team',
        '24/7 enterprise support',
        'SLA guarantees & uptime monitoring',
        'Custom revenue models available'
      ]
    },
    {
      id: 'licensing',
      name: 'Technology Licensing',
      monthlyPrice: 'Custom',
      yearlyPrice: 'Custom',
      description: 'License our patent-protected algorithms for your platform',
      icon: <Leaf className="h-6 w-6" />,
      badge: 'IP Licensing',
      badgeVariant: 'secondary' as const,
      features: [
        'Environmental Impact Engine™ licensing',
        'Multi-Parameter Optimization™ licensing',
        'Hierarchical Geographic Intelligence licensing',
        'ADAPT Standard 1.0 implementation rights',
        'Patent portfolio sub-licensing',
        'Source code access & documentation',
        'Integration consulting & support',
        'Ongoing algorithm updates',
        'Geographic territory licensing',
        'Exclusive industry vertical options',
        'Custom terms & revenue models'
      ]
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') return;
    
    setLoading(true);
    try {
      const interval = isAnnual ? 'year' : 'month';
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: planId, interval }
      });

      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (plan: typeof plans[0]) => {
    return isAnnual ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const isCurrentPlan = (planId: string) => {
    if (planId === 'free') {
      return !subscriptionData?.subscribed;
    }
    return subscriptionData?.subscription_tier?.toLowerCase() === planId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
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
          <div className="flex items-center gap-4">
            {subscriptionData?.subscribed && (
              <div className="flex items-center gap-2">
                <Badge variant="default">
                  {subscriptionData.subscription_tier} - {subscriptionData.subscription_interval}ly
                </Badge>
                <Button variant="outline" size="sm" onClick={handleManageSubscription} disabled={loading}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={refreshSubscription} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Choose Your <span className="text-primary">Patent-Protected Agricultural Intelligence</span> Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              From hobby gardeners to enterprise ag-tech platforms. <span className="font-semibold text-primary">4 patent-protected algorithms</span> delivering 
              breakthrough environmental intelligence with <span className="font-semibold text-primary">zero GIS skills required</span>.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/features'} className="mb-8">
              View Detailed Feature Comparison
            </Button>
            
            {/* Annual/Monthly Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Label htmlFor="billing-toggle" className={`cursor-pointer ${!isAnnual ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <Label htmlFor="billing-toggle" className={`cursor-pointer ${isAnnual ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Annual
              </Label>
              <Badge variant="secondary" className="ml-2">Save 2 months</Badge>
            </div>
          </div>

          {/* Subscription Status */}
          {subscriptionData && (
            <div className="bg-primary/5 rounded-lg p-6 mb-8 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Current Subscription</h3>
                  <p className="text-muted-foreground">
                    {subscriptionData.subscribed 
                      ? `${subscriptionData.subscription_tier} plan (${subscriptionData.subscription_interval}ly billing)`
                      : 'Free plan'}
                  </p>
                  {subscriptionData.subscription_end && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Next billing: {new Date(subscriptionData.subscription_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={refreshSubscription} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Status
                  </Button>
                  {subscriptionData.subscribed && (
                    <Button onClick={handleManageSubscription} disabled={loading}>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Standard Pricing Cards */}
          <div className="grid lg:grid-cols-4 gap-6 justify-center mb-16">
            {plans.map((plan) => {
              const price = getPrice(plan);
              const isCurrentUserPlan = isCurrentPlan(plan.id);
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    plan.id === 'pro' ? 'ring-2 ring-primary shadow-lg scale-105' : ''
                  } ${isCurrentUserPlan ? 'border-green-500 bg-green-50/50' : ''}`}
                >
                  {plan.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge variant={plan.badgeVariant}>{plan.badge}</Badge>
                    </div>
                  )}
                  
                  {isCurrentUserPlan && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Your Plan
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {plan.icon}
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-primary">
                          {typeof price === 'number' ? `$${price}` : price}
                        </span>
                        {typeof price === 'number' && (
                          <span className="text-muted-foreground">
                            /{isAnnual ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      {isAnnual && plan.id === 'pro' && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          Save $158 per year
                        </div>
                      )}
                    </div>
                    
                    <CardDescription className="text-sm">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full mt-6" 
                      variant={plan.id === 'pro' ? 'default' : 'outline'}
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={loading || isCurrentUserPlan || plan.id === 'free'}
                    >
                      {loading ? 'Processing...' :
                       isCurrentUserPlan ? 'Current Plan' :
                       plan.id === 'free' ? 'Get Started' : 
                       plan.id === 'enterprise' ? 'Contact Sales' : 
                       'Start 7-Day Trial'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* White-Label Partnership Section */}
          <div className="border-t border-border pt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-primary">White-Label & Partnership</span> Solutions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Turn our patent-protected agricultural intelligence into your branded platform. 
                Perfect for resellers, integrators, and enterprises building custom solutions.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 justify-center">
              {whitelabelPlans.map((plan) => {
                const price = typeof plan.monthlyPrice === 'string' ? plan.monthlyPrice : (isAnnual ? plan.yearlyPrice : plan.monthlyPrice);
                
                return (
                  <Card 
                    key={plan.id} 
                    className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5"
                  >
                    <div className="absolute top-4 right-4">
                      <Badge variant={plan.badgeVariant}>{plan.badge}</Badge>
                    </div>
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {plan.icon}
                        </div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-primary">
                            {typeof price === 'string' ? price : `$${price}`}
                          </span>
                          {typeof price !== 'string' && (
                            <span className="text-muted-foreground">
                              /{isAnnual ? 'year' : 'month'}
                            </span>
                          )}
                        </div>
                        {isAnnual && typeof plan.monthlyPrice === 'number' && typeof plan.yearlyPrice === 'number' && (
                          <div className="text-sm text-green-600 font-medium mt-1">
                            Save ${((plan.monthlyPrice * 12) - plan.yearlyPrice).toFixed(2)} per year
                          </div>
                        )}
                      </div>
                      
                      <CardDescription className="text-sm">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        className="w-full mt-6" 
                        variant="default"
                        onClick={() => {
                          // Contact sales for white-label options
                          window.open('mailto:sales@soilsidekick.com?subject=White-Label Partnership Inquiry&body=I am interested in learning more about your white-label and partnership solutions.', '_blank');
                        }}
                      >
                        Contact Partnership Team
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Ready to Experience Patent-Protected Agricultural Intelligence?</h3>
            <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
              Join thousands of growers leveraging our breakthrough environmental impact algorithms and multi-parameter optimization systems. 
              Now with ADAPT Standard 1.0 integration—break free from vendor lock-in and connect your soil intelligence to any farm management system.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-background/80 px-3 py-1 rounded-full text-sm">
                <Check className="h-3 w-3 text-green-500" />
                ADAPT Standard 1.0 Certified
              </div>
              <div className="inline-flex items-center gap-2 bg-background/80 px-3 py-1 rounded-full text-sm">
                <Check className="h-3 w-3 text-green-500" />
                Environmental Impact Engine™
              </div>
              <div className="inline-flex items-center gap-2 bg-background/80 px-3 py-1 rounded-full text-sm">
                <Check className="h-3 w-3 text-green-500" />
                Multi-Parameter Planting Optimization™
              </div>
              <div className="inline-flex items-center gap-2 bg-background/80 px-3 py-1 rounded-full text-sm">
                <Check className="h-3 w-3 text-green-500" />
                Hierarchical Geographic Intelligence
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/soil-analysis')}>
                Try Patent-Protected Features Free
              </Button>
              <Button variant="outline" onClick={() => navigate('/api-docs')}>
                Explore Enterprise APIs
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;