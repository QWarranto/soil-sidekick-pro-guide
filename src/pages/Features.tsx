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
      category: 'Data Access & Analysis',
      items: [
        { name: 'County soil data lookup', free: true, starter: true, pro: true, enterprise: true },
        { name: 'Basic soil recommendations', free: true, starter: true, pro: true, enterprise: true },
        { name: 'AI soil analysis', free: false, starter: '5/month', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Visual crop analysis', free: false, starter: false, pro: true, enterprise: true },
        { name: 'Advanced analytics dashboard', free: false, starter: false, pro: true, enterprise: true },
        { name: 'Satellite-enhanced analysis', free: false, starter: false, pro: true, enterprise: true },
        { name: 'GPT-5 enhanced recommendations', free: false, starter: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
      ]
    },
    {
      category: 'Reporting & Export',
      items: [
        { name: 'Basic PDF reports', free: 'Limited', starter: true, pro: true, enterprise: true },
        { name: 'Professional loan-ready reports', free: false, starter: false, pro: true, enterprise: true },
        { name: 'Smart report summaries', free: false, starter: false, pro: true, enterprise: true },
        { name: 'ADAPT format export', free: false, starter: false, pro: true, enterprise: true },
        { name: 'Custom report branding', free: false, starter: false, pro: false, enterprise: true },
        { name: 'Bulk data export', free: false, starter: false, pro: false, enterprise: true },
      ]
    },
    {
      category: 'Integrations & API',
      items: [
        { name: 'ADAPT integration', free: false, starter: false, pro: false, enterprise: true },
        { name: 'John Deere Operations Center sync', free: false, starter: false, pro: false, enterprise: true },
        { name: 'Case IH AFS Connect sync', free: false, starter: false, pro: false, enterprise: true },
        { name: 'API access', free: false, starter: false, pro: 'Limited', enterprise: 'Full' },
        { name: 'Custom integrations', free: false, starter: false, pro: false, enterprise: true },
        { name: 'White-label capabilities', free: false, starter: false, pro: false, enterprise: true },
      ]
    },
    {
      category: 'Planning & Tools',
      items: [
        { name: 'Planting calendar', free: 'Basic', starter: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
        { name: 'Seasonal planning assistant', free: 'Limited', starter: true, pro: true, enterprise: true },
        { name: 'Carbon credit calculator', free: false, starter: false, pro: true, enterprise: true },
        { name: 'Environmental impact scoring', free: false, starter: false, pro: true, enterprise: true },
        { name: 'Water quality analysis', free: 'Basic', starter: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
        { name: 'Field boundary management', free: false, starter: false, pro: false, enterprise: true },
      ]
    },
    {
      category: 'Support & Service',
      items: [
        { name: 'Community support', free: true, starter: false, pro: false, enterprise: false },
        { name: 'Email support', free: false, starter: true, pro: true, enterprise: true },
        { name: 'Priority support', free: false, starter: false, pro: true, enterprise: true },
        { name: 'Dedicated support', free: false, starter: false, pro: false, enterprise: true },
        { name: 'Onboarding assistance', free: false, starter: false, pro: false, enterprise: true },
        { name: 'Training sessions', free: false, starter: false, pro: false, enterprise: true },
      ]
    }
  ];

  const plans = [
    { id: 'free', name: 'Free', price: '$0', icon: Shield, color: 'text-gray-600' },
    { id: 'starter', name: 'Starter', price: '$29', icon: Zap, color: 'text-blue-600' },
    { id: 'pro', name: 'Pro', price: '$79', icon: Crown, color: 'text-primary' },
    { id: 'enterprise', name: 'Enterprise', price: '$149', icon: Sparkles, color: 'text-purple-600' }
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
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div></div>
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card key={plan.id} className="text-center">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-2">
                    <div className={`p-2 rounded-full bg-background`}>
                      <Icon className={`h-5 w-5 ${plan.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="font-semibold text-lg">{plan.price}/month</CardDescription>
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
                    <div key={featureIndex} className="grid grid-cols-5 gap-4 items-center py-2 border-b border-border/50 last:border-b-0">
                      <div className="font-medium text-sm">{feature.name}</div>
                      <div className="flex justify-center">
                        {renderFeatureValue(feature.free)}
                      </div>
                      <div className="flex justify-center">
                        {renderFeatureValue(feature.starter)}
                      </div>
                      <div className="flex justify-center">
                        {renderFeatureValue(feature.pro)}
                      </div>
                      <div className="flex justify-center">
                        {renderFeatureValue(feature.enterprise)}
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