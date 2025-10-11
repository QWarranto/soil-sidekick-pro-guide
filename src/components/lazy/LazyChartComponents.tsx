import { lazy, Suspense } from 'react';
import { ChartLoadingFallback, CardLoadingFallback } from '@/utils/lazyLoad';

/**
 * Lazy-loaded chart components from recharts
 */

// Carbon Credit Dashboard
const LazyCarbonCreditDashboardComponent = lazy(() =>
  import('@/components/CarbonCreditDashboard').then(module => ({ 
    default: module.CarbonCreditDashboard 
  }))
);

export const LazyCarbonCreditDashboard = (props: any) => (
  <Suspense fallback={<CardLoadingFallback title="Carbon Credit Dashboard" />}>
    <LazyCarbonCreditDashboardComponent {...props} />
  </Suspense>
);

// Cost Monitoring Dashboard (default export)
const LazyCostMonitoringDashboardComponent = lazy(() =>
  import('@/components/CostMonitoringDashboard')
);

export const LazyCostMonitoringDashboard = (props: any) => (
  <Suspense fallback={<CardLoadingFallback title="Cost Monitoring" />}>
    <LazyCostMonitoringDashboardComponent {...props} />
  </Suspense>
);

// Usage Dashboard (default export)
const LazyUsageDashboardComponent = lazy(() =>
  import('@/components/UsageDashboard')
);

export const LazyUsageDashboard = (props: any) => (
  <Suspense fallback={<CardLoadingFallback title="Usage Analytics" />}>
    <LazyUsageDashboardComponent {...props} />
  </Suspense>
);

// KPI Dashboard (default export)
const LazyKPIDashboardComponent = lazy(() =>
  import('@/components/KPIDashboard')
);

export const LazyKPIDashboard = (props: any) => (
  <Suspense fallback={<ChartLoadingFallback />}>
    <LazyKPIDashboardComponent {...props} />
  </Suspense>
);

// AI Crop Recommendations (default export)
const LazyAICropRecommendationsComponent = lazy(() =>
  import('@/components/AICropRecommendations')
);

export const LazyAICropRecommendations = (props: any) => (
  <Suspense fallback={<CardLoadingFallback title="AI Crop Recommendations" />}>
    <LazyAICropRecommendationsComponent {...props} />
  </Suspense>
);

// Seasonal Planning Card
const LazySeasonalPlanningCardComponent = lazy(() =>
  import('@/components/SeasonalPlanningCard').then(module => ({ 
    default: module.SeasonalPlanningCard 
  }))
);

export const LazySeasonalPlanningCard = (props: any) => (
  <Suspense fallback={<CardLoadingFallback title="Seasonal Planning" />}>
    <LazySeasonalPlanningCardComponent {...props} />
  </Suspense>
);
