import React from 'react';
import { cn } from '@/lib/utils';
import { Droplets, Sun, Thermometer, Wind } from 'lucide-react';

/**
 * LeafEngines™ White-Label UI Component
 * Dynamic Care Recommendations Card
 * 
 * @package @leafengines/react-components
 */

export interface CareRecommendation {
  type: 'water' | 'light' | 'temperature' | 'humidity';
  status: 'good' | 'warning' | 'critical';
  message: string;
  action?: string;
  urgency?: 'low' | 'medium' | 'high';
}

export interface PlantCareCardProps {
  plantName: string;
  scientificName?: string;
  recommendations: CareRecommendation[];
  lastUpdated?: string;
  className?: string;
  compact?: boolean;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export const PlantCareCard: React.FC<PlantCareCardProps> = ({
  plantName,
  scientificName,
  recommendations,
  lastUpdated,
  className,
  compact = false,
  theme
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'water': return Droplets;
      case 'light': return Sun;
      case 'temperature': return Thermometer;
      case 'humidity': return Wind;
      default: return Droplets;
    }
  };

  const getUrgencyBorder = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'border-l-4 border-l-red-500';
      case 'medium': return 'border-l-4 border-l-yellow-500';
      default: return 'border-l-4 border-l-green-500';
    }
  };

  return (
    <div 
      className={cn(
        'rounded-lg border bg-card shadow-sm',
        compact ? 'p-3' : 'p-4',
        className
      )}
      style={{
        backgroundColor: theme?.backgroundColor,
        color: theme?.textColor
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 
          className="font-semibold text-lg"
          style={{ color: theme?.primaryColor }}
        >
          {plantName}
        </h3>
        {scientificName && (
          <p className="text-sm text-muted-foreground italic">{scientificName}</p>
        )}
      </div>

      {/* Recommendations */}
      <div className={cn('space-y-2', compact && 'space-y-1')}>
        {recommendations.map((rec, index) => {
          const Icon = getIcon(rec.type);
          
          return (
            <div 
              key={index}
              className={cn(
                'rounded-md p-2 flex items-start gap-3',
                getStatusColor(rec.status),
                getUrgencyBorder(rec.urgency)
              )}
            >
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
                  {rec.message}
                </p>
                {rec.action && !compact && (
                  <p className="text-xs mt-1 opacity-80">
                    Action: {rec.action}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Powered by LeafEngines™
        </span>
        {lastUpdated && (
          <span className="text-xs text-muted-foreground">
            Updated: {lastUpdated}
          </span>
        )}
      </div>
    </div>
  );
};

export default PlantCareCard;
