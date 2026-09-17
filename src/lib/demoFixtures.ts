/**
 * Deterministic demo fixtures. Shaped exactly like the rows the real Supabase
 * queries return, so they travel through the identical hook/KPI code path.
 * Never persisted, never sent to the backend.
 */

const NOW = '2026-04-12T09:00:00.000Z';

const box = (lat: number, lng: number) => ({
  type: 'Polygon',
  coordinates: [[
    [lng, lat],
    [lng + 0.01, lat],
    [lng + 0.01, lat + 0.01],
    [lng, lat + 0.01],
    [lng, lat],
  ]],
});

/** 6 fields, areas sum to exactly 220.0 acres. */
export const DEMO_FIELDS = [
  { id: 'demo-field-1', name: 'North Bottoms', description: 'Demo data', boundary_coordinates: box(32.51, -83.66), area_acres: 42.5, crop_type: 'Corn', planting_date: '2026-03-28', harvest_date: '2026-08-20' },
  { id: 'demo-field-2', name: 'Creek Draw', description: 'Demo data', boundary_coordinates: box(32.53, -83.64), area_acres: 18.2, crop_type: 'Soybeans', planting_date: '2026-04-05', harvest_date: '2026-09-30' },
  { id: 'demo-field-3', name: 'Airport Pivot', description: 'Demo data', boundary_coordinates: box(32.55, -83.69), area_acres: 65.0, crop_type: 'Cotton', planting_date: '2026-04-18', harvest_date: '2026-10-15' },
  { id: 'demo-field-4', name: 'Home Block', description: 'Demo data', boundary_coordinates: box(32.49, -83.61), area_acres: 12.8, crop_type: 'Peanuts', planting_date: '2026-05-02', harvest_date: '2026-10-05' },
  { id: 'demo-field-5', name: 'Sandhill East', description: 'Demo data', boundary_coordinates: box(32.57, -83.58), area_acres: 30.4, crop_type: 'Winter Wheat', planting_date: '2025-11-10', harvest_date: '2026-06-12' },
  { id: 'demo-field-6', name: 'River Terrace', description: 'Demo data', boundary_coordinates: box(32.46, -83.72), area_acres: 51.1, crop_type: 'Corn', planting_date: '2026-03-30', harvest_date: '2026-08-25' },
].map((f) => ({
  ...f,
  user_id: 'demo-user',
  created_at: NOW,
  updated_at: NOW,
}));

export const DEMO_SOIL_ANALYSES = DEMO_FIELDS.map((f, i) => ({
  id: `demo-soil-${i + 1}`,
  ph_level: [6.4, 5.9, 6.8, 6.1, 6.6, 5.7][i],
  organic_matter: [2.8, 1.9, 3.4, 2.2, 3.0, 1.6][i],
  nitrogen_level: ['Medium', 'Low', 'High', 'Medium', 'High', 'Low'][i],
  phosphorus_level: ['High', 'Medium', 'High', 'Low', 'Medium', 'Low'][i],
  potassium_level: ['Medium', 'Medium', 'High', 'Medium', 'High', 'Low'][i],
  recommendations: 'Demo data — illustrative amendment plan only.',
  county_fips: '13153',
  county_name: 'Houston County',
  state_code: 'GA',
  property_address: f.name,
}));

/** 5 tasks — 3 open (pending / in_progress), 2 closed. */
export const DEMO_TASKS = [
  { id: 'demo-task-1', task_name: 'Side-dress nitrogen — North Bottoms', category: 'fertilization', status: 'pending', priority: 'high', scheduled_date: '2026-04-18', field_id: 'demo-field-1' },
  { id: 'demo-task-2', task_name: 'Scout for thrips — Airport Pivot', category: 'pest_management', status: 'in_progress', priority: 'medium', scheduled_date: '2026-04-14', field_id: 'demo-field-3' },
  { id: 'demo-task-3', task_name: 'Pull soil samples — Sandhill East', category: 'soil_testing', status: 'pending', priority: 'low', scheduled_date: '2026-04-25', field_id: 'demo-field-5' },
  { id: 'demo-task-4', task_name: 'Plant soybeans — Creek Draw', category: 'planting', status: 'completed', priority: 'high', scheduled_date: '2026-04-05', completed_date: '2026-04-05', field_id: 'demo-field-2' },
  { id: 'demo-task-5', task_name: 'Calibrate pivot flow meter', category: 'equipment_maintenance', status: 'completed', priority: 'medium', scheduled_date: '2026-03-22', completed_date: '2026-03-23', field_id: 'demo-field-3' },
].map((t) => ({
  ...t,
  user_id: 'demo-user',
  description: 'Demo data',
  created_at: NOW,
  updated_at: NOW,
}));

/** 3 sensors with deliberate drift / calibration variance across A, C and F grades. */
export const DEMO_SENSOR_QUALITY = [
  {
    id: 'demo-sq-1',
    sensor_id: 'SSP-MOIST-014',
    field_id: 'demo-field-1',
    reading_timestamp: '2026-04-12T08:40:00.000Z',
    drift_detected: false,
    drift_percentage: 0.8,
    staleness_warning: false,
    days_since_calibration: 34,
    confidence_score: 94,
    confidence_factors: ['Calibrated 34 days ago', 'Drift within tolerance', 'Continuous uplink'],
    quality_grade: 'A',
  },
  {
    id: 'demo-sq-2',
    sensor_id: 'SSP-EC-207',
    field_id: 'demo-field-3',
    reading_timestamp: '2026-04-12T08:35:00.000Z',
    drift_detected: true,
    drift_percentage: 12.4,
    staleness_warning: true,
    days_since_calibration: 210,
    confidence_score: 71,
    confidence_factors: ['Drift 12.4% vs baseline', 'Calibration overdue (210 days)'],
    quality_grade: 'C',
  },
  {
    id: 'demo-sq-3',
    sensor_id: 'SSP-TEMP-441',
    field_id: 'demo-field-5',
    reading_timestamp: '2026-04-12T07:55:00.000Z',
    drift_detected: true,
    drift_percentage: 27.9,
    staleness_warning: true,
    days_since_calibration: 420,
    confidence_score: 48,
    confidence_factors: ['Drift 27.9% vs baseline', 'Calibration overdue (420 days)', 'Intermittent uplink'],
    quality_grade: 'F',
  },
];
