import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calculator, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CarbonCreditCalculatorProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface CalculationForm {
  field_name: string;
  field_size_acres: number;
  soil_organic_matter?: number;
  soil_analysis_id?: string;
  verification_type: 'self_reported' | 'third_party' | 'satellite';
}

export function CarbonCreditCalculator({ onClose, onSuccess }: CarbonCreditCalculatorProps) {
  const [form, setForm] = useState<CalculationForm>({
    field_name: '',
    field_size_acres: 0,
    verification_type: 'self_reported'
  });
  const [calculating, setCalculating] = useState(false);
  const [soilAnalyses, setSoilAnalyses] = useState<any[]>([]);

  const handleInputChange = (field: keyof CalculationForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    if (!form.field_name || !form.field_size_acres) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCalculating(true);
    try {
      const { data, error } = await supabase.functions.invoke('carbon-credit-calculator', {
        body: form
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Successfully calculated ${data.credit_record.credits_earned.toFixed(2)} CO₂ tonnes in carbon credits!`);
        onSuccess();
      } else {
        throw new Error(data.error || 'Calculation failed');
      }
    } catch (error) {
      console.error('Error calculating carbon credits:', error);
      toast.error(error.message || 'Failed to calculate carbon credits');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Carbon Credit Calculator
              </DialogTitle>
              <DialogDescription>
                Calculate carbon credits based on soil organic matter enhancement
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field_name">Field Name *</Label>
              <Input
                id="field_name"
                value={form.field_name}
                onChange={(e) => handleInputChange('field_name', e.target.value)}
                placeholder="e.g., North Field"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field_size">Field Size (acres) *</Label>
              <Input
                id="field_size"
                type="number"
                min="0"
                step="0.1"
                value={form.field_size_acres || ''}
                onChange={(e) => handleInputChange('field_size_acres', parseFloat(e.target.value) || 0)}
                placeholder="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="soil_organic_matter">Soil Organic Matter (%)</Label>
            <Input
              id="soil_organic_matter"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={form.soil_organic_matter || ''}
              onChange={(e) => handleInputChange('soil_organic_matter', parseFloat(e.target.value) || undefined)}
              placeholder="2.5 (leave empty to use regional average)"
            />
            <p className="text-xs text-muted-foreground">
              If not provided, regional average (2.5%) will be used with lower confidence score
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification_type">Verification Type</Label>
            <Select 
              value={form.verification_type} 
              onValueChange={(value) => handleInputChange('verification_type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self_reported">Self Reported</SelectItem>
                <SelectItem value="third_party">Third Party Verified</SelectItem>
                <SelectItem value="satellite">Satellite Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">How Carbon Credits Are Calculated</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                • <strong>Baseline:</strong> Assumes 0.5% improvement in soil organic matter
              </p>
              <p>
                • <strong>Sequestration:</strong> Calculated based on enhanced soil organic matter vs baseline
              </p>
              <p>
                • <strong>Formula:</strong> (Enhanced SOM - Baseline SOM) × Bulk Density × Field Size × CO₂ Conversion
              </p>
              <p>
                • <strong>Confidence:</strong> Higher with lab data (85%) vs estimates (50-70%)
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCalculate} disabled={calculating}>
              {calculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Calculate Credits
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}