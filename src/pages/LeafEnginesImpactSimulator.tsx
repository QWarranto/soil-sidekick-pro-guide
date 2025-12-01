import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ChevronRight, ChevronLeft } from "lucide-react";
import ImpactSimulatorInputs from "@/components/impact-simulator/ImpactSimulatorInputs";
import ImpactSimulatorBaseline from "@/components/impact-simulator/ImpactSimulatorBaseline";
import ImpactSimulatorCharts from "@/components/impact-simulator/ImpactSimulatorCharts";
import ImpactSimulatorROI from "@/components/impact-simulator/ImpactSimulatorROI";
import ImpactSimulatorRoadmap from "@/components/impact-simulator/ImpactSimulatorRoadmap";
import ImpactSimulatorSampleTable from "@/components/impact-simulator/ImpactSimulatorSampleTable";

interface AppCharacteristics {
  currentAccuracy: number;
  avgResponseTime: number;
  monthlyApiCalls: number;
  currentCostPerCall: number;
  dataQuality: number;
  userBase: number;
}

interface ImpactMetrics {
  accuracyImprovement: number;
  responseTimeReduction: number;
  costSavings: number;
  dataQualityScore: number;
  roi: number;
  timeToValue: number;
}

export default function LeafEnginesImpactSimulator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [characteristics, setCharacteristics] = useState<AppCharacteristics>({
    currentAccuracy: 75,
    avgResponseTime: 2000,
    monthlyApiCalls: 10000,
    currentCostPerCall: 0.05,
    dataQuality: 60,
    userBase: 1000,
  });

  const calculateImpact = (): ImpactMetrics => {
    // LeafEngines improvements based on real-world benchmarks
    const accuracyBoost = Math.min(95, characteristics.currentAccuracy + (100 - characteristics.currentAccuracy) * 0.65);
    const speedImprovement = characteristics.avgResponseTime * 0.45; // 55% faster
    
    // Volume-based pricing for LeafEngines (economies of scale)
    let costPerCallWithLeafEngines = 0.02;
    if (characteristics.monthlyApiCalls > 500000) {
      costPerCallWithLeafEngines = 0.01; // 50% discount for very high volume
    } else if (characteristics.monthlyApiCalls > 100000) {
      costPerCallWithLeafEngines = 0.015; // 25% discount for high volume
    }
    
    const monthlySavings = (characteristics.currentCostPerCall - costPerCallWithLeafEngines) * characteristics.monthlyApiCalls;
    const dataQualityImprovement = Math.min(95, characteristics.dataQuality + (100 - characteristics.dataQuality) * 0.70);
    
    // Tiered implementation cost (economies of scale for larger deployments)
    let implementationCost = 5000; // Base implementation
    const userBase = characteristics.userBase;
    
    if (userBase <= 1000) {
      implementationCost += userBase * 2;
    } else if (userBase <= 5000) {
      implementationCost += (1000 * 2) + ((userBase - 1000) * 1);
    } else {
      implementationCost += (1000 * 2) + (4000 * 1) + ((userBase - 5000) * 0.5);
    }
    
    const annualSavings = monthlySavings * 12;
    const roiMonths = implementationCost / monthlySavings;

    return {
      accuracyImprovement: accuracyBoost,
      responseTimeReduction: speedImprovement,
      costSavings: monthlySavings,
      dataQualityScore: dataQualityImprovement,
      roi: (annualSavings / implementationCost) * 100,
      timeToValue: roiMonths,
    };
  };

  const impact = calculateImpact();

  const handleCalculate = () => {
    setCurrentStep(1);
  };

  const steps = [
    { label: "Input Metrics", component: <ImpactSimulatorInputs characteristics={characteristics} setCharacteristics={setCharacteristics} onCalculate={handleCalculate} /> },
    { label: "Baseline Snapshot", component: <ImpactSimulatorBaseline characteristics={characteristics} /> },
    { label: "Performance Charts", component: <ImpactSimulatorCharts characteristics={characteristics} impact={impact} /> },
    { label: "ROI Summary", component: <ImpactSimulatorROI impact={impact} characteristics={characteristics} /> },
    { label: "Implementation", component: <ImpactSimulatorRoadmap /> },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            <Zap className="w-4 h-4 mr-2" />
            Impact Calculator
          </Badge>
          <h1 className="text-4xl font-bold mb-4">LeafEngines™ Impact Simulator</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how LeafEngines Environmental Intelligence transforms your agricultural application's performance, accuracy, and ROI
          </p>
        </div>

        {/* Sample Scenarios Table */}
        <div className="mb-12">
          <ImpactSimulatorSampleTable
            onUseScenario={(scenario) => {
              // Parse scenario values to populate the form
              const userBase = parseInt(scenario.userBase.split('-')[0].replace(/[^0-9]/g, '')) || 1000;
              const accuracy = parseInt(scenario.currentAccuracy.split('-')[0]) || 75;
              const apiCalls = parseInt(scenario.monthlyApiCalls.replace(/[^0-9]/g, '')) * 1000 || 10000;
              
              setCharacteristics({
                currentAccuracy: accuracy,
                avgResponseTime: 2000,
                monthlyApiCalls: apiCalls,
                currentCostPerCall: 0.05,
                dataQuality: 60,
                userBase: userBase,
              });
              setCurrentStep(0);
            }}
          />
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                } font-bold text-sm`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 text-center">
                {step.label}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="mb-8">
          {steps[currentStep].component}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={currentStep === 0}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleReset}>
              Start Over
            </Button>
          )}
        </div>

        {/* CTA Section */}
        {currentStep >= 3 && (
          <Card className="mt-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to Transform Your Application?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Schedule a demo to see LeafEngines in action and discuss your specific use case with our team
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/developer-sandbox">Try API Sandbox</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/api-docs">View Documentation</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
