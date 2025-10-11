
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { OfflineSyncIndicator } from "@/components/OfflineSyncIndicator";
import { NetworkStatusBanner } from "@/components/NetworkStatusBanner";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
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
import BusinessCase from "./pages/BusinessCase";
import SeasonalPlanning from "./pages/SeasonalPlanning";
import TourGuide from "./pages/TourGuide";
import Disclaimer from "./pages/Disclaimer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { FieldMapping } from "./pages/FieldMapping";
import TaskManager from "./pages/TaskManager";
import DeploymentGuide from "./pages/DeploymentGuide";
import NotificationsDemo from "./pages/NotificationsDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppHeader />
          <NetworkStatusBanner />
          <OfflineSyncIndicator />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
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
        <Route path="/business-case" element={<BusinessCase />} />
        <Route path="/seasonal-planning" element={<SeasonalPlanning />} />
        <Route path="/field-mapping" element={<FieldMapping />} />
        <Route path="/task-manager" element={<TaskManager />} />
        <Route path="/tour-guide" element={<TourGuide />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/deployment-guide" element={<DeploymentGuide />} />
        <Route path="/notifications" element={<NotificationsDemo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
