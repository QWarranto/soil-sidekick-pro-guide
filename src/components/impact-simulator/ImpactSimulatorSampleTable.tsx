import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Zap } from "lucide-react";

interface SampleScenario {
  scenario: string;
  icon: React.ReactNode;
  userBase: string;
  currentAccuracy: string;
  monthlyApiCalls: string;
  accuracyImprovement: string;
  speedGain: string;
  costSavings: string;
  roi: string;
  tier: "starter" | "growth" | "enterprise";
}

const sampleScenarios: SampleScenario[] = [
  {
    scenario: "Startup Farm App",
    icon: <Zap className="h-4 w-4" />,
    userBase: "500-1,000",
    currentAccuracy: "70-75%",
    monthlyApiCalls: "5K-10K",
    accuracyImprovement: "+18-20%",
    speedGain: "55% faster",
    costSavings: "$150-300/mo",
    roi: "250-400%",
    tier: "starter"
  },
  {
    scenario: "Growing AgTech Platform",
    icon: <TrendingUp className="h-4 w-4" />,
    userBase: "5,000-10,000",
    currentAccuracy: "75-80%",
    monthlyApiCalls: "50K-100K",
    accuracyImprovement: "+15-18%",
    speedGain: "55% faster",
    costSavings: "$2K-4K/mo",
    roi: "400-600%",
    tier: "growth"
  },
  {
    scenario: "Enterprise Agriculture Suite",
    icon: <Users className="h-4 w-4" />,
    userBase: "25,000+",
    currentAccuracy: "80-85%",
    monthlyApiCalls: "500K+",
    accuracyImprovement: "+12-15%",
    speedGain: "55% faster",
    costSavings: "$15K+/mo",
    roi: "600-800%",
    tier: "enterprise"
  }
];

interface ImpactSimulatorSampleTableProps {
  onUseScenario?: (scenario: SampleScenario) => void;
}

export default function ImpactSimulatorSampleTable({ onUseScenario }: ImpactSimulatorSampleTableProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "starter":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "growth":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      case "enterprise":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Sample Impact Scenarios
        </CardTitle>
        <CardDescription>
          General estimates across different application scales. Use the calculator below for precise projections based on your specific metrics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Scenario Type</TableHead>
                <TableHead>User Base</TableHead>
                <TableHead>Current Accuracy</TableHead>
                <TableHead>Monthly API Calls</TableHead>
                <TableHead>Accuracy Gain</TableHead>
                <TableHead>Speed Gain</TableHead>
                <TableHead>Cost Savings</TableHead>
                <TableHead>Annual ROI</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleScenarios.map((scenario, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {scenario.icon}
                        <span className="font-medium">{scenario.scenario}</span>
                      </div>
                      <Badge variant="secondary" className={getTierColor(scenario.tier)}>
                        {scenario.tier}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{scenario.userBase}</TableCell>
                  <TableCell>{scenario.currentAccuracy}</TableCell>
                  <TableCell>{scenario.monthlyApiCalls}</TableCell>
                  <TableCell className="text-green-600 dark:text-green-400 font-medium">
                    {scenario.accuracyImprovement}
                  </TableCell>
                  <TableCell className="text-blue-600 dark:text-blue-400 font-medium">
                    {scenario.speedGain}
                  </TableCell>
                  <TableCell className="text-primary font-medium">
                    {scenario.costSavings}
                  </TableCell>
                  <TableCell className="text-primary font-bold">
                    {scenario.roi}
                  </TableCell>
                  <TableCell className="text-right">
                    {onUseScenario && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUseScenario(scenario)}
                      >
                        Use Values
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> These are generalized estimates based on typical use cases. 
            For accurate projections tailored to your specific application characteristics, use the interactive calculator below.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
