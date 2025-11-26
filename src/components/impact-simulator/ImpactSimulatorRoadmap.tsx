import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function ImpactSimulatorRoadmap() {
  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Implementation Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
              <div className="w-0.5 h-16 bg-border"></div>
            </div>
            <div className="flex-1 pb-8">
              <div className="font-medium">Week 1-2: Integration Setup</div>
              <div className="text-sm text-muted-foreground">API key provisioning, SDK integration, initial testing</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
              <div className="w-0.5 h-16 bg-border"></div>
            </div>
            <div className="flex-1 pb-8">
              <div className="font-medium">Week 3-4: Feature Migration</div>
              <div className="text-sm text-muted-foreground">Migrate existing features to LeafEngines data sources</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
              <div className="w-0.5 h-16 bg-border"></div>
            </div>
            <div className="flex-1 pb-8">
              <div className="font-medium">Week 5-6: Optimization & Testing</div>
              <div className="text-sm text-muted-foreground">Performance tuning, A/B testing, quality validation</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">✓</div>
            </div>
            <div className="flex-1">
              <div className="font-medium">Week 7: Production Launch</div>
              <div className="text-sm text-muted-foreground">Full rollout with monitoring and support</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
