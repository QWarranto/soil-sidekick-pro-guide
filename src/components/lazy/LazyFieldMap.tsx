import { lazy, Suspense } from 'react';
import { MapLoadingFallback } from '@/utils/lazyLoad';
import type { FieldMap as FieldMapType } from '@/components/FieldMap';

/**
 * Lazy-loaded FieldMap component
 * Heavy component: Uses Mapbox GL JS library
 */
const LazyFieldMapComponent = lazy(() =>
  import('@/components/FieldMap').then(module => ({ default: module.FieldMap }))
);

export const LazyFieldMap: typeof FieldMapType = (props) => (
  <Suspense fallback={<MapLoadingFallback />}>
    <LazyFieldMapComponent {...props} />
  </Suspense>
);
