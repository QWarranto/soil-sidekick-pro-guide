import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Heart, Sprout, Clock, TrendingUp, Loader2 } from "lucide-react";
import { FrequentPlant, RecentPlant } from "@/hooks/usePlantTracking";
import { formatDistanceToNow } from "date-fns";

interface PlantHistorySectionProps {
  frequentPlants: FrequentPlant[];
  recentPlants: RecentPlant[];
  isLoading: boolean;
  onPlantClick: (plantName: string, queryType: 'identify' | 'health' | 'care') => void;
}

const getQueryTypeIcon = (type: string) => {
  switch (type) {
    case 'identify':
      return <Leaf className="h-3 w-3" />;
    case 'health':
      return <Heart className="h-3 w-3" />;
    case 'care':
      return <Sprout className="h-3 w-3" />;
    default:
      return null;
  }
};

const getQueryTypeColor = (type: string) => {
  switch (type) {
    case 'identify':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'health':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'care':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default:
      return 'bg-muted';
  }
};

export function PlantHistorySection({
  frequentPlants,
  recentPlants,
  isLoading,
  onPlantClick,
}: PlantHistorySectionProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  const hasFrequentPlants = frequentPlants.length > 0;
  const hasRecentPlants = recentPlants.length > 0;

  if (!hasFrequentPlants && !hasRecentPlants) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Plant History Yet</h3>
          <p className="text-sm text-muted-foreground">
            Start identifying plants, and they'll appear here for quick access!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {hasFrequentPlants && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Your Most Searched Plants</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {frequentPlants.map((plant) => (
              <div
                key={plant.plant_name}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium">{plant.plant_name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {plant.query_count} {plant.query_count === 1 ? 'query' : 'queries'}
                    </span>
                    <div className="flex gap-1">
                      {plant.query_types.map((type) => (
                        <Badge
                          key={type}
                          variant="outline"
                          className={`text-xs ${getQueryTypeColor(type)}`}
                        >
                          {getQueryTypeIcon(type)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {plant.query_types.includes('identify') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onPlantClick(plant.plant_name, 'identify')}
                    >
                      <Leaf className="h-4 w-4" />
                    </Button>
                  )}
                  {plant.query_types.includes('health') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onPlantClick(plant.plant_name, 'health')}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  )}
                  {plant.query_types.includes('care') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onPlantClick(plant.plant_name, 'care')}
                    >
                      <Sprout className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {hasRecentPlants && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Recent Searches</h3>
          </div>
          <div className="space-y-2">
            {recentPlants.slice(0, 5).map((plant) => (
              <div
                key={plant.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onPlantClick(plant.plant_name, plant.query_type as any)}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getQueryTypeColor(plant.query_type)}>
                    {getQueryTypeIcon(plant.query_type)}
                    <span className="ml-1 capitalize">{plant.query_type}</span>
                  </Badge>
                  <span className="font-medium">{plant.plant_name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(plant.created_at), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
