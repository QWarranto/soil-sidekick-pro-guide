
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, LogOut, LogIn, Sparkles } from 'lucide-react';
import LeadCapture from '@/components/LeadCapture';
import Footer from '@/components/Footer';
import { OptimizedImage } from '@/components/OptimizedImage';
import heroAerialFarm from '@/assets/hero-aerial-farm.jpg';
import heroTechAgriculture from '@/assets/hero-tech-agriculture.jpg';

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    navigate('/soil-analysis');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src={heroAerialFarm}
          alt="Aerial view of precision agriculture farmland with advanced crop management"
          priority
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Tech Agriculture Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 opacity-20 z-0 hidden lg:block">
        <OptimizedImage
          src={heroTechAgriculture}
          alt="Smart farming technology with AI-powered agricultural intelligence"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto slide-in-up">
          <Card className="card-subtle backdrop-blur-md bg-card/90 border-border shadow-elegant">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-foreground">Welcome to SoilSidekick Pro</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Your premium soil analysis platform with ADAPT Standard 1.0 integration for seamless farm management connectivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Lead Capture Section - Show for non-authenticated users */}
                {!user && (
                  <LeadCapture />
                )}
                
                {user ? (
                  <div className="bg-gradient-primary p-6 rounded-lg border border-primary/20 shadow-glow-primary card-elevated">
                    <h3 className="text-lg font-semibold text-white mb-2">🌱 Free Trial Active</h3>
                    <p className="text-white/90">
                      You're on a 10-day free trial with access to premium features. 
                      After your trial, upgrade to maintain unlimited county lookups and export capabilities.
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted p-6 rounded-lg border border-border shadow-md">
                    <h3 className="text-lg font-semibold text-foreground mb-2">🌾 Welcome to SoilSidekick Pro</h3>
                    <p className="text-muted-foreground">
                      Sign in to access premium features including unlimited county lookups, detailed analysis, and export capabilities.
                    </p>
                  </div>
                )}
                
                {/* New User Tour Guide Highlight */}
                {!user && (
                  <div className="bg-gradient-primary p-6 rounded-lg border border-primary/20 shadow-glow-primary card-elevated text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">🎓 New to SoilSidekick Pro?</h3>
                    <p className="text-white/90 mb-4 text-lg">
                      Take our interactive Tour Guide to discover all the powerful features that will transform your agricultural operations.
                    </p>
                    <Button size="xl" variant="hero" onClick={() => navigate('/tour-guide')} className="animate-pulse">
                      Start Interactive Tour
                    </Button>
                  </div>
                )}
                
                <div className="text-center space-y-4">
                  <p className="text-foreground text-lg font-medium">
                    Ready to explore soil data and plan your sustainable growing season?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
                    <Button size="xl" variant="hero" onClick={() => navigate('/dashboard')} className="animate-bounce-in">
                      Dashboard
                    </Button>
                    <Button size="lg" variant="premium" onClick={handleStartAnalysis} className="animate-fade-in">
                      Soil Analysis
                    </Button>
                    <Button size="lg" variant="glass" onClick={() => navigate('/water-quality')} className="animate-fade-in">
                      Water Quality
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/planting-calendar')} className="animate-fade-in hover:shadow-lg">
                      Planting Calendar
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/fertilizer-footprint')} className="animate-fade-in hover:shadow-lg">
                      Fertilizer Footprint
                    </Button>
                    <Button size="lg" variant="secondary" onClick={() => navigate('/adapt-integration')} className="animate-fade-in hover:shadow-lg">
                      ADAPT Integration
                    </Button>
                    <Button size="lg" variant="premium" onClick={() => navigate('/variable-rate-technology')} className="animate-fade-in hover:shadow-lg relative">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Variable Rate Tech (VRT)
                      <Badge className="absolute -top-2 -right-2 bg-green-500">NEW</Badge>
                    </Button>
                    <Button size="lg" variant="glass" onClick={() => navigate('/property-report')} className="animate-fade-in hover:shadow-lg relative border-blue-500/50">
                      🏠 Property Soil Report
                      <Badge className="absolute -top-2 -right-2 bg-blue-500">REAL ESTATE</Badge>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Add Footer */}
      <Footer />
    </div>
  );
};

export default Index;
