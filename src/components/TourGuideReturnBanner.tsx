import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

/**
 * Floating banner that appears on any page reached via the Tour Guide.
 * Uses router location state { fromTour: true } to detect tour navigation.
 */
const TourGuideReturnBanner = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state?.fromTour) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="flex items-center gap-3 rounded-full border border-primary/30 bg-background/95 backdrop-blur-sm shadow-lg px-5 py-3">
        <Map className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-sm font-medium text-foreground">You arrived from the Tour Guide</span>
        <Button
          size="sm"
          variant="default"
          className="rounded-full h-8 px-4 text-xs"
          onClick={() => navigate('/tour-guide')}
        >
          ← Back to Tour
        </Button>
      </div>
    </div>
  );
};

export default TourGuideReturnBanner;
