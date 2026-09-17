import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Navigation, Radio, RadioTower, AlertTriangle } from 'lucide-react';
import { DeadReckoningState } from '@/hooks/useDeadReckoning';

interface DeadReckoningBadgeProps {
  state: DeadReckoningState;
}

export function DeadReckoningBadge({ state }: DeadReckoningBadgeProps) {
  if (!state.position) return null;

  const isGPS = state.position.source === 'gps';
  const driftWarning = state.uncertaintyRadius > 50;
  const driftCritical = state.uncertaintyRadius > 200;

  const formatUncertainty = (meters: number) => {
    if (meters >= 1000) return `±${(meters / 1000).toFixed(1)}km`;
    return `±${Math.round(meters)}m`;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  if (isGPS && !state.isEstimating) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-green-100 text-green-700 border-green-200">
              <RadioTower className="h-3 w-3" />
              GPS Lock
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Live GPS position • Accuracy: {formatUncertainty(state.position.accuracy)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            variant="secondary"
            className={`flex items-center gap-1 text-xs ${
              driftCritical
                ? 'bg-destructive/10 text-destructive border-destructive/20'
                : driftWarning
                ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                : 'bg-blue-100 text-blue-700 border-blue-200'
            }`}
          >
            {driftCritical ? (
              <AlertTriangle className="h-3 w-3" />
            ) : (
              <Navigation className="h-3 w-3" />
            )}
            DR {formatUncertainty(state.uncertaintyRadius)}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1 text-xs">
            <p className="font-medium">Dead Reckoning (Inertial Estimation)</p>
            <p>Steps detected: {state.stepCount}</p>
            <p>Heading: {state.heading !== null ? `${Math.round(state.heading)}°` : 'N/A'}</p>
            <p>Time since GPS: {formatTime(state.secondsSinceGPSFix)}</p>
            <p>Uncertainty: {formatUncertainty(state.uncertaintyRadius)}</p>
            {driftCritical && (
              <p className="text-destructive font-medium mt-1">
                ⚠ High drift — position unreliable. Reconnect for GPS fix.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
