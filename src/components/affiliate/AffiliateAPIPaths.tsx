import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal, Cpu, Globe } from 'lucide-react';

const paths = [
  {
    icon: Terminal,
    label: 'Path A',
    title: 'Claude Desktop (via Official MCP Registry)',
    description: 'LeafEngines appears in the Claude Desktop server browser natively. Search "LeafEngines" or "agricultural" in the server discovery panel.',
    code: `{
  "mcpServers": {
    "leafengines": {
      "command": "npx",
      "args": ["-y", "@leafengines/mcp-server"],
      "env": {
        "LEAFENGINES_API_KEY": "your-key-here"
      }
    }
  }
}`,
    lang: 'JSON',
  },
  {
    icon: Cpu,
    label: 'Path B',
    title: 'OpenClaw Agent Config',
    description: 'Install the skill and add to your OpenClaw config in seconds.',
    code: `# Step 1: Install the skill
clawhub install leafengines-opportunity-scanner

# Step 2: Add to OpenClaw config
mcpServers:
  leafengines:
    url: https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server
    headers:
      x-api-key: YOUR_API_KEY_HERE`,
    lang: 'YAML',
  },
  {
    icon: Globe,
    label: 'Path C',
    title: 'Direct REST API',
    description: 'Use the LeafEngines API directly from any language or platform. Get your key at /api-docs.',
    code: `curl -X POST \\
  https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/agricultural-intelligence \\
  -H "x-api-key: YOUR_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "soil analysis for corn in Iowa"}'`,
    lang: 'bash',
  },
];

export function AffiliateAPIPaths() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Three Paths to a First API Call</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your referrals choose the path that fits their workflow. All paths use the same API key from <code className="text-xs bg-muted px-1 py-0.5 rounded">/api-docs</code>.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {paths.map((p) => (
          <div key={p.label} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <p.icon className="h-4 w-4 text-primary" />
              <Badge variant="secondary" className="text-xs">{p.label}</Badge>
              <span className="font-semibold text-sm">{p.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{p.description}</p>
            <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto font-mono whitespace-pre">
              {p.code}
            </pre>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
