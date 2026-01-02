import React from 'react';
import { cn } from '@/lib/utils';
import { Satellite, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * LeafEngines™ White-Label UI Component
 * Real-time Satellite Health Monitoring Badge
 * 
 * @package @leafengines/react-components
 */

export interface SatelliteHealthProps {
  ndvi: number;
  soilMoisture?: number;
  vegetationTrend?: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
  variant?: 'badge' | 'card' | 'inline';
  className?: string;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export const SatelliteHealth: React.FC<SatelliteHealthProps> = ({
  ndvi,
  soilMoisture,
  vegetationTrend = 'stable',
  lastUpdated,
  variant = 'badge',
  className,
  theme
}) => {
  const getNDVIStatus = (value: number) => {
    if (value >= 0.6) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (value >= 0.4) return { label: 'Good', color: 'text-green-500', bg: 'bg-green-50' };
    if (value >= 0.2) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'declining': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const status = getNDVIStatus(ndvi);
  const TrendIcon = getTrendIcon(vegetationTrend);

  // Badge variant - compact inline display
  if (variant === 'badge') {
    return (
      <div 
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
          status.bg,
          status.color,
          className
        )}
        style={{ backgroundColor: theme?.backgroundColor }}
      >
        <Satellite className="w-4 h-4" />
        <span>NDVI: {ndvi.toFixed(2)}</span>
        <TrendIcon className={cn('w-3 h-3', getTrendColor(vegetationTrend))} />
      </div>
    );
  }

  // Inline variant - minimal text display
  if (variant === 'inline') {
    return (
      <span 
        className={cn(
          'inline-flex items-center gap-1 text-sm',
          status.color,
          className
        )}
      >
        <Activity className="w-3 h-3" />
        <span>{status.label}</span>
        <TrendIcon className={cn('w-3 h-3', getTrendColor(vegetationTrend))} />
      </span>
    );
  }

  // Card variant - full display
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Satellite 
            className="w-5 h-5" 
            style={{ color: theme?.primaryColor }}
          />
          <h3 
            className="font-semibold"
            style={{ color: theme?.primaryColor }}
          >
            Satellite Monitoring
          </h3>
        </div>
        <span className={cn(
          'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
          status.bg,
          status.color
        )}>
          <Activity className="w-3 h-3" />
          {status.label}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* NDVI */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Vegetation Index (NDVI)</p>
          <div className="flex items-baseline gap-2">
            <span className={cn('text-2xl font-bold', status.color)}>
              {ndvi.toFixed(2)}
            </span>
            <TrendIcon className={cn('w-4 h-4', getTrendColor(vegetationTrend))} />
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ 
                width: `${ndvi * 100}%`,
                backgroundColor: theme?.primaryColor 
              }}
            />
          </div>
        </div>

        {/* Soil Moisture */}
        {soilMoisture !== undefined && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Soil Moisture</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">
                {(soilMoisture * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${soilMoisture * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Trend */}
      <div className="mt-4 flex items-center gap-2">
        <TrendIcon className={cn('w-4 h-4', getTrendColor(vegetationTrend))} />
        <span className={cn('text-sm capitalize', getTrendColor(vegetationTrend))}>
          Vegetation {vegetationTrend}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Powered by LeafEngines™
        </span>
        <span className="text-xs text-muted-foreground">
          Updated: {lastUpdated}
        </span>
      </div>
    </div>
  );
};

export default SatelliteHealth;
