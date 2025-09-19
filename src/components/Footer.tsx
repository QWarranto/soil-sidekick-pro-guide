import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SoilSidekick Pro</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Patent-protected agricultural intelligence platform with ADAPT Standard 1.0 integration for seamless farm management connectivity.
            </p>
            <div className="flex gap-3">
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Github className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Main Menu */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Main Menu</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/api-docs" className="text-muted-foreground hover:text-primary transition-colors">API Documentation</Link></li>
              <li><Link to="/adapt-integration" className="text-muted-foreground hover:text-primary transition-colors">ADAPT Integration</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/soil-analysis" className="text-muted-foreground hover:text-primary transition-colors">Soil Analysis</Link></li>
              <li><Link to="/water-quality" className="text-muted-foreground hover:text-primary transition-colors">Water Quality</Link></li>
              <li><Link to="/planting-calendar" className="text-muted-foreground hover:text-primary transition-colors">Planting Calendar</Link></li>
              <li><Link to="/fertilizer-footprint" className="text-muted-foreground hover:text-primary transition-colors">Fertilizer Footprint</Link></li>
              <li><Link to="/seasonal-planning" className="text-muted-foreground hover:text-primary transition-colors">Seasonal Planning</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support & Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/user-guide" className="text-muted-foreground hover:text-primary transition-colors">User Guide</Link></li>
              <li><Link to="/tour-guide" className="text-muted-foreground hover:text-primary transition-colors">Tour Guide</Link></li>
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@soilsidekickpro.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1-800-SOIL-PRO</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-muted-foreground">
              © 2024 SoilSidekick Pro. All rights reserved. 
              Patent Pending/Provisional #63/861,944 & Patent Pending/Non-Provisional #19/320,727
            </div>
            <div className="text-xs text-muted-foreground">
              Built with ❤️ for sustainable agriculture
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;