
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, LogOut, LogIn } from 'lucide-react';
import LeadCapture from '@/components/LeadCapture';

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    navigate('/soil-analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      {/* Header */}
      <header className="border-b glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 floating-animation">
            <Leaf className="h-6 w-6 text-primary pulse-glow" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">SoilSidekick Pro</span>
              <span className="text-xs text-white/80">Patent Pending/Provisional #63/861,944 & Patent Pending/Non-Provisional #19/320,727</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')}>
              Pricing
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/api-docs')}>
              API Docs
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/adapt-integration')}>
              ADAPT Integration
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/faq')}>
              FAQ
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/user-guide')}>
              User Guide
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tour-guide')}>
              Tour Guide
            </Button>
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto slide-in-up">
          <Card className="card-subtle backdrop-blur-sm bg-white/90 dark:bg-card/90">
            <CardHeader>
              <CardTitle className="text-3xl gradient-text">Welcome to SoilSidekick Pro</CardTitle>
              <CardDescription className="text-lg">
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
                      You're on a 7-day free trial with access to premium features. 
                      After your trial, upgrade to maintain unlimited county lookups and export capabilities.
                    </p>
                  </div>
                ) : (
                  <div className="glass-effect p-6 rounded-lg border border-white/20 shadow-xl">
                    <h3 className="text-lg font-semibold text-foreground mb-2">🌾 Welcome to SoilSidekick Pro</h3>
                    <p className="text-muted-foreground">
                      Sign in to access premium features including unlimited county lookups, detailed analysis, and export capabilities.
                    </p>
                  </div>
                )}
                
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
