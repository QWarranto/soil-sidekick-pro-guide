import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, Home, FileText, Code2, TrendingUp } from "lucide-react";

export const LeafEnginesNav = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      to: "/leafengines-api",
      label: "API Documentation",
      icon: Code2,
      description: "Complete API reference"
    },
    {
      to: "/client-integration-guide",
      label: "Integration Guide",
      icon: FileText,
      description: "Implementation checklist"
    },
    {
      to: "/revenue-projections",
      label: "Revenue Projections",
      icon: TrendingUp,
      description: "Licensing & tiers"
    }
  ];

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="default" 
            size="lg" 
            className="gap-2 bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Menu className="h-5 w-5" />
            LeafEngines Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 bg-background border-2 shadow-xl">
          <DropdownMenuLabel className="font-semibold">LeafEngines™ Navigation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link to="/" className="flex items-start gap-3 cursor-pointer">
              <Home className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <div className="font-medium">SoilSidekick Pro Home</div>
                <div className="text-xs text-muted-foreground">Main product page</div>
              </div>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <DropdownMenuItem key={item.to} asChild>
                <Link 
                  to={item.to} 
                  className={`flex items-start gap-3 cursor-pointer ${isActive ? 'bg-accent' : ''}`}
                >
                  <Icon className={`h-4 w-4 mt-0.5 ${isActive ? 'text-primary' : ''}`} />
                  <div>
                    <div className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
