import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">Legal Disclaimer</h1>
          <p className="text-lg text-muted-foreground text-center">
            Important information regarding the use of SoilSidekick Pro
          </p>
        </div>

        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please read this disclaimer carefully before using SoilSidekick Pro. By using our application, you acknowledge and agree to the terms outlined below.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>No Guaranteed Results</CardTitle>
              <CardDescription>
                Agricultural outcomes disclaimer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                SoilSidekick Pro provides agricultural recommendations and analysis based on available data and scientific methodologies. However, <strong>no results are guaranteed</strong> as the application cannot control all conditions conducive to the execution of implied benefits, even when such results have been proven under other conditions.
              </p>
              <p className="text-foreground">
                Agricultural success depends on numerous variables including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Weather conditions and climate variability</li>
                <li>Soil composition and local environmental factors</li>
                <li>Implementation accuracy of recommendations</li>
                <li>Timing of agricultural activities</li>
                <li>Quality and source of inputs (seeds, fertilizers, etc.)</li>
                <li>Pest and disease pressures</li>
                <li>Water availability and irrigation practices</li>
                <li>Local regulations and market conditions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limited Liability</CardTitle>
              <CardDescription>
                Responsibility and liability limitations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                SoilSidekick Pro and its operators <strong>are not liable for individual results</strong> achieved by users of the application. This limitation of liability exists because it is unknown which recommendations are taken by users and which recommendations are not taken, as well as how accurately or completely any recommendations are implemented.
              </p>
              <p className="text-foreground">
                Users acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>All agricultural decisions remain the sole responsibility of the user</li>
                <li>The application provides guidance and recommendations only</li>
                <li>Professional agricultural consultation may be necessary for specific situations</li>
                <li>Local conditions may vary significantly from general recommendations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data and Analysis Limitations</CardTitle>
              <CardDescription>
                Understanding the scope and limitations of our analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                While SoilSidekick Pro utilizes advanced algorithms and scientific data, users should understand that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Analysis is based on available data which may not reflect all local conditions</li>
                <li>Recommendations are general in nature and may require local adaptation</li>
                <li>Technology limitations may affect accuracy of certain features</li>
                <li>Third-party data sources may contain inaccuracies or become outdated</li>
                <li>AI-generated content should be verified with professional expertise when critical decisions are involved</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Consultation</CardTitle>
              <CardDescription>
                When to seek additional expertise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                SoilSidekick Pro is designed to supplement, not replace, professional agricultural advice. Users are encouraged to consult with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Local agricultural extension services</li>
                <li>Certified crop advisors</li>
                <li>Soil scientists and agronomists</li>
                <li>Local farming experts familiar with regional conditions</li>
                <li>Regulatory agencies for compliance requirements</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Responsibility</CardTitle>
              <CardDescription>
                Your role in successful outcomes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                By using SoilSidekick Pro, users accept full responsibility for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Evaluating the applicability of recommendations to their specific situation</li>
                <li>Implementing recommendations safely and in accordance with best practices</li>
                <li>Monitoring results and adjusting practices as needed</li>
                <li>Compliance with all applicable laws and regulations</li>
                <li>Environmental stewardship and sustainable practices</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Terms of Service Integration</CardTitle>
              <CardDescription>
                Future legal framework
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                This disclaimer serves as interim legal protection and will be incorporated into comprehensive Terms of Service documentation when implemented. By using SoilSidekick Pro, users agree to be bound by this disclaimer and any future Terms of Service that may be established.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            For questions regarding this disclaimer, please contact support@soilsidekickpro.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;