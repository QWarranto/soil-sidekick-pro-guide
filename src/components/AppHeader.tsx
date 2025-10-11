import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, LogIn } from 'lucide-react';

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
        
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')}>
            Pricing
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/api-docs')}>
            API Docs
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/faq')}>
            FAQ
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/user-guide')}>
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
