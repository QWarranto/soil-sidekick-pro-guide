import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Users, DollarSign, Calendar, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RevenueProjections = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="mb-4" variant="secondary">
            <Target className="w-3 h-3 mr-1" />
            5-Year Revenue Buildout
          </Badge>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            LeafEngines™ Revenue Projections
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Quarterly milestones and customer acquisition targets for $75M (Conservative) and $120M (Aggressive) ARR scenarios
          </p>
        </div>

        {/* Key Assumptions */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Strategic Assumptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">Market Entry Strategy</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ 18-month patent exclusivity window (no direct competitors)</li>
                  <li>✓ Focus on European apps first (GDPR compliance advantage)</li>
                  <li>✓ Mid-tier Plant ID apps as initial beachhead (2,500 apps)</li>
                  <li>✓ Agricultural apps as secondary expansion (8,000 apps)</li>
                  <li>✓ Enterprise sales cycles: 6-9 months average</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-lg">Revenue Model</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Tiered pricing: Starter ($500/mo), Professional ($1,500/mo), Enterprise (custom)</li>
                  <li>✓ Pay-as-you-go overage: $0.02 per API call</li>
                  <li>✓ Annual contracts with monthly billing</li>
                  <li>✓ Churn rate: 8-12% annually (industry standard for API services)</li>
                  <li>✓ Expansion revenue: 20-35% of customers upgrade tiers annually</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Tabs */}
        <Tabs defaultValue="conservative" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="conservative">Conservative ($75M)</TabsTrigger>
            <TabsTrigger value="aggressive">Aggressive ($120M)</TabsTrigger>
          </TabsList>

          {/* Conservative Scenario */}
          <TabsContent value="conservative" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Conservative Scenario: $75M Year 5 ARR
                  </CardTitle>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-500">
                    3% Market Penetration
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Total Customers Year 5</div>
                    <div className="text-2xl font-bold text-blue-500">495</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Avg ARR Per Customer</div>
                    <div className="text-2xl font-bold text-blue-500">$151K</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Monthly Churn Rate</div>
                    <div className="text-2xl font-bold text-blue-500">1.0%</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Market Share</div>
                    <div className="text-2xl font-bold text-blue-500">3.0%</div>
                  </div>
                </div>

                {/* Quarterly Breakdown */}
                <div className="overflow-x-auto">
                  <h3 className="font-semibold mb-4 text-lg">Quarterly Customer & Revenue Targets</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Period</th>
                        <th className="text-right p-3 font-semibold">New Customers</th>
                        <th className="text-right p-3 font-semibold">Total Active</th>
                        <th className="text-right p-3 font-semibold">Quarterly Revenue</th>
                        <th className="text-right p-3 font-semibold">ARR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {/* Year 1 */}
                      <tr className="bg-blue-500/5">
                        <td colSpan={5} className="p-3 font-semibold text-blue-500">YEAR 1: Foundation & Initial Sales</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q1 2025</td>
                        <td className="text-right p-3 font-mono">5</td>
                        <td className="text-right p-3 font-mono">5</td>
                        <td className="text-right p-3 font-mono">$8K</td>
                        <td className="text-right p-3 font-mono">$30K</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q2 2025</td>
                        <td className="text-right p-3 font-mono">12</td>
                        <td className="text-right p-3 font-mono">17</td>
                        <td className="text-right p-3 font-mono">$45K</td>
                        <td className="text-right p-3 font-mono">$180K</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q3 2025</td>
                        <td className="text-right p-3 font-mono">18</td>
                        <td className="text-right p-3 font-mono">35</td>
                        <td className="text-right p-3 font-mono">$125K</td>
                        <td className="text-right p-3 font-mono">$500K</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q4 2025</td>
                        <td className="text-right p-3 font-mono">25</td>
                        <td className="text-right p-3 font-mono">59</td>
                        <td className="text-right p-3 font-mono">$285K</td>
                        <td className="text-right p-3 font-mono font-semibold text-blue-500">$1.14M</td>
                      </tr>
                      
                      {/* Year 2 */}
                      <tr className="bg-blue-500/5">
                        <td colSpan={5} className="p-3 font-semibold text-blue-500">YEAR 2: Momentum Building</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q1 2026</td>
                        <td className="text-right p-3 font-mono">32</td>
                        <td className="text-right p-3 font-mono">90</td>
                        <td className="text-right p-3 font-mono">$625K</td>
                        <td className="text-right p-3 font-mono">$2.5M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q2 2026</td>
                        <td className="text-right p-3 font-mono">38</td>
                        <td className="text-right p-3 font-mono">127</td>
                        <td className="text-right p-3 font-mono">$1.15M</td>
                        <td className="text-right p-3 font-mono">$4.6M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q3 2026</td>
                        <td className="text-right p-3 font-mono">42</td>
                        <td className="text-right p-3 font-mono">168</td>
                        <td className="text-right p-3 font-mono">$1.95M</td>
                        <td className="text-right p-3 font-mono">$7.8M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q4 2026</td>
                        <td className="text-right p-3 font-mono">45</td>
                        <td className="text-right p-3 font-mono">212</td>
                        <td className="text-right p-3 font-mono">$2.95M</td>
                        <td className="text-right p-3 font-mono font-semibold text-blue-500">$11.8M</td>
                      </tr>

                      {/* Year 3 */}
                      <tr className="bg-blue-500/5">
                        <td colSpan={5} className="p-3 font-semibold text-blue-500">YEAR 3: Scale & Expansion</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q1 2027</td>
                        <td className="text-right p-3 font-mono">48</td>
                        <td className="text-right p-3 font-mono">258</td>
                        <td className="text-right p-3 font-mono">$5.1M</td>
                        <td className="text-right p-3 font-mono">$20.4M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q2 2027</td>
                        <td className="text-right p-3 font-mono">50</td>
                        <td className="text-right p-3 font-mono">306</td>
                        <td className="text-right p-3 font-mono">$7.5M</td>
                        <td className="text-right p-3 font-mono">$30M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q3 2027</td>
                        <td className="text-right p-3 font-mono">52</td>
                        <td className="text-right p-3 font-mono">356</td>
                        <td className="text-right p-3 font-mono">$10.2M</td>
                        <td className="text-right p-3 font-mono">$40.8M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q4 2027</td>
                        <td className="text-right p-3 font-mono">54</td>
                        <td className="text-right p-3 font-mono">408</td>
                        <td className="text-right p-3 font-mono">$12.8M</td>
                        <td className="text-right p-3 font-mono font-semibold text-blue-500">$51.2M</td>
                      </tr>

                      {/* Year 4 */}
                      <tr className="bg-blue-500/5">
                        <td colSpan={5} className="p-3 font-semibold text-blue-500">YEAR 4: Market Leadership</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q1 2028</td>
                        <td className="text-right p-3 font-mono">24</td>
                        <td className="text-right p-3 font-mono">430</td>
                        <td className="text-right p-3 font-mono">$14.8M</td>
                        <td className="text-right p-3 font-mono">$59.2M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q2 2028</td>
                        <td className="text-right p-3 font-mono">22</td>
                        <td className="text-right p-3 font-mono">450</td>
                        <td className="text-right p-3 font-mono">$16.2M</td>
                        <td className="text-right p-3 font-mono">$64.8M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q3 2028</td>
                        <td className="text-right p-3 font-mono">20</td>
                        <td className="text-right p-3 font-mono">468</td>
                        <td className="text-right p-3 font-mono">$17.1M</td>
                        <td className="text-right p-3 font-mono">$68.4M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q4 2028</td>
                        <td className="text-right p-3 font-mono">18</td>
                        <td className="text-right p-3 font-mono">484</td>
                        <td className="text-right p-3 font-mono">$17.8M</td>
                        <td className="text-right p-3 font-mono font-semibold text-blue-500">$71.2M</td>
                      </tr>

                      {/* Year 5 */}
                      <tr className="bg-blue-500/5">
                        <td colSpan={5} className="p-3 font-semibold text-blue-500">YEAR 5: Optimization & Efficiency</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q1 2029</td>
                        <td className="text-right p-3 font-mono">10</td>
                        <td className="text-right p-3 font-mono">492</td>
                        <td className="text-right p-3 font-mono">$18.2M</td>
                        <td className="text-right p-3 font-mono">$72.8M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q2 2029</td>
                        <td className="text-right p-3 font-mono">8</td>
                        <td className="text-right p-3 font-mono">498</td>
                        <td className="text-right p-3 font-mono">$18.5M</td>
                        <td className="text-right p-3 font-mono">$74M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q3 2029</td>
                        <td className="text-right p-3 font-mono">6</td>
                        <td className="text-right p-3 font-mono">502</td>
                        <td className="text-right p-3 font-mono">$18.7M</td>
                        <td className="text-right p-3 font-mono">$74.8M</td>
                      </tr>
                      <tr className="hover:bg-muted/50 bg-blue-500/10">
                        <td className="p-3 font-semibold">Q4 2029</td>
                        <td className="text-right p-3 font-mono font-semibold">5</td>
                        <td className="text-right p-3 font-mono font-semibold">495</td>
                        <td className="text-right p-3 font-mono font-semibold">$18.8M</td>
                        <td className="text-right p-3 font-mono font-semibold text-lg text-blue-500">$75M</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Critical Milestones */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-4 text-lg">Critical Milestones & Derisking Events</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">90-Day Checkpoint (Q1 2025)</p>
                        <p className="text-xs text-muted-foreground">5 LOIs secured from European Plant ID apps. Validates GDPR advantage and pricing model.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">6-Month Checkpoint (Q2 2025)</p>
                        <p className="text-xs text-muted-foreground">17 paying customers, $180K ARR. Proves repeatable sales motion and API stability.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Year 1 Exit (Q4 2025)</p>
                        <p className="text-xs text-muted-foreground">59 customers, $1.14M ARR. Establishes product-market fit and enables Series A fundraising.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Patent Expiration (Q2 2026)</p>
                        <p className="text-xs text-muted-foreground">212 customers, $11.8M ARR by end of exclusive window. Strong market position before competitors emerge.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aggressive Scenario */}
          <TabsContent value="aggressive" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Aggressive Scenario: $120M Year 5 ARR
                  </CardTitle>
                  <Badge variant="default">
                    5% Market Penetration
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Total Customers Year 5</div>
                    <div className="text-2xl font-bold text-primary">825</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Avg ARR Per Customer</div>
                    <div className="text-2xl font-bold text-primary">$145K</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Monthly Churn Rate</div>
                    <div className="text-2xl font-bold text-primary">0.8%</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Market Share</div>
                    <div className="text-2xl font-bold text-primary">5.0%</div>
                  </div>
                </div>

                {/* Quarterly Breakdown */}
                <div className="overflow-x-auto">
                  <h3 className="font-semibold mb-4 text-lg">Quarterly Customer & Revenue Targets</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Period</th>
                        <th className="text-right p-3 font-semibold">New Customers</th>
                        <th className="text-right p-3 font-semibold">Total Active</th>
                        <th className="text-right p-3 font-semibold">Quarterly Revenue</th>
                        <th className="text-right p-3 font-semibold">ARR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {/* Year 1 */}
                      <tr className="bg-primary/5">
                        <td colSpan={5} className="p-3 font-semibold text-primary">YEAR 1: Aggressive Market Entry</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q1 2025</td>
                        <td className="text-right p-3 font-mono">8</td>
                        <td className="text-right p-3 font-mono">8</td>
                        <td className="text-right p-3 font-mono">$15K</td>
                        <td className="text-right p-3 font-mono">$60K</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q2 2025</td>
                        <td className="text-right p-3 font-mono">22</td>
                        <td className="text-right p-3 font-mono">30</td>
                        <td className="text-right p-3 font-mono">$95K</td>
                        <td className="text-right p-3 font-mono">$380K</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q3 2025</td>
                        <td className="text-right p-3 font-mono">35</td>
                        <td className="text-right p-3 font-mono">65</td>
                        <td className="text-right p-3 font-mono">$285K</td>
                        <td className="text-right p-3 font-mono">$1.14M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q4 2025</td>
                        <td className="text-right p-3 font-mono">48</td>
                        <td className="text-right p-3 font-mono">112</td>
                        <td className="text-right p-3 font-mono">$625K</td>
                        <td className="text-right p-3 font-mono font-semibold text-primary">$2.5M</td>
                      </tr>
                      
                      {/* Year 2 */}
                      <tr className="bg-primary/5">
                        <td colSpan={5} className="p-3 font-semibold text-primary">YEAR 2: Rapid Scaling</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q1 2026</td>
                        <td className="text-right p-3 font-mono">62</td>
                        <td className="text-right p-3 font-mono">173</td>
                        <td className="text-right p-3 font-mono">$1.45M</td>
                        <td className="text-right p-3 font-mono">$5.8M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q2 2026</td>
                        <td className="text-right p-3 font-mono">72</td>
                        <td className="text-right p-3 font-mono">244</td>
                        <td className="text-right p-3 font-mono">$2.65M</td>
                        <td className="text-right p-3 font-mono">$10.6M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q3 2026</td>
                        <td className="text-right p-3 font-mono">80</td>
                        <td className="text-right p-3 font-mono">323</td>
                        <td className="text-right p-3 font-mono">$4.5M</td>
                        <td className="text-right p-3 font-mono">$18M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q4 2026</td>
                        <td className="text-right p-3 font-mono">85</td>
                        <td className="text-right p-3 font-mono">407</td>
                        <td className="text-right p-3 font-mono">$6.8M</td>
                        <td className="text-right p-3 font-mono font-semibold text-primary">$27.2M</td>
                      </tr>

                      {/* Year 3 */}
                      <tr className="bg-primary/5">
                        <td colSpan={5} className="p-3 font-semibold text-primary">YEAR 3: Market Dominance</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q1 2027</td>
                        <td className="text-right p-3 font-mono">92</td>
                        <td className="text-right p-3 font-mono">498</td>
                        <td className="text-right p-3 font-mono">$11.5M</td>
                        <td className="text-right p-3 font-mono">$46M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q2 2027</td>
                        <td className="text-right p-3 font-mono">95</td>
                        <td className="text-right p-3 font-mono">592</td>
                        <td className="text-right p-3 font-mono">$16.8M</td>
                        <td className="text-right p-3 font-mono">$67.2M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q3 2027</td>
                        <td className="text-right p-3 font-mono">96</td>
                        <td className="text-right p-3 font-mono">687</td>
                        <td className="text-right p-3 font-mono">$22.8M</td>
                        <td className="text-right p-3 font-mono">$91.2M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q4 2027</td>
                        <td className="text-right p-3 font-mono">98</td>
                        <td className="text-right p-3 font-mono">784</td>
                        <td className="text-right p-3 font-mono">$28.5M</td>
                        <td className="text-right p-3 font-mono font-semibold text-primary">$114M</td>
                      </tr>

                      {/* Year 4 */}
                      <tr className="bg-primary/5">
                        <td colSpan={5} className="p-3 font-semibold text-primary">YEAR 4: Consolidation</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q1 2028</td>
                        <td className="text-right p-3 font-mono">18</td>
                        <td className="text-right p-3 font-mono">800</td>
                        <td className="text-right p-3 font-mono">$29.2M</td>
                        <td className="text-right p-3 font-mono">$116.8M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q2 2028</td>
                        <td className="text-right p-3 font-mono">16</td>
                        <td className="text-right p-3 font-mono">814</td>
                        <td className="text-right p-3 font-mono">$29.6M</td>
                        <td className="text-right p-3 font-mono">$118.4M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q3 2028</td>
                        <td className="text-right p-3 font-mono">14</td>
                        <td className="text-right p-3 font-mono">826</td>
                        <td className="text-right p-3 font-mono">$29.9M</td>
                        <td className="text-right p-3 font-mono">$119.6M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q4 2028</td>
                        <td className="text-right p-3 font-mono">12</td>
                        <td className="text-right p-3 font-mono">836</td>
                        <td className="text-right p-3 font-mono">$30.1M</td>
                        <td className="text-right p-3 font-mono font-semibold text-primary">$120.4M</td>
                      </tr>

                      {/* Year 5 */}
                      <tr className="bg-primary/5">
                        <td colSpan={5} className="p-3 font-semibold text-primary">YEAR 5: Sustained Growth</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q1 2029</td>
                        <td className="text-right p-3 font-mono">10</td>
                        <td className="text-right p-3 font-mono">844</td>
                        <td className="text-right p-3 font-mono">$30.3M</td>
                        <td className="text-right p-3 font-mono">$121.2M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q2 2029</td>
                        <td className="text-right p-3 font-mono">-12</td>
                        <td className="text-right p-3 font-mono">832</td>
                        <td className="text-right p-3 font-mono">$29.8M</td>
                        <td className="text-right p-3 font-mono">$119.2M</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Q3 2029</td>
                        <td className="text-right p-3 font-mono">-8</td>
                        <td className="text-right p-3 font-mono">824</td>
                        <td className="text-right p-3 font-mono">$29.9M</td>
                        <td className="text-right p-3 font-mono">$119.6M</td>
                      </tr>
                      <tr className="hover:bg-muted/50 bg-primary/10">
                        <td className="p-3 font-semibold">Q4 2029</td>
                        <td className="text-right p-3 font-mono font-semibold">1</td>
                        <td className="text-right p-3 font-mono font-semibold">825</td>
                        <td className="text-right p-3 font-mono font-semibold">$30M</td>
                        <td className="text-right p-3 font-mono font-semibold text-lg text-primary">$120M</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Critical Milestones */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-4 text-lg">Critical Milestones & Derisking Events</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">90-Day Checkpoint (Q1 2025)</p>
                        <p className="text-xs text-muted-foreground">8 LOIs secured (vs 5 in conservative). Strong early traction signals aggressive growth is achievable.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">6-Month Checkpoint (Q2 2025)</p>
                        <p className="text-xs text-muted-foreground">30 paying customers, $380K ARR. 76% faster growth than conservative validates premium positioning.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Year 1 Exit (Q4 2025)</p>
                        <p className="text-xs text-muted-foreground">112 customers, $2.5M ARR. Clear product-market fit enables larger Series A raise ($15M+).</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Patent Expiration (Q2 2026)</p>
                        <p className="text-xs text-muted-foreground">407 customers, $27.2M ARR. Commanding market position makes competitive entry difficult despite patent expiration.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Risk Analysis */}
        <Card className="border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Risk Factors & Mitigation Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-orange-500">Key Risks</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold mb-1">Enterprise Sales Cycle Risk</p>
                    <p className="text-xs text-muted-foreground">6-9 month sales cycles could delay Q1-Q2 2025 targets</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold mb-1">Patent Expiration (Q2 2026)</p>
                    <p className="text-xs text-muted-foreground">Competitors can replicate methodology after 18 months</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold mb-1">API Integration Complexity</p>
                    <p className="text-xs text-muted-foreground">Mid-tier apps may lack technical resources for integration</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold mb-1">Pricing Pressure</p>
                    <p className="text-xs text-muted-foreground">Apps with {"<"}100K users may resist $500/mo minimum</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-green-600">Mitigation Strategies</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold mb-1">Sandbox + White-Glove Onboarding</p>
                    <p className="text-xs text-muted-foreground">30-day free trial with dedicated integration engineer reduces sales friction</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold mb-1">Network Effects + First-Mover Advantage</p>
                    <p className="text-xs text-muted-foreground">407+ customers by patent expiration creates switching costs for apps</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold mb-1">Pre-Built SDKs (React Native, Flutter)</p>
                    <p className="text-xs text-muted-foreground">Drop-in libraries reduce integration from 3 weeks to 3 days</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold mb-1">Usage-Based Pricing Tier</p>
                    <p className="text-xs text-muted-foreground">$0.02/call pay-as-you-go option for smaller apps ($100-200/mo effective cost)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary & Recommendation */}
        <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-background">
          <CardHeader>
            <CardTitle className="text-2xl">Strategic Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              The <strong className="text-primary">conservative $75M target</strong> is highly achievable with proper execution, requiring only 3% market penetration over 5 years. This scenario assumes standard B2B SaaS growth rates and builds in churn resilience.
            </p>
            <p className="text-lg leading-relaxed">
              The <strong className="text-primary">aggressive $120M target</strong> is realistic if the GDPR compliance advantage proves as strong as projected in European markets, and if early customer case studies create strong word-of-mouth effects within the Plant ID app community.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Card className="p-4 bg-background">
                <h4 className="font-semibold mb-2 text-primary">Go/No-Go Decision Point</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>90 days (Q1 2025):</strong> If 5+ LOIs cannot be secured from European Plant ID apps, the GDPR value proposition needs re-evaluation. This is the earliest derisking milestone.
                </p>
              </Card>
              <Card className="p-4 bg-background">
                <h4 className="font-semibold mb-2 text-primary">Recommended Initial Target</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Plan for conservative, execute for aggressive.</strong> Build financial models around $75M but allocate 20% additional resources to capitalize on early momentum if Q1-Q2 2025 exceed targets.
                </p>
              </Card>
            </div>

            <div className="mt-6 flex gap-4">
              <Button asChild size="lg">
                <Link to="/api-docs">
                  Explore API Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/developer-sandbox">Try Developer Sandbox</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueProjections;
