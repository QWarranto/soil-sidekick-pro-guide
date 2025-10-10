import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Star, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface FeedbackSurveyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackSurvey = ({ open, onOpenChange }: FeedbackSurveyProps) => {
  const [rating, setRating] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("user_feedback").insert({
        user_id: user?.id || null,
        rating: parseInt(rating),
        feedback_text: feedbackText || null,
        would_recommend: wouldRecommend === "yes" ? true : wouldRecommend === "no" ? false : null,
        survey_type: "satisfaction",
        page_context: window.location.pathname,
      });

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
      });

      // Reset form
      setRating("");
      setFeedbackText("");
      setWouldRecommend("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            We'd Love Your Feedback
          </DialogTitle>
          <DialogDescription>
            Help us improve SoilSidekick Pro by sharing your experience
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              How would you rate your overall experience?
            </Label>
            <RadioGroup value={rating} onValueChange={setRating}>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center gap-1">
                    <RadioGroupItem
                      value={value.toString()}
                      id={`rating-${value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`rating-${value}`}
                      className="flex flex-col items-center gap-1 cursor-pointer peer-data-[state=checked]:text-primary"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-input peer-data-[state=checked]:border-primary flex items-center justify-center font-semibold text-lg hover:border-primary/50 transition-colors">
                        {value}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {value === 1 ? "Poor" : value === 5 ? "Excellent" : ""}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Would Recommend */}
          <div className="space-y-3">
            <Label>Would you recommend SoilSidekick Pro to others?</Label>
            <RadioGroup value={wouldRecommend} onValueChange={setWouldRecommend}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="recommend-yes" />
                  <Label htmlFor="recommend-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="recommend-no" />
                  <Label htmlFor="recommend-no" className="cursor-pointer">No</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Feedback Text */}
          <div className="space-y-3">
            <Label htmlFor="feedback">
              Tell us more about your experience (optional)
            </Label>
            <Textarea
              id="feedback"
              placeholder="What do you like? What could we improve?"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
