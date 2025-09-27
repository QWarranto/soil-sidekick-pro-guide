import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, TrendingUp } from 'lucide-react';
import { useOneTimePurchase } from '@/hooks/useOneTimePurchase';

interface QuickAccessSuggestionProps {
  feature: string;
  title: string;
  description: string;
  usageContext: string;
  className?: string;
}

export function QuickAccessSuggestion({ 
  feature, 
  title, 
  description, 
  usageContext,
  className = ""
}: QuickAccessSuggestionProps) {
  const { 
    showOneTimePurchaseModal, 
    getFeatureConfig, 
    shouldShowOneTimePurchase 
  } = useOneTimePurchase();

  if (!shouldShowOneTimePurchase(feature)) {
    return null;
  }

  const config = getFeatureConfig(feature);

  return (
    <Card className={`border-primary/30 bg-gradient-to-br from-primary/5 to-transparent ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          💡 {usageContext}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">10-day access</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">${config.price}</div>
            <div className="text-xs text-muted-foreground line-through">${config.originalPrice}</div>
          </div>
        </div>
        
        <Button 
          onClick={() => showOneTimePurchaseModal(feature)}
          className="w-full h-8 text-sm bg-primary hover:bg-primary/90"
        >
          <Zap className="h-3 w-3 mr-2" />
          Get Quick Access
        </Button>
      </CardContent>
    </Card>
  );
}