import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Cpu, Wifi, WifiOff } from 'lucide-react';

export interface TurboQuantStatusProps {
  /** Whether TurboQuant 3-bit KV cache is active */
  active: boolean;
  /** Current runtime tier */
  runtimeTier: 'webgpu' | 'wasm_tq' | 'wasm_standard' | 'cloud_fallback';
  /** Current model identifier */
  model: string;
  /** Estimated KV cache size in GB */
  kvCacheGB?: number;
  /** Max context tokens available */
  maxContextTokens?: number;
  /** Whether the device is currently online */
  isOnline?: boolean;
  /** Optional CSS class */
  className?: string;
}

const RUNTIME_LABELS: Record<string, string> = {
  webgpu: 'WebGPU',
  wasm_tq: 'WASM + TurboQuant',
  wasm_standard: 'WASM (Standard)',
  cloud_fallback: 'Cloud',
};

/**
 * White-label status indicator for TurboQuant-powered local inference.
 * Designed for SDK licensees to embed in their settings or status bars.
 *
 * Themeable via CSS variables: --primary, --secondary, --muted, etc.
 */
export function TurboQuantStatus({
  active,
  runtimeTier,
  model,
  kvCacheGB,
  maxContextTokens,
  isOnline = true,
  className,
}: TurboQuantStatusProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Cpu className="h-4 w-4 text-muted-foreground" />
          Local AI Status
          {active && (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
              <Zap className="h-3 w-3 mr-1" />
              TurboQuant
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Runtime</span>
          <span className="font-medium text-foreground">
            {RUNTIME_LABELS[runtimeTier] ?? runtimeTier}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Model</span>
          <span className="font-medium text-foreground">{model}</span>
        </div>
        {kvCacheGB !== undefined && (
          <div className="flex justify-between">
            <span>KV Cache</span>
            <span className="font-medium text-foreground">
              ~{kvCacheGB.toFixed(1)} GB {active ? '(3-bit)' : '(16-bit)'}
            </span>
          </div>
        )}
        {maxContextTokens !== undefined && (
          <div className="flex justify-between">
            <span>Context</span>
            <span className="font-medium text-foreground">
              {(maxContextTokens / 1024).toFixed(0)}K tokens
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Connectivity</span>
          <span className="flex items-center gap-1 font-medium text-foreground">
            {isOnline ? (
              <><Wifi className="h-3 w-3" /> Online</>
            ) : (
              <><WifiOff className="h-3 w-3" /> Offline</>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
