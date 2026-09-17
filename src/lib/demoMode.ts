/**
 * Demo mode ("?demo=1") — renders the populated dashboard path using fixtures
 * that flow through the REAL hooks (useFields / useTasks / sensor query), so a
 * demo render is a genuine test of the populated logic, not a hardcoded panel.
 *
 * Safety rules:
 *  1. Env-gated: only available in dev or when VITE_ENABLE_DEMO_MODE=true.
 *  2. Inert when real data exists — fixtures are only substituted when the real
 *     query came back empty, so a customer can never see fixtures as their own.
 *  3. Every demo render is watermarked persistently (see DemoDataWatermark).
 */

export const DEMO_MODE_AVAILABLE =
  import.meta.env.DEV === true || import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';

/** True when the current URL asks for demo mode AND the build allows it. */
export function isDemoMode(): boolean {
  if (!DEMO_MODE_AVAILABLE) return false;
  if (typeof window === 'undefined') return false;
  const value = new URLSearchParams(window.location.search).get('demo');
  return value === '1' || value === 'true';
}
