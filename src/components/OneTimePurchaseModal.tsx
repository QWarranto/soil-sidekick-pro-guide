import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OneTimePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  featureTitle: string;
  featureDescription: string;
  price: number;
  originalPrice: number;
  benefits: string[];
  onPurchaseSuccess?: () => void;
}

export function OneTimePurchaseModal({
  isOpen,
  onClose,
  feature,
  featureTitle,
  featureDescription,
  price,
  originalPrice,
  benefits,
  onPurchaseSuccess
}: OneTimePurchaseModalProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          plan: 'one_time',
          feature,
          amount: price * 100, // Convert to cents
          duration_days: 3
        }
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
        onClose();
        if (onPurchaseSuccess) onPurchaseSuccess();
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  const savings = originalPrice - price;
  const savingsPercentage = Math.round((savings / originalPrice) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Quick Access Available!</DialogTitle>
              <DialogDescription>
                Get temporary access to {featureTitle} without committing to a full subscription
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{featureTitle}</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            </div>
            <CardDescription>{featureDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                3-day access • Use as much as you need
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">What you'll get:</div>
              <div className="space-y-1">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">${price}</span>
                    <span className="text-lg text-muted-foreground line-through">${originalPrice}</span>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Save ${savings} ({savingsPercentage}% off monthly rate)
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  One-time payment
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={handlePurchase} 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? 'Processing...' : `Get 3-Day Access for $${price}`}
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/pricing')}
              className="flex-1"
            >
              View Full Plans
            </Button>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground">
          No commitment • Cancel anytime • Full access for 3 days
        </div>
      </DialogContent>
    </Dialog>
  );
}