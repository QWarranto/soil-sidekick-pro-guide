
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { OfflineSyncIndicator } from "@/components/OfflineSyncIndicator";
import { NetworkStatusBanner } from "@/components/NetworkStatusBanner";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import B2BLanding from "./pages/B2BLanding";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DeveloperSandbox from "./pages/DeveloperSandbox";
import PrivacyAdvantage from "./pages/PrivacyAdvantage";
import SoilAnalysis from "./pages/SoilAnalysis";
import WaterQuality from "./pages/WaterQuality";
import PlantingCalendar from "./pages/PlantingCalendar";
import FertilizerFootprint from "./pages/FertilizerFootprint";
import Pricing from "./pages/Pricing";
import ApiDocs from "./pages/ApiDocs";
import FAQ from "./pages/FAQ";
import Features from "./pages/Features";
import UserGuide from "./pages/UserGuide";
import AdaptIntegration from "./pages/AdaptIntegration";
import VariableRateTechnology from "./pages/VariableRateTechnology";
import BusinessCase from "./pages/BusinessCase";
import GlobalMarketComparison from "./pages/GlobalMarketComparison";
import RevenueProjections from "./pages/RevenueProjections";
import SeasonalPlanning from "./pages/SeasonalPlanning";
import TourGuide from "./pages/TourGuide";
import Disclaimer from "./pages/Disclaimer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { FieldMapping } from "./pages/FieldMapping";
import TaskManager from "./pages/TaskManager";
import DeploymentGuide from "./pages/DeploymentGuide";
import NotificationsDemo from "./pages/NotificationsDemo";
import PropertyReport from "./pages/PropertyReport";
import NotFound from "./pages/NotFound";
import Install from "./pages/Install";
import { PWAOfflinePage } from "./components/PWAOfflinePage";
import FarmonautComparison from "./pages/FarmonautComparison";
import OneSoilComparison from "./pages/OneSoilComparison";
import HeirloomComparison from "./pages/HeirloomComparison";
import SoilTestProComparison from "./pages/SoilTestProComparison";
import LayoutDemo from "./pages/LayoutDemo";

const queryClient = new QueryClient();

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppHeader />
          <NetworkStatusBanner />
          <OfflineSyncIndicator />
          <PWAInstallBanner />
      <Routes>
        <Route path="/" element={<B2BLanding />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/developer-sandbox" element={<DeveloperSandbox />} />
        <Route path="/privacy-advantage" element={<PrivacyAdvantage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/soil-analysis" element={<SoilAnalysis />} />
            <Route path="/water-quality" element={<WaterQuality />} />
            <Route path="/planting-calendar" element={<PlantingCalendar />} />
            <Route path="/fertilizer-footprint" element={<FertilizerFootprint />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/features" element={<Features />} />
            <Route path="/user-guide" element={<UserGuide />} />
        <Route path="/adapt-integration" element={<AdaptIntegration />} />
        <Route path="/variable-rate-technology" element={<VariableRateTechnology />} />
        <Route path="/business-case" element={<BusinessCase />} />
        <Route path="/global-market-comparison" element={<GlobalMarketComparison />} />
        <Route path="/revenue-projections" element={<RevenueProjections />} />
        <Route path="/seasonal-planning" element={<SeasonalPlanning />} />
        <Route path="/field-mapping" element={<FieldMapping />} />
        <Route path="/task-manager" element={<TaskManager />} />
        <Route path="/tour-guide" element={<TourGuide />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/deployment-guide" element={<DeploymentGuide />} />
        <Route path="/notifications" element={<NotificationsDemo />} />
        <Route path="/property-report" element={<PropertyReport />} />
        <Route path="/install" element={<Install />} />
        <Route path="/offline" element={<PWAOfflinePage />} />
        <Route path="/compare/farmonaut" element={<FarmonautComparison />} />
        <Route path="/compare/onesoil" element={<OneSoilComparison />} />
        <Route path="/compare/heirloom" element={<HeirloomComparison />} />
        <Route path="/compare/soiltest-pro" element={<SoilTestProComparison />} />
        <Route path="/layout-demo" element={<LayoutDemo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
