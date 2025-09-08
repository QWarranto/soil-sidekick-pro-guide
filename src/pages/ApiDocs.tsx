import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Leaf, LogOut, Copy, Code2, Zap, Clock, Shield, Key, Settings, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApiDocs = () => {
  const { user, signOut, subscriptionData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isApiSubscriber = subscriptionData?.subscription_tier === 'enterprise';

  const handleBackHome = () => {
    navigate('/');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet copied successfully",
    });
  };

  const codeExamples = {
    javascript: `// SoilSidekick Pro API - JavaScript/Node.js
const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.soilsidekickpro.com/v1';

async function getSoilData(countyFips) {
  const response = await fetch(\`\${BASE_URL}/soil/\${countyFips}\`, {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
}

// Example usage
getSoilData('48453') // Travis County, TX
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,

    curl: `# SoilSidekick Pro API - cURL
curl -X GET "https://api.soilsidekick.com/v1/soil/48453" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json"

# Get PDF export
curl -X GET "https://api.soilsidekick.com/v1/soil/48453/pdf" \\
  -H "Authorization: Bearer your_api_key_here" \\
  --output soil-report.pdf`,

    python: `# SoilSidekick Pro API - Python
import requests
import json

API_KEY = 'your_api_key_here'
BASE_URL = 'https://api.soilsidekickpro.com/v1'

def get_soil_data(county_fips):
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(f'{BASE_URL}/soil/{county_fips}', headers=headers)
    return response.json()

# Example usage
soil_data = get_soil_data('48453')  # Travis County, TX
print(json.dumps(soil_data, indent=2))`,

    embed: `<!-- SoilSidekick Pro Embed Widget -->
<div id="soilsidekick-widget" data-api-key="your_api_key_here"></div>
<script src="https://cdn.soilsidekickpro.com/widget/v1/embed.js"></script>

<script>
  SoilSidekick.init({
    apiKey: 'your_api_key_here',
    container: '#soilsidekick-widget',
    theme: 'light', // or 'dark'
    showExport: true,
    defaultCounty: '48453' // Optional
  });
</script>`
  };

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      {/* Header */}
      <header className="border-b glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackHome}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">SoilSidekick Pro</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 slide-in-up">
            <h1 className="text-4xl font-bold mb-4 gradient-text animate-fade-in">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Monetizable</span> Soil Data API
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
              Integrate county-level USDA soil intelligence into your agriculture platform. 
              <span className="font-semibold gradient-text"> 15-minute setup</span>, zero GIS skills required.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="card-elevated hover:card-3d animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-lg">15-Minute Integration</CardTitle>
                    <CardDescription>vs. months with enterprise suites</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Plug-and-play REST API with JSON + PDF endpoints. Get started in minutes, not months.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-lg">County-Level Precision</CardTitle>
                    <CardDescription>3,143 granular data points</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time USDA SSURGO data aggregated at county level, not state averages.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Pay-As-You-Go</CardTitle>
                    <CardDescription>&lt;$50/mo starting point</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No enterprise minimums. Scale from hobby to commercial with predictable pricing.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* API Installation Guide - Only for API Subscribers */}
          {isApiSubscriber && (
            <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  API Installation Guide
                  <Badge variant="outline" className="ml-2">Subscriber Access</Badge>
                </CardTitle>
                <CardDescription>
                  Step-by-step guide to set up your API integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-background/50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Key className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Step 1: Get Your API Key</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your unique API key is automatically generated with your subscription.
                    </p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      sk_live_abc123...xyz789
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Check your email for your complete API key, or contact support.
                    </p>
                  </div>

                  <div className="bg-background/50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Step 2: Configure Headers</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Include your API key in the Authorization header for all requests.
                    </p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      Authorization: Bearer sk_live_...
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Always use HTTPS for secure transmission.
                    </p>
                  </div>

                  <div className="bg-background/50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Code2 className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Step 3: Make First Call</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Test your integration with a sample county lookup.
                    </p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      GET /soil/48453
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Travis County, TX - Perfect for testing.
                    </p>
                  </div>
                </div>

                <div className="bg-background/80 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Quick Start Checklist</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded border border-primary bg-primary/10"></span>
                      Save your API key securely (never commit to version control)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded border border-primary bg-primary/10"></span>
                      Set up proper error handling for rate limits and timeouts
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded border border-primary bg-primary/10"></span>
                      Use county FIPS codes for precise data lookup
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded border border-primary bg-primary/10"></span>
                      Cache responses when appropriate to optimize performance
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Our technical support team is ready to help you get started.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Email Support
                    </Button>
                    <Button size="sm" variant="outline">
                      Schedule Call
                    </Button>
                    <Button size="sm" variant="outline">
                      View Samples
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Documentation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-6 w-6" />
                API Documentation
              </CardTitle>
              <CardDescription>
                Complete guide to integrating SoilSidekick Pro into your platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="embed">Embed</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Base URL</h3>
                    <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                      https://api.soilsidekickpro.com/v1
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      All API requests require a Bearer token in the Authorization header.
                    </p>
                    <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                      Authorization: Bearer your_api_key_here
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Available Endpoints</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">GET</Badge>
                          <code className="font-mono">/soil/&#123;county_fips&#125;</code>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Get comprehensive soil analysis data for a specific county by FIPS code.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">GET</Badge>
                          <code className="font-mono">/soil/&#123;county_fips&#125;/pdf</code>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Download a formatted PDF report for the specified county.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">GET</Badge>
                          <code className="font-mono">/counties/search</code>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Search for counties by name or state to get FIPS codes.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">POST</Badge>
                          <code className="font-mono">/alpha-earth-environmental-enhancement</code>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Enhance environmental analysis using AlphaEarth satellite intelligence and Google Earth Engine data.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">GET</Badge>
                          <code className="font-mono">/water-quality/&#123;county_fips&#125;</code>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Get real-time water quality data from EPA monitoring stations for environmental assessment.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="javascript">
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyToClipboard(codeExamples.javascript)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{codeExamples.javascript}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="python">
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyToClipboard(codeExamples.python)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{codeExamples.python}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="curl">
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyToClipboard(codeExamples.curl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{codeExamples.curl}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="embed">
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyToClipboard(codeExamples.embed)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{codeExamples.embed}</code>
                    </pre>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Embed Widget Features</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Responsive design works on any website</li>
                      <li>• Light/dark theme support</li>
                      <li>• Optional PDF export functionality</li>
                      <li>• Customizable styling with CSS</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Response Format */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Response Format</CardTitle>
              <CardDescription>
                Example JSON response structure from the soil data endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`{
  "county_fips": "48453",
  "county_name": "Travis County", 
  "state_code": "TX",
  "state_name": "Texas",
  "soil_analysis": {
    "ph_level": 7.2,
    "organic_matter": 3.1,
    "nitrogen_level": "medium",
    "phosphorus_level": "high",
    "potassium_level": "medium",
    "texture": "clay_loam",
    "drainage": "moderate"
  },
  "recommendations": [
    "Consider lime application for optimal pH",
    "Maintain current organic matter levels", 
    "Monitor nitrogen levels during growing season"
  ],
  "metadata": {
    "data_source": "USDA_SSURGO",
    "last_updated": "2024-01-15T10:30:00Z",
    "confidence_score": 0.94
  }
}`}</code>
              </pre>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Integrate?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get your API key and start building soil intelligence into your platform. 
              Join seed companies and ag-tech platforms already using SoilSidekick Pro.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/pricing')}>
                Get API Access
              </Button>
              <Button variant="outline">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApiDocs;