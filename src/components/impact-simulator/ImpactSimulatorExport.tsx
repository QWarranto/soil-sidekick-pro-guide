import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, FileJson, FileText, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
  avgResponseTime: number;
  monthlyApiCalls: number;
  currentCostPerCall: number;
  dataQuality: number;
  userBase: number;
}

interface ComparisonTestData {
  confidenceImprovement: number;
  additionalDataPoints: number;
  responseTimeDiff: number;
  baselineConfidence: number;
  enhancedConfidence: number;
  matchAgreement: boolean;
  testTimestamp: string;
}

interface ImpactSimulatorExportProps {
  characteristics: AppCharacteristics;
  impact: ImpactMetrics;
  comparisonData?: ComparisonTestData | null;
  clientName?: string;
}

export default function ImpactSimulatorExport({
  characteristics,
  impact,
  comparisonData,
  clientName: initialClientName = ""
}: ImpactSimulatorExportProps) {
  const [clientName, setClientName] = useState(initialClientName);
  const [isExporting, setIsExporting] = useState(false);

  const generateReportData = () => {
    const reportDate = new Date().toISOString();
    
    return {
      report_metadata: {
        title: "LeafEngines™ Impact Assessment Report",
        generated_at: reportDate,
        client_name: clientName || "Prospective Client",
        report_version: "1.0"
      },
      current_state: {
        accuracy_percent: characteristics.currentAccuracy,
        avg_response_time_ms: characteristics.avgResponseTime,
        monthly_api_calls: characteristics.monthlyApiCalls,
        cost_per_call_usd: characteristics.currentCostPerCall,
        data_quality_score: characteristics.dataQuality,
        user_base: characteristics.userBase
      },
      projected_improvements: {
        accuracy_after_integration: impact.accuracyImprovement,
        accuracy_gain_percent: impact.accuracyImprovement - characteristics.currentAccuracy,
        response_time_reduction_ms: impact.responseTimeReduction,
        speed_improvement_percent: 55,
        data_quality_after: impact.dataQualityScore,
        data_quality_gain: impact.dataQualityScore - characteristics.dataQuality
      },
      financial_impact: {
        monthly_cost_savings_usd: impact.costSavings,
        annual_cost_savings_usd: impact.costSavings * 12,
        three_year_savings_usd: impact.costSavings * 36,
        roi_percent: impact.roi,
        break_even_months: impact.timeToValue
      },
      business_value: {
        user_retention_improvement_percent: (impact.accuracyImprovement - characteristics.currentAccuracy) * 0.8,
        user_engagement_increase_percent: comparisonData ? comparisonData.additionalDataPoints * 2 : 15,
        competitive_advantage_score: Math.min(100, impact.accuracyImprovement + 10),
        time_to_market_reduction_weeks: 8
      },
      ...(comparisonData && {
        live_test_results: {
          test_timestamp: comparisonData.testTimestamp,
          baseline_confidence: comparisonData.baselineConfidence,
          enhanced_confidence: comparisonData.enhancedConfidence,
          confidence_improvement: comparisonData.confidenceImprovement,
          additional_data_points: comparisonData.additionalDataPoints,
          response_time_difference_ms: comparisonData.responseTimeDiff,
          species_match_agreement: comparisonData.matchAgreement
        }
      }),
      integration_roadmap: {
        week_1_2: "API key provisioning, SDK integration, initial testing",
        week_3_4: "Feature migration to LeafEngines data sources",
        week_5_6: "Performance tuning, A/B testing, quality validation",
        week_7: "Production launch with monitoring and support"
      },
      pricing_tier_recommendation: characteristics.monthlyApiCalls > 100000 
        ? "enterprise" 
        : characteristics.monthlyApiCalls > 10000 
          ? "pro" 
          : "starter",
      next_steps: [
        "Schedule technical demo with LeafEngines team",
        "Obtain sandbox API key for integration testing",
        "Review SDK documentation and code examples",
        "Define integration timeline and milestones"
      ]
    };
  };

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const data = generateReportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leafengines-impact-report-${clientName || "client"}-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("JSON report downloaded successfully");
    } catch (error) {
      toast.error("Failed to export JSON report");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    setIsExporting(true);
    try {
      const data = generateReportData();
      
      // Generate HTML content for PDF
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>LeafEngines Impact Report - ${data.report_metadata.client_name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #16a34a; border-bottom: 3px solid #16a34a; padding-bottom: 10px; }
    h2 { color: #166534; margin-top: 30px; }
    .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
    .metric-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; }
    .metric-value { font-size: 28px; font-weight: bold; color: #16a34a; }
    .metric-label { font-size: 12px; color: #666; }
    .section { margin: 30px 0; }
    .highlight { background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 20px; border-radius: 12px; margin: 20px 0; }
    .highlight-value { font-size: 48px; font-weight: bold; color: #16a34a; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f9fafb; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <h1>🌿 LeafEngines™ Impact Assessment</h1>
  <p><strong>Prepared for:</strong> ${data.report_metadata.client_name}</p>
  <p><strong>Generated:</strong> ${new Date(data.report_metadata.generated_at).toLocaleDateString()}</p>
  
  <div class="highlight">
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; text-align: center;">
      <div>
        <div class="highlight-value">${data.financial_impact.roi_percent.toFixed(0)}%</div>
        <div>Annual ROI</div>
      </div>
      <div>
        <div class="highlight-value">${data.financial_impact.break_even_months.toFixed(1)}</div>
        <div>Months to Break-Even</div>
      </div>
    </div>
  </div>
  
  <h2>Current State Analysis</h2>
  <div class="metric-grid">
    <div class="metric-card">
      <div class="metric-value">${data.current_state.accuracy_percent}%</div>
      <div class="metric-label">Current Accuracy</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">${data.current_state.avg_response_time_ms}ms</div>
      <div class="metric-label">Response Time</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">${(data.current_state.monthly_api_calls / 1000).toFixed(0)}K</div>
      <div class="metric-label">Monthly API Calls</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">${data.current_state.user_base.toLocaleString()}</div>
      <div class="metric-label">User Base</div>
    </div>
  </div>
  
  <h2>Projected Improvements with LeafEngines</h2>
  <div class="metric-grid">
    <div class="metric-card">
      <div class="metric-value">+${data.projected_improvements.accuracy_gain_percent.toFixed(1)}%</div>
      <div class="metric-label">Accuracy Improvement (to ${data.projected_improvements.accuracy_after_integration.toFixed(1)}%)</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">${data.projected_improvements.speed_improvement_percent}%</div>
      <div class="metric-label">Speed Improvement</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">${data.projected_improvements.data_quality_after.toFixed(1)}%</div>
      <div class="metric-label">Data Quality Score</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">+${data.business_value.user_retention_improvement_percent.toFixed(1)}%</div>
      <div class="metric-label">User Retention</div>
    </div>
  </div>
  
  <h2>Financial Impact</h2>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Monthly Cost Savings</td><td><strong>$${data.financial_impact.monthly_cost_savings_usd.toFixed(0)}</strong></td></tr>
    <tr><td>Annual Cost Savings</td><td><strong>$${data.financial_impact.annual_cost_savings_usd.toFixed(0)}</strong></td></tr>
    <tr><td>3-Year Total Savings</td><td><strong>$${data.financial_impact.three_year_savings_usd.toFixed(0)}</strong></td></tr>
    <tr><td>Return on Investment</td><td><strong>${data.financial_impact.roi_percent.toFixed(0)}%</strong></td></tr>
    <tr><td>Break-Even Timeline</td><td><strong>${data.financial_impact.break_even_months.toFixed(1)} months</strong></td></tr>
  </table>
  
  ${data.live_test_results ? `
  <h2>Live Test Results</h2>
  <p><em>Real data from Plant ID Comparison test on ${new Date(data.live_test_results.test_timestamp).toLocaleString()}</em></p>
  <table>
    <tr><th>Metric</th><th>Before</th><th>After</th><th>Improvement</th></tr>
    <tr>
      <td>Confidence Score</td>
      <td>${data.live_test_results.baseline_confidence.toFixed(1)}%</td>
      <td>${data.live_test_results.enhanced_confidence.toFixed(1)}%</td>
      <td><strong>+${data.live_test_results.confidence_improvement.toFixed(1)}%</strong></td>
    </tr>
    <tr>
      <td>Data Points</td>
      <td>-</td>
      <td>+${data.live_test_results.additional_data_points}</td>
      <td>Environmental context added</td>
    </tr>
  </table>
  ` : ''}
  
  <h2>Implementation Roadmap</h2>
  <table>
    <tr><th>Timeline</th><th>Activities</th></tr>
    <tr><td>Week 1-2</td><td>${data.integration_roadmap.week_1_2}</td></tr>
    <tr><td>Week 3-4</td><td>${data.integration_roadmap.week_3_4}</td></tr>
    <tr><td>Week 5-6</td><td>${data.integration_roadmap.week_5_6}</td></tr>
    <tr><td>Week 7</td><td>${data.integration_roadmap.week_7}</td></tr>
  </table>
  
  <h2>Recommended Tier: ${data.pricing_tier_recommendation.charAt(0).toUpperCase() + data.pricing_tier_recommendation.slice(1)}</h2>
  
  <h2>Next Steps</h2>
  <ol>
    ${data.next_steps.map(step => `<li>${step}</li>`).join('')}
  </ol>
  
  <div class="footer">
    <p>This report was generated by the LeafEngines™ Impact Simulator. Projections are estimates based on industry benchmarks and the input parameters provided.</p>
    <p><strong>Contact:</strong> sales@leafengines.com | <strong>Website:</strong> leafengines.com</p>
  </div>
</body>
</html>`;

      // Create and download as HTML (can be printed to PDF)
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leafengines-impact-report-${clientName || "client"}-${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Report downloaded! Open in browser and print to PDF");
    } catch (error) {
      toast.error("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  const copyShareableLink = () => {
    const data = generateReportData();
    const encodedData = btoa(JSON.stringify({
      c: characteristics,
      i: impact,
      n: clientName
    }));
    const shareUrl = `${window.location.origin}/impact-simulator?data=${encodedData}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Shareable link copied to clipboard");
  };

  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <Badge className="w-fit mb-2" variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Badge>
        <CardTitle>Export Impact Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client/Company Name (optional)</Label>
          <Input
            id="clientName"
            placeholder="e.g., Plantum, Plant Parent"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Personalizes the export for sales presentations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Export PDF Report
          </Button>
          
          <Button
            variant="outline"
            onClick={exportToJSON}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <FileJson className="w-4 h-4" />
            Export JSON Data
          </Button>

          <Button
            variant="outline"
            onClick={copyShareableLink}
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Copy Share Link
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <div className="font-medium">Export includes:</div>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Current state analysis with all input metrics</li>
                <li>• Projected improvements and ROI calculations</li>
                <li>• Financial impact summary (monthly, annual, 3-year)</li>
                <li>• Implementation roadmap and timeline</li>
                <li>• Recommended pricing tier</li>
                {comparisonData && <li>• Live Plant ID comparison test results</li>}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
