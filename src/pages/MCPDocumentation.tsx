import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ExternalLink, Terminal, Shield, Zap, Globe, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

const MCPDocumentation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const tools = [
    { name: 'county_lookup', required: 'term', auth: false, desc: 'Resolve place names to FIPS codes' },
    { name: 'get_soil_data', required: 'county_fips', auth: true, desc: 'USDA soil composition by county' },
    { name: 'agricultural_intelligence', required: 'county_fips', auth: true, desc: 'AI crop recommendations & yield predictions' },
    { name: 'territorial_water_quality', required: 'county_fips', auth: true, desc: 'EPA water quality & contamination risk' },
    { name: 'safe_identification', required: 'plant_name', auth: true, desc: 'Plant ID with toxic lookalike warnings' },
    { name: 'carbon_credit_calculator', required: 'field_size_acres', auth: true, desc: 'Carbon credit potential estimation' },
    { name: 'generate_vrt_prescription', required: 'county_fips, application_type', auth: true, desc: 'Variable rate prescription maps' },
    { name: 'environmental_impact_analysis', required: 'county_fips, lat, lng, soil_data', auth: true, desc: 'Patent-pending multi-source environmental assessment' },
    { name: 'planting_optimization', required: 'county_fips, crop_type', auth: true, desc: 'Multi-parameter planting calendar' },
    { name: 'turbo_quant_capabilities', required: '(none)', auth: false, desc: 'Query TurboQuant runtime & hardware profiles' },
  ];

  const models = [
    { model: 'gemma-2b-it-onnx', ram: '1 GB', kv: '0.5 GB', tier: 'Starter', tokens: '24K', runtimes: 'webgpu, wasm' },
    { model: 'gemma-7b-it', ram: '4 GB', kv: '1.3 GB', tier: 'Professional', tokens: '24K', runtimes: 'webgpu, wasm' },
    { model: 'phi-4-mini', ram: '4 GB', kv: '1.0 GB', tier: 'Professional', tokens: '16K', runtimes: 'webgpu, wasm' },
    { model: 'bitnet-70b', ram: '8 GB', kv: '2.0 GB', tier: 'Enterprise', tokens: '48K', runtimes: 'native-cpp' },
    { model: 'bitnet-100b', ram: '12 GB', kv: '4.0 GB', tier: 'Enterprise', tokens: '48K', runtimes: 'native-cpp' },
  ];

  const MCP_URL = 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/api-docs')} className="mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> API Docs
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">LeafEngines™ MCP Server</h1>
            <Badge variant="secondary">v1.1.0</Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Model Context Protocol server for AI agents — soil analysis, crop planning, water quality, carbon credits, and environmental intelligence for every US county.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge>MCP Streamable HTTP</Badge>
            <Badge>JSON-RPC 2.0</Badge>
            <Badge variant="outline">10 Tools</Badge>
            <Badge variant="outline">TurboQuant</Badge>
            <Badge variant="outline">Apache 2.0</Badge>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="mb-8 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Terminal className="h-5 w-5" /> Quick Start</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Endpoint</p>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-3 py-2 rounded text-sm font-mono flex-1 overflow-x-auto">{MCP_URL}</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(MCP_URL)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Test with curl</p>
              <pre className="bg-muted rounded-md p-3 text-xs font-mono overflow-x-auto whitespace-pre">{`curl -X POST "${MCP_URL}" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize"}'`}</pre>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="turboquant">TurboQuant</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          {/* Tools Tab */}
          <TabsContent value="tools">
            <Card>
              <CardHeader>
                <CardTitle>Available Tools (10)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tool</TableHead>
                        <TableHead>Required Params</TableHead>
                        <TableHead>API Key</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tools.map((t) => (
                        <TableRow key={t.name}>
                          <TableCell className="font-mono text-sm font-medium">{t.name}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{t.required}</TableCell>
                          <TableCell>
                            {t.auth ? (
                              <Badge variant="default" className="text-xs">Required</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">No</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">{t.desc}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold">TurboQuant Parameters (optional on AI tools)</h3>
                  <p className="text-sm text-muted-foreground">
                    Tools marked with TQ support accept these optional parameters:
                  </p>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parameter</TableHead>
                          <TableHead>Values</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-mono text-sm">context_mode</TableCell>
                          <TableCell className="font-mono text-xs">standard | extended | maximum</TableCell>
                          <TableCell className="text-sm">Context window size (~4K / ~16K / ~24K tokens)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-mono text-sm">kv_cache_hint</TableCell>
                          <TableCell className="font-mono text-xs">none | reuse | persist</TableCell>
                          <TableCell className="text-sm">KV cache strategy for follow-up queries</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-mono text-sm">preferred_model_tier</TableCell>
                          <TableCell className="font-mono text-xs">starter | professional | enterprise</TableCell>
                          <TableCell className="text-sm">Preferred offline model tier</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auth Tab */}
          <TabsContent value="auth">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  The MCP server uses <code className="bg-muted px-1.5 py-0.5 rounded text-xs">x-api-key</code> header authentication (not Supabase JWT).
                </p>
                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="font-semibold text-sm">No API Key Required</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li><code className="text-xs bg-muted px-1 rounded">initialize</code></li>
                    <li><code className="text-xs bg-muted px-1 rounded">tools/list</code></li>
                    <li><code className="text-xs bg-muted px-1 rounded">turbo_quant_capabilities</code> tool</li>
                  </ul>
                </div>
                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="font-semibold text-sm">API Key Required</h4>
                  <p className="text-sm text-muted-foreground">
                    All other <code className="text-xs bg-muted px-1 rounded">tools/call</code> invocations require a valid key.
                    Obtain one at{' '}
                    <button onClick={() => navigate('/api-keys')} className="text-primary underline">
                      API Key Management
                    </button>.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold text-sm mb-2">Required HTTP Headers</h4>
                  <pre className="bg-muted rounded p-2 text-xs font-mono">{`Content-Type: application/json
Accept: application/json
x-api-key: your-api-key-here`}</pre>
                  <p className="text-xs text-muted-foreground mt-2">
                    Missing <code className="bg-muted px-1 rounded">Accept</code> header → HTTP 406. Missing <code className="bg-muted px-1 rounded">x-api-key</code> on protected tools → JSON-RPC error -32000.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TurboQuant Tab */}
          <TabsContent value="turboquant">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5" /> TurboQuant — 3-bit KV Cache Quantization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  TurboQuant provides 3-bit KV cache quantization for on-device inference, reducing memory requirements by ~5.3× while maintaining reasoning quality.
                </p>

                <div>
                  <h3 className="font-semibold mb-3">Supported Models</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Model</TableHead>
                          <TableHead>Min RAM</TableHead>
                          <TableHead>KV Cache (3-bit)</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead>Max Tokens</TableHead>
                          <TableHead>Runtimes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {models.map((m) => (
                          <TableRow key={m.model}>
                            <TableCell className="font-mono text-sm">{m.model}</TableCell>
                            <TableCell>{m.ram}</TableCell>
                            <TableCell>{m.kv}</TableCell>
                            <TableCell><Badge variant="outline">{m.tier}</Badge></TableCell>
                            <TableCell>{m.tokens}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{m.runtimes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold text-sm mb-2">Context Modes</h4>
                    <ul className="text-sm space-y-2">
                      <li><Badge variant="outline" className="mr-2">standard</Badge> ~4K tokens (~5 messages)</li>
                      <li><Badge variant="outline" className="mr-2">extended</Badge> ~16K tokens (~20 messages)</li>
                      <li><Badge variant="outline" className="mr-2">maximum</Badge> ~24K tokens (~30 messages)</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold text-sm mb-2">Performance Benefits</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <strong>6×</strong> memory reduction</li>
                      <li>• Up to <strong>8×</strong> inference speedup</li>
                      <li>• Gemma 7B on <strong>4GB+ devices</strong></li>
                      <li>• Cloud-equivalent offline reasoning</li>
                    </ul>
                  </div>
                </div>

                <Button variant="outline" onClick={() => navigate('/turbo-quant-capabilities')}>
                  <Zap className="h-4 w-4 mr-2" /> Open TurboQuant Capabilities Tester
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Integration Paths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="font-semibold">Path A — Claude Desktop</h4>
                  <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto">{`{
  "mcpServers": {
    "leafengines": {
      "command": "npx",
      "args": ["-y", "@leafengines/mcp-server"],
      "env": {
        "LEAFENGINES_API_KEY": "your-key-here"
      }
    }
  }
}`}</pre>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="font-semibold">Path B — OpenClaw / Generic Agent</h4>
                  <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto">{`mcpServers:
  leafengines:
    url: ${MCP_URL}
    headers:
      x-api-key: YOUR_API_KEY_HERE`}</pre>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="font-semibold">Path C — Direct HTTP</h4>
                  <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto">{`curl -X POST "${MCP_URL}" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "county_lookup",
      "arguments": { "term": "Fulton" }
    }
  }'`}</pre>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://github.com/QWarranto/leafengines-claude-mcp" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" /> GitHub Repository
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/swagger-ui')}>
                    OpenAPI / Swagger
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/api-keys')}>
                    Get API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <CardTitle>Error Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Meaning</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">-32700</TableCell>
                      <TableCell>JSON-RPC</TableCell>
                      <TableCell>Parse error — invalid JSON body</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">-32601</TableCell>
                      <TableCell>JSON-RPC</TableCell>
                      <TableCell>Method not found</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">-32602</TableCell>
                      <TableCell>JSON-RPC</TableCell>
                      <TableCell>Unknown tool name</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">-32000</TableCell>
                      <TableCell>JSON-RPC</TableCell>
                      <TableCell>Missing x-api-key header</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">HTTP 405</TableCell>
                      <TableCell>HTTP</TableCell>
                      <TableCell>Non-POST request (only POST allowed)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">HTTP 406</TableCell>
                      <TableCell>HTTP</TableCell>
                      <TableCell>Missing Accept: application/json header</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Service Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tier</TableHead>
                      <TableHead>Monthly</TableHead>
                      <TableHead>API Calls</TableHead>
                      <TableHead>Includes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">Developer</TableCell>
                      <TableCell>$149</TableCell>
                      <TableCell>25,000</TableCell>
                      <TableCell>EPA Water Quality</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Professional</TableCell>
                      <TableCell>$499</TableCell>
                      <TableCell>100,000</TableCell>
                      <TableCell>EPA + Satellite</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Enterprise</TableCell>
                      <TableCell>$1,999</TableCell>
                      <TableCell>500,000</TableCell>
                      <TableCell>EPA + Satellite + White-labeling</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Enterprise Platform Bundle</TableCell>
                      <TableCell>$3,499</TableCell>
                      <TableCell>500K + 185K</TableCell>
                      <TableCell>SoilSidekick Pro + LeafEngines-MCP</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Discovery */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Discovery Manifest</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              AI platforms discover LeafEngines via the standard <code className="bg-muted px-1 rounded text-xs">/.well-known/ai-plugin.json</code> manifest:
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-muted px-3 py-2 rounded text-sm font-mono flex-1">
                app.soilsidekickpro.com/.well-known/ai-plugin.json
              </code>
              <Button variant="outline" size="sm" asChild>
                <a href="/.well-known/ai-plugin.json" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default MCPDocumentation;
