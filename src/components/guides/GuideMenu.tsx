import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sprout, 
  Calendar, 
  FlaskConical, 
  Satellite, 
  Droplet, 
  Code, 
  Radio, 
  CalendarRange,
  Clock,
  Search,
  BookOpen,
  Lock
} from 'lucide-react';
import { guides, Guide, GuideCategory } from '@/config/guides';
import { GuideDialog } from './GuideDialog';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  Sprout,
  Calendar,
  FlaskConical,
  Satellite,
  Droplet,
  Code,
  Radio,
  CalendarRange
};

const categoryLabels: Record<GuideCategory, string> = {
  quickstart: 'Quick Start',
  feature: 'Features',
  integration: 'Integrations',
  validation: 'Validation'
};

const difficultyColors = {
  beginner: 'bg-success/10 text-success border-success/20',
  intermediate: 'bg-warning/10 text-warning border-warning/20',
  advanced: 'bg-destructive/10 text-destructive border-destructive/20'
};

interface GuideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideMenu({ isOpen, onClose }: GuideMenuProps) {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { subscription } = useSubscription();

  const handleGuideSelect = (guide: Guide) => {
    setSelectedGuide(guide);
  };

  const handleGuideClose = () => {
    setSelectedGuide(null);
  };

  const isGuideLocked = (guide: Guide): boolean => {
    if (!guide.requiredTier) return false;
    if (!subscription?.tier) return true;
    return !guide.requiredTier.includes(subscription.tier);
  };

  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const guidesByCategory = Object.entries(
    filteredGuides.reduce((acc, guide) => {
      if (!acc[guide.category]) acc[guide.category] = [];
      acc[guide.category].push(guide);
      return acc;
    }, {} as Record<GuideCategory, Guide[]>)
  );

  return (
    <>
      <Dialog open={isOpen && !selectedGuide} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <DialogTitle className="text-2xl">Interactive Guides</DialogTitle>
            </div>
            <DialogDescription>
              Step-by-step tutorials to help you master SoilSidekick Pro
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Guides by Category */}
          <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              <TabsTrigger value="feature">Features</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 mt-4 overflow-hidden">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {guidesByCategory.map(([category, categoryGuides]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                        {categoryLabels[category as GuideCategory]}
                      </h3>
                      <div className="grid gap-3">
                        {categoryGuides.map(guide => (
                          <GuideCard
                            key={guide.id}
                            guide={guide}
                            isLocked={isGuideLocked(guide)}
                            onClick={() => handleGuideSelect(guide)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {(['quickstart', 'feature', 'integration', 'validation'] as GuideCategory[]).map(category => (
              <TabsContent key={category} value={category} className="flex-1 mt-4 overflow-hidden">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="grid gap-3">
                    {filteredGuides
                      .filter(guide => guide.category === category)
                      .map(guide => (
                        <GuideCard
                          key={guide.id}
                          guide={guide}
                          isLocked={isGuideLocked(guide)}
                          onClick={() => handleGuideSelect(guide)}
                        />
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>

      {selectedGuide && (
        <GuideDialog
          guide={selectedGuide}
          isOpen={true}
          onClose={handleGuideClose}
        />
      )}
    </>
  );
}

interface GuideCardProps {
  guide: Guide;
  isLocked: boolean;
  onClick: () => void;
}

function GuideCard({ guide, isLocked, onClick }: GuideCardProps) {
  const Icon = iconMap[guide.icon] || BookOpen;

  return (
    <Card
      className={cn(
        "p-4 transition-all hover:shadow-md cursor-pointer group",
        isLocked && "opacity-60"
      )}
      onClick={() => !isLocked && onClick()}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {isLocked ? <Lock className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold group-hover:text-primary transition-colors">
              {guide.title}
            </h4>
            <div className="flex gap-1 shrink-0">
              <Badge variant="outline" className={cn("text-xs", difficultyColors[guide.difficulty])}>
                {guide.difficulty}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {guide.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {guide.estimatedTime}
            </span>
            <span>{guide.steps.length} steps</span>
            {isLocked && (
              <Badge variant="outline" className="text-xs gap-1">
                <Lock className="h-3 w-3" />
                {guide.requiredTier?.join(', ')} required
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
