import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Sprout, Code2, GraduationCap } from 'lucide-react';

const useCases = [
  {
    icon: Bot,
    title: 'OpenClaw & AI Agents',
    badge: 'USE CASE 01',
    description: 'Access real-world environmental arbitrage — a completely new category of profit opportunities.',
    detail: 'No other agents have this capability. First-mover advantage is real and time-limited.',
    color: 'text-primary',
  },
  {
    icon: Sprout,
    title: 'Homesteaders & Farmers',
    badge: 'USE CASE 02',
    description: 'Monitor soil, water, and climate data to detect yield deviations early.',
    detail: 'Free tier (100 calls/month) is perfect for personal and homestead-scale use — no credit card needed.',
    color: 'text-green-600',
  },
  {
    icon: Code2,
    title: 'Developers',
    badge: 'USE CASE 03',
    description: 'Open source MCP server for Claude Desktop integration. npm package published — install in 30 seconds.',
    detail: 'Build agricultural intelligence into any application or agent workflow.',
    color: 'text-blue-600',
  },
  {
    icon: GraduationCap,
    title: 'Researchers & Students',
    badge: 'USE CASE 04',
    description: 'Environmental analysis, climate impact assessment, sustainability scoring, and agricultural data for research.',
    detail: '150+ country coverage and 50+ crop types.',
    color: 'text-amber-600',
  },
];

export function AffiliateUseCases() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Who You're Recruiting — 4 Customer Profiles</CardTitle>
        <p className="text-sm text-muted-foreground">
          Environmental data is systematically mispriced in commodity futures, crop insurance, agricultural input purchasing, and carbon credit markets. LeafEngines exposes this gap in real time — with patent-pending scoring algorithms unavailable anywhere else.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {useCases.map((uc) => (
            <div key={uc.badge} className="rounded-lg border p-4 space-y-2 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                <uc.icon className={`h-5 w-5 ${uc.color}`} />
                <Badge variant="outline" className="text-xs">{uc.badge}</Badge>
              </div>
              <h3 className="font-semibold">{uc.title}</h3>
              <p className="text-sm text-muted-foreground">{uc.description}</p>
              <p className="text-xs text-muted-foreground/80 italic">{uc.detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
