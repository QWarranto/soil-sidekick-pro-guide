import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home, 
  Droplet, 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Sprout,
  FileText,
  MapPin
} from 'lucide-react';

interface SoilData {
  id: string;
  county_name: string;
  state_code: string;
  property_address?: string;
  ph_level: number | null;
  organic_matter: number | null;
  nitrogen_level: string | null;
  phosphorus_level: string | null;
  potassium_level: string | null;
  recommendations: string | null;
  analysis_data: any;
  created_at: string;
}

interface PropertySoilAnalysisProps {
  soilData: SoilData;
}

export const PropertySoilAnalysis: React.FC<PropertySoilAnalysisProps> = ({ soilData }) => {
  
  // Foundation Risk Assessment
  const getFoundationRisk = () => {
    const ph = soilData.ph_level || 7.0;
    const om = soilData.organic_matter || 2.5;
    
    // Expansive soil indicators: high clay content (low OM), extreme pH
    if (ph < 5.5 || ph > 8.5 || om < 1.5) {
      return {
        level: 'high',
        score: 75,
        color: 'destructive',
        icon: AlertTriangle,
        title: 'Higher Foundation Risk',
        description: 'Soil conditions may indicate expansive clay or poor bearing capacity. Professional foundation inspection strongly recommended.',
        concerns: [
          'Potential for soil expansion/contraction',
          'May require specialized foundation design',
          'Increased risk of settlement or movement'
        ]
      };
    } else if (ph < 6.0 || ph > 8.0 || om < 2.5) {
      return {
        level: 'moderate',
        score: 45,
        color: 'warning',
        icon: AlertCircle,
        title: 'Moderate Foundation Risk',
        description: 'Soil characteristics are acceptable but warrant attention during construction planning.',
        concerns: [
          'Standard foundation design may be adequate',
          'Monitor for drainage and moisture management',
          'Consider soil stabilization if needed'
        ]
      };
    } else {
      return {
        level: 'low',
        score: 20,
        color: 'default',
        icon: CheckCircle,
        title: 'Lower Foundation Risk',
        description: 'Soil properties indicate favorable conditions for standard foundation construction.',
        concerns: [
          'Good soil bearing capacity indicated',
          'Standard construction practices suitable',
          'Lower risk of settlement issues'
        ]
      };
    }
  };

  // Septic System Feasibility
  const getSepticFeasibility = () => {
    const ph = soilData.ph_level || 7.0;
    const om = soilData.organic_matter || 2.5;
    
    // Good drainage: moderate OM (2-4%), neutral pH
    if (ph >= 6.0 && ph <= 7.5 && om >= 2.0 && om <= 4.0) {
      return {
        feasibility: 'good',
        score: 85,
        color: 'default',
        icon: CheckCircle,
        title: 'Good Septic Feasibility',
        description: 'Soil characteristics suggest favorable conditions for conventional septic system installation.',
        factors: [
          'Adequate percolation expected',
          'Good biological treatment capacity',
          'Standard drain field likely suitable'
        ]
      };
    } else if ((ph >= 5.5 && ph <= 8.0) && om >= 1.5) {
      return {
        feasibility: 'moderate',
        score: 55,
        color: 'warning',
        icon: AlertCircle,
        title: 'Moderate Septic Feasibility',
        description: 'Septic system possible but may require additional testing or alternative design.',
        factors: [
          'Percolation test required',
          'May need larger drain field',
          'Alternative system designs may be considered'
        ]
      };
    } else {
      return {
        feasibility: 'challenging',
        score: 25,
        color: 'destructive',
        icon: AlertTriangle,
        title: 'Challenging Septic Conditions',
        description: 'Soil properties may limit conventional septic system options. Professional evaluation essential.',
        factors: [
          'Poor drainage or percolation expected',
          'Alternative systems likely required',
          'Higher installation and maintenance costs'
        ]
      };
    }
  };

  // Landscaping & Property Value Impact
  const getLandscapingPotential = () => {
    const ph = soilData.ph_level || 7.0;
    const om = soilData.organic_matter || 2.5;
    const nitrogen = soilData.nitrogen_level?.toLowerCase() || 'medium';
    
    let score = 50;
    if (ph >= 6.0 && ph <= 7.5) score += 15;
    if (om >= 3.0) score += 20;
    if (nitrogen === 'high' || nitrogen === 'medium') score += 15;
    
    if (score >= 80) {
      return {
        quality: 'excellent',
        score: score,
        color: 'default',
        icon: TrendingUp,
        title: 'Excellent Landscaping Potential',
        description: 'High-quality soil supports diverse landscaping with minimal amendments.',
        benefits: [
          'Rich, fertile soil for gardens and lawns',
          'Lower landscaping maintenance costs',
          'Positive impact on property value'
        ],
        valueImpact: '+2-5% typical property value increase'
      };
    } else if (score >= 60) {
      return {
        quality: 'good',
        score: score,
        color: 'default',
        icon: CheckCircle,
        title: 'Good Landscaping Potential',
        description: 'Soil quality is adequate for most landscaping with modest improvements.',
        benefits: [
          'Suitable for lawns and common plantings',
          'Moderate amendment costs expected',
          'Standard property value impact'
        ],
        valueImpact: 'Neutral to slight positive value impact'
      };
    } else {
      return {
        quality: 'limited',
        score: score,
        color: 'warning',
        icon: TrendingDown,
        title: 'Limited Landscaping Potential',
        description: 'Soil may require significant amendments for quality landscaping.',
        benefits: [
          'Requires soil improvement investments',
          'Limited plant variety without amendments',
          'May affect curb appeal and value'
        ],
        valueImpact: 'Potential minor negative value impact'
      };
    }
  };

  const foundationRisk = getFoundationRisk();
  const septicFeasibility = getSepticFeasibility();
  const landscaping = getLandscapingPotential();
  const FoundationIcon = foundationRisk.icon;
  const SepticIcon = septicFeasibility.icon;
  const LandscapeIcon = landscaping.icon;

  return (
    <div className="space-y-6">
      {/* Header with Watermark */}
      <Card className="card-elevated border-2 border-primary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Home className="h-6 w-6 text-primary" />
                Property Soil Report
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {soilData.county_name}, {soilData.state_code} • 
                Based on USDA NRCS Soil Survey Data • 
                Generated {new Date(soilData.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
          
          {/* Watermark Section */}
          {soilData.property_address && (
            <div className="mt-4 p-4 bg-primary/10 border-2 border-primary/30 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary mb-1">PROPERTY ADDRESS (Report Watermark)</p>
                  <p className="text-lg font-bold text-foreground break-words">
                    {soilData.property_address}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    This report is valid only for the property address shown above. 
                    Unauthorized use for other properties is prohibited.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Foundation Risk */}
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FoundationIcon className="h-5 w-5" />
              Foundation Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Level:</span>
                <Badge variant={foundationRisk.color as any}>{foundationRisk.level.toUpperCase()}</Badge>
              </div>
              <Progress value={foundationRisk.score} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Septic Feasibility */}
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <SepticIcon className="h-5 w-5" />
              Septic System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Feasibility:</span>
                <Badge variant={septicFeasibility.color as any}>{septicFeasibility.feasibility.toUpperCase()}</Badge>
              </div>
              <Progress value={septicFeasibility.score} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Landscaping Potential */}
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <LandscapeIcon className="h-5 w-5" />
              Landscaping Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Potential:</span>
                <Badge variant={landscaping.color as any}>{landscaping.quality.toUpperCase()}</Badge>
              </div>
              <Progress value={landscaping.score} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Foundation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            {foundationRisk.title}
          </CardTitle>
          <CardDescription>{foundationRisk.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Key Considerations:</h4>
            <ul className="space-y-2">
              {foundationRisk.concerns.map((concern, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Septic Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-cyan-600" />
            {septicFeasibility.title}
          </CardTitle>
          <CardDescription>{septicFeasibility.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Important Factors:</h4>
            <ul className="space-y-2">
              {septicFeasibility.factors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Landscaping & Value */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-green-600" />
            {landscaping.title}
          </CardTitle>
          <CardDescription>{landscaping.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Landscaping Benefits:</h4>
              <ul className="space-y-2">
                {landscaping.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Property Value Impact:</strong> {landscaping.valueImpact}
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Soil Chemistry Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Soil Chemistry Details
          </CardTitle>
          <CardDescription>
            Technical soil properties from USDA NRCS survey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">pH Level:</span>
                <Badge variant="outline">{soilData.ph_level?.toFixed(1) || 'N/A'}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Organic Matter:</span>
                <Badge variant="outline">{soilData.organic_matter ? `${soilData.organic_matter.toFixed(1)}%` : 'N/A'}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Nitrogen (N):</span>
                <Badge variant="outline">{soilData.nitrogen_level || 'N/A'}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Phosphorus (P):</span>
                <Badge variant="outline">{soilData.phosphorus_level || 'N/A'}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> This report provides general soil characteristics based on USDA NRCS county-level data. 
          Site-specific soil tests, percolation tests, and professional inspections are required for construction, 
          septic system installation, and property transactions. Consult licensed engineers, soil scientists, and home 
          inspectors for detailed assessments.
        </AlertDescription>
      </Alert>
    </div>
  );
};
