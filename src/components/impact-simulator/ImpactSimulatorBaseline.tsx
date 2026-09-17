import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface AppCharacteristics {
  currentAccuracy: number;
  avgResponseTime: number;
  monthlyApiCalls: number;
  currentCostPerCall: number;
  dataQuality: number;
  userBase: number;
}

interface ImpactSimulatorBaselineProps {
  characteristics: AppCharacteristics;
}

export default function ImpactSimulatorBaseline({ characteristics }: ImpactSimulatorBaselineProps) {
  const monthlyCost = characteristics.currentCostPerCall * characteristics.monthlyApiCalls;

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Current Performance Baseline
        </CardTitle>
        <CardDescription>
          Snapshot of your application's current state before LeafEngines integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Data Accuracy</span>
              <Badge variant="secondary">{characteristics.currentAccuracy}%</Badge>
            </div>
            <Progress value={characteristics.currentAccuracy} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Data Quality Score</span>
              <Badge variant="secondary">{characteristics.dataQuality}%</Badge>
            </div>
            <Progress value={characteristics.dataQuality} className="h-2" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-sm text-muted-foreground mb-1">Response Time</div>
            <div className="text-2xl font-bold">{characteristics.avgResponseTime}ms</div>
          </div>

          <div className="p-4 rounded-lg bg-muted">
            <div className="text-sm text-muted-foreground mb-1">Monthly Cost</div>
            <div className="text-2xl font-bold">${monthlyCost.toFixed(0)}</div>
          </div>

          <div className="p-4 rounded-lg bg-muted">
            <div className="text-sm text-muted-foreground mb-1">Active Users</div>
            <div className="text-2xl font-bold">{characteristics.userBase.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-sm font-medium mb-2">Key Metrics Summary</div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Monthly API Calls:</span>
              <span className="font-medium text-foreground">{characteristics.monthlyApiCalls.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cost per Call:</span>
              <span className="font-medium text-foreground">${characteristics.currentCostPerCall.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span>Annual API Cost:</span>
              <span className="font-medium text-foreground">${(monthlyCost * 12).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
