import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, LogIn } from 'lucide-react';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';

const AppHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b glass-effect sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer floating-animation"
          onClick={() => navigate('/')}
        >
          <img 
            src="/logo-192.png" 
            alt="SoilSidekick Pro Logo" 
            className="h-10 w-10 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">SoilSidekick Pro</span>
            <span className="text-xs text-white/80 hidden sm:block">
              Patent Pending/Provisional #63/861,944 & Patent Pending/Non-Provisional #19/320,727
            </span>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <NetworkStatusIndicator />
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="hidden md:flex">
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')} className="hidden md:flex">
            Pricing
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/api-docs')} className="hidden md:flex">
            API Docs
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/faq')} className="hidden md:flex">
            FAQ
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/user-guide')} className="hidden md:flex">
            User Guide
          </Button>
          {user ? (
            <>
              <span className="text-sm text-white/80 ml-2">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
