import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MapPin, Database, Zap } from "lucide-react";

const BusinessCase = () => {
  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      <div className="container mx-auto px-4 py-12 max-w-6xl slide-in-up">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            Market Potential Study: Revised Analysis
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            5-Year Revenue Projections with ADAPT Standard 1.0 Integration & GPS Features
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              ADAPT 1.0 Integration
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              GPS/Geolocation
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Enhanced API Suite
            </Badge>
          </div>
        </div>

        {/* Key Market Drivers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Enhanced Value Proposition with ADAPT & GPS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">ADAPT Standard 1.0 Integration</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Seamless data export to major farm management systems (John Deere, Case IH, AgLeader)</li>
                  <li>• 40% reduction in data entry time for commercial operators</li>
                  <li>• Compliance with industry standard formats accelerates enterprise adoption</li>
                  <li>• Unlocks white-label opportunities with equipment manufacturers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">GPS/Geolocation Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Precise field mapping and zone management capabilities</li>
                  <li>• Enhanced soil variability analysis for precision agriculture</li>
                  <li>• Integration with existing farm boundaries and management zones</li>
                  <li>• Mobile-first data collection with automatic location tagging</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Assumptions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Assumptions & Growth Drivers</CardTitle>
            <CardDescription>Market foundation and penetration logic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Total Addressable Market (TAM)</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>53M</strong> U.S. gardening households (National Gardening Survey 2023)</li>
                  <li><strong>1.4M</strong> farms (USDA Census 2022)</li>
                  <li><strong>~2.5K</strong> North American ag-tech companies</li>
                  <li><strong>Growing:</strong> ADAPT-compatible equipment manufacturers seeking soil data APIs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Enhanced Penetration Logic</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Commercial acceleration:</strong> ADAPT integration reduces trial-to-adoption time by 60%</li>
                  <li><strong>API monetization:</strong> GPS-enabled data commands 2-3x premium in B2B licensing</li>
                  <li><strong>Ecosystem network effects:</strong> Integration partnerships drive organic growth</li>
                  <li><strong>Retention improvement:</strong> Standards compliance increases switching costs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5-Year Projections */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5-Year Revenue Projections (USD)</CardTitle>
            <CardDescription>Conservative growth model with enhanced feature set</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Metric</th>
                    <th className="text-right py-2">Year 1</th>
                    <th className="text-right py-2">Year 2</th>
                    <th className="text-right py-2">Year 3</th>
                    <th className="text-right py-2">Year 4</th>
                    <th className="text-right py-2">Year 5</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-2 font-medium">Total Active Users</td>
                    <td className="text-right py-2">485,000</td>
                    <td className="text-right py-2">1,250,000</td>
                    <td className="text-right py-2">2,400,000</td>
                    <td className="text-right py-2">3,850,000</td>
                    <td className="text-right py-2">5,500,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Basic (90%→85%)</td>
                    <td className="text-right py-2">436,500</td>
                    <td className="text-right py-2">1,125,000</td>
                    <td className="text-right py-2">2,112,000</td>
                    <td className="text-right py-2">3,311,000</td>
                    <td className="text-right py-2">4,675,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Pro (9%→14%)</td>
                    <td className="text-right py-2">43,650</td>
                    <td className="text-right py-2">112,500</td>
                    <td className="text-right py-2">336,000</td>
                    <td className="text-right py-2">539,000</td>
                    <td className="text-right py-2">770,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">API-Enterprise (1%)</td>
                    <td className="text-right py-2">4,850</td>
                    <td className="text-right py-2">12,500</td>
                    <td className="text-right py-2">24,000</td>
                    <td className="text-right py-2">38,500</td>
                    <td className="text-right py-2">55,000</td>
                  </tr>
                  <tr className="border-b bg-secondary/10">
                    <td className="py-2 font-semibold">Annual Recurring Revenue</td>
                    <td className="text-right py-2 font-semibold">$2.8M</td>
                    <td className="text-right py-2 font-semibold">$8.2M</td>
                    <td className="text-right py-2 font-semibold">$18.5M</td>
                    <td className="text-right py-2 font-semibold">$32.1M</td>
                    <td className="text-right py-2 font-semibold">$48.9M</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Basic Tier Revenue</td>
                    <td className="text-right py-2">$392K</td>
                    <td className="text-right py-2">$1.01M</td>
                    <td className="text-right py-2">$1.90M</td>
                    <td className="text-right py-2">$2.98M</td>
                    <td className="text-right py-2">$4.21M</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Pro Tier Revenue</td>
                    <td className="text-right py-2">$1.31M</td>
                    <td className="text-right py-2">$3.38M</td>
                    <td className="text-right py-2">$10.08M</td>
                    <td className="text-right py-2">$16.17M</td>
                    <td className="text-right py-2">$23.10M</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">API-Enterprise Revenue</td>
                    <td className="text-right py-2">$1.16M</td>
                    <td className="text-right py-2">$3.75M</td>
                    <td className="text-right py-2">$7.20M</td>
                    <td className="text-right py-2">$11.55M</td>
                    <td className="text-right py-2">$16.50M</td>
                  </tr>
                  <tr className="bg-primary/10">
                    <td className="py-2 font-semibold">ADAPT Integration Premium</td>
                    <td className="text-right py-2 font-semibold">$85K</td>
                    <td className="text-right py-2 font-semibold">$275K</td>
                    <td className="text-right py-2 font-semibold">$750K</td>
                    <td className="text-right py-2 font-semibold">$1.45M</td>
                    <td className="text-right py-2 font-semibold">$2.85M</td>
                  </tr>
                  <tr className="bg-primary/10">
                    <td className="py-2 font-semibold">GPS Data Licensing</td>
                    <td className="text-right py-2 font-semibold">$45K</td>
                    <td className="text-right py-2 font-semibold">$195K</td>
                    <td className="text-right py-2 font-semibold">$580K</td>
                    <td className="text-right py-2 font-semibold">$1.15M</td>
                    <td className="text-right py-2 font-semibold">$2.25M</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Revenue Drivers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enhanced Revenue Drivers</CardTitle>
            <CardDescription>New monetization opportunities with ADAPT & GPS integration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">ADAPT Integration Premium</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  20% uplift on Pro/Enterprise subscriptions for ADAPT export capabilities
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Equipment manufacturer partnerships</li>
                  <li>• Reduced customer acquisition cost</li>
                  <li>• Higher retention through ecosystem lock-in</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">GPS Data Licensing</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  B2B revenue from anonymized, location-tagged soil insights
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Agricultural research institutions</li>
                  <li>• Government soil monitoring programs</li>
                  <li>• Environmental consulting firms</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">White-Label Opportunities</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  ADAPT compliance opens equipment OEM partnerships
                </p>
                <ul className="text-xs space-y-1">
                  <li>• John Deere Operations Center integration</li>
                  <li>• Case IH AFS Connect partnerships</li>
                  <li>• Regional distributor white-labeling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Mitigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Risk Factors & Mitigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-destructive">Risk Factors</h4>
                <ul className="space-y-2 text-sm">
                  <li>• On-farm digital infrastructure gaps in rural areas</li>
                  <li>• Consolidation reducing total farm count</li>
                  <li>• Incumbent farm management suites bundling soil analytics</li>
                  <li>• ADAPT standard evolution requiring ongoing compliance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-600">Mitigation Strategies</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Offline-capable mobile apps with sync capabilities</li>
                  <li>• Focus on larger, tech-forward operations for commercial tiers</li>
                  <li>• API-first architecture enables integration vs. competition</li>
                  <li>• Active ADAPT working group participation ensures standard alignment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategic Conclusion */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic Analysis & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="mb-4">
                <strong>Market Position:</strong> ADAPT Standard 1.0 integration and GPS capabilities fundamentally strengthen our value proposition across all customer segments. Medium and large farms, together with ag-tech vendors, represent only 15% of potential users by Year 5 but are projected to contribute ~78% of total ARR due to enhanced enterprise features.
              </p>
              
              <p className="mb-4">
                <strong>Commercial Focus:</strong> The combination of ADAPT compliance and precision GPS data positions us as infrastructure rather than application, reducing competitive risk from incumbent farm management platforms. White-label API integrations with equipment manufacturers should receive disproportionate sales and product resources, as they provide both revenue diversification and customer acquisition cost reduction.
              </p>
              
              <p className="mb-4">
                <strong>Monetization Strategy:</strong> While the gardening segment continues to build brand awareness and provides valuable anonymized data for enterprise models, sustainable monetization hinges on converting precision agriculture operations to Pro subscriptions and licensing GPS-tagged soil insights to research institutions and government programs.
              </p>
              
              <p>
                <strong>Growth Catalyst:</strong> ADAPT integration reduces enterprise sales cycles from 12-18 months to 6-9 months by eliminating technical integration barriers. This acceleration, combined with GPS-enabled precision capabilities, supports the projected shift from 90/9/1% to 85/14/1% tier distribution while maintaining conservative penetration assumptions in the underlying TAM segments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessCase;