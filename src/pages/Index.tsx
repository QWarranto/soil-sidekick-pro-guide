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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <video
              src={leafEnginesHeroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-2xl rounded-2xl shadow-2xl opacity-80"
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <video
            src={leafEnginesHeroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-2xl rounded-2xl shadow-2xl opacity-80"
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
