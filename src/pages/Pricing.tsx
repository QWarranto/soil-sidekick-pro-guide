import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Shield, TrendingUp, Users, Sparkles, ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const tiers = [
    {
      id: "starter",
      name: "Environmental Intelligence Starter",
      monthlyPrice: 500,
      annualPrice: 5000,
      annualDiscount: "Save $1,000",
      description: "Perfect for emerging plant ID apps looking to differentiate with environmental data",
      icon: Zap,
      popular: false,
      features: [
        { text: "Environmental Compatibility Score API", included: true },
        { text: "EPA Water Quality Integration", included: true },
        { text: "Federal FIPS Location Intelligence", included: true },
        { text: "Privacy-Preserving WebGPU AI (on-device)", included: true },
        { text: "GDPR-compliant by design", included: true },
        { text: "50,000 API calls/month", included: true },
        { text: "Email support (48hr response)", included: true },
        { text: "API documentation access", included: true },
        { text: "Basic analytics dashboard", included: true },
        { text: "AlphaEarth Satellite Data", included: false },
        { text: "White-label options", included: false },
        { text: "Dedicated account manager", included: false },
      ],
      cta: "Start Free Trial",
      limits: {
        apiCalls: "50,000/month",
        rateLimit: "1,000 req/min",
        support: "Email (48hr)",
      },
    },
    {
      id: "professional",
      name: "Satellite Monitoring Pro",
      monthlyPrice: 1500,
      annualPrice: 15000,
      annualDiscount: "Save $3,000",
      description: "Complete environmental intelligence with real-time satellite monitoring",
      icon: Sparkles,
      popular: true,
      features: [
        { text: "Everything in Starter", included: true },
        { text: "AlphaEarth Satellite Intelligence", included: true },
        { text: "Real-time NDVI & soil moisture data", included: true },
        { text: "Thermal stress indicators", included: true },
        { text: "Advanced on-device AI models", included: true },
        { text: "250,000 API calls/month", included: true },
        { text: "Priority support (24hr response)", included: true },
        { text: "Advanced analytics & reporting", included: true },
        { text: "Custom integration support", included: true },
        { text: "Quarterly business reviews", included: true },
        { text: "White-label options", included: false },
      ],
      cta: "Start Free Trial",
      limits: {
        apiCalls: "250,000/month",
        rateLimit: "2,500 req/min",
        support: "Priority (24hr)",
      },
    },
    {
      id: "enterprise",
      name: "White-Label Enterprise",
      monthlyPrice: null,
      annualPrice: null,
      customPricing: "Custom",
      description: "Complete white-label solution with unlimited access and dedicated support",
      icon: Shield,
      popular: false,
      features: [
        { text: "Everything in Professional", included: true },
        { text: "Unlimited API calls", included: true },
        { text: "White-label branding options", included: true },
        { text: "Custom domain support", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "24/7 phone & Slack support", included: true },
        { text: "Custom SLA agreements", included: true },
        { text: "On-premise deployment options", included: true },
        { text: "Custom feature development", included: true },
        { text: "Strategic partnership opportunities", included: true },
      ],
      cta: "Contact Sales",
      limits: {
        apiCalls: "Unlimited",
        rateLimit: "Custom",
        support: "24/7 Dedicated",
      },
    },
  ];

  const annualSavingsPercentage = (tier: typeof tiers[0]) => {
    if (!tier.monthlyPrice || !tier.annualPrice) return 0;
    const monthlyCost = tier.monthlyPrice * 12;
    const savings = monthlyCost - tier.annualPrice;
    return Math.round((savings / monthlyCost) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="secondary">
              Transparent Pricing
            </Badge>
            <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              Licensing Tiers for Plant ID Apps
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Choose the plan that fits your app's scale. All plans include patent-protected Environmental Compatibility Scores and multi-agency data integration.
            </p>

            {/* Demo and Sandbox Links */}
            <div className="mb-8 flex gap-4 justify-center">
              <Button asChild>
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

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <Label htmlFor="billing-toggle" className={billingCycle === "monthly" ? "font-semibold text-foreground" : "text-muted-foreground"}>
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={billingCycle === "annual"}
                onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
              />
              <Label htmlFor="billing-toggle" className={billingCycle === "annual" ? "font-semibold text-foreground" : "text-muted-foreground"}>
                Annual
                <Badge variant="secondary" className="ml-2">
                  Save up to 17%
                </Badge>
              </Label>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const displayPrice = billingCycle === "annual" ? tier.annualPrice : tier.monthlyPrice;
              const displayPeriod = billingCycle === "annual" ? "year" : "month";

              return (
                <Card
                  key={tier.id}
                  className={`relative flex flex-col ${
                    tier.popular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge className="bg-primary px-4 py-1 text-sm">Most Popular</Badge>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                      </div>
                    </div>

                    <p className="mb-6 text-sm text-muted-foreground">{tier.description}</p>

                    <div className="mb-6">
                      {displayPrice === null ? (
                        <div>
                          <p className="text-4xl font-bold text-foreground">{tier.customPricing}</p>
                          <p className="text-sm text-muted-foreground">Contact for pricing</p>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-bold text-foreground">
                              ${billingCycle === "annual" ? Math.round(displayPrice! / 12).toLocaleString() : displayPrice!.toLocaleString()}
                            </p>
                            <p className="text-muted-foreground">/{billingCycle === "annual" ? "mo" : "month"}</p>
                          </div>
                          {billingCycle === "annual" && tier.annualPrice && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              ${tier.annualPrice.toLocaleString()} billed annually • {tier.annualDiscount}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mb-6 space-y-2 rounded-lg bg-muted/50 p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">API Calls</span>
                        <span className="font-semibold text-foreground">{tier.limits.apiCalls}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rate Limit</span>
                        <span className="font-semibold text-foreground">{tier.limits.rateLimit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Support</span>
                        <span className="font-semibold text-foreground">{tier.limits.support}</span>
                      </div>
                    </div>

                    <Button
                      className="mb-6 w-full"
                      variant={tier.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {tier.cta}
                      {tier.id !== "enterprise" && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>

                    <div className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              feature.included ? "text-primary" : "text-muted-foreground/30"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              feature.included ? "text-foreground" : "text-muted-foreground/50 line-through"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* European Market Advantage */}
      <section className="border-y border-border bg-gradient-to-br from-primary/5 via-background to-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <Badge className="mb-4" variant="default">
                <Shield className="mr-2 h-3 w-3" />
                GDPR Compliance Advantage
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-foreground">Built for the European Market</h2>
              <p className="text-lg text-muted-foreground">
                The only plant intelligence platform with privacy-preserving on-device AI. Perfect for GDPR-conscious licensees.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                  <Check className="h-5 w-5 text-green-600" />
                  With SoilSidekick
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>WebGPU on-device AI = Zero PII transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>GDPR compliant by architectural design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Works offline for remote farming areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>No cloud AI costs passed to you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Position as privacy-first alternative</span>
                  </li>
                </ul>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Without Privacy AI
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <span>User photos uploaded to cloud for AI processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <span>Complex GDPR compliance documentation required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <span>Requires stable internet connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <span>Ongoing cloud inference costs scale with users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <span>Privacy concerns limit European market growth</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="mt-8 rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-lg font-semibold text-foreground">
                🇪🇺 European plant ID apps see <strong>2.3x higher conversion</strong> when highlighting on-device AI privacy
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Source: Internal analysis of 12 EU-based licensee partners (Q4 2024)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground">ROI: Churn Reduction Math</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                See how Environmental Intelligence directly impacts your bottom line
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <div className="mb-4 rounded-lg bg-destructive/10 p-3">
                  <TrendingUp className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">Without Environmental Intel</h3>
                <p className="mb-4 text-3xl font-bold text-foreground">28%</p>
                <p className="text-sm text-muted-foreground">
                  Average 90-day churn when identified plants die without actionable care guidance
                </p>
              </Card>

              <Card className="border-primary p-6">
                <div className="mb-4 rounded-lg bg-primary/10 p-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">With Environmental Intel</h3>
                <p className="mb-4 text-3xl font-bold text-foreground">12%</p>
                <p className="text-sm text-muted-foreground">
                  Reduce churn by providing real-time environmental compatibility and care guidance
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 rounded-lg bg-green-500/10 p-3">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">Net Impact</h3>
                <p className="mb-4 text-3xl font-bold text-foreground">57%</p>
                <p className="text-sm text-muted-foreground">
                  Reduction in churn = Higher LTV, better retention metrics, and predictable MRR growth
                </p>
              </Card>
            </div>

            <div className="mt-8 rounded-lg bg-primary/5 p-6">
              <h4 className="mb-4 text-center text-lg font-semibold text-foreground">Conservative Revenue Impact Example</h4>
              <div className="grid gap-4 text-center md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">10,000 MAU App</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">+$42K ARR</p>
                  <p className="text-xs text-muted-foreground">From retention improvement alone</p>
                </div>
                <div className="border-x border-border">
                  <p className="text-sm text-muted-foreground">50,000 MAU App</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">+$210K ARR</p>
                  <p className="text-xs text-muted-foreground">Pays for Professional tier 14x over</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">100,000+ MAU App</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">+$420K+ ARR</p>
                  <p className="text-xs text-muted-foreground">White-label enterprise makes sense</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground">Detailed Feature Comparison</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-sm font-semibold text-foreground">Feature</th>
                    <th className="p-4 text-center text-sm font-semibold text-foreground">Starter</th>
                    <th className="p-4 text-center text-sm font-semibold text-foreground">Professional</th>
                    <th className="p-4 text-center text-sm font-semibold text-foreground">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Environmental Compatibility Score API", starter: true, pro: true, enterprise: true },
                    { feature: "EPA Water Quality Integration", starter: true, pro: true, enterprise: true },
                    { feature: "Federal FIPS Location Intelligence", starter: true, pro: true, enterprise: true },
                    { feature: "Privacy-Preserving WebGPU AI", starter: true, pro: true, enterprise: true },
                    { feature: "GDPR Compliant by Design", starter: true, pro: true, enterprise: true },
                    { feature: "Offline-First Architecture", starter: true, pro: true, enterprise: true },
                    { feature: "AlphaEarth Satellite Data", starter: false, pro: true, enterprise: true },
                    { feature: "Real-time NDVI Monitoring", starter: false, pro: true, enterprise: true },
                    { feature: "Advanced On-Device AI Models", starter: false, pro: true, enterprise: true },
                    { feature: "Monthly API Calls", starter: "50K", pro: "250K", enterprise: "Unlimited" },
                    { feature: "Rate Limit (req/min)", starter: "1,000", pro: "2,500", enterprise: "Custom" },
                    { feature: "Support Response Time", starter: "48hrs", pro: "24hrs", enterprise: "Immediate" },
                    { feature: "White-label Branding", starter: false, pro: false, enterprise: true },
                    { feature: "Custom Domain Support", starter: false, pro: false, enterprise: true },
                    { feature: "Dedicated Account Manager", starter: false, pro: false, enterprise: true },
                    { feature: "Custom Feature Development", starter: false, pro: false, enterprise: true },
                    { feature: "On-premise Deployment", starter: false, pro: false, enterprise: true },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-border">
                      <td className="p-4 text-sm text-foreground">{row.feature}</td>
                      <td className="p-4 text-center">
                        {typeof row.starter === "boolean" ? (
                          row.starter ? (
                            <Check className="mx-auto h-5 w-5 text-primary" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="text-sm font-semibold text-foreground">{row.starter}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? (
                            <Check className="mx-auto h-5 w-5 text-primary" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="text-sm font-semibold text-foreground">{row.pro}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.enterprise === "boolean" ? (
                          row.enterprise ? (
                            <Check className="mx-auto h-5 w-5 text-primary" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="text-sm font-semibold text-foreground">{row.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-2 font-semibold text-foreground">How does the free trial work?</h3>
                <p className="text-sm text-muted-foreground">
                  All paid tiers include a 14-day free trial with full access to features. No credit card required to start. You'll only be charged after the trial period ends.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 font-semibold text-foreground">What happens if I exceed my API call limit?</h3>
                <p className="text-sm text-muted-foreground">
                  API calls beyond your tier limit are charged at $0.02 per additional call. You'll receive notifications at 80% and 100% usage to help you manage costs.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 font-semibold text-foreground">Can I upgrade or downgrade my plan anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! You can upgrade immediately to access more features. Downgrades take effect at the end of your current billing cycle to ensure uninterrupted service.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 font-semibold text-foreground">Do you offer custom enterprise solutions?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely. Our Enterprise tier is fully customizable to your needs, including white-labeling, custom SLAs, on-premise deployment, and strategic partnership opportunities. Contact sales to discuss your requirements.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="mb-2 font-semibold text-foreground">Is there a setup fee or integration cost?</h3>
                <p className="text-sm text-muted-foreground">
                  No setup fees for Starter and Professional tiers. Enterprise customers receive complimentary onboarding and integration support as part of their package.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              Ready to Reduce Churn and Boost Revenue?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/api-docs">
                  Explore API Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
