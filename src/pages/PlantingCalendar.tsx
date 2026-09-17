import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CountyLookup } from '@/components/CountyLookup';
import { Leaf, ArrowLeft, Calendar, Sprout, Thermometer, CloudRain, Loader2, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CROPS = [
  'collards', 'kale', 'cabbage', 'broccoli', 'spinach', 'lettuce',
  'peas', 'onions', 'carrots', 'potatoes', 'garlic',
  'corn', 'soybeans', 'tomatoes', 'peppers', 'squash',
  'cucumbers', 'beans', 'okra', 'sweet_potatoes',
];

interface County {
  id?: string;
  county_name: string;
  state_name?: string;
  state_code: string;
  fips_code: string;
}

interface PlantingResult {
  crop_type: string;
  crop?: string;
  region?: string;
  usda_zone?: string;
  last_spring_frost?: string;
  first_fall_frost?: string;
  spring_window?: { start?: string; end?: string; harvest?: string };
  fall_window?: { start?: string; end?: string; harvest?: string };
  soil_temp_range?: string;
  notes?: string;
  recommendations?: string[];
  [k: string]: any;
}

const normalizePlantingResult = (data: PlantingResult): PlantingResult => {
  const windows = Array.isArray(data.planting_windows) ? data.planting_windows : [];
  const springWindow = windows.find((window: any) => window?.season === 'spring');
  const fallWindow = windows.find((window: any) => window?.season === 'fall');
  const soilTemp = data.soil?.target_soil_temp_f;

  return {
    ...data,
    crop_type: data.crop_type ?? data.crop ?? '',
    region: data.region ?? data.climate?.region,
    usda_zone: data.usda_zone ?? data.climate?.hardiness_zone,
    last_spring_frost: data.last_spring_frost ?? data.climate?.average_last_spring_frost,
    first_fall_frost: data.first_fall_frost ?? data.climate?.average_first_fall_frost,
    spring_window: data.spring_window ?? (springWindow ? {
      start: springWindow.start,
      end: springWindow.end,
      harvest: springWindow.harvest ?? springWindow.harvest_estimate,
    } : undefined),
    fall_window: data.fall_window ?? (fallWindow ? {
      start: fallWindow.start,
      end: fallWindow.end,
      harvest: fallWindow.harvest ?? fallWindow.harvest_estimate,
    } : undefined),
    soil_temp_range: data.soil_temp_range ?? (soilTemp ? `${soilTemp.min}–${soilTemp.max}°F` : undefined),
  };
};

const PlantingCalendar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [county, setCounty] = useState<County | null>(null);
  const [crop, setCrop] = useState<string>('collards');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlantingResult | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const runCalendar = async (c: County, cropType: string) => {
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('get-planting-calendar', {
        body: { county_fips: c.fips_code, crop_type: cropType },
        headers: { 'x-free-tier': 'true' },
      });
      if (error) throw error;
      setResult(normalizePlantingResult(data));
      toast({ title: 'Planting window ready', description: `${c.county_name}, ${c.state_code} · ${cropType}` });
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Could not load calendar', description: e?.message ?? 'Try another county or crop.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCountySelect = (c: County) => {
    setCounty(c);
    runCalendar(c, crop);
  };

  const handleCropChange = (nextCrop: string) => {
    setCrop(nextCrop);
    if (county) runCalendar(county, nextCrop);
  };

  const shareText = () => {
    if (!result || !county) return '';
    const sw = result.spring_window;
    const fw = result.fall_window;
    return `${crop} in ${county.county_name}, ${county.state_code}` +
      (sw?.start ? ` · Spring: ${sw.start}–${sw.end}` : '') +
      (fw?.start ? ` · Fall: ${fw.start}–${fw.end}` : '') +
      ` — via SoilSidekick Pro (free): https://soilsidekickpro.com/planting-calendar`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      <header className="border-b glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">SoilSidekick Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>Home</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')}>Pricing</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto slide-in-up">
          <Button variant="glass" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          <Card className="mb-6 card-elevated animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary pulse-glow" />
                <div>
                  <CardTitle className="text-2xl gradient-text">Planting Calendar</CardTitle>
                  <CardDescription>
                    Free, county-specific planting windows powered by SoilSidekick Pro. No signup required.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="ml-auto">Free tier</Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6 card-elevated">
            <CardHeader>
              <CardTitle>1. Pick a crop</CardTitle>
              <CardDescription>Choose from 20 common crops.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {CROPS.map((c) => (
                  <Button
                    key={c}
                    variant={c === crop ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCropChange(c)}
                    className="capitalize"
                  >
                    {c.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 card-elevated">
            <CardHeader>
              <CardTitle>2. Pick your county</CardTitle>
              <CardDescription>Search by county name, state, or 5-digit FIPS.</CardDescription>
            </CardHeader>
            <CardContent>
              <CountyLookup onCountySelect={handleCountySelect} />
            </CardContent>
          </Card>

          {loading && (
            <Card className="mb-6">
              <CardContent className="py-8 flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading planting window…
              </CardContent>
            </Card>
          )}

          {result && county && !loading && (
            <div ref={resultRef} className="space-y-6 scroll-mt-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-green-600" />
                    <span className="capitalize">{crop.replace('_', ' ')}</span> · {county.county_name}, {county.state_code}
                  </CardTitle>
                  {(result.region || result.usda_zone) && (
                    <CardDescription>
                      {result.region}{result.usda_zone ? ` · USDA zone ${result.usda_zone}` : ''}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.last_spring_frost && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <CloudRain className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-semibold">Last spring frost</p>
                          <p className="text-lg text-blue-600">{result.last_spring_frost}</p>
                        </div>
                      </div>
                    )}
                    {result.first_fall_frost && (
                      <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                        <Thermometer className="h-8 w-8 text-orange-600" />
                        <div>
                          <p className="font-semibold">First fall frost</p>
                          <p className="text-lg text-orange-600">{result.first_fall_frost}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.spring_window?.start && (
                      <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-2"><CardTitle className="text-base">Spring window</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-1">
                          <p><span className="font-medium text-green-600">Plant:</span> {result.spring_window.start} – {result.spring_window.end}</p>
                          {result.spring_window.harvest && (
                            <p><span className="font-medium text-orange-600">Harvest:</span> {result.spring_window.harvest}</p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                    {result.fall_window?.start && (
                      <Card className="border-l-4 border-l-amber-500">
                        <CardHeader className="pb-2"><CardTitle className="text-base">Fall window</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-1">
                          <p><span className="font-medium text-green-600">Plant:</span> {result.fall_window.start} – {result.fall_window.end}</p>
                          {result.fall_window.harvest && (
                            <p><span className="font-medium text-orange-600">Harvest:</span> {result.fall_window.harvest}</p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {result.soil_temp_range && (
                    <p className="text-sm"><span className="font-medium">Soil temp:</span> {result.soil_temp_range}</p>
                  )}
                  {result.notes && (
                    <p className="text-sm text-muted-foreground">{result.notes}</p>
                  )}
                  {result.recommendations?.length ? (
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  ) : null}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(shareText());
                        toast({ title: 'Copied', description: 'Share text copied to clipboard.' });
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Copy share text
                    </Button>
                    <Button variant="default" size="sm" onClick={() => navigate('/pricing')}>
                      Unlock full seasonal plan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-primary">💡 Tips</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Local microclimates can shift windows by 1–2 weeks.</p>
                  <p>• Cool-season crops tolerate light frost; warm-season crops need soil ≥ 60°F.</p>
                  <p>• Succession-plant every 2–3 weeks for continuous harvest.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlantingCalendar;
