
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, LogOut } from 'lucide-react';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleStartAnalysis = () => {
    navigate('/soil-analysis');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">SoilSidekick Pro</span>
              <span className="text-xs text-muted-foreground">Patent Pending, Application Number 63/861,944</span>
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
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
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
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to SoilSidekick Pro</CardTitle>
              <CardDescription>
                Your premium soil analysis platform with ADAPT Standard 1.0 integration for seamless farm management connectivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-primary mb-2">🌱 Free Trial Active</h3>
                  <p className="text-muted-foreground">
                    You're on a 7-day free trial with access to premium features. 
                    After your trial, upgrade to maintain unlimited county lookups and export capabilities.
                  </p>
                </div>
                
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Ready to explore soil data and plan your sustainable growing season?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
                    <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleStartAnalysis}>
                      Soil Analysis
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/water-quality')}>
                      Water Quality
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/planting-calendar')}>
                      Planting Calendar
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/fertilizer-footprint')}>
                      Fertilizer Footprint
                    </Button>
                    <Button size="lg" variant="secondary" onClick={() => navigate('/adapt-integration')}>
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
