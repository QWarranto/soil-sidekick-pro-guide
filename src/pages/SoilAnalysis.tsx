
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Leaf, LogOut } from 'lucide-react';

const SoilAnalysis = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
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
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Soil Analysis Dashboard</CardTitle>
              <CardDescription>
                Analyze soil data for informed agricultural decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-4">Soil Analysis Features Coming Soon!</h3>
                <p className="text-muted-foreground mb-6">
                  We're building comprehensive soil analysis tools including:
                </p>
                <ul className="text-left max-w-md mx-auto space-y-2 text-muted-foreground">
                  <li>• County-based soil data lookup</li>
                  <li>• Nutrient level analysis</li>
                  <li>• pH and composition reports</li>
                  <li>• Agricultural recommendations</li>
                  <li>• Export capabilities</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SoilAnalysis;
