import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function FoundersProgram() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <section className="container max-w-2xl py-24">
        <Card>
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Founders Program — Closed
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              The Founders Program closed on June 1, 2026. Standard pricing is now in effect for all new subscribers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/pricing')}>
                <ArrowRight className="mr-2 h-4 w-4" />
                View Pricing
              </Button>
              <Button variant="outline" onClick={() => navigate('/api-keys')}>
                Manage API Keys
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
