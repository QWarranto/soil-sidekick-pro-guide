import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Target, TrendingUp } from "lucide-react";

interface AppCharacteristics {
  currentAccuracy: number;
  avgResponseTime: number;
  monthlyApiCalls: number;
  currentCostPerCall: number;
  dataQuality: number;
  userBase: number;
}

interface ImpactSimulatorInputsProps {
  characteristics: AppCharacteristics;
  setCharacteristics: (characteristics: AppCharacteristics) => void;
  onCalculate: () => void;
}

export default function ImpactSimulatorInputs({
  characteristics,
  setCharacteristics,
  onCalculate,
}: ImpactSimulatorInputsProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Your Current Application
        </CardTitle>
        <CardDescription>
          Enter your current app's characteristics and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Environmental Data Accuracy: {characteristics.currentAccuracy}%</Label>
          <Slider
            value={[characteristics.currentAccuracy]}
            onValueChange={(v) => setCharacteristics({ ...characteristics, currentAccuracy: v[0] })}
            min={40}
            max={95}
            step={5}
          />
        </div>

        <div className="space-y-3">
          <Label>Average API Response Time: {characteristics.avgResponseTime}ms</Label>
          <Slider
            value={[characteristics.avgResponseTime]}
            onValueChange={(v) => setCharacteristics({ ...characteristics, avgResponseTime: v[0] })}
            min={500}
            max={5000}
            step={100}
          />
        </div>

        <div className="space-y-3">
          <Label>Monthly API Calls</Label>
          <Input
            type="number"
            value={characteristics.monthlyApiCalls}
            onChange={(e) => setCharacteristics({ ...characteristics, monthlyApiCalls: Number(e.target.value) })}
            min={1000}
          />
        </div>

        <div className="space-y-3">
          <Label>Current Cost per API Call ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={characteristics.currentCostPerCall}
            onChange={(e) => setCharacteristics({ ...characteristics, currentCostPerCall: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-3">
          <Label>Data Quality Score: {characteristics.dataQuality}%</Label>
          <Slider
            value={[characteristics.dataQuality]}
            onValueChange={(v) => setCharacteristics({ ...characteristics, dataQuality: v[0] })}
            min={30}
            max={90}
            step={5}
          />
        </div>

        <div className="space-y-3">
          <Label>Active User Base</Label>
          <Input
            type="number"
            value={characteristics.userBase}
            onChange={(e) => setCharacteristics({ ...characteristics, userBase: Number(e.target.value) })}
            min={100}
          />
        </div>

        <Button onClick={onCalculate} className="w-full" size="lg">
          <TrendingUp className="mr-2 h-5 w-5" />
          Calculate Impact
        </Button>
      </CardContent>
    </Card>
  );
}
