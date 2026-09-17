import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import APIKeyManager from '@/components/APIKeyManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function APIKeyManagement() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?redirect=/api-keys');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">API Key Management</h1>
          <p className="text-muted-foreground mt-2">
            Generate sandbox keys instantly or request access to paid tiers for production use.
          </p>
        </div>

        <APIKeyManager />

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Tier Comparison</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Sandbox (Free)</span>
              <ul className="text-muted-foreground mt-1 space-y-1">
                <li>• 100 requests/hour</li>
                <li>• Limited endpoints</li>
                <li>• Instant access</li>
              </ul>
            </div>
            <div>
              <span className="font-medium">Starter ($149/mo)</span>
              <ul className="text-muted-foreground mt-1 space-y-1">
                <li>• 10,000 requests/month</li>
                <li>• All endpoints</li>
                <li>• Requires approval</li>
              </ul>
            </div>
            <div>
              <span className="font-medium">Pro/Enterprise</span>
              <ul className="text-muted-foreground mt-1 space-y-1">
                <li>• 50K+ requests/month</li>
                <li>• Priority support</li>
                <li>• Custom SLAs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
