import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Sprout, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SeasonalPlanningCardProps {
  location?: {
    county_name: string;
    state_code: string;
  };
  soilData?: any;
}

export const SeasonalPlanningCard: React.FC<SeasonalPlanningCardProps> = ({
  location,
  soilData
}) => {
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth();
  const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
  const currentSeason = seasons[Math.floor(currentMonth / 3)];

  const getSeasonalTips = () => {
    switch (currentSeason) {
      case 'Spring':
        return ['Soil testing', 'Seed preparation', 'Equipment maintenance'];
      case 'Summer':
        return ['Crop monitoring', 'Irrigation planning', 'Pest management'];
      case 'Fall':
        return ['Harvest planning', 'Cover crop seeding', 'Soil amendment'];
      case 'Winter':
        return ['Planning next season', 'Equipment repair', 'Crop rotation design'];
      default:
        return ['Seasonal planning', 'Crop selection', 'Soil management'];
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-green-200 bg-gradient-to-br from-green-50 to-blue-50"
      onClick={() => navigate('/seasonal-planning')}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" />
          Seasonal Planning
          <Badge variant="outline" className="ml-auto">
            {currentSeason}
          </Badge>
        </CardTitle>
        <CardDescription>
          AI-powered crop rotation and seasonal planning recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {location && (
            <div className="text-sm text-muted-foreground">
              <strong>Location:</strong> {location.county_name}, {location.state_code}
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Sprout className="h-4 w-4 text-green-500" />
              {currentSeason} Priorities
            </h4>
            <ul className="text-xs space-y-1">
              {getSeasonalTips().map((tip, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-green-500 rounded-full" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              GPT-5 Enhanced Planning
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};