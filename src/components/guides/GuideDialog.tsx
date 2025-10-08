import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, ExternalLink, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Guide, GuideStep } from '@/config/guides';
import { cn } from '@/lib/utils';

interface GuideDialogProps {
  guide: Guide;
  isOpen: boolean;
  onClose: () => void;
}

export function GuideDialog({ guide, isOpen, onClose }: GuideDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const progress = (completedSteps.size / guide.steps.length) * 100;
  const currentStepData = guide.steps[currentStep];

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < guide.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAction = (step: GuideStep) => {
    if (step.action?.route) {
      navigate(step.action.route);
      onClose();
    } else if (step.action?.external) {
      window.open(step.action.external, '_blank', 'noopener,noreferrer');
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  const handleClose = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    onClose();
  };

  const difficultyColors = {
    beginner: 'bg-success/10 text-success border-success/20',
    intermediate: 'bg-warning/10 text-warning border-warning/20',
    advanced: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{guide.title}</DialogTitle>
              <DialogDescription className="mt-2">{guide.description}</DialogDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className={cn("text-xs", difficultyColors[guide.difficulty])}>
                {guide.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs gap-1">
                <Clock className="h-3 w-3" />
                {guide.estimatedTime}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Step {currentStep + 1} of {guide.steps.length}
            </span>
            <span className="text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation Dots */}
        <div className="flex items-center justify-center gap-2 py-2">
          {guide.steps.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === currentStep ? "w-8 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/50",
                completedSteps.has(index) && index !== currentStep && "bg-success"
              )}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Current Step Content */}
        <div className="flex-1 overflow-y-auto">
          <Card className="p-6 border-2 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                  completedSteps.has(currentStep) 
                    ? "bg-success/10 border-success text-success"
                    : "bg-primary/10 border-primary text-primary"
                )}>
                  {completedSteps.has(currentStep) ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{currentStep + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{currentStepData.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{currentStepData.content}</p>
                </div>
              </div>

              {/* Tips Section */}
              {currentStepData.tips && currentStepData.tips.length > 0 && (
                <Card className="bg-muted/50 border-primary/20">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">Pro Tips</span>
                    </div>
                    <ul className="space-y-2">
                      {currentStepData.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              )}

              {/* Action Button */}
              {currentStepData.action && (
                <Button
                  onClick={() => handleAction(currentStepData)}
                  variant="outline"
                  className="w-full gap-2"
                >
                  {currentStepData.action.label}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Close
            </Button>
            {currentStep < guide.steps.length - 1 ? (
              <Button onClick={handleNext} className="gap-2">
                Next Step
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleClose} className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Complete Guide
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
