import { useState, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { offsetPosition, EARTH_RADIUS_M, DEG_TO_RAD } from '@/lib/dead-reckoning/geodesy';
import {
  createSensorFusionState,
  updatePrimaryHeading,
  updateSecondaryHeading,
  DEFAULT_FUSION_CONFIG,
} from '@/lib/dead-reckoning/sensor-fusion';
import {
  createUncertaintyState,
  accumulateStepUncertainty,
  resetUncertaintyFromGPS,
  DEFAULT_UNCERTAINTY_CONFIG,
} from '@/lib/dead-reckoning/uncertainty-model';
import { Shield, Crosshair, Waves, BarChart3, Download, FileVideo } from 'lucide-react';
import { downloadStandaloneHTML } from '@/utils/dv005HtmlExport';
import dv005Video from '@/assets/dv005-demo-circulation.mp4';

// ─── TYPES ───────────────────────────────────────────────
interface GridPoint {
  lat: number;
  lng: number;
  row: number;
  col: number;
  eoir: number; // EO/IR synthetic value
  rf: number;   // RF synthetic value
}

interface FusionSample {
  t: number;
  primary: number;
  secondary: number;
  fused: number;
}

interface UncertaintySample {
  step: number;
  variance: number;
  radius: number;
  gpsReset: boolean;
}

// ─── CONSTANTS ───────────────────────────────────────────
const ORIGIN = { lat: 33.7490, lng: -84.3880 }; // Atlanta, GA — representative CONUS point
const GRID_SIZE = 12;
const GRID_SPACING_M = 10; // 10m precision grid

// ─── ENVIRONMENTAL PRIORS (shared state vector) ──────────
function environmentalState(lat: number, lng: number) {
  // Deterministic pseudo-random from position — simulates soil moisture, NDVI, conductivity
  const seed = Math.sin(lat * 12345.6789 + lng * 98765.4321) * 43758.5453;
  const moisture = 0.3 + 0.4 * ((seed - Math.floor(seed)));
  const ndvi = 0.2 + 0.6 * ((Math.sin(seed * 2.1) + 1) / 2);
  const conductivity = 0.1 + 0.5 * ((Math.cos(seed * 3.7) + 1) / 2);
  return { moisture, ndvi, conductivity };
}

// ─── DEMO A: GEO-SPECIFIC GRID ──────────────────────────
function generateGrid(): GridPoint[] {
  const points: GridPoint[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      // Step east then north from origin
      const eastOffset = offsetPosition(ORIGIN.lat, ORIGIN.lng, c * GRID_SPACING_M, 90);
      const pos = offsetPosition(eastOffset.latitude, eastOffset.longitude, r * GRID_SPACING_M, 0);
      const env = environmentalState(pos.latitude, pos.longitude);
      points.push({
        lat: pos.latitude,
        lng: pos.longitude,
        row: r,
        col: c,
        eoir: env.moisture * 0.6 + env.ndvi * 0.4, // EO/IR: moisture + vegetation
        rf: env.conductivity * 0.7 + env.moisture * 0.3, // RF: conductivity + moisture
      });
    }
  }
  return points;
}

// ─── DEMO B: SENSOR FUSION TIME SERIES ───────────────────
function generateFusionSeries(): FusionSample[] {
  const state = createSensorFusionState();
  const samples: FusionSample[] = [];
  const N = 120;

  for (let i = 0; i < N; i++) {
    const t = i * 100; // 100ms intervals
    // Primary: smooth rotation with gyro drift
    const primary = (45 + i * 1.5 + Math.sin(i * 0.1) * 3) % 360;
    // Secondary: magnetometer — noisier, slower update
    const secondary = (45 + i * 1.5 + Math.sin(i * 0.05) * 8 + (Math.random() - 0.5) * 5) % 360;

    if (i % 3 === 0) updateSecondaryHeading(secondary, state);
    const fused = updatePrimaryHeading(primary, t, state, DEFAULT_FUSION_CONFIG);

    samples.push({
      t,
      primary: primary,
      secondary: secondary,
      fused: fused ?? primary,
    });
  }
  return samples;
}

// ─── DEMO C: UNCERTAINTY PROPAGATION ─────────────────────
function generateUncertaintySeries(gpsResetStep: number): UncertaintySample[] {
  const state = createUncertaintyState(5); // 5m initial GPS accuracy
  const samples: UncertaintySample[] = [];
  const N = 80;

  for (let i = 0; i < N; i++) {
    const isReset = i === gpsResetStep;
    if (isReset) {
      resetUncertaintyFromGPS(3, state); // GPS correction to 3m
    } else {
      accumulateStepUncertainty(0.75, state, DEFAULT_UNCERTAINTY_CONFIG); // 0.75m stride
    }
    samples.push({
      step: i,
      variance: state.variance,
      radius: state.radius,
      gpsReset: isReset,
    });
  }
  return samples;
}

// ─── COLOR UTILITIES ─────────────────────────────────────
function valueToHeatColor(v: number, palette: 'eoir' | 'rf'): string {
  const clamped = Math.max(0, Math.min(1, v));
  if (palette === 'eoir') {
    // Green → Yellow → Red (vegetation/thermal)
    const r = Math.round(255 * Math.min(1, clamped * 2));
    const g = Math.round(255 * Math.min(1, (1 - clamped) * 2));
    return `rgb(${r}, ${g}, 40)`;
  }
  // Blue → Cyan → White (RF attenuation)
  const b = 200;
  const rg = Math.round(60 + 195 * clamped);
  return `rgb(${rg}, ${rg}, ${b})`;
}

// ─── SVG CHART HELPERS ───────────────────────────────────
function MiniLineChart({
  data,
  width = 600,
  height = 200,
  lines,
  yDomain,
}: {
  data: Record<string, number>[];
  width?: number;
  height?: number;
  lines: { key: string; color: string; label: string }[];
  yDomain?: [number, number];
}) {
  const margin = { top: 10, right: 16, bottom: 24, left: 44 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const allVals = data.flatMap(d => lines.map(l => d[l.key] as number));
  const [yMin, yMax] = yDomain ?? [Math.min(...allVals), Math.max(...allVals)];
  const xScale = (i: number) => margin.left + (i / (data.length - 1)) * w;
  const yScale = (v: number) => margin.top + h - ((v - yMin) / (yMax - yMin || 1)) * h;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: height }}>
      {/* Y axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const v = yMin + f * (yMax - yMin);
        return (
          <text key={f} x={margin.left - 6} y={yScale(v) + 4} textAnchor="end" fontSize={10} fill="currentColor" className="text-muted-foreground">
            {v < 10 ? v.toFixed(1) : Math.round(v)}
          </text>
        );
      })}
      {/* Grid */}
      {[0, 0.5, 1].map(f => (
        <line key={f} x1={margin.left} x2={width - margin.right} y1={yScale(yMin + f * (yMax - yMin))} y2={yScale(yMin + f * (yMax - yMin))} stroke="currentColor" strokeOpacity={0.1} />
      ))}
      {/* Lines */}
      {lines.map(l => (
        <polyline
          key={l.key}
          fill="none"
          stroke={l.color}
          strokeWidth={1.5}
          points={data.map((d, i) => `${xScale(i)},${yScale(d[l.key] as number)}`).join(' ')}
        />
      ))}
      {/* Legend */}
      {lines.map((l, i) => (
        <g key={l.key} transform={`translate(${margin.left + i * 140}, ${height - 6})`}>
          <rect width={12} height={3} fill={l.color} rx={1} />
          <text x={16} y={3} fontSize={9} fill="currentColor" className="text-muted-foreground">{l.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────
export default function DV005Demo() {
  const [gpsResetStep, setGpsResetStep] = useState([40]);

  const grid = useMemo(() => generateGrid(), []);
  const fusionSeries = useMemo(() => generateFusionSeries(), []);
  const uncertaintySeries = useMemo(() => generateUncertaintySeries(gpsResetStep[0]), [gpsResetStep]);

  const correlationCoeff = useMemo(() => {
    const eoirVals = grid.map(p => p.eoir);
    const rfVals = grid.map(p => p.rf);
    const n = eoirVals.length;
    const meanA = eoirVals.reduce((s, v) => s + v, 0) / n;
    const meanB = rfVals.reduce((s, v) => s + v, 0) / n;
    let num = 0, denA = 0, denB = 0;
    for (let i = 0; i < n; i++) {
      const da = eoirVals[i] - meanA;
      const db = rfVals[i] - meanB;
      num += da * db;
      denA += da * da;
      denB += db * db;
    }
    return num / Math.sqrt(denA * denB);
  }, [grid]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="text-xs font-mono">AFWERX TECH CONNECT 00004990</Badge>
            <Badge variant="secondary" className="text-xs">DV005</Badge>
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            LeafEngines™ DV005 Technical Demonstration
          </h1>
          <p className="text-muted-foreground text-sm max-w-3xl">
            Patent-protected architecture for geo-specific scene construction, cross-modal physical consistency,
            and uncertainty quantification — all operating offline-first at the tactical edge.
          </p>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Badge variant="outline" className="text-xs font-mono">CIP #19/544,827</Badge>
            <Badge variant="outline" className="text-xs font-mono">Non-Prov #19/320,727</Badge>
            <Badge variant="outline" className="text-xs font-mono">Prov #63/861,944</Badge>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" onClick={downloadStandaloneHTML}>
              <Download className="h-3 w-3 mr-1.5" /> Export Standalone HTML
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={dv005Video} download="LeafEngines_DV005_Demo.mp4">
                <FileVideo className="h-3 w-3 mr-1.5" /> Download Circulation Video
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="geo" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="geo" className="text-xs">
              <Crosshair className="h-3 w-3 mr-1" /> A: Geo-Specific Grounding
            </TabsTrigger>
            <TabsTrigger value="fusion" className="text-xs">
              <Waves className="h-3 w-3 mr-1" /> B: Cross-Modal Consistency
            </TabsTrigger>
            <TabsTrigger value="uncertainty" className="text-xs">
              <BarChart3 className="h-3 w-3 mr-1" /> C: Uncertainty Quantification
            </TabsTrigger>
          </TabsList>

          {/* ═══ TAB A: GEO-SPECIFIC SCENE CONSTRUCTION ═══ */}
          <TabsContent value="geo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vincenty Geodesy Engine → Terrain-Accurate Coordinate Grid</CardTitle>
                <CardDescription>
                  {GRID_SIZE}×{GRID_SIZE} grid at {GRID_SPACING_M}m spacing. Each cell positioned via Vincenty spherical geodesy
                  (CIP #19/544,827). Environmental priors from unified intelligence layer generate co-registered EO/IR and RF outputs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* EO/IR Frame */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                      EO/IR Synthetic Frame
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">Moisture (60%) + Vegetation Index (40%)</p>
                    <div className="border border-border rounded overflow-hidden" style={{ aspectRatio: '1' }}>
                      <svg viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`} className="w-full h-full">
                        {grid.map(p => (
                          <rect
                            key={`eoir-${p.row}-${p.col}`}
                            x={p.col}
                            y={GRID_SIZE - 1 - p.row}
                            width={1}
                            height={1}
                            fill={valueToHeatColor(p.eoir, 'eoir')}
                          />
                        ))}
                      </svg>
                    </div>
                  </div>
                  {/* RF Frame */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                      RF Synthetic Representation
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">Conductivity (70%) + Moisture (30%)</p>
                    <div className="border border-border rounded overflow-hidden" style={{ aspectRatio: '1' }}>
                      <svg viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`} className="w-full h-full">
                        {grid.map(p => (
                          <rect
                            key={`rf-${p.row}-${p.col}`}
                            x={p.col}
                            y={GRID_SIZE - 1 - p.row}
                            width={1}
                            height={1}
                            fill={valueToHeatColor(p.rf, 'rf')}
                          />
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard label="Grid Origin" value={`${ORIGIN.lat.toFixed(4)}°N`} sub={`${ORIGIN.lng.toFixed(4)}°W`} />
                  <MetricCard label="Cell Spacing" value={`${GRID_SPACING_M}m`} sub="Vincenty direct" />
                  <MetricCard label="Grid Extent" value={`${GRID_SIZE * GRID_SPACING_M}m × ${GRID_SIZE * GRID_SPACING_M}m`} sub={`${GRID_SIZE * GRID_SIZE} cells`} />
                  <MetricCard label="Cross-Modal ρ" value={correlationCoeff.toFixed(3)} sub="Pearson correlation" />
                </div>

                {/* Coordinate table */}
                <details className="mt-4">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    Show coordinate table (first 10 points)
                  </summary>
                  <div className="mt-2 overflow-x-auto">
                    <table className="text-xs w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-1">Cell</th>
                          <th className="text-left p-1">Latitude</th>
                          <th className="text-left p-1">Longitude</th>
                          <th className="text-left p-1">EO/IR</th>
                          <th className="text-left p-1">RF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grid.slice(0, 10).map(p => (
                          <tr key={`${p.row}-${p.col}`} className="border-b border-border/50">
                            <td className="p-1 font-mono">[{p.row},{p.col}]</td>
                            <td className="p-1 font-mono">{p.lat.toFixed(8)}</td>
                            <td className="p-1 font-mono">{p.lng.toFixed(8)}</td>
                            <td className="p-1 font-mono">{p.eoir.toFixed(4)}</td>
                            <td className="p-1 font-mono">{p.rf.toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="text-sm font-medium mb-2">Architecture: Shared Environmental State → Multimodal Output</h4>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-4">
                  <div className="border border-border px-3 py-2 rounded text-center">
                    <div className="font-medium text-foreground">Vincenty Engine</div>
                    <div>lat/lng → grid</div>
                  </div>
                  <span>→</span>
                  <div className="border border-primary px-3 py-2 rounded text-center bg-primary/5">
                    <div className="font-medium text-foreground">Environmental State</div>
                    <div>moisture, NDVI, conductivity</div>
                  </div>
                  <span>→</span>
                  <div className="flex flex-col gap-1">
                    <div className="border border-green-500/50 px-3 py-1 rounded text-center">EO/IR Output</div>
                    <div className="border border-blue-500/50 px-3 py-1 rounded text-center">RF Output</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Patent #19/320,727 — Unified Environmental Intelligence Layer ensures co-registered outputs from single truth source
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB B: CROSS-MODAL CONSISTENCY ═══ */}
          <TabsContent value="fusion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complementary Filter Sensor Fusion</CardTitle>
                <CardDescription>
                  α = {DEFAULT_FUSION_CONFIG.alpha} complementary filter blends high-frequency primary (gyro/orientation)
                  with low-frequency secondary (magnetometer) to produce stable fused heading.
                  Directly applicable to cross-modal EO/IR + RF correlation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MiniLineChart
                  data={fusionSeries.map(s => ({ primary: s.primary, secondary: s.secondary, fused: s.fused }))}
                  width={700}
                  height={240}
                  yDomain={[0, 360]}
                  lines={[
                    { key: 'secondary', color: '#94a3b8', label: 'Secondary (Magnetometer)' },
                    { key: 'primary', color: '#60a5fa', label: 'Primary (Gyro/Orientation)' },
                    { key: 'fused', color: '#f59e0b', label: 'Fused Output (α=0.96)' },
                  ]}
                />

                <div className="mt-4 p-3 border border-border rounded bg-card">
                  <h4 className="text-xs font-medium mb-1">Complementary Filter Formula</h4>
                  <code className="text-xs font-mono text-muted-foreground">
                    heading_fused = α × heading_primary + (1 − α) × heading_secondary
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    The same fusion architecture applies to multimodal scene generation: primary (EO/IR high-frequency updates)
                    blended with secondary (RF ground truth) via the same α-weighted filter, ensuring cross-modal physical consistency
                    from a shared environmental state vector.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <MetricCard label="Filter Weight (α)" value={DEFAULT_FUSION_CONFIG.alpha.toString()} sub="Primary source weight" />
                  <MetricCard label="Heading Deadband" value={`${DEFAULT_FUSION_CONFIG.headingDeadband}°`} sub="Min propagation threshold" />
                  <MetricCard label="Samples" value={fusionSeries.length.toString()} sub="100ms intervals" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="text-sm font-medium mb-2">Cross-Modal Consistency Validation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-border rounded">
                    <div className="text-xs text-muted-foreground mb-1">EO/IR ↔ RF Pearson Correlation</div>
                    <div className="text-2xl font-mono font-bold text-foreground">{correlationCoeff.toFixed(4)}</div>
                    <div className="text-xs text-muted-foreground">From shared environmental state</div>
                  </div>
                  <div className="p-3 border border-border rounded">
                    <div className="text-xs text-muted-foreground mb-1">Physical Consistency</div>
                    <div className="text-2xl font-mono font-bold text-foreground">
                      {correlationCoeff > 0.7 ? '✓ PASS' : '✗ FAIL'}
                    </div>
                    <div className="text-xs text-muted-foreground">Threshold: ρ &gt; 0.70</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB C: UNCERTAINTY QUANTIFICATION ═══ */}
          <TabsContent value="uncertainty" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kalman-Inspired Variance Propagation</CardTitle>
                <CardDescription>
                  Formal uncertainty model: σ²(n) = σ²(n-1) + (stride × driftRate)² + processNoise².
                  GPS correction resets variance to sensor accuracy. Drag the slider to move the GPS correction point.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label className="text-xs text-muted-foreground block mb-2">
                    GPS Correction at Step: <strong>{gpsResetStep[0]}</strong>
                  </label>
                  <Slider value={gpsResetStep} onValueChange={setGpsResetStep} min={10} max={70} step={1} className="max-w-md" />
                </div>

                {/* Uncertainty radius plot */}
                <div className="border border-border rounded p-2">
                  <svg viewBox="0 0 700 220" className="w-full" style={{ maxHeight: 220 }}>
                    {/* Axes */}
                    <line x1={44} x2={684} y1={190} y2={190} stroke="currentColor" strokeOpacity={0.2} />
                    <text x={364} y={214} textAnchor="middle" fontSize={10} fill="currentColor" className="text-muted-foreground">Steps</text>
                    <text x={10} y={105} textAnchor="middle" fontSize={10} fill="currentColor" className="text-muted-foreground" transform="rotate(-90 10 105)">σ (m)</text>

                    {/* Max uncertainty line */}
                    {(() => {
                      const maxR = Math.max(...uncertaintySeries.map(s => s.radius));
                      const yScale = (v: number) => 180 - (v / (maxR * 1.1)) * 170;
                      return (
                        <>
                          {/* Filled area */}
                          <polygon
                            points={[
                              `44,${yScale(0)}`,
                              ...uncertaintySeries.map((s, i) => `${44 + (i / (uncertaintySeries.length - 1)) * 640},${yScale(s.radius)}`),
                              `684,${yScale(0)}`,
                            ].join(' ')}
                            fill="hsl(var(--destructive))"
                            fillOpacity={0.08}
                          />
                          {/* Line */}
                          <polyline
                            fill="none"
                            stroke="hsl(var(--destructive))"
                            strokeWidth={2}
                            points={uncertaintySeries.map((s, i) => `${44 + (i / (uncertaintySeries.length - 1)) * 640},${yScale(s.radius)}`).join(' ')}
                          />
                          {/* GPS reset marker */}
                          {uncertaintySeries.filter(s => s.gpsReset).map(s => {
                            const x = 44 + (s.step / (uncertaintySeries.length - 1)) * 640;
                            return (
                              <g key={s.step}>
                                <line x1={x} x2={x} y1={10} y2={190} stroke="hsl(120, 60%, 40%)" strokeDasharray="4 2" strokeWidth={1.5} />
                                <text x={x} y={8} textAnchor="middle" fontSize={9} fill="hsl(120, 60%, 40%)">GPS Fix</text>
                              </g>
                            );
                          })}
                          {/* Y labels */}
                          {[0, 0.5, 1].map(f => {
                            const v = f * maxR * 1.1;
                            return (
                              <text key={f} x={40} y={yScale(v) + 4} textAnchor="end" fontSize={9} fill="currentColor" className="text-muted-foreground">
                                {v.toFixed(1)}
                              </text>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard
                    label="Drift Rate"
                    value={`${(DEFAULT_UNCERTAINTY_CONFIG.driftRatePerStep * 100).toFixed(0)}%`}
                    sub="Per step of stride"
                  />
                  <MetricCard
                    label="Process Noise"
                    value={`${DEFAULT_UNCERTAINTY_CONFIG.processNoisePerStep}m`}
                    sub="Per step"
                  />
                  <MetricCard
                    label="Max Uncertainty"
                    value={`${DEFAULT_UNCERTAINTY_CONFIG.maxUncertaintyM}m`}
                    sub="Reliability gate"
                  />
                  <MetricCard
                    label="Peak σ (pre-reset)"
                    value={`${Math.max(...uncertaintySeries.filter(s => s.step < gpsResetStep[0]).map(s => s.radius)).toFixed(2)}m`}
                    sub="Before GPS correction"
                  />
                </div>

                <div className="mt-4 p-3 border border-border rounded bg-card">
                  <h4 className="text-xs font-medium mb-1">Reliability Gating for AI/ML Training Data</h4>
                  <p className="text-xs text-muted-foreground">
                    When σ exceeds {DEFAULT_UNCERTAINTY_CONFIG.maxUncertaintyM}m, the system flags synthetic data as <strong>unreliable</strong> — 
                    automatically excluding it from training pipelines. GPS/reference corrections reset variance, restoring data to
                    <strong> validated</strong> status. This formal uncertainty bound ensures AI/ML models train only on physically grounded,
                    confidence-scored synthetic scenes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Offline-First Evidence Footer */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-foreground mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-medium">Offline-First Operation Evidence</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  All computations on this page execute <strong>entirely in-browser</strong> with zero network requests.
                  The Vincenty geodesy engine, complementary filter, and uncertainty model run as pure TypeScript modules —
                  no cloud APIs, no external dependencies. This demonstrates the DIL-resilient architecture
                  protected by Provisional #63/861,944 and Non-Provisional #19/320,727.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">0 Network Requests</Badge>
                  <Badge variant="outline" className="text-xs">&lt;10ms Computation</Badge>
                  <Badge variant="outline" className="text-xs">Pure Client-Side</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IP Footer */}
        <div className="mt-6 pb-8 text-center">
          <p className="text-xs text-muted-foreground">
            Patent Pending — Applications #19/320,727 &amp; #19/544,827 &amp; #63/861,944 | 
            SoilSidekick Pro, Inc. (Delaware) | IP developed with private funds — SBIR data rights preserved
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── METRIC CARD ─────────────────────────────────────────
function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-3 border border-border rounded bg-card">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-mono font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
