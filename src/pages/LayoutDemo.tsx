import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Layers, Eye, Droplets, Type } from "lucide-react";

const LayoutDemo = () => {
  return (
    <div className="min-h-screen p-8 space-y-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text">Pre-built Component Classes</h1>
          <p className="text-muted-foreground">Interactive showcase of design system utilities</p>
        </div>

        {/* Card Elevated */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Card Elevated</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Hover to see the lift effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  This card has a gradient background, shadow, and smooth hover animation that lifts it up.
                </p>
              </CardContent>
            </Card>
            <div className="card-elevated p-6 space-y-2">
              <h3 className="font-semibold">Also works on divs!</h3>
              <p className="text-sm text-muted-foreground">
                Use <code className="bg-muted px-2 py-1 rounded text-xs">card-elevated</code> on any element for the same effect.
              </p>
            </div>
          </div>
        </section>

        {/* Card Subtle */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Card Subtle</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-subtle">
                <CardHeader>
                  <CardTitle>Subtle {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Gentle hover transform for understated elegance.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Button Effects */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Button Effects</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Outline Glow Variant</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline-glow">Outline Glow</Button>
                <Button variant="outline-glow" size="lg">Large Outline Glow</Button>
                <Button variant="outline-glow" size="sm">Small Outline Glow</Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Manual Glow Class</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="btn-glow">Primary Glow</Button>
                <Button variant="secondary" className="btn-glow">Secondary Glow</Button>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Outline Glow variant includes border, scale animation, and glow effect on hover.
          </p>
        </section>

        {/* Glass Effect */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Glass Effect</h2>
          </div>
          <div 
            className="relative h-96 rounded-lg overflow-hidden"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-white">Frosted Glass Card</CardTitle>
                    <CardDescription className="text-white/80">
                      Backdrop blur with semi-transparent background
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-white/90">
                      Perfect for overlays and floating panels over images or gradients.
                    </p>
                    <Button variant="outline-glow" className="w-full">Outline Glow Button</Button>
                  </CardContent>
                </Card>
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-white">Another Glass Panel</CardTitle>
                    <CardDescription className="text-white/80">
                      Multiple glass elements work together
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-white/90">
                      Layer multiple glass elements for depth and visual interest.
                    </p>
                    <Button variant="outline-glow" className="w-full">Action Button</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Gradient Text */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Type className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Gradient Text</h2>
          </div>
          <div className="space-y-4 text-center">
            <h1 className="text-6xl font-bold gradient-text">
              Bold Statement
            </h1>
            <h2 className="text-4xl font-semibold gradient-text">
              Medium Heading
            </h2>
            <p className="text-2xl gradient-text">
              Applies the primary gradient to text with a stunning fill effect.
            </p>
          </div>
        </section>

        {/* Combined Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Combined Effects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-elevated glass-effect">
              <CardHeader>
                <CardTitle className="gradient-text">Elevated + Glass</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="btn-glow w-full">Action Button</Button>
              </CardContent>
            </Card>
            <Card className="card-subtle">
              <CardHeader>
                <CardTitle className="gradient-text">Subtle + Gradient</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Mix and match classes for unique combinations.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Usage Reference */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Quick Reference</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm font-mono">
                <div className="flex justify-between p-3 bg-muted rounded">
                  <code>.card-elevated</code>
                  <span className="text-muted-foreground">Shadow + hover lift</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <code>.card-subtle</code>
                  <span className="text-muted-foreground">Subtle hover transform</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <code>variant="outline-glow"</code>
                  <span className="text-muted-foreground">Outline + glow + scale</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <code>.btn-glow</code>
                  <span className="text-muted-foreground">Glow + scale on hover</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <code>.glass-effect</code>
                  <span className="text-muted-foreground">Frosted glass backdrop</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <code>.gradient-text</code>
                  <span className="text-muted-foreground">Primary gradient fill</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default LayoutDemo;