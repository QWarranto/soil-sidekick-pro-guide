import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, LogOut, ArrowLeft } from 'lucide-react';
import { CountyLookup } from '@/components/CountyLookup';
import { SeasonalPlanningAssistant } from '@/components/SeasonalPlanningAssistant';
import { useToast } from '@/hooks/use-toast';

interface County {
  id: string;
  county_name: string;
  state_name: string;
  state_code: string;
  fips_code: string;
}

const SeasonalPlanning = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [soilData, setSoilData] = useState<any>(null);

  const handleCountySelect = (county: County) => {
    setSelectedCounty(county);
    // In a real app, you might fetch soil data for the county here
    // For now, we'll use mock data or pass null
    setSoilData(null);
    
    toast({
      title: "Location Selected",
      description: `Selected ${county.county_name}, ${county.state_code} for seasonal planning`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-blue-50">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-600">Seasonal Planning Assistant</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Location Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Location Selection
              </CardTitle>
              <CardDescription>
                Select your location to get region-specific seasonal planning recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CountyLookup 
                onCountySelect={handleCountySelect}
              />
            </CardContent>
          </Card>

          {/* Seasonal Planning Assistant */}
          <SeasonalPlanningAssistant 
            location={selectedCounty || undefined}
            soilData={soilData}
          />
        </div>
      </main>
    </div>
  );
};

export default SeasonalPlanning;