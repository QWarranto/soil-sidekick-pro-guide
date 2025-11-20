import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MapPin, Eye, Droplets, Leaf } from 'lucide-react';

interface Field {
  id: string;
  name: string;
  area_acres?: number;
  crop_type?: string;
  boundary_coordinates: any;
  soilAnalysis?: {
    ph_level: number;
    organic_matter: number;
    nitrogen_level: 'high' | 'medium' | 'low';
    phosphorus_level: 'high' | 'medium' | 'low';
    potassium_level: 'high' | 'medium' | 'low';
  };
}

interface FieldsListProps {
  fields: Field[];
  onFieldSelect?: (field: Field) => void;
}

const getNutrientValue = (level: string) => {
  switch (level.toLowerCase()) {
    case 'high': return 90;
    case 'medium': return 60;
    case 'low': return 30;
    default: return 0;
  }
};

const getNutrientColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'high': return 'hsl(var(--success))';
    case 'medium': return 'hsl(var(--warning))';
    case 'low': return 'hsl(var(--destructive))';
    default: return 'hsl(var(--muted))';
  }
};

const CustomNutrientTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-foreground mb-1">{data.payload.name}</p>
        <p className="text-sm text-muted-foreground">
          Level: <span className="font-medium text-foreground">{data.payload.level}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function FieldsList({ fields, onFieldSelect }: FieldsListProps) {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [showSoilModal, setShowSoilModal] = useState(false);

  const handleViewSoilAnalysis = (field: Field) => {
    setSelectedField(field);
    setShowSoilModal(true);
  };

  const getSoilData = (field: Field) => {
    if (!field.soilAnalysis) return null;
    
    return [
      { 
        name: 'Nitrogen (N)', 
        value: getNutrientValue(field.soilAnalysis.nitrogen_level),
        level: field.soilAnalysis.nitrogen_level,
        color: getNutrientColor(field.soilAnalysis.nitrogen_level)
      },
      { 
        name: 'Phosphorus (P)', 
        value: getNutrientValue(field.soilAnalysis.phosphorus_level),
        level: field.soilAnalysis.phosphorus_level,
        color: getNutrientColor(field.soilAnalysis.phosphorus_level)
      },
      { 
        name: 'Potassium (K)', 
        value: getNutrientValue(field.soilAnalysis.potassium_level),
        level: field.soilAnalysis.potassium_level,
        color: getNutrientColor(field.soilAnalysis.potassium_level)
      },
    ];
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => (
          <Card key={field.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{field.name}</CardTitle>
                  {field.crop_type && (
                    <Badge variant="outline" className="text-xs">
                      <Leaf className="h-3 w-3 mr-1" />
                      {field.crop_type}
                    </Badge>
                  )}
                </div>
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {field.area_acres && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Area:</span>{' '}
                  <span className="font-medium">{field.area_acres.toFixed(1)} acres</span>
                </div>
              )}
              
              {field.soilAnalysis && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">pH Level</span>
                    <span className="font-medium">{field.soilAnalysis.ph_level.toFixed(1)}</span>
                  </div>
                  <Progress value={(field.soilAnalysis.ph_level / 14) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Organic Matter</span>
                    <span className="font-medium">{field.soilAnalysis.organic_matter.toFixed(1)}%</span>
                  </div>
                  <Progress value={field.soilAnalysis.organic_matter * 10} className="h-2" />
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                {field.soilAnalysis && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewSoilAnalysis(field)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Soil Analysis
                  </Button>
                )}
                {onFieldSelect && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onFieldSelect(field)}
                    className="flex-1"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    View Map
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Soil Analysis Modal */}
      <Dialog open={showSoilModal} onOpenChange={setShowSoilModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              Soil Analysis: {selectedField?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed nutrient composition and soil health metrics
            </DialogDescription>
          </DialogHeader>
          
          {selectedField?.soilAnalysis && (
            <div className="space-y-6">
              {/* Nutrient Levels Bar Chart */}
              <div>
                <h4 className="font-semibold mb-3">Nutrient Levels (N-P-K)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={getSoilData(selectedField)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomNutrientTooltip />} />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                    >
                      {getSoilData(selectedField)?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* pH and Organic Matter Gauges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">pH Level</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {selectedField.soilAnalysis.ph_level.toFixed(1)}
                      </span>
                      <Badge variant={
                        selectedField.soilAnalysis.ph_level >= 6.0 && selectedField.soilAnalysis.ph_level <= 7.5 
                          ? 'default' 
                          : 'secondary'
                      }>
                        {selectedField.soilAnalysis.ph_level >= 6.0 && selectedField.soilAnalysis.ph_level <= 7.5 
                          ? 'Optimal' 
                          : 'Needs Adjustment'}
                      </Badge>
                    </div>
                    <Progress 
                      value={(selectedField.soilAnalysis.ph_level / 14) * 100} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Acidic (0)</span>
                      <span>Neutral (7)</span>
                      <span>Alkaline (14)</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Organic Matter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {selectedField.soilAnalysis.organic_matter.toFixed(1)}%
                      </span>
                      <Badge variant={
                        selectedField.soilAnalysis.organic_matter >= 3.0 
                          ? 'default' 
                          : 'secondary'
                      }>
                        {selectedField.soilAnalysis.organic_matter >= 3.0 
                          ? 'Good' 
                          : 'Low'}
                      </Badge>
                    </div>
                    <Progress 
                      value={selectedField.soilAnalysis.organic_matter * 10} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Poor (0%)</span>
                      <span>Good (5%)</span>
                      <span>Excellent (10%)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Nutrient Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Nitrogen</div>
                  <Badge 
                    className="w-full justify-center"
                    style={{ backgroundColor: getNutrientColor(selectedField.soilAnalysis.nitrogen_level) }}
                  >
                    {selectedField.soilAnalysis.nitrogen_level}
                  </Badge>
                </div>
                <div className="text-center p-3 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Phosphorus</div>
                  <Badge 
                    className="w-full justify-center"
                    style={{ backgroundColor: getNutrientColor(selectedField.soilAnalysis.phosphorus_level) }}
                  >
                    {selectedField.soilAnalysis.phosphorus_level}
                  </Badge>
                </div>
                <div className="text-center p-3 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Potassium</div>
                  <Badge 
                    className="w-full justify-center"
                    style={{ backgroundColor: getNutrientColor(selectedField.soilAnalysis.potassium_level) }}
                  >
                    {selectedField.soilAnalysis.potassium_level}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
