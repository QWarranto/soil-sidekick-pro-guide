import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, CheckCircle, Activity, Clock, TrendingDown } from 'lucide-react';

interface SensorQualityRecord {
  id: string;
  sensor_id: string;
  field_id: string | null;
  reading_timestamp: string;
  drift_detected: boolean;
  drift_percentage: number | null;
  staleness_warning: boolean;
  days_since_calibration: number | null;
  confidence_score: number;
  confidence_factors: string[];
  quality_grade: string;
}

const gradeColors: Record<string, string> = {
  A: 'bg-green-500/10 text-green-700 border-green-200',
  B: 'bg-blue-500/10 text-blue-700 border-blue-200',
  C: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  D: 'bg-orange-500/10 text-orange-700 border-orange-200',
  F: 'bg-red-500/10 text-red-700 border-red-200',
};

export function SensorDataQuality() {
  const [records, setRecords] = useState<SensorQualityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestQuality();
  }, []);

  async function fetchLatestQuality() {
    try {
      const { data, error } = await supabase
        .from('sensor_data_quality')
        .select('*')
        .order('reading_timestamp', { ascending: false })
        .limit(20);

      if (!error && data) {
        setRecords(data as unknown as SensorQualityRecord[]);
      }
    } catch (err) {
      console.error('Failed to fetch sensor quality data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Group by sensor_id, show latest per sensor
  const latestBySensor = records.reduce<Record<string, SensorQualityRecord>>((acc, r) => {
    if (!acc[r.sensor_id]) acc[r.sensor_id] = r;
    return acc;
  }, {});

  const sensors = Object.values(latestBySensor);
  const hasIssues = sensors.some(s => s.drift_detected || s.staleness_warning || s.confidence_score < 75);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Sensor Data Quality</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Loading sensor health data...</p></CardContent>
      </Card>
    );
  }

  if (sensors.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Sensor Data Quality</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No sensor data quality records yet. Quality checks run automatically when sensor data is ingested.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Sensor Data Quality
          {hasIssues && <Badge variant="destructive" className="ml-2">Issues Detected</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary alerts */}
        {sensors.some(s => s.staleness_warning) && (
          <Alert variant="destructive">
            <Clock className="h-4 w-4" />
            <AlertTitle>Calibration Overdue</AlertTitle>
            <AlertDescription>
              {sensors.filter(s => s.staleness_warning).length} sensor(s) need recalibration. Uncalibrated sensors can drift ~15% over 6 months, degrading AI recommendation accuracy.
            </AlertDescription>
          </Alert>
        )}

        {sensors.some(s => s.drift_detected) && (
          <Alert>
            <TrendingDown className="h-4 w-4" />
            <AlertTitle>Drift Detected</AlertTitle>
            <AlertDescription>
              {sensors.filter(s => s.drift_detected).length} sensor(s) showing readings that deviate &gt;10% from historical baselines.
            </AlertDescription>
          </Alert>
        )}

        {/* Per-sensor details */}
        <Accordion type="multiple" className="w-full">
          {sensors.map((sensor) => (
            <AccordionItem key={sensor.sensor_id} value={sensor.sensor_id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left w-full pr-4">
                  <Badge className={`${gradeColors[sensor.quality_grade] || ''} border font-mono text-sm`}>
                    {sensor.quality_grade}
                  </Badge>
                  <span className="font-medium">{sensor.sensor_id}</span>
                  <div className="ml-auto flex items-center gap-2">
                    {sensor.drift_detected && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    {sensor.staleness_warning && <Clock className="h-4 w-4 text-red-500" />}
                    {!sensor.drift_detected && !sensor.staleness_warning && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {/* Confidence score */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Confidence Score</span>
                      <span className="font-medium">{sensor.confidence_score}%</span>
                    </div>
                    <Progress value={sensor.confidence_score} className="h-2" />
                  </div>

                  {/* Drift info */}
                  {sensor.drift_detected && sensor.drift_percentage && (
                    <div className="text-sm p-2 rounded bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-200">
                      <strong>Drift:</strong> {sensor.drift_percentage.toFixed(1)}% deviation from historical baseline
                    </div>
                  )}

                  {/* Calibration info */}
                  {sensor.days_since_calibration !== null && (
                    <div className={`text-sm p-2 rounded ${sensor.staleness_warning ? 'bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200' : 'bg-muted text-muted-foreground'}`}>
                      <strong>Last calibration:</strong> {sensor.days_since_calibration} days ago
                      {sensor.staleness_warning && ' — overdue'}
                    </div>
                  )}

                  {/* Confidence factors */}
                  {sensor.confidence_factors && sensor.confidence_factors.length > 0 && (
                    <div className="text-sm space-y-1">
                      <span className="text-muted-foreground font-medium">Factors:</span>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {sensor.confidence_factors.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Last assessed: {new Date(sensor.reading_timestamp).toLocaleString()}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
