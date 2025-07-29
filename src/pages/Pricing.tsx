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
      description: 'Perfect for hobby gardeners exploring soil basics',
      icon: <Leaf className="h-6 w-6" />,
      badge: 'Free',
      badgeVariant: 'secondary' as const,
      features: [
        'County soil snapshot',
        'Basic environmental assessment',
        'Up to 3 counties per month',
        'Interactive map with FIPS lookup',
        'Standard planting recommendations',
        'Basic ADAPT export (soil data only)'
      ]
    },
    {
      id: 'pro',
      name: 'Pro — Agricultural Intelligence',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      description: 'Patent-protected agricultural intelligence for serious growers',
      icon: <Star className="h-6 w-6" />,
      badge: 'Most Popular',
      badgeVariant: 'default' as const,
      features: [
        'Unlimited counties with smart caching',
        'GPS field mapping & location capture',
        'Advanced field management dashboard',
        'ADAPT Standard 1.0 Integration',
        'Bidirectional sync with John Deere, Case IH, AGCO',
        'Field boundary import/export',
        'Environmental Impact Engine™ (Patent-Protected)',
        'Multi-Parameter Planting Optimization™',
        'Eco-Friendly Alternative Recommendations',
        'Carbon Footprint & Sustainability Scoring',
        'Hierarchical Geographic Intelligence',
        'Adaptive Usage Analytics & Insights',
        'PDF & CSV exports (lender-ready)',
        'Priority support & consultation'
      ]
    },
    {
      id: 'api',
      name: 'API — Enterprise',
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      description: 'Patent-protected APIs for ag-tech platforms & enterprises',
      icon: <Zap className="h-6 w-6" />,
      badge: 'Enterprise',
      badgeVariant: 'outline' as const,
      features: [
        '10k calls per month',
        'Full ADAPT Standard 1.0 API Suite',
        'Custom integration support',
        'Real-time bidirectional sync',
        'Batch processing capabilities',
        'GPS-enabled field management APIs',
        'Mobile-ready location services',
        'Patent-Protected Environmental Assessment APIs',
        'Hierarchical Cache-Optimised Data Broker',
        'Geo-Consumption Analytics Integration',
        'Multi-Parameter Optimization Endpoints',
        'Revenue-share option for retailers',
        'White-label ready with custom branding',
        '99.9% SLA with enterprise support'
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
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              From hobby gardeners to enterprise ag-tech platforms. <span className="font-semibold text-primary">4 patent-protected algorithms</span> delivering 
              breakthrough environmental intelligence with <span className="font-semibold text-primary">zero GIS skills required</span>.
            </p>
            
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

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 justify-center">
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
                          ${price}
                        </span>
                        <span className="text-muted-foreground">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                      </div>
                      {isAnnual && plan.id !== 'free' && (
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
                      variant={plan.id === 'pro' ? 'default' : 'outline'}
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={loading || isCurrentUserPlan || plan.id === 'free'}
                    >
                      {loading ? 'Processing...' :
                       isCurrentUserPlan ? 'Current Plan' :
                       plan.id === 'free' ? 'Get Started' : 
                       plan.id === 'api' ? 'Contact Sales' : 
                       'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
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