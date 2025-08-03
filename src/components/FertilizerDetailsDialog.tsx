import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Droplets, Leaf, AlertTriangle, Clock, Target } from 'lucide-react';

interface FertilizerRecommendation {
  name: string;
  type: 'synthetic' | 'organic' | 'slow-release';
  nValue: number;
  pValue: number;
  kValue: number;
  runoffRisk: 'low' | 'medium' | 'high';
  environmentalScore: number;
  price: string;
  benefits: string[];
  ecoAlternative?: string;
  runoffReduction?: number;
}

interface FertilizerDetailsDialogProps {
  fertilizer: FertilizerRecommendation | null;
  isOpen: boolean;
  onClose: () => void;
}

const FertilizerDetailsDialog: React.FC<FertilizerDetailsDialogProps> = ({
  fertilizer,
  isOpen,
  onClose,
}) => {
  if (!fertilizer) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'organic':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'slow-release':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'synthetic':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDetailedNutrientInfo = (nutrient: 'N' | 'P' | 'K', value: number) => {
    const nutrientInfo = {
      N: {
        name: 'Nitrogen',
        description: 'Promotes leafy growth and green color',
        functions: ['Protein synthesis', 'Chlorophyll production', 'Overall plant growth'],
        deficiencySymptoms: ['Yellowing of older leaves', 'Stunted growth', 'Poor color'],
        applicationNotes: 'Apply in split doses during growing season for best results'
      },
      P: {
        name: 'Phosphorus',
        description: 'Essential for root development and flowering',
        functions: ['Root development', 'Flower and fruit production', 'Energy transfer'],
        deficiencySymptoms: ['Purple leaf discoloration', 'Poor root growth', 'Delayed maturity'],
        applicationNotes: 'Most effective when incorporated into soil near root zone'
      },
      K: {
        name: 'Potassium',
        description: 'Improves disease resistance and water regulation',
        functions: ['Disease resistance', 'Water regulation', 'Enzyme activation'],
        deficiencySymptoms: ['Leaf edge burn', 'Weak stems', 'Poor cold tolerance'],
        applicationNotes: 'Can be applied as side-dress during growing season'
      }
    };

    return nutrientInfo[nutrient];
  };

  const getApplicationGuidelines = () => {
    const baseGuidelines = {
      synthetic: {
        timing: 'Apply during active growing season, avoid dormant periods',
        frequency: 'Every 4-6 weeks during growing season',
        weatherConditions: 'Apply before rain or water immediately after application',
        soilPrep: 'No special soil preparation required',
        safety: 'Wear gloves and avoid contact with foliage in hot weather'
      },
      organic: {
        timing: 'Apply in spring and early fall, can be applied year-round',
        frequency: 'Every 6-8 weeks during growing season',
        weatherConditions: 'Can be applied in any weather conditions',
        soilPrep: 'Work into top 2-3 inches of soil for best results',
        safety: 'Safe for children and pets after application'
      },
      'slow-release': {
        timing: 'Apply once in early spring, may need second application mid-season',
        frequency: 'Once or twice per growing season',
        weatherConditions: 'Rain or irrigation helps activate release mechanism',
        soilPrep: 'Light cultivation to incorporate into soil surface',
        safety: 'Less risk of fertilizer burn, safer around sensitive plants'
      }
    };

    return baseGuidelines[fertilizer.type] || baseGuidelines.synthetic;
  };

  const applicationRates = {
    'Standard NPK 10-10-10': { rate: '1-2 lbs per 1000 sq ft', coverage: '5000-10000 sq ft per bag' },
    'Organic Compost Blend': { rate: '2-4 lbs per 1000 sq ft', coverage: '2500-5000 sq ft per bag' },
    'Slow-Release Polymer Coated': { rate: '1 lb per 1000 sq ft', coverage: '10000-15000 sq ft per bag' },
    'Low-Phosphorus Organic': { rate: '2-3 lbs per 1000 sq ft', coverage: '3000-5000 sq ft per bag' }
  };

  const guidelines = getApplicationGuidelines();
  const rateInfo = applicationRates[fertilizer.name as keyof typeof applicationRates] || 
    { rate: '1-2 lbs per 1000 sq ft', coverage: '5000-10000 sq ft per bag' };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            {fertilizer.name} - Detailed Analysis
          </DialogTitle>
          <DialogDescription>
            Comprehensive nutrient analysis and application guidelines
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overview</span>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(fertilizer.type)}>
                    {fertilizer.type}
                  </Badge>
                  <Badge className={getRiskColor(fertilizer.runoffRisk)}>
                    {fertilizer.runoffRisk} runoff risk
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Environmental Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={fertilizer.environmentalScore * 10} className="flex-1" />
                    <span className="text-sm font-medium">{fertilizer.environmentalScore}/10</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Price</p>
                  <p className="text-lg font-semibold">{fertilizer.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Nutrient Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Detailed Nutrient Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(['N', 'P', 'K'] as const).map((nutrient) => {
                const value = nutrient === 'N' ? fertilizer.nValue : 
                             nutrient === 'P' ? fertilizer.pValue : fertilizer.kValue;
                const info = getDetailedNutrientInfo(nutrient, value);
                
                return (
                  <div key={nutrient} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{info.name} ({nutrient})</h4>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {value}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Primary Functions:</h5>
                        <ul className="text-sm space-y-1">
                          {info.functions.map((func, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {func}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Deficiency Symptoms:</h5>
                        <ul className="text-sm space-y-1">
                          {info.deficiencySymptoms.map((symptom, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                      <p className="text-sm"><strong>Application Note:</strong> {info.applicationNotes}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Application Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Application Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Application Rate</h4>
                    <p className="text-sm text-muted-foreground">{rateInfo.rate}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Coverage</h4>
                    <p className="text-sm text-muted-foreground">{rateInfo.coverage}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Application Frequency</h4>
                    <p className="text-sm text-muted-foreground">{guidelines.frequency}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Best Timing</h4>
                    <p className="text-sm text-muted-foreground">{guidelines.timing}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Weather Conditions</h4>
                    <p className="text-sm text-muted-foreground">{guidelines.weatherConditions}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Soil Preparation</h4>
                    <p className="text-sm text-muted-foreground">{guidelines.soilPrep}</p>
                  </div>
                </div>
              </div>

              {/* Safety Information */}
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Safety Information
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">{guidelines.safety}</p>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          {fertilizer.runoffReduction && fertilizer.runoffReduction > 0 && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Droplets className="h-5 w-5" />
                  Environmental Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{fertilizer.runoffReduction}%</p>
                    <p className="text-xs text-green-600">Runoff Reduction</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      This fertilizer reduces nutrient runoff by {fertilizer.runoffReduction}% compared to conventional alternatives,
                      helping protect nearby water bodies from contamination and algal blooms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Key Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2">
                {fertilizer.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FertilizerDetailsDialog;