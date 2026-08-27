import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import LaunchProgressTracker from "@/components/LaunchProgressTracker";
import GISProgressTracker from "@/components/GISProgressTracker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RevenueData {
  homebuyer: number;
  monthlySubscriptions: number;
  annualSubscriptions: number;
  total: number;
}

interface CustomerData {
  homebuyerReports: number;
  monthlySubscribers: number;
  annualSubscribers: number;
}

const AdminLaunch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Revenue data - in production, this would come from Stripe API
  const [revenue, setRevenue] = useState<RevenueData>({
    homebuyer: 0,
    monthlySubscriptions: 0,
    annualSubscriptions: 0,
    total: 0,
  });
  
  const [customers, setCustomers] = useState<CustomerData>({
    homebuyerReports: 0,
    monthlySubscribers: 0,
    annualSubscribers: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!roleLoading) {
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate("/dashboard");
      } else {
        loadRevenueData();
      }
    }
  }, [isAdmin, roleLoading, navigate, toast]);

  const loadRevenueData = async () => {
    setLoading(true);
    try {
      // Fetch revenue data from Stripe via edge function
      const { data, error } = await supabase.functions.invoke('get-launch-metrics');
      
      if (error) {
        console.error("Error fetching launch metrics:", error);
        // Use placeholder data if edge function doesn't exist yet
        setRevenue({
          homebuyer: 0,
          monthlySubscriptions: 0,
          annualSubscriptions: 0,
          total: 0,
        });
        setCustomers({
          homebuyerReports: 0,
          monthlySubscribers: 0,
          annualSubscribers: 0,
        });
      } else if (data) {
        setRevenue(data.revenue);
        setCustomers(data.customers);
      }
    } catch (error: any) {
      console.error("Error loading revenue data:", error);
      toast({
        title: "Note",
        description: "Using placeholder data. Create get-launch-metrics edge function to fetch real Stripe data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRevenueData();
    setRefreshing(false);
    toast({
      title: "Data refreshed",
      description: "Launch metrics have been updated.",
    });
  };

  if (loading || roleLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <AppHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading launch metrics...</div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8" />
              Launch Control Center
            </h1>
            <p className="text-muted-foreground">
              Track revenue progress toward official SoilCertify launch
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        <LaunchProgressTracker revenue={revenue} customers={customers} />

        <div className="mt-8">
          <GISProgressTracker />
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default AdminLaunch;
