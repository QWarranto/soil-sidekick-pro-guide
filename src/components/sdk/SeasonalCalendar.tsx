import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Leaf, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * LeafEngines™ White-Label UI Component
 * Seasonal Planting Calendar Widget
 * 
 * @package @leafengines/react-components
 */

export interface PlantingWindow {
  cropType: string;
  optimalStart: string;
  optimalEnd: string;
  lastSafeDate?: string;
  confidence: number;
  recommendations?: string[];
}

export interface SeasonalCalendarProps {
  location: string;
  windows: PlantingWindow[];
  currentDate?: Date;
  className?: string;
  showRecommendations?: boolean;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export const SeasonalCalendar: React.FC<SeasonalCalendarProps> = ({
  location,
  windows,
  currentDate = new Date(),
  className,
  showRecommendations = true,
  theme
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getWindowStatus = (window: PlantingWindow) => {
    const now = currentDate.getTime();
    const start = new Date(window.optimalStart).getTime();
    const end = new Date(window.optimalEnd).getTime();
    const lastSafe = window.lastSafeDate ? new Date(window.lastSafeDate).getTime() : end;

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'optimal';
    if (now > end && now <= lastSafe) return 'late';
    return 'passed';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimal':
        return { 
          icon: CheckCircle, 
          text: 'Plant Now!', 
          class: 'bg-green-100 text-green-800' 
        };
      case 'upcoming':
        return { 
          icon: Calendar, 
          text: 'Coming Soon', 
          class: 'bg-blue-100 text-blue-800' 
        };
      case 'late':
        return { 
          icon: AlertTriangle, 
          text: 'Late Window', 
          class: 'bg-yellow-100 text-yellow-800' 
        };
      case 'passed':
        return { 
          icon: Leaf, 
          text: 'Season Passed', 
          class: 'bg-gray-100 text-gray-800' 
        };
      default:
        return { 
          icon: Calendar, 
          text: 'Unknown', 
          class: 'bg-gray-100 text-gray-800' 
        };
    }
  };

  return (
    <div 
      className={cn(
        'rounded-lg border bg-card shadow-sm p-4',
        className
      )}
      style={{
        backgroundColor: theme?.backgroundColor,
        color: theme?.textColor
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar 
          className="w-5 h-5" 
          style={{ color: theme?.primaryColor }}
        />
        <div>
          <h3 
            className="font-semibold"
            style={{ color: theme?.primaryColor }}
          >
            Planting Calendar
          </h3>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
      </div>

      {/* Windows */}
      <div className="space-y-3">
        {windows.map((window, index) => {
          const status = getWindowStatus(window);
          const badge = getStatusBadge(status);
          const BadgeIcon = badge.icon;

          return (
            <div 
              key={index}
              className={cn(
                'rounded-md border p-3',
                status === 'optimal' && 'border-green-300 bg-green-50/50'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{window.cropType}</span>
                <span className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                  badge.class
                )}>
                  <BadgeIcon className="w-3 h-3" />
                  {badge.text}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {formatDate(window.optimalStart)} - {formatDate(window.optimalEnd)}
                </span>
                {window.lastSafeDate && (
                  <span className="text-xs">
                    Last safe: {formatDate(window.lastSafeDate)}
                  </span>
                )}
              </div>

              {/* Confidence */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ 
                      width: `${window.confidence}%`,
                      backgroundColor: theme?.primaryColor 
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {window.confidence}% confidence
                </span>
              </div>

              {/* Recommendations */}
              {showRecommendations && window.recommendations && window.recommendations.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {window.recommendations.slice(0, 2).map((rec, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="text-green-600">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          Powered by LeafEngines™
        </span>
      </div>
    </div>
  );
};

export default SeasonalCalendar;
