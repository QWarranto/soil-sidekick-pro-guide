import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, LogIn } from 'lucide-react';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { OptimizedImage } from '@/components/OptimizedImage';

const AppHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-secondary/95 backdrop-blur-md sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <OptimizedImage 
            src="/logo-192.png" 
            alt="SoilSidekick Pro Logo" 
            width={40}
            height={40}
            priority
            objectFit="contain"
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-secondary-foreground">SoilSidekick Pro</span>
            <span className="text-xs text-secondary-foreground/80 hidden sm:block">
              Patent Pending/Provisional #63/861,944 & Patent Pending/Non-Provisional #19/320,727
            </span>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <NetworkStatusIndicator />
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="hidden md:flex text-secondary-foreground hover:text-primary">
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')} className="hidden md:flex text-secondary-foreground hover:text-primary">
            Pricing
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/api-docs')} className="hidden md:flex text-secondary-foreground hover:text-primary">
            API Docs
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/faq')} className="hidden md:flex text-secondary-foreground hover:text-primary">
            FAQ
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/user-guide')} className="hidden md:flex text-secondary-foreground hover:text-primary">
            User Guide
          </Button>
          {user ? (
            <>
              <span className="text-sm text-secondary-foreground/80 ml-2">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut} className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
