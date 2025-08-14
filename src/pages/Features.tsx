import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowRight, Shield, Zap, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Features() {
  const navigate = useNavigate();

  const features = [
    {
      category: 'Core Agricultural Intelligence',
      items: [
        { name: 'County soil snapshot', basic: true, pro: true, api: true },
        { name: 'Basic environmental assessment', basic: true, pro: true, api: true },
        { name: 'Interactive map with FIPS lookup', basic: true, pro: true, api: true },
        { name: 'Standard planting recommendations', basic: true, pro: true, api: true },
        { name: 'Patent-Protected agricultural intelligence', basic: false, pro: true, api: true },
        { name: 'Environmental Impact Engine (Patent-Protected)', basic: false, pro: true, api: true },
        { name: 'Multi-Parameter Planting Optimization™', basic: false, pro: true, api: true },
        { name: 'Eco-Friendly Alternative Recommendations', basic: false, pro: true, api: true },
        { name: 'Carbon Footprint & Sustainability Scoring', basic: false, pro: true, api: true },
      ]
    },
    {
      category: 'Advanced Analysis & Monitoring',
      items: [
        { name: 'Satellite-enhanced environmental analysis', basic: false, pro: true, api: true },
        { name: 'AlphaEarth integration with confidence scores', basic: false, pro: true, api: true },
        { name: 'GPS field mapping & location capture', basic: false, pro: true, api: true },
        { name: 'Advanced field management dashboard', basic: false, pro: true, api: true },
        { name: 'Hierarchical Geographic Intelligence', basic: false, pro: true, api: true },
        { name: 'Adaptive Usage Analytics & Insights', basic: false, pro: true, api: true },
        { name: 'Precision Livestock Farming', basic: false, pro: false, api: true },
      ]
    },
    {
      category: 'Data Export & Integration',
      items: [
        { name: 'PDF & CSV exports (lender-ready)', basic: false, pro: true, api: true },
        { name: 'ADAPT Standard 1.0 Integration', basic: false, pro: true, api: true },
        { name: 'Bidirectional sync with John Deere', basic: false, pro: true, api: true },
        { name: 'Case IH sync', basic: false, pro: true, api: true },
        { name: 'AGCO sync', basic: false, pro: true, api: true },
        { name: 'Field boundary import/export', basic: false, pro: true, api: true },
        { name: 'Full ADAPT Standard 1.0 API Suite', basic: false, pro: false, api: true },
        { name: 'Batch processing capabilities', basic: false, pro: false, api: true },
      ]
    },
    {
      category: 'API & Enterprise Features',
      items: [
        { name: 'Patent-protected environmental assessment APIs', basic: false, pro: false, api: true },
        { name: 'Hierarchical Cache-Optimized Data Broker', basic: false, pro: false, api: true },
        { name: 'Geo-Consumption Analytics Integration', basic: false, pro: false, api: true },
        { name: 'Revenue-sharing option for retailers', basic: false, pro: false, api: true },
        { name: 'White-label ready with custom branding', basic: false, pro: false, api: true },
        { name: 'Multi-Parameter Optimization Endpoints', basic: false, pro: false, api: true },
        { name: 'Mobile-ready location services', basic: false, pro: false, api: true },
        { name: 'Real-time bidirectional sync', basic: false, pro: false, api: true },
      ]
    },
    {
      category: 'Usage Limits & Support',
      items: [
        { name: 'Counties per month', basic: '3', pro: 'Unlimited', api: 'Unlimited' },
        { name: 'API calls per month', basic: 'N/A', pro: 'N/A', api: '10k' },
        { name: 'Support level', basic: 'Community', pro: 'Priority support & consultation', api: '99.9% SLA with enterprise support' },
        { name: 'Smart caching', basic: false, pro: true, api: true },
        { name: 'Custom integration support', basic: false, pro: false, api: true },
      ]
    }
  ];

  const plans = [
    { 
      id: 'basic', 
      name: 'Basic', 
      price: '$0.00', 
      description: 'Perfect for hobby gardeners exploring soil basics',
      icon: Shield, 
      color: 'text-gray-600' 
    },
    { 
      id: 'pro', 
      name: 'Pro-Agricultural Intelligence', 
      price: '$9.99/mo • $99/yr', 
      description: 'Patent-Protected agricultural intelligence for serious growers',
      popular: true,
      icon: Crown, 
      color: 'text-primary' 
    },
    { 
      id: 'api', 
      name: 'API-Enterprise', 
      price: '$49.99/mo • $499/yr', 
      description: 'Patent-protected APIs for ag-tech platforms & enterprises',
      popular: true,
      icon: Sparkles, 
      color: 'text-purple-600' 
    }
  ];

  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (value === false) {
      return <X className="h-4 w-4 text-red-400" />;
    }
    return <span className="text-xs text-center">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Comprehensive <span className="text-primary">Feature Comparison</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Compare all features across our subscription plans to find the perfect fit for your agricultural needs
          </p>
          <Button onClick={() => navigate('/pricing')} className="mb-8">
            View Pricing <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Plans Header */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div></div>
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card key={plan.id} className={`text-center ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-4">
                  {plan.popular && (
                    <Badge className="mx-auto mb-2 w-fit">Most Popular</Badge>
                  )}
                  <div className="flex justify-center mb-2">
                    <div className={`p-2 rounded-full bg-background`}>
                      <Icon className={`h-5 w-5 ${plan.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="font-semibold text-lg">{plan.price}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="space-y-8">
          {features.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-xl">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((feature, featureIndex) => (
                    <div key={featureIndex} className="grid grid-cols-4 gap-4 items-center py-2 border-b border-border/50 last:border-b-0">
                      <div className="font-medium text-sm">{feature.name}</div>
                      <div className="flex justify-center">
                        {renderFeatureValue(feature.basic)}
                      </div>
                      <div className="flex justify-center">
                        {renderFeatureValue(feature.pro)}
                      </div>
                      <div className="flex justify-center">
                        {renderFeatureValue(feature.api)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">Choose the plan that best fits your needs</p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/pricing')} size="lg">
              View Pricing Plans
            </Button>
            <Button variant="outline" onClick={() => navigate('/faq')} size="lg">
              Have Questions? Check FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}