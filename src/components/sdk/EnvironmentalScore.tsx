import React from 'react';
import { cn } from '@/lib/utils';

/**
 * LeafEngines™ White-Label UI Component
 * Environmental Compatibility Score Display
 * 
 * @package @leafengines/react-components
 */

export interface EnvironmentalScoreProps {
  score: number;
  soilCompatibility?: number;
  waterCompatibility?: number;
  climateCompatibility?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  showBreakdown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export const EnvironmentalScore: React.FC<EnvironmentalScoreProps> = ({
  score,
  soilCompatibility,
  waterCompatibility,
  climateCompatibility,
  riskLevel = 'low',
  showBreakdown = true,
  size = 'md',
  className,
  theme
}) => {
  const getScoreColor = (value: number) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sizeClasses = {
    sm: { container: 'p-3', score: 'text-3xl', label: 'text-xs' },
    md: { container: 'p-4', score: 'text-4xl', label: 'text-sm' },
    lg: { container: 'p-6', score: 'text-5xl', label: 'text-base' }
  };

  const sizes = sizeClasses[size];

  return (
    <div 
      className={cn(
        'rounded-lg border bg-card shadow-sm',
        sizes.container,
        className
      )}
      style={{
        backgroundColor: theme?.backgroundColor,
        color: theme?.textColor
      }}
    >
      {/* Main Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <span 
            className={cn('font-bold', sizes.score, getScoreColor(score))}
            style={{ color: theme?.primaryColor }}
          >
            {score}
          </span>
          <span className={cn('text-muted-foreground', sizes.label)}>/100</span>
        </div>
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          getRiskBadgeColor(riskLevel)
        )}>
          {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
        </span>
      </div>

      <h3 className={cn('font-semibold mb-2', sizes.label)}>
        Environmental Compatibility Score
      </h3>

      {/* Breakdown */}
      {showBreakdown && (soilCompatibility || waterCompatibility || climateCompatibility) && (
        <div className="space-y-2 mt-4">
          {soilCompatibility !== undefined && (
            <ScoreBar label="Soil" value={soilCompatibility} theme={theme} />
          )}
          {waterCompatibility !== undefined && (
            <ScoreBar label="Water" value={waterCompatibility} theme={theme} />
          )}
          {climateCompatibility !== undefined && (
            <ScoreBar label="Climate" value={climateCompatibility} theme={theme} />
          )}
        </div>
      )}

      {/* LeafEngines Attribution */}
      <div className="mt-4 pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          Powered by LeafEngines™
        </span>
      </div>
    </div>
  );
};

interface ScoreBarProps {
  label: string;
  value: number;
  theme?: EnvironmentalScoreProps['theme'];
}

const ScoreBar: React.FC<ScoreBarProps> = ({ label, value, theme }) => {
  const getBarColor = (v: number) => {
    if (v >= 70) return 'bg-green-500';
    if (v >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-14">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all', getBarColor(value))}
          style={{ 
            width: `${value}%`,
            backgroundColor: theme?.primaryColor 
          }}
        />
      </div>
      <span className="text-xs font-medium w-8 text-right">{value}</span>
    </div>
  );
};

export default EnvironmentalScore;
