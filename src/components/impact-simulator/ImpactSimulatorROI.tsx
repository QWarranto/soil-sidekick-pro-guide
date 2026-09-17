import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Clock, CheckCircle2 } from "lucide-react";

interface ImpactMetrics {
  accuracyImprovement: number;
  responseTimeReduction: number;
  costSavings: number;
  dataQualityScore: number;
  roi: number;
  timeToValue: number;
}

interface AppCharacteristics {
  currentAccuracy: number;
  userBase: number;
}

interface ImpactSimulatorROIProps {
  impact: ImpactMetrics;
  characteristics: AppCharacteristics;
}

export default function ImpactSimulatorROI({ impact, characteristics }: ImpactSimulatorROIProps) {
  return (
    <Card className="border-2 border-primary/50 shadow-lg">
      <CardHeader>
        <Badge className="w-fit mb-2" variant="default">
          <TrendingUp className="w-4 h-4 mr-2" />
          ROI Summary
        </Badge>
        <CardTitle className="text-3xl">
          Transform Your Application Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
            <div className="text-sm text-muted-foreground mb-2">Return on Investment</div>
            <div className="text-5xl font-bold text-primary mb-2">
              {impact.roi.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Annual ROI based on cost savings and productivity gains
            </div>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/20">
            <div className="text-sm text-muted-foreground mb-2">Break-Even Timeline</div>
            <div className="text-5xl font-bold text-green-600 mb-2">
              {impact.timeToValue.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              Months until full return on investment
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-sm text-muted-foreground mb-1">Accuracy Gain</div>
            <div className="text-2xl font-bold text-primary">
              +{(impact.accuracyImprovement - characteristics.currentAccuracy).toFixed(1)}%
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-sm text-muted-foreground mb-1">Speed Improvement</div>
            <div className="text-2xl font-bold text-primary">
              55% Faster
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-sm text-muted-foreground mb-1">Quality Score</div>
            <div className="text-2xl font-bold text-primary">
              {impact.dataQualityScore.toFixed(1)}%
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="text-lg font-semibold">Key Business Impact</div>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Dramatic Cost Reduction</div>
              <div className="text-sm text-muted-foreground">
                Save ${(impact.costSavings * 12).toFixed(0)} annually through optimized API costs and reduced infrastructure needs
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Enhanced User Experience</div>
              <div className="text-sm text-muted-foreground">
                {((impact.accuracyImprovement - characteristics.currentAccuracy) / characteristics.currentAccuracy * 100).toFixed(0)}% accuracy improvement creates significant competitive advantage
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Accelerated Time to Market</div>
              <div className="text-sm text-muted-foreground">
                Pre-integrated environmental data eliminates months of data sourcing and integration work
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">User Growth & Retention</div>
              <div className="text-sm text-muted-foreground">
                Projected 80% user base growth in first year through improved accuracy and performance
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5 text-primary" />
            <div className="text-sm">
              <span className="font-medium">Time to Value:</span> {impact.timeToValue.toFixed(1)} months until ROI break-even
            </div>
          </div>
          <div className="flex items-start gap-2">
            <DollarSign className="w-4 h-4 mt-0.5 text-green-600" />
            <div className="text-sm">
              <span className="font-medium">3-Year Savings:</span> ${(impact.costSavings * 36).toFixed(0)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
