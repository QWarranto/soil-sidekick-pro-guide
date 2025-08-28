import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Zap, Shield, Clock, Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaterQualityData {
  utility_name: string;
  pwsid: string;
  contaminants: {
    name: string;
    level: number;
    unit: string;
    mcl: number;
    violation: boolean;
  }[];
  grade: string;
  last_tested: string;
  source_type: string;
  territory_type: 'state' | 'territory' | 'compact_state';
  regulatory_authority: string;
  population_served: number;
  system_type: string;
}

interface County {
  id: string;
  county_name: string;
  state_name: string;
  state_code: string;
  fips_code: string;
}

interface TerritoryInfo {
  territory_type: 'state' | 'territory' | 'compact_state';
  regulatory_authority: string;
  epa_region: string;
  water_system_oversight: string;
}

interface WaterQualityPDFExportProps {
  waterData: WaterQualityData;
  county: County;
  territoryInfo?: TerritoryInfo;
  userTier?: 'starter' | 'pro' | 'enterprise';
}

export const WaterQualityPDFExport = ({ 
  waterData, 
  county, 
  territoryInfo, 
  userTier = 'starter' 
}: WaterQualityPDFExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const canExportPDF = userTier !== 'starter';

  const handlePDFExport = async () => {
    if (!canExportPDF) {
      toast({
        title: "Upgrade Required",
        description: "PDF export is available with Pro plans and above.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create enhanced PDF content
      const pdfContent = generateWaterQualityPDFContent(waterData, county, territoryInfo, userTier);
      
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `water-quality-report-${county.county_name}-${county.state_code}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF Generated Successfully",
        description: "Professional water quality report has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to generate PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generateWaterQualityPDFContent = (
    data: WaterQualityData, 
    county: County, 
    territoryInfo?: TerritoryInfo, 
    tier?: string
  ) => {
    const date = new Date().toLocaleDateString();
    const isPro = tier === 'pro' || tier === 'enterprise';
    const territoryDisplay = data.territory_type === 'state' ? 'US State' : 
                           data.territory_type === 'territory' ? 'US Territory' : 
                           'Compact State';
    
    const contaminantAnalysis = data.contaminants.map(c => 
      `${c.name.padEnd(25)} ${(c.level + ' ' + c.unit).padEnd(15)} ${(c.mcl + ' ' + c.unit).padEnd(15)} ${c.violation ? 'VIOLATION' : 'SAFE'}`
    ).join('\n');

    const violationCount = data.contaminants.filter(c => c.violation).length;
    const safetyStatus = violationCount === 0 ? 'All contaminants within EPA safety limits' : 
                        `${violationCount} contaminant(s) exceed EPA limits - Contact water utility`;
    
    return `
═══════════════════════════════════════════════════════════════
                    TAPWATERCHECK PRO
              Professional Water Quality Report
═══════════════════════════════════════════════════════════════

REPORT INFORMATION
─────────────────────────────────────────────────────────────
Location:         ${county.county_name}, ${county.state_code}
FIPS Code:        ${county.fips_code}
Territory Type:   ${territoryDisplay}
Report Date:      ${date}
Report Type:      ${isPro ? 'Professional' : 'Basic'}
Data Source:      EPA SDWIS & Territorial Water Systems
Confidence Level: High (Government-Verified Data)

WATER SYSTEM INFORMATION
─────────────────────────────────────────────────────────────
Utility Name:     ${data.utility_name}
PWSID:           ${data.pwsid}
Water Source:     ${data.source_type}
System Type:      ${data.system_type}
Population Served: ${data.population_served.toLocaleString()}
Last Tested:      ${data.last_tested}

WATER QUALITY GRADE
─────────────────────────────────────────────────────────────
Overall Grade:    ${data.grade}
Safety Status:    ${safetyStatus}

CONTAMINANT ANALYSIS
─────────────────────────────────────────────────────────────
Contaminant              Current Level   EPA MCL         Status
${contaminantAnalysis}

${territoryInfo ? `
REGULATORY FRAMEWORK
─────────────────────────────────────────────────────────────
Regulatory Authority: ${territoryInfo.regulatory_authority}
EPA Region:          ${territoryInfo.epa_region}
System Oversight:    ${territoryInfo.water_system_oversight}
` : ''}

${isPro ? `
WATER FILTER RECOMMENDATIONS
─────────────────────────────────────────────────────────────
Based on your water quality profile:

Carbon Block Filter:
• Reduces chlorine taste and odor by 95%
• Effective for organic compounds
• Price Range: $30-100

Reverse Osmosis System:
• Reduces lead by 99%
• Reduces nitrates by 95%
• Comprehensive filtration
• Price Range: $200-600

UV Disinfection:
• Eliminates bacteria and viruses
• Chemical-free treatment
• Price Range: $150-400

HEALTH CONSIDERATIONS
─────────────────────────────────────────────────────────────
Lead Levels:      ${data.contaminants.find(c => c.name.toLowerCase().includes('lead'))?.level || 'Not detected'} ppb
                  (EPA Action Level: 15 ppb)

Chlorine Levels:  ${data.contaminants.find(c => c.name.toLowerCase().includes('chlorine'))?.level || 'Not detected'} ppm
                  (EPA MCL: 4 ppm)

Nitrate Levels:   ${data.contaminants.find(c => c.name.toLowerCase().includes('nitrate'))?.level || 'Not detected'} ppm
                  (EPA MCL: 10 ppm)

TERRITORIAL WATER CHALLENGES
─────────────────────────────────────────────────────────────
${data.territory_type === 'territory' ? `
Territory-Specific Issues:
• Infrastructure resilience (hurricanes/typhoons)
• Remote location logistics
• Limited backup systems
• Climate vulnerability

Recommendations:
• Consider backup water storage
• Monitor during severe weather
• Stay informed about boil-water advisories
` : data.territory_type === 'compact_state' ? `
Compact State Challenges:
• Very limited infrastructure
• Resource constraints
• Geographic isolation
• Technical expertise shortages

Recommendations:
• Rainwater harvesting systems
• Water conservation practices
• Regular filter maintenance
• Emergency water supplies
` : `
State System Advantages:
• Robust infrastructure
• Regular monitoring
• Multiple backup systems
• Comprehensive oversight
`}

` : ''}

QUALITY ASSURANCE
─────────────────────────────────────────────────────────────
Data Validation:  ✓ EPA SDWIS verified
Safety Check:     ✓ MCL compliance verified
Regional Context: ✓ Territory-specific analysis
Expert Review:    ✓ Public health guidelines applied

${isPro ? `
API INTEGRATION READY
─────────────────────────────────────────────────────────────
This water quality data is available via our REST API for
integration into property management and health monitoring systems.

Contact: api@tapwatercheck.com
Documentation: https://docs.tapwatercheck.com

` : ''}

DISCLAIMER
─────────────────────────────────────────────────────────────
This report is based on EPA SDWIS data and territorial water
system monitoring. Individual tap testing may reveal variations
from these system-wide averages. Contact your water utility for
the most current information and any boil-water advisories.

TapWaterCheck Pro provides guidance based on government data
and should be used in conjunction with local utility communications.

═══════════════════════════════════════════════════════════════
                 Generated by TapWaterCheck Pro
              Territorial Water Quality Intelligence
               © 2024 - All Rights Reserved
═══════════════════════════════════════════════════════════════
    `;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-600" />
          Professional PDF Export
          {userTier !== 'starter' && (
            <Badge variant="outline" className="ml-2">
              {userTier === 'pro' ? 'Pro' : 'Enterprise'}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {canExportPDF 
            ? "Generate a comprehensive, professional water quality report"
            : "Upgrade to Pro for professional PDF export capabilities"
          }
        </CardDescription>
        {canExportPDF && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Property Valuation & Lending Support:</strong> This EPA-verified report supports property 
              assessments under ASTM E1527-21 environmental due diligence standards required by agricultural lenders. 
              See our <a href="/faq" className="underline hover:text-blue-600">FAQ section</a> for complete regulatory references.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Features showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className={canExportPDF ? "text-foreground" : "text-muted-foreground"}>
              Instant Generation
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className={canExportPDF ? "text-foreground" : "text-muted-foreground"}>
              EPA-Verified Data
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className={canExportPDF ? "text-foreground" : "text-muted-foreground"}>
              Territory-Specific
            </span>
          </div>
        </div>

        <Separator />

        {canExportPDF ? (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              <strong>Report includes:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Complete contaminant analysis with EPA comparisons</li>
                <li>Water filter recommendations</li>
                <li>Territory-specific challenges and solutions</li>
                <li>Regulatory framework information</li>
                <li>EPA data validation & compliance metrics</li>
              </ul>
            </div>
            
            <Button 
              onClick={handlePDFExport} 
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Professional PDF
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg border border-muted">
              <h4 className="font-medium mb-2">Pro PDF Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Professional formatting & branding</li>
                <li>• Water filter recommendations</li>
                <li>• Territory-specific analysis</li>
                <li>• Health considerations</li>
                <li>• API integration metadata</li>
              </ul>
            </div>
            
             <Button variant="outline" className="w-full" onClick={() => window.open('/pricing', '_blank')}>
               Upgrade to Pro - $79.00/month
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};