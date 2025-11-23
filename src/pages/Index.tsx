
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
  AlertCircle
} from 'lucide-react';
import LeadCapture from '@/components/LeadCapture';
import Footer from '@/components/Footer';
import { OptimizedImage } from '@/components/OptimizedImage';
import heroAerialFarm from '@/assets/hero-aerial-farm.jpg';

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
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16 relative z-10">
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
                
                <div className="text-center pt-6 border-t border-border">
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
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8 text-center slide-in-up">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-2">
              {getGreeting()}, {getUserName()}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Your Agricultural Command Center
            </p>
            <Alert className="max-w-2xl mx-auto bg-primary/10 border-primary/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-semibold">Trial Mode Active:</span> Experience all premium features during your trial period.
              </AlertDescription>
            </Alert>
          </div>

          {/* Primary Action Grid */}
          <Card className="card-subtle backdrop-blur-md bg-card/90 border-border shadow-elegant animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl">Quick Access</CardTitle>
              <CardDescription className="text-base">
                Select a tool to get started with your agricultural analysis
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  variant="hero"
                  className="w-full h-28 text-lg font-semibold flex flex-col gap-2"
                >
                  <BarChart3 className="h-8 w-8" />
                  Dashboard
                </Button>

                <Button
                  onClick={() => navigate('/soil-analysis')}
                  variant="premium"
                  size="lg"
                  className="w-full h-28 text-lg font-semibold flex flex-col gap-2"
                >
                  <Droplets className="h-8 w-8" />
                  Soil Analysis
                </Button>

                <Button
                  onClick={() => navigate('/water-quality')}
                  variant="glass"
                  size="lg"
                  className="w-full h-28 text-lg font-semibold flex flex-col gap-2 relative"
                >
                  <Waves className="h-8 w-8" />
                  Water Quality
                  <Badge variant="secondary" className="absolute top-2 right-2">New</Badge>
                </Button>

                <Button
                  onClick={() => navigate('/planting-calendar')}
                  variant="outline"
                  size="lg"
                  className="w-full h-28 text-lg font-semibold flex flex-col gap-2"
                >
                  <Calendar className="h-8 w-8" />
                  Planting Calendar
                </Button>

                <Button
                  onClick={() => navigate('/fertilizer-footprint')}
                  variant="outline"
                  size="lg"
                  className="w-full h-28 text-lg font-semibold flex flex-col gap-2 relative"
                >
                  <Sprout className="h-8 w-8" />
                  Environmental Impact
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs">Patent</Badge>
                </Button>

                <Button
                  onClick={() => navigate('/field-mapping')}
                  variant="outline"
                  size="lg"
                  className="w-full h-28 text-lg font-semibold flex flex-col gap-2"
                >
                  <Map className="h-8 w-8" />
                  Field Mapping
                </Button>

                <Button
                  onClick={() => navigate('/seasonal-planning')}
                  variant="outline"
                  size="lg"
                  className="w-full h-28 text-lg font-semibold flex flex-col gap-2 relative"
                >
                  <Cloud className="h-8 w-8" />
                  Seasonal Planning
                  <Badge variant="secondary" className="absolute top-2 right-2">AI</Badge>
                </Button>

                <Button
                  onClick={() => navigate('/variable-rate-technology')}
                  variant="premium"
                  size="lg"
                  className="w-full h-28 text-lg font-semibold flex flex-col gap-2 relative"
                >
                  <Sparkles className="h-8 w-8" />
                  Variable Rate Tech
                  <Badge className="absolute top-2 right-2 bg-green-500">NEW</Badge>
                </Button>

                <Button
                  onClick={() => navigate('/tour-guide')}
                  variant="secondary"
                  size="lg"
                  className="w-full h-28 text-lg font-semibold flex flex-col gap-2"
                >
                  <Play className="h-8 w-8" />
                  Interactive Tour
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
