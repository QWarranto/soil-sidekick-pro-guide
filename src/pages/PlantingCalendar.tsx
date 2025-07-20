import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CountyMenuLookup } from '@/components/CountyMenuLookup';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, LogOut, ArrowLeft, Calendar, Sprout, Thermometer, CloudRain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlantingData {
  crop: string;
  plantingWindow: {
    start: string;
    end: string;
  };
  harvestWindow: {
    start: string;
    end: string;
  };
  lastFrostDate: string;
  firstFrostDate: string;
  category: 'cool-season' | 'warm-season' | 'year-round';
  description: string;
}

// Sample planting data - this would come from USDA NASS Crop Progress + NOAA weather APIs
const samplePlantingData: PlantingData[] = [
  {
    crop: 'Tomatoes',
    plantingWindow: { start: 'Apr 15', end: 'May 30' },
    harvestWindow: { start: 'Jul 1', end: 'Oct 15' },
    lastFrostDate: 'Apr 10',
    firstFrostDate: 'Oct 20',
    category: 'warm-season',
    description: 'Plant after last frost when soil temperature reaches 60°F'
  },
  {
    crop: 'Lettuce',
    plantingWindow: { start: 'Mar 1', end: 'Apr 15' },
    harvestWindow: { start: 'Apr 15', end: 'Jun 1' },
    lastFrostDate: 'Apr 10',
    firstFrostDate: 'Oct 20',
    category: 'cool-season',
    description: 'Cool weather crop, plant 2-4 weeks before last frost'
  },
  {
    crop: 'Peppers',
    plantingWindow: { start: 'May 1', end: 'Jun 15' },
    harvestWindow: { start: 'Jul 15', end: 'Oct 10' },
    lastFrostDate: 'Apr 10',
    firstFrostDate: 'Oct 20',
    category: 'warm-season',
    description: 'Warm season crop, plant 2-3 weeks after last frost'
  },
  {
    crop: 'Spinach',
    plantingWindow: { start: 'Mar 1', end: 'Apr 1' },
    harvestWindow: { start: 'Apr 15', end: 'May 30' },
    lastFrostDate: 'Apr 10',
    firstFrostDate: 'Oct 20',
    category: 'cool-season',
    description: 'Plant in early spring, tolerates light frost'
  },
  {
    crop: 'Corn',
    plantingWindow: { start: 'Apr 20', end: 'May 20' },
    harvestWindow: { start: 'Jul 20', end: 'Sep 15' },
    lastFrostDate: 'Apr 10',
    firstFrostDate: 'Oct 20',
    category: 'warm-season',
    description: 'Plant when soil temperature is consistently above 50°F'
  },
  {
    crop: 'Carrots',
    plantingWindow: { start: 'Mar 15', end: 'Jul 15' },
    harvestWindow: { start: 'Jun 1', end: 'Nov 1' },
    lastFrostDate: 'Apr 10',
    firstFrostDate: 'Oct 20',
    category: 'cool-season',
    description: 'Plant every 2-3 weeks for continuous harvest'
  }
];

const PlantingCalendar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [plantingData, setPlantingData] = useState<PlantingData[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleDataFound = (data: any[]) => {
    // In a real implementation, this would fetch planting data based on the county
    // For now, we'll use sample data
    setPlantingData(samplePlantingData);
    setShowResults(true);
    toast({
      title: "Planting calendar loaded",
      description: `Found planting recommendations for your selected county.`,
    });
  };

  const handleNoDataFound = () => {
    setShowResults(false);
    toast({
      title: "No planting data available",
      description: "Planting calendar data not available for this county yet.",
      variant: "destructive",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cool-season':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'warm-season':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'year-round':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">SoilSidekick Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/soil-analysis')}>
              Soil Analysis
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')}>
              Pricing
            </Button>
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
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
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Page Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Planting Calendar</CardTitle>
                  <CardDescription>
                    County-specific planting and harvest schedules based on USDA and NOAA data
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* County Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Your County</CardTitle>
              <CardDescription>
                Choose your county to get personalized planting recommendations based on local climate data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CountyMenuLookup
                onDataFound={handleDataFound}
                onNoDataFound={handleNoDataFound}
              />
            </CardContent>
          </Card>

          {/* Planting Calendar Results */}
          {showResults && (
            <div className="space-y-6">
              {/* Weather Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Frost Dates & Climate Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <CloudRain className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-semibold">Last Spring Frost</p>
                        <p className="text-lg text-blue-600">April 10</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <Thermometer className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="font-semibold">First Fall Frost</p>
                        <p className="text-lg text-orange-600">October 20</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Planting Calendar Grid */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    Crop Planting Calendar
                  </CardTitle>
                  <CardDescription>
                    Recommended planting and harvest windows for your county
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {plantingData.map((crop, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{crop.crop}</CardTitle>
                            <Badge className={getCategoryColor(crop.category)}>
                              {crop.category.replace('-', ' ')}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-green-600">Plant Window</p>
                              <p>{crop.plantingWindow.start} - {crop.plantingWindow.end}</p>
                            </div>
                            <div>
                              <p className="font-medium text-orange-600">Harvest Window</p>
                              <p>{crop.harvestWindow.start} - {crop.harvestWindow.end}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {crop.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">💡 Planting Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">• Always check soil temperature before planting warm-season crops</p>
                  <p className="text-sm">• Cool-season crops can often tolerate light frost</p>
                  <p className="text-sm">• Plant successive crops every 2-3 weeks for continuous harvest</p>
                  <p className="text-sm">• Local microclimates may vary from county averages</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlantingCalendar;