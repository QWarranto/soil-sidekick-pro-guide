import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, TrendingUp, Award, Calculator } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { CarbonCreditCalculator } from './CarbonCreditCalculator';

interface CarbonCredit {
  id: string;
  field_name: string;
  field_size_acres: number;
  credits_earned: number;
  verification_status: string;
  calculation_date: string;
  soil_organic_matter?: number;
}

interface CarbonCreditStats {
  total_credits: number;
  verified_credits: number;
  pending_credits: number;
  total_fields: number;
  average_credits_per_acre: number;
}

export function CarbonCreditDashboard() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<CarbonCredit[]>([]);
  const [stats, setStats] = useState<CarbonCreditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCarbonCredits();
    }
  }, [user]);

  const fetchCarbonCredits = async () => {
    try {
      const { data, error } = await supabase
        .from('carbon_credits')
        .select('*')
        .order('calculation_date', { ascending: false });

      if (error) throw error;

      setCredits(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching carbon credits:', error);
      toast.error('Failed to load carbon credits');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (creditData: CarbonCredit[]) => {
    const totalCredits = creditData.reduce((sum, credit) => sum + credit.credits_earned, 0);
    const verifiedCredits = creditData
      .filter(credit => credit.verification_status === 'verified')
      .reduce((sum, credit) => sum + credit.credits_earned, 0);
    const pendingCredits = creditData
      .filter(credit => credit.verification_status === 'pending')
      .reduce((sum, credit) => sum + credit.credits_earned, 0);
    const totalAcres = creditData.reduce((sum, credit) => sum + credit.field_size_acres, 0);

    setStats({
      total_credits: totalCredits,
      verified_credits: verifiedCredits,
      pending_credits: pendingCredits,
      total_fields: creditData.length,
      average_credits_per_acre: totalAcres > 0 ? totalCredits / totalAcres : 0
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleNewCredit = () => {
    fetchCarbonCredits();
    setShowCalculator(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <Leaf className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_credits.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">CO₂ tonnes sequestered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Credits</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verified_credits.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ready for trading</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fields Tracked</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_fields}</div>
              <p className="text-xs text-muted-foreground">Carbon tracking enabled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits/Acre</CardTitle>
              <Calculator className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.average_credits_per_acre.toFixed(3)}</div>
              <p className="text-xs text-muted-foreground">Average efficiency</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={() => setShowCalculator(true)} className="flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Calculate New Credits
        </Button>
      </div>

      {/* Calculator Modal */}
      {showCalculator && (
        <CarbonCreditCalculator 
          onClose={() => setShowCalculator(false)}
          onSuccess={handleNewCredit}
        />
      )}

      {/* Credits List */}
      <Card>
        <CardHeader>
          <CardTitle>Carbon Credit History</CardTitle>
          <CardDescription>Track your carbon sequestration progress</CardDescription>
        </CardHeader>
        <CardContent>
          {credits.length === 0 ? (
            <div className="text-center py-8">
              <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No carbon credits yet</h3>
              <p className="text-muted-foreground mb-4">
                Start calculating carbon credits for your fields to track sequestration.
              </p>
              <Button onClick={() => setShowCalculator(true)}>
                Calculate Your First Credits
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {credits.map((credit) => (
                <div key={credit.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{credit.field_name}</h4>
                      <Badge className={getStatusColor(credit.verification_status)}>
                        {credit.verification_status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Size:</span> {credit.field_size_acres} acres
                      </div>
                      <div>
                        <span className="font-medium">Credits:</span> {credit.credits_earned.toFixed(2)} CO₂ tonnes
                      </div>
                      <div>
                        <span className="font-medium">SOM:</span> {credit.soil_organic_matter?.toFixed(1) || 'N/A'}%
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(credit.calculation_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-success">
                      {credit.credits_earned.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">CO₂ tonnes</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}