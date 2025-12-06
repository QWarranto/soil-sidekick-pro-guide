import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Droplets, 
  Waves, 
  Calendar, 
  Sprout, 
  Map, 
  Cloud, 
  Play,
  Sparkles,
  AlertCircle,
  Code2,
  TrendingUp
} from 'lucide-react';
import LeadCapture from '@/components/LeadCapture';
import Footer from '@/components/Footer';
import { OptimizedImage } from '@/components/OptimizedImage';
import heroAerialFarm from '@/assets/hero-aerial-farm.jpg';
import leafEnginesHeroVideo from '@/assets/leafengines-hero.mp4';
import { LeafEnginesNav } from '@/components/LeafEnginesNav';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get user's first name for personalized greeting
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return 'Farmer';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // SCENARIO A: Public/Guest View (Not Logged In)
  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <LeafEnginesNav />
        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={heroAerialFarm}
            alt="Aerial view of precision agriculture farmland"
            priority
            objectFit="cover"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/98 via-background/95 to-background/98" />
          
          {/* Hero Video */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <video
              src={leafEnginesHeroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-3xl opacity-40"
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="card-subtle backdrop-blur-md bg-card/95 border-border shadow-elegant">
              <CardHeader className="space-y-4 pb-8 text-center">
                <div className="space-y-3">
                  <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    SoilSidekick Pro
                  </CardTitle>
                  <CardDescription className="text-xl text-muted-foreground">
                    Advanced Agricultural Intelligence Platform
                  </CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">
                    Real-time satellite monitoring • Environmental impact analysis • AI-powered insights
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <LeadCapture />
                
                <div className="text-center pt-6 border-t border-border space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">
                      Powered by Patent-Pending Technology
                    </p>
                    <Button
                      onClick={() => navigate('/leafengines-api')}
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      <Code2 className="mr-2 h-5 w-5" />
                      Explore LeafEngines API
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Enterprise-grade agricultural intelligence API
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={() => navigate('/leafengines-impact-simulator')}
                      variant="outline"
                      size="lg"
                      className="w-full group"
                    >
                      <TrendingUp className="mr-2 h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                      View Impact Simulator
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Model ROI and visualize integration impact
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">
                      Already have an account?
                    </p>
                    <Button
                      onClick={() => navigate('/auth')}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Log In to Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // SCENARIO B: Authenticated User View (Logged In)
  return (
    <div className="min-h-screen relative overflow-hidden">
      <LeafEnginesNav />
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src={heroAerialFarm}
          alt="Aerial view of precision agriculture farmland"
          priority
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
        
        {/* Hero Video */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <video
            src={leafEnginesHeroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-3xl opacity-40"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8 relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-5xl mx-auto w-full">
          <Card className="card-subtle backdrop-blur-md bg-card/95 border-border shadow-elegant animate-fade-in">
            {/* Simple Header */}
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                SoilSidekick Pro
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Select a tool to begin your analysis
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* LeafEngines API Highlight Banner */}
              <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 p-6 rounded-lg border-2 border-primary/30 hover-scale">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">LeafEngines API</h3>
                      <Badge className="bg-primary/20 text-primary border-primary/30">Patent-Pending</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enterprise agricultural intelligence API powered by SoilSidekick Pro technology
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/leafengines-api')}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 whitespace-nowrap"
                  >
                    Explore API
                  </Button>
                </div>
              </div>

              {/* Main Action Grid - 4 columns */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Primary: Soil Analysis */}
                <Button
                  onClick={() => navigate('/soil-analysis')}
                  size="lg"
                  className="w-full h-32 text-lg font-semibold bg-primary hover:bg-primary/90 flex flex-col gap-2 hover-scale group"
                >
                  <Droplets className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:text-primary-foreground" />
                  Soil Analysis
                </Button>

                {/* Water Quality */}
                <Button
                  onClick={() => navigate('/water-quality')}
                  variant="outline"
                  size="lg"
                  className="w-full h-32 text-lg font-semibold flex flex-col gap-2 hover-scale border-2 group"
                >
                  <Waves className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                  Water Quality
                </Button>

                {/* Planting Calendar */}
                <Button
                  onClick={() => navigate('/planting-calendar')}
                  variant="outline"
                  size="lg"
                  className="w-full h-32 text-lg font-semibold flex flex-col gap-2 hover-scale border-2 group"
                >
                  <Calendar className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                  Planting Calendar
                </Button>

                {/* Fertilizer Footprint */}
                <Button
                  onClick={() => navigate('/fertilizer-footprint')}
                  variant="outline"
                  size="lg"
                  className="w-full h-32 text-lg font-semibold flex flex-col gap-2 hover-scale border-2 group"
                >
                  <Sprout className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                  Fertilizer Footprint
                </Button>

                {/* ADAPT Integration - Dark */}
                <Button
                  onClick={() => navigate('/adapt-integration')}
                  size="lg"
                  className="w-full h-32 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground flex flex-col gap-2 hover-scale group"
                >
                  <Sparkles className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:text-accent" />
                  ADAPT Integration
                </Button>

                {/* Variable Rate Tech - NEW Badge */}
                <Button
                  onClick={() => navigate('/variable-rate-technology')}
                  variant="outline"
                  size="lg"
                  className="w-full h-32 text-lg font-semibold flex flex-col gap-2 hover-scale border-2 relative group"
                >
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">NEW</Badge>
                  <Sparkles className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                  Variable Rate Tech
                </Button>

                {/* Property Report - BETA Badge */}
                <Button
                  onClick={() => navigate('/property-report')}
                  variant="outline"
                  size="lg"
                  className="w-full h-32 text-lg font-semibold flex flex-col gap-2 hover-scale border-2 relative group"
                >
                  <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black">BETA</Badge>
                  <Map className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                  Property Report
                </Button>

                {/* Impact Simulator */}
                <Button
                  onClick={() => navigate('/leafengines-impact-simulator')}
                  variant="outline"
                  size="lg"
                  className="w-full h-32 text-lg font-semibold flex flex-col gap-2 hover-scale border-2 group"
                >
                  <TrendingUp className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                  Impact Simulator
                </Button>

                {/* Dashboard */}
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  size="lg"
                  className="w-full h-32 text-lg font-semibold flex flex-col gap-2 hover-scale border-2 group"
                >
                  <BarChart3 className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                  Dashboard
                </Button>
              </div>

              {/* Impact Simulator Description */}
              <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-6 rounded-lg border border-accent/20">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Impact Simulator
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Model ROI scenarios and visualize the environmental and financial impact of LeafEngines API integration. 
                      Compare baseline metrics against projected improvements across yield optimization, resource efficiency, 
                      and sustainability goals to build your business case.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tour Section */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    New to the platform?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Take our interactive tour to optimize your yield.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/tour-guide')}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 whitespace-nowrap"
                >
                  Start Tour
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
