
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
        <div className="absolute inset-0 bg-gradient-to-b from-background/98 via-background/90 to-background/98" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
        <div className="max-w-4xl mx-auto slide-in-up">
          <Card className="card-subtle backdrop-blur-md bg-card/90 border-border shadow-elegant">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Welcome to SoilSidekick Pro
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-muted-foreground mt-2">
                Your premium soil analysis platform with ADAPT Standard 1.0 integration for seamless farm management connectivity
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-4 sm:space-y-6">
                {/* Lead Capture Section - Show for non-authenticated users */}
                {!user && (
                  <LeadCapture />
                )}
                
                {user ? (
                  <div className="bg-gradient-primary p-4 sm:p-6 rounded-lg border border-primary/20 shadow-glow-primary card-elevated">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">🌱 Free Trial Active</h3>
                    <p className="text-sm sm:text-base text-white/90">
                      You're on a 10-day free trial with access to premium features. 
                      After your trial, upgrade to maintain unlimited county lookups and export capabilities.
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted p-4 sm:p-6 rounded-lg border border-border shadow-md">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">🌾 Welcome to SoilSidekick Pro</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Sign in to access premium features including unlimited county lookups, detailed analysis, and export capabilities.
                    </p>
                  </div>
                )}
                
                {/* New User Tour Guide Highlight */}
                {!user && (
                  <div className="bg-gradient-primary p-4 sm:p-6 rounded-lg border border-primary/20 shadow-glow-primary card-elevated text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">🎓 New to SoilSidekick Pro?</h3>
                    <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-3 sm:mb-4">
                      Take our interactive Tour Guide to discover all the powerful features that will transform your agricultural operations.
                    </p>
                    <Button size="lg" variant="hero" onClick={() => navigate('/tour-guide')} className="animate-pulse w-full sm:w-auto">
                      Start Interactive Tour
                    </Button>
                  </div>
                )}
                
                <div className="text-center space-y-3 sm:space-y-4">
                  <p className="text-foreground text-base sm:text-lg font-medium px-2">
                    Ready to explore soil data and plan your sustainable growing season?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto">
                    <Button size="lg" variant="hero" onClick={() => navigate('/dashboard')} className="animate-bounce-in w-full">
                      Dashboard
                    </Button>
                    <Button size="lg" variant="premium" onClick={handleStartAnalysis} className="animate-fade-in w-full">
                      Soil Analysis
                    </Button>
                    <Button size="lg" variant="glass" onClick={() => navigate('/water-quality')} className="animate-fade-in w-full">
                      Water Quality
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/planting-calendar')} className="animate-fade-in hover:shadow-lg w-full">
                      Planting Calendar
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/fertilizer-footprint')} className="animate-fade-in hover:shadow-lg w-full">
                      Fertilizer Footprint
                    </Button>
                    <Button size="lg" variant="secondary" onClick={() => navigate('/adapt-integration')} className="animate-fade-in hover:shadow-lg w-full">
                      ADAPT Integration
                    </Button>
                    <Button size="lg" variant="premium" onClick={() => navigate('/variable-rate-technology')} className="animate-fade-in hover:shadow-lg relative w-full">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Variable Rate Tech (VRT)
                      <Badge className="absolute -top-2 -right-2 bg-green-500">NEW</Badge>
                    </Button>
                    <Button size="lg" variant="glass" onClick={() => navigate('/property-report')} className="animate-fade-in hover:shadow-lg relative border-blue-500/50 w-full">
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
