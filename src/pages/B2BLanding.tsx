import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, TrendingDown, Check, Code, Database, Satellite } from "lucide-react";
import { Link } from "react-router-dom";
import { LeafEnginesNav } from "@/components/LeafEnginesNav";
import { OptimizedImage } from "@/components/OptimizedImage";
import gdprCertified from "@/assets/gdpr-certified.png";

export default function B2BLanding() {
  return (
    <div className="min-h-screen bg-background">
      <LeafEnginesNav />
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="secondary">
              <Shield className="mr-2 h-3 w-3" />
              Patent-Protected Technology
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              LeafEngines™
            </h1>
            <p className="mb-4 text-xl text-muted-foreground md:text-2xl">
              Environmental Intelligence API for Plant Apps
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Stop losing users when their identified plants die. Power your app with real-time environmental compatibility scores and turn identification into actionable plant care.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/leafengines-api">
                  View API Documentation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/privacy-advantage">Privacy Advantage</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="border-b border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-start gap-6">
              <div className="rounded-full bg-destructive/10 p-3">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="mb-4 text-3xl font-bold text-foreground">
                  Your Users Don't Just Want to Know <em>What</em> — They Need to Know <em>How</em>
                </h2>
                <p className="mb-4 text-lg text-muted-foreground">
                  Plant identification apps solve the "What is this plant?" question brilliantly. But users delete apps when their identified plants die 3 months later.
                </p>
                <p className="text-lg font-semibold text-foreground">
                  The missing piece? Real-time environmental intelligence that answers: "Will this plant thrive HERE?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GDPR/Privacy Hook */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <Badge className="mb-4" variant="default">
                  <Shield className="mr-2 h-3 w-3" />
                  Patent-Protected Technology
                </Badge>
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  Privacy-Preserving AI Processing
                </h2>
                <p className="mb-4 text-lg text-muted-foreground">
                  The only plant intelligence platform with <strong className="text-foreground">on-device WebGPU AI</strong> that keeps user data private while delivering real-time environmental analysis.
                </p>
                <p className="mb-6 text-lg font-semibold text-foreground">
                  LeafEngines™ is ready for European licensing — privacy-first, audit-ready, and built for trust.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">GDPR Compliant by Design</p>
                      <p className="text-sm text-muted-foreground">Zero PII transmission. All AI processing happens on-device via WebGPU.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Competitive Advantage in EU Markets</p>
                      <p className="text-sm text-muted-foreground">Position your app as the privacy-first choice for European users.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Offline-First Architecture</p>
                      <p className="text-sm text-muted-foreground">Works without internet. Perfect for remote farming locations.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">No Cloud Hosting Costs</p>
                      <p className="text-sm text-muted-foreground">Reduce infrastructure spend. AI inference runs on user devices.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="mb-4 rounded-lg bg-muted p-4">
                    <Code className="mb-2 h-8 w-8 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">WebGPU Integration</h3>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-green-400">
{`// On-device AI processing
import { pipeline } from "@huggingface/transformers";

const analyzer = await pipeline(
  "feature-extraction",
  "plant-health-model",
  { device: "webgpu" }
);

// All processing happens locally
const result = await analyzer(imageData);
// No data leaves the device`}
                  </pre>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Users' plant photos never leave their device. GDPR compliance built-in.
                  </p>
                </Card>
                
                <div className="flex justify-center">
                  <OptimizedImage
                    src={gdprCertified}
                    alt="GDPR Certified - Data Protection Compliance"
                    width={300}
                    height={150}
                    className="max-w-full w-auto h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="outline">
              The Complete Solution
            </Badge>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              Churn Reduction as a Service
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              LeafEngines provides the "How" (maintenance & location-specific care) after the "What" (identification). Powered by patent-protected multi-agency data integration + privacy-preserving on-device AI.
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="p-6 text-left">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Satellite className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Real-Time Satellite Intelligence</h3>
                <p className="text-muted-foreground">
                  AlphaEarth integration provides live NDVI, soil moisture, and thermal data for precise plant health monitoring.
                </p>
              </Card>

              <Card className="p-6 text-left">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">EPA Water Quality API</h3>
                <p className="text-muted-foreground">
                  Location-specific environmental warnings and contamination alerts protect your users' gardens.
                </p>
              </Card>

              <Card className="p-6 text-left">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Federal FIPS Location Intelligence</h3>
                <p className="text-muted-foreground">
                  Hyper-local soil composition, climate patterns, and growing conditions down to the county level.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why License vs. Build */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
              Why License Instead of Build?
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Save 18-24 Months</h3>
                </div>
                <p className="text-muted-foreground">
                  Our serverless microservices layer is production-ready. Skip the R&D phase and launch differentiated features this quarter.
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Patent Protection + Privacy</h3>
                </div>
                <p className="text-muted-foreground">
                  Our Environmental Compatibility Score methodology is patent-protected, and our WebGPU on-device AI gives you a GDPR compliance advantage competitors can't match.
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Zero Maintenance</h3>
                </div>
                <p className="text-muted-foreground">
                  We handle API versioning, data source updates, and infrastructure scaling. You focus on your core product.
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">SOC 2 Type 1 Compliant</h3>
                </div>
                <p className="text-muted-foreground">
                  Enterprise-grade security and compliance built-in. Meet regulatory requirements without additional engineering effort.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              From pay-as-you-go API calls to white-label enterprise solutions
            </p>

            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <Card className="p-6 text-left">
                <h3 className="mb-2 text-xl font-semibold text-foreground">Starter</h3>
                <p className="mb-4 text-3xl font-bold text-foreground">$500<span className="text-lg text-muted-foreground">/mo</span></p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>Environmental Intelligence API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>EPA Water Quality Integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>50,000 API calls/month</span>
                  </li>
                </ul>
              </Card>

              <Card className="border-primary p-6 text-left shadow-lg">
                <Badge className="mb-2">Most Popular</Badge>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Professional</h3>
                <p className="mb-4 text-3xl font-bold text-foreground">$1,500<span className="text-lg text-muted-foreground">/mo</span></p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>Everything in Starter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>Satellite Monitoring (AlphaEarth)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>250,000 API calls/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 text-left">
                <h3 className="mb-2 text-xl font-semibold text-foreground">Enterprise</h3>
                <p className="mb-4 text-3xl font-bold text-foreground">Custom</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>Everything in Professional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>White-label solutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>Unlimited API calls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>Dedicated support team</span>
                  </li>
                </ul>
              </Card>
            </div>

            <Button size="lg" asChild>
              <Link to="/pricing">View Full Pricing Details</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              Ready to Reduce Churn and Increase Retention?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join the plant identification apps transforming user identification into long-term plant care success.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/api-docs">
                  Explore API Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
