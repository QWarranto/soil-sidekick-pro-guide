import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, User, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LeadCapture = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both name and email are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create mailto link to send lead info to your email
      const subject = `New Lead from SoilSidekick Pro: ${name}`;
      const body = `New lead captured from SoilSidekick Pro website:

Name: ${name}
Email: ${email}
Timestamp: ${new Date().toLocaleString()}

This lead was captured from the homepage and is interested in learning more about SoilSidekick Pro.`;

      const mailtoLink = `mailto:support@soilsidekickpro.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Clear form
      setName('');
      setEmail('');
      
      toast({
        title: "Thank you for your interest!",
        description: "We'll be in touch soon with more information about SoilSidekick Pro.",
      });
      
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly at support@soilsidekickpro.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary">
          Get Early Access to SoilSidekick Pro
        </CardTitle>
        <CardDescription>
          Join thousands of farmers already using our premium soil analysis platform. 
          Get notified about new features and exclusive offers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                Get Started with SoilSidekick Pro
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-4">
          No spam, ever. We respect your privacy and will only send you relevant updates about SoilSidekick Pro.
        </p>
      </CardContent>
    </Card>
  );
};

export default LeadCapture;