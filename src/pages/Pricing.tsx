
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Leaf, LogOut, Check, Star, Zap } from 'lucide-react';

const Pricing = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const handleBackHome = () => {
    navigate('/');
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for hobby gardeners exploring soil basics',
      icon: <Leaf className="h-6 w-6" />,
      badge: 'Free',
      badgeVariant: 'secondary' as const,
      features: [
        'County soil snapshot',
        'Basic water-quality grade',
        'Up to 3 counties per month',
        'Interactive map'
      ]
    },
    {
      id: 'pro',
      name: 'Pro — Agricultural Intelligence',
      price: '$9.99',
      period: 'per month',
      yearlyPrice: '$99 / yr (save 17%)',
      description: 'Complete soil intelligence for serious growers',
      icon: <Star className="h-6 w-6" />,
      badge: 'Most Popular',
      badgeVariant: 'default' as const,
      features: [
        'Unlimited counties',
        'Full soil + water analysis',
        'Planting calendar & frost dates',
        'Fertilizer runoff risk + eco-scores',
        'PDF & CSV exports (lender-ready)',
        'Priority support'
      ]
    },
    {
      id: 'api',
      name: 'API',
      price: '$49',
      period: 'per month',
      description: 'Monetizable API for seed companies & ag-tech platforms',
      icon: <Zap className="h-6 w-6" />,
      badge: 'Developer',
      badgeVariant: 'outline' as const,
      features: [
        '10k calls per month',
        'Soil + water endpoints',
        'Revenue-share option for retailers',
        'White-label ready',
        '99.9% SLA'
      ]
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
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Choose Your <span className="text-primary">Agricultural Intelligence</span> Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From hobby gardeners to enterprise ag-tech platforms. County-level soil & water data 
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
                <div className="font-medium mb-2">Soil + Water Analysis</div>
                <div className="text-muted-foreground">Complete agricultural intelligence in one platform</div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-2">EPA + USDA Data</div>
                <div className="text-muted-foreground">Government-grade accuracy for 297 counties (expanding)</div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-2">15-Minute Integration</div>
                <div className="text-muted-foreground">Plug-and-play vs. months with enterprise suites</div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 justify-center">
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
                    {plan.yearlyPrice && (
                      <div className="text-sm text-muted-foreground mt-1">
                        or {plan.yearlyPrice}
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
                    disabled={plan.id === 'free'}
                  >
                    {plan.id === 'free' ? 'Get Started' : 
                     plan.id === 'api' ? 'Contact Sales' : 
                     'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of growers making data-driven soil decisions with our Agricultural Intelligence platform. 
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
