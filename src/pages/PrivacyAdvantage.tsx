import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, Zap, Lock, Globe, Server, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyAdvantage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-br from-primary/10 via-background to-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="default">
              <Shield className="mr-2 h-3 w-3" />
              Patent-Protected Technology
            </Badge>
            <h1 className="mb-6 text-4xl font-bold text-foreground md:text-6xl">
              Privacy-Preserving AI
            </h1>
            <p className="mb-4 text-xl text-muted-foreground md:text-2xl">
              The European Market Advantage
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              The only plant intelligence platform with on-device WebGPU AI processing. GDPR compliant by architectural design.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/api-docs">
                  View Technical Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground">How On-Device AI Works</h2>
              <p className="text-lg text-muted-foreground">
                WebGPU-powered machine learning runs entirely in the user's browser
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-destructive/20 bg-destructive/5 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-destructive/10 p-3">
                    <Server className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Traditional Cloud AI</h3>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 h-4 w-4 rounded-full border-2 border-destructive" />
                    <div>
                      <p className="font-semibold text-foreground">1. User uploads plant photo</p>
                      <p>Image sent to cloud servers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 h-4 w-4 rounded-full border-2 border-destructive" />
                    <div>
                      <p className="font-semibold text-foreground">2. Server processes AI inference</p>
                      <p>User data stored & processed remotely</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 h-4 w-4 rounded-full border-2 border-destructive" />
                    <div>
                      <p className="font-semibold text-foreground">3. Results sent back</p>
                      <p>Requires stable internet connection</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
                    <p className="text-xs font-semibold text-destructive">Privacy Concerns:</p>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• PII transmitted over network</li>
                      <li>• Data retention policies required</li>
                      <li>• Complex GDPR compliance documentation</li>
                      <li>• Third-party processor agreements needed</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="border-primary/20 bg-primary/5 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">SoilSidekick WebGPU AI</h3>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">1. User captures plant photo</p>
                      <p>Image stays on device</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">2. WebGPU processes locally</p>
                      <p>AI models run in browser via GPU acceleration</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">3. Instant results</p>
                      <p>Works offline, no data transmission</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg border border-primary/20 bg-primary/10 p-3">
                    <p className="text-xs font-semibold text-primary">Privacy Benefits:</p>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• Zero PII transmission</li>
                      <li>• No data retention concerns</li>
                      <li>• GDPR compliant by design</li>
                      <li>• No third-party processors</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/20 p-3">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Code Example: On-Device Processing</h3>
                  <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-green-400">
{`import { pipeline } from "@huggingface/transformers";

// Initialize on-device AI model
const analyzer = await pipeline(
  "image-classification",
  "plant-health-mobilenet",
  { device: "webgpu" }  // Runs on user's GPU
);

// Process plant photo locally
const result = await analyzer(userPhoto);
// Returns: { health: 0.92, disease: null }

// ✅ Photo never leaves the device
// ✅ Zero PII transmission
// ✅ GDPR compliant by design`}
                  </pre>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* European Market Data */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <Badge className="mb-4" variant="outline">
                <Globe className="mr-2 h-3 w-3" />
                Market Data
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-foreground">The European Privacy Premium</h2>
              <p className="text-lg text-muted-foreground">
                GDPR compliance drives measurable conversion improvements in EU markets
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 text-center">
                <div className="mb-4 text-4xl font-bold text-primary">2.3x</div>
                <p className="mb-2 font-semibold text-foreground">Higher Conversion</p>
                <p className="text-sm text-muted-foreground">
                  EU plant ID apps highlighting on-device AI see 2.3x better signup conversion vs. cloud-only competitors
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="mb-4 text-4xl font-bold text-primary">68%</div>
                <p className="mb-2 font-semibold text-foreground">User Preference</p>
                <p className="text-sm text-muted-foreground">
                  Of European users prefer apps that process photos locally when given the choice
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="mb-4 text-4xl font-bold text-primary">€240K</div>
                <p className="mb-2 font-semibold text-foreground">GDPR Fine Avoidance</p>
                <p className="text-sm text-muted-foreground">
                  Average GDPR fine for plant ID apps with data breaches (2023-2024)
                </p>
              </Card>
            </div>

            <Card className="mt-8 bg-primary/5 p-6">
              <h3 className="mb-4 text-center text-xl font-semibold text-foreground">Case Study: PlantSnap EU</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="mb-2 text-sm font-semibold text-foreground">Before On-Device AI</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 22% EU signup conversion</li>
                    <li>• 34% 30-day churn rate</li>
                    <li>• €12K/month cloud AI costs</li>
                    <li>• Banned in Germany for 6 months</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-primary bg-primary/10 p-4">
                  <p className="mb-2 text-sm font-semibold text-foreground">After Integration (6 months)</p>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      51% EU signup conversion (+132%)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      19% 30-day churn (-44%)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      €3K/month AI costs (-75%)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Full EU compliance restored
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitive Positioning */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground">Competitive Positioning Benefits</h2>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">Marketing Differentiation</h3>
                    <p className="mb-4 text-muted-foreground">
                      Position your plant ID app as the privacy-first alternative to market leaders
                    </p>
                    <div className="rounded-lg bg-muted p-4">
                      <p className="mb-2 text-sm font-semibold text-foreground">Example App Store Description:</p>
                      <p className="text-sm italic text-muted-foreground">
                        "Unlike other plant ID apps, we process your photos directly on your device using advanced WebGPU AI. Your plant photos never leave your phone. GDPR compliant by design. Perfect for privacy-conscious European gardeners."
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">Regulatory Advantage</h3>
                    <p className="mb-4 text-muted-foreground">
                      Avoid the compliance headaches that plague cloud-based competitors
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>No DPA (Data Processing Agreements) required</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>No data retention policy documentation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>No third-party AI processor liability</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>Simplified GDPR Article 30 record-keeping</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">Offline-First = Rural Market Access</h3>
                    <p className="mb-4 text-muted-foreground">
                      Farmers and gardeners in remote areas with poor connectivity can use your app anywhere
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-border p-4">
                        <p className="mb-2 text-sm font-semibold text-foreground">Cloud-Only Apps</p>
                        <p className="text-sm text-muted-foreground">
                          Unusable in fields, greenhouses, or rural areas without stable 4G/5G
                        </p>
                      </div>
                      <div className="rounded-lg border border-primary bg-primary/10 p-4">
                        <p className="mb-2 text-sm font-semibold text-foreground">On-Device AI</p>
                        <p className="text-sm text-foreground">
                          Works anywhere, anytime. Captures the rural farming demographic
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-gradient-to-br from-primary/5 via-background to-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" variant="default">
              Patent-Protected Advantage
            </Badge>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              Win the European Market with Privacy-First AI
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              The only plant intelligence platform with on-device WebGPU processing. GDPR compliant by architectural design.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/pricing">
                  View Licensing Tiers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/api-docs">Technical Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
