import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Globe, MapPin, DollarSign, Users, Rocket } from "lucide-react";

const GlobalMarketComparison = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="mb-4" variant="secondary">
            <Globe className="w-3 h-3 mr-1" />
            Market Analysis Update
          </Badge>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Global B2B API Market vs US-Only B2C Market
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comparing the total addressable market for Environmental Intelligence APIs 
            versus the original US consumer agricultural market
          </p>
        </div>

        {/* Executive Summary */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Market Expansion Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border">
                <div className="text-3xl font-bold text-primary">47.8×</div>
                <div className="text-sm text-muted-foreground">Market Size Multiplier</div>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border">
                <div className="text-3xl font-bold text-primary">$2.39B</div>
                <div className="text-sm text-muted-foreground">Year 5 Revenue Potential (Global B2B)</div>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border">
                <div className="text-3xl font-bold text-primary">195 Countries</div>
                <div className="text-sm text-muted-foreground">Addressable Markets</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* US-Only B2C Market (Original) */}
          <Card className="border-orange-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Original Model: US-Only B2C
                </CardTitle>
                <Badge variant="outline" className="border-orange-500/50 text-orange-500">
                  Previous Strategy
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Market Assumptions */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Target Market
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>US Farmers</span>
                    <span className="font-mono">2.0M</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Agricultural Professionals</span>
                    <span className="font-mono">250K</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Agronomists/Consultants</span>
                    <span className="font-mono">75K</span>
                  </div>
                  <div className="flex justify-between p-2 bg-primary/10 rounded font-semibold">
                    <span>Total Addressable Market</span>
                    <span className="font-mono">2.325M users</span>
                  </div>
                </div>
              </div>

              {/* 5-Year Projections */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  5-Year Revenue Projection
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Year 1</span>
                    <span className="font-mono">$2.8M</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Year 2</span>
                    <span className="font-mono">$12.5M</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Year 3</span>
                    <span className="font-mono">$28.4M</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Year 4</span>
                    <span className="font-mono">$42.1M</span>
                  </div>
                  <div className="flex justify-between p-2 bg-orange-500/10 rounded font-semibold">
                    <span>Year 5</span>
                    <span className="font-mono text-orange-500">$50.0M</span>
                  </div>
                </div>
              </div>

              {/* Challenges */}
              <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-orange-500">Key Challenges</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• High customer acquisition cost ($50-150 per user)</li>
                  <li>• Competing with established ag-tech platforms</li>
                  <li>• Limited to US market (USDA/EPA data)</li>
                  <li>• Direct consumer marketing required</li>
                  <li>• Long sales cycles for enterprise</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Global B2B API Market (New) */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  New Model: Global B2B API
                </CardTitle>
                <Badge variant="default" className="bg-primary">
                  Current Strategy
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Market Assumptions */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Target Market
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Global Plant ID App Users</span>
                    <span className="font-mono">450M+</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Mid-Tier Apps (Direct Licensees)</span>
                    <span className="font-mono">2,500+</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Agricultural Apps</span>
                    <span className="font-mono">8,000+</span>
                  </div>
                  <div className="flex justify-between p-2 bg-primary/10 rounded font-semibold">
                    <span>Total Addressable Market</span>
                    <span className="font-mono">10,500+ apps</span>
                  </div>
                </div>
              </div>

              {/* 5-Year Projections */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  5-Year Revenue Projection
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Year 1</span>
                    <span className="font-mono">$145M</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Year 2</span>
                    <span className="font-mono">$487M</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Year 3</span>
                    <span className="font-mono">$1.12B</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Year 4</span>
                    <span className="font-mono">$1.84B</span>
                  </div>
                  <div className="flex justify-between p-2 bg-primary/10 rounded font-semibold">
                    <span>Year 5</span>
                    <span className="font-mono text-primary">$2.39B</span>
                  </div>
                </div>
              </div>

              {/* Advantages */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-primary">Strategic Advantages</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Zero customer acquisition cost (B2B model)</li>
                  <li>• Competitors become customers</li>
                  <li>• Global reach (195 countries)</li>
                  <li>• API infrastructure scales infinitely</li>
                  <li>• Patent protection (18-month exclusivity)</li>
                  <li>• GDPR compliance as competitive moat</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Market Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Global B2B Market Size Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Market Segment</th>
                    <th className="text-right p-3 font-semibold">Apps</th>
                    <th className="text-right p-3 font-semibold">Avg Users/App</th>
                    <th className="text-right p-3 font-semibold">Total Users</th>
                    <th className="text-right p-3 font-semibold">Year 5 ARR Potential</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-muted/50">
                    <td className="p-3">
                      <div className="font-medium">Premium Plant ID Apps</div>
                      <div className="text-xs text-muted-foreground">PlantNet, iNaturalist, Seek</div>
                    </td>
                    <td className="text-right p-3 font-mono">2,500</td>
                    <td className="text-right p-3 font-mono">180K</td>
                    <td className="text-right p-3 font-mono">450M</td>
                    <td className="text-right p-3 font-mono font-semibold text-primary">$1.8B</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-3">
                      <div className="font-medium">Agricultural Apps</div>
                      <div className="text-xs text-muted-foreground">Farm management, precision ag</div>
                    </td>
                    <td className="text-right p-3 font-mono">8,000</td>
                    <td className="text-right p-3 font-mono">15K</td>
                    <td className="text-right p-3 font-mono">120M</td>
                    <td className="text-right p-3 font-mono font-semibold text-primary">$384M</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-3">
                      <div className="font-medium">Gardening/Landscaping Apps</div>
                      <div className="text-xs text-muted-foreground">Consumer gardening tools</div>
                    </td>
                    <td className="text-right p-3 font-mono">5,200</td>
                    <td className="text-right p-3 font-mono">25K</td>
                    <td className="text-right p-3 font-mono">130M</td>
                    <td className="text-right p-3 font-mono font-semibold text-primary">$156M</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-3">
                      <div className="font-medium">Environmental Research</div>
                      <div className="text-xs text-muted-foreground">Academic, govt, NGO platforms</div>
                    </td>
                    <td className="text-right p-3 font-mono">800</td>
                    <td className="text-right p-3 font-mono">8K</td>
                    <td className="text-right p-3 font-mono">6.4M</td>
                    <td className="text-right p-3 font-mono font-semibold text-primary">$48M</td>
                  </tr>
                  <tr className="bg-primary/5 font-semibold">
                    <td className="p-3">TOTAL</td>
                    <td className="text-right p-3 font-mono">16,500</td>
                    <td className="text-right p-3 font-mono">—</td>
                    <td className="text-right p-3 font-mono">706.4M</td>
                    <td className="text-right p-3 font-mono text-primary text-lg">$2.39B</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Average Revenue Per App (Year 5)</div>
                <div className="text-2xl font-bold text-primary">$144,850</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">API Call Volume (Year 5)</div>
                <div className="text-2xl font-bold text-primary">119.5B calls</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Average Price Per Call</div>
                <div className="text-2xl font-bold text-primary">$0.020</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution (Year 5 Revenue)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-semibold">North America</div>
                  <div className="text-xs text-muted-foreground">US, Canada, Mexico</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-primary">$717M</div>
                  <div className="text-xs text-muted-foreground">30%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-semibold">Europe</div>
                  <div className="text-xs text-muted-foreground">EU, UK, Switzerland (GDPR priority)</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-primary">$645M</div>
                  <div className="text-xs text-muted-foreground">27%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-semibold">Asia-Pacific</div>
                  <div className="text-xs text-muted-foreground">China, India, Japan, Australia</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-primary">$598M</div>
                  <div className="text-xs text-muted-foreground">25%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-semibold">Latin America</div>
                  <div className="text-xs text-muted-foreground">Brazil, Argentina, Chile</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-primary">$286M</div>
                  <div className="text-xs text-muted-foreground">12%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-semibold">Rest of World</div>
                  <div className="text-xs text-muted-foreground">Africa, Middle East</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-primary">$143M</div>
                  <div className="text-xs text-muted-foreground">6%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategic Recommendation */}
        <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-background">
          <CardHeader>
            <CardTitle className="text-2xl">Strategic Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              The pivot from US-only B2C to global B2B API licensing represents a <strong className="text-primary">47.8× market expansion</strong> (from $50M to $2.39B in Year 5 revenue potential). The B2B model eliminates customer acquisition costs, converts competitors into customers, and leverages patent protection to create an 18-month competitive moat.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-background border border-primary/20 rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">Immediate Actions (90 Days)</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Secure 5 LOIs from mid-tier Plant ID apps</li>
                  <li>✓ Launch API sandbox with GDPR compliance demo</li>
                  <li>✓ Target European apps (privacy compliance advantage)</li>
                  <li>✓ Present at Plant ID industry conferences</li>
                </ul>
              </div>
              <div className="p-4 bg-background border border-primary/20 rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">Medium-Term (6-12 Months)</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Achieve 50+ paying licensees</li>
                  <li>✓ Expand to agricultural app market</li>
                  <li>✓ Build enterprise sales team</li>
                  <li>✓ Patent commercialization strategy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalMarketComparison;
