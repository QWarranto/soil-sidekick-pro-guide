import React, { Suspense, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LazyLoadOptions {
  fallback?: React.ReactNode;
  minHeight?: string;
  className?: string;
}

/**
 * Creates a lazy-loaded component with a loading fallback
 * @param importFn - Dynamic import function
 * @param options - Configuration options
 * @returns Lazy-loaded component with Suspense boundary
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) {
  const LazyComponent = React.lazy(importFn);
  
  const {
    fallback,
    minHeight = '400px',
    className = ''
  } = options;

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <DefaultLoadingFallback minHeight={minHeight} className={className} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Default loading fallback component
 */
const DefaultLoadingFallback: React.FC<{ minHeight?: string; className?: string }> = ({ 
  minHeight = '400px',
  className = '' 
}) => (
  <div className={`flex items-center justify-center ${className}`} style={{ minHeight }}>
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading component...</p>
    </div>
  </div>
);

/**
 * Card-style loading fallback
 */
export const CardLoadingFallback: React.FC<{ title?: string }> = ({ title }) => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64 mt-2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-64 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </CardContent>
  </Card>
);

/**
 * Chart-specific loading fallback
 */
export const ChartLoadingFallback: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-64 w-full rounded-lg" />
    <div className="flex gap-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

/**
 * Map-specific loading fallback
 */
export const MapLoadingFallback: React.FC = () => (
  <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-muted">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
    {/* Simulate map tiles loading */}
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-4 opacity-20">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-full" />
      ))}
    </div>
  </div>
);

/**
 * Dashboard-specific loading fallback
 */
export const DashboardLoadingFallback: React.FC = () => (
  <div className="space-y-6 p-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <CardLoadingFallback />
      <CardLoadingFallback />
    </div>
  </div>
);

/**
 * Hook for viewport-based lazy loading
 */
export function useInViewport(ref: React.RefObject<HTMLElement>, threshold = 0.1) {
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once loaded, stop observing
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold]);

  return isInView;
}

/**
 * Component that lazy loads children when they enter the viewport
 */
export const LazyViewportLoader: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
  threshold?: number;
}> = ({ children, fallback, minHeight = '200px', threshold = 0.1 }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInViewport(ref, threshold);

  return (
    <div ref={ref} style={{ minHeight }}>
      {isInView ? children : fallback || <DefaultLoadingFallback minHeight={minHeight} />}
    </div>
  );
};
