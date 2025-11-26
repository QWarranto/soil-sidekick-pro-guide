import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayCircle, Code, Zap, Book, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

export default function DeveloperSandbox() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTestAPI = () => {
    setLoading(true);
    setTimeout(() => {
      setResponse(JSON.stringify({
        compatibility_score: 87,
        risk_level: "low",
        factors: {
          soil_ph: { optimal: true, current: 6.8 },
          water_quality: { optimal: true, contamination_risk: "none" },
          climate: { optimal: true, hardiness_zone: "7b" }
        },
        recommendations: ["Soil conditions are ideal", "Monitor moisture weekly"]
      }, null, 2));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <Badge className="mb-4" variant="secondary">
            <Code className="mr-2 h-3 w-3" />
            Interactive Demo
          </Badge>
          <h1 className="mb-2 text-4xl font-bold text-foreground">LeafEngines™ Developer Sandbox</h1>
          <p className="text-lg text-muted-foreground">
            Test the Environmental Intelligence API in real-time
          </p>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/leafengines-api">
                <Book className="mr-2 h-4 w-4" />
                View API Documentation
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/client-integration-guide">
                <ClipboardList className="mr-2 h-4 w-4" />
                Integration Guide
              </Link>
            </Button>
            <Button asChild>
              <Link to="/impact-simulator">
                <Zap className="mr-2 h-4 w-4" />
                Impact Calculator
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <Tabs defaultValue="environmental" className="space-y-8">
              <TabsList>
                <TabsTrigger value="environmental">Environmental Score</TabsTrigger>
                <TabsTrigger value="satellite">Satellite Data</TabsTrigger>
                <TabsTrigger value="water">Water Quality</TabsTrigger>
              </TabsList>

              <TabsContent value="environmental">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="p-6">
                    <h3 className="mb-4 text-xl font-bold text-foreground">Request</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Plant ID</Label>
                        <Input defaultValue="monstera-deliciosa" />
                      </div>
                      <div>
                        <Label>Latitude</Label>
                        <Input type="number" defaultValue="40.7128" />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        <Input type="number" defaultValue="-74.0060" />
                      </div>
                      <div>
                        <Label>County FIPS</Label>
                        <Input defaultValue="36061" />
                      </div>
                      <Button onClick={handleTestAPI} disabled={loading} className="w-full">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        {loading ? "Testing..." : "Test API"}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="mb-4 text-xl font-bold text-foreground">Response</h3>
                    <Textarea
                      value={response || "Click 'Test API' to see results..."}
                      className="min-h-[400px] font-mono text-sm"
                      readOnly
                    />
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="satellite">
                <Card className="p-6 text-center">
                  <Zap className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-xl font-bold text-foreground">Satellite API Demo</h3>
                  <p className="text-muted-foreground">
                    Contact sales for full API access and testing credentials
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="water">
                <Card className="p-6 text-center">
                  <Zap className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-xl font-bold text-foreground">Water Quality API Demo</h3>
                  <p className="text-muted-foreground">
                    Contact sales for full API access and testing credentials
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
