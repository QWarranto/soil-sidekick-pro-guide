import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Leaf, LogOut, Check, Star, Zap, Building2 } from 'lucide-react';

const Pricing = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const handleBackHome = () => {
    navigate('/');
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Perfect for hobby gardeners exploring soil basics',
      icon: <Leaf className="h-6 w-6" />,
      badge: 'Free',
      badgeVariant: 'secondary' as const,
      features: [
        '5 county lookups per month',
        'Basic soil metrics (pH, texture)',
        'County-level USDA data',
        'Community support',
        'Mobile-responsive interface'
      ],
      limitations: [
        'No PDF export',
        'No API access',
        'Limited historical data'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'Complete soil intelligence for serious growers',
      icon: <Star className="h-6 w-6" />,
      badge: 'Most Popular',
      badgeVariant: 'default' as const,
      features: [
        'Unlimited county lookups',
        'Complete soil analysis (NPK, OM, pH)',
        'Instant PDF export',
        'Crop-specific recommendations',
        'Historical soil trends',
        'Priority email support',
        'Mobile app access'
      ],
      limitations: []
    },
    {
      id: 'api',
      name: 'API Developer',
      price: '$49',
      period: 'per month',
      description: 'Monetizable API for seed companies & ag-tech platforms',
      icon: <Zap className="h-6 w-6" />,
      badge: 'Developer',
      badgeVariant: 'outline' as const,
      features: [
        'Everything in Pro',
        'REST API access (50,000 calls/mo)',
        'JSON + PDF endpoints',
        '15-minute integration guide',
        'Webhook notifications',
        'Usage analytics dashboard',
        'White-label embed widgets',
        'Dedicated technical support'
      ],
      limitations: []
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'Scale across your entire operation',
      icon: <Building2 className="h-6 w-6" />,
      badge: 'Enterprise',
      badgeVariant: 'outline' as const,
      features: [
        'Everything in API Developer',
        'Unlimited API calls',
        'Custom integrations',
        'Multi-user management',
        'SLA guarantees',
        'On-premise deployment options',
        'Revenue-share partnerships',
        'Dedicated account manager'
      ],
      limitations: []
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // TODO: Integrate with Stripe checkout
    console.log('Selected plan:', planId);
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
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Choose Your <span className="text-primary">Soil Intelligence</span> Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From hobby gardeners to enterprise ag-tech platforms. County-level USDA soil data 
              with <span className="font-semibold text-primary">zero GIS skills required</span>.
            </p>
          </div>

          {/* Competitive Advantages */}
          <div className="bg-primary/5 rounded-lg p-6 mb-12 border border-primary/20">
            <h3 className="text-lg font-semibold text-primary mb-4 text-center">
              🏆 Why SoilSidekick Pro Leads the Market
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium mb-2">County-Only API</div>
                <div className="text-muted-foreground">3,143 granular snapshots vs. state averages</div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-2">15-Minute Integration</div>
                <div className="text-muted-foreground">Plug-and-play vs. months with enterprise suites</div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-2">Pay-As-You-Go &lt;$50/mo</div>
                <div className="text-muted-foreground">No enterprise minimums or hardware costs</div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  plan.id === 'pro' ? 'ring-2 ring-primary shadow-lg scale-105' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge variant={plan.badgeVariant}>{plan.badge}</Badge>
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
                      <span className="text-3xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>
                  
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="font-medium text-sm text-primary">✓ Features included:</div>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="font-medium text-sm text-muted-foreground">Limitations:</div>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-4 h-4 text-center">-</span>
                          <span>{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    className="w-full mt-6" 
                    variant={plan.id === 'pro' ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={plan.id === 'starter'}
                  >
                    {plan.id === 'starter' ? 'Current Plan' : 
                     plan.id === 'enterprise' ? 'Contact Sales' : 
                     'Upgrade Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of growers making data-driven soil decisions. 
              Start with our free tier and upgrade when you need more features.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/soil-analysis')}>
                Try Free Now
              </Button>
              <Button variant="outline" onClick={() => navigate('/api-docs')}>
                View API Docs
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;