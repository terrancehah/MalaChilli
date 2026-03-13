import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton, HeaderSkeleton } from "../../components/ui/skeleton";
import { Settings, Share2, DollarSign, Users as UsersIcon, Briefcase, Loader2, ChevronDown } from "lucide-react";
import type { Restaurant } from "../../types/database.types";
import type { DashboardSummary } from "../../types/analytics.types";
import { getTranslation } from "../../translations";

// Import tab components
import {
  ViralPerformanceTab,
  BusinessMetricsTab,
  CustomerInsightsTab,
  TransactionsTab,
  MerchantAIChat,
} from "../../components/merchant";
import { MerchantSettingsPanel } from "../../components/merchant/MerchantSettingsPanel";
import { ManagementPanel } from "../../components/merchant/ManagementPanel";
import { DashboardHeader } from "../../components/shared/DashboardHeader";
import { LanguageSelector, SEO } from "../../components/shared";
import { useLanguagePreference } from "../../hooks/useLanguagePreference";
import PullToRefresh from "react-simple-pull-to-refresh";

type TabType = "viral" | "business" | "customers" | "transactions";

export default function MerchantDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("viral");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownedRestaurants, setOwnedRestaurants] = useState<Restaurant[]>([]); // All restaurants owned by this merchant
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [showManagement, setShowManagement] = useState(false);

  // Language preference with database persistence
  const { language, setLanguage } = useLanguagePreference(user?.id);

  // Get translations
  const t = getTranslation(language);

  // Fetch restaurants owned by this merchant via merchant_id
  useEffect(() => {
    const fetchOwnedRestaurants = async () => {
      if (!user) return;

      try {
        // Query restaurants where this merchant is the owner
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .eq("merchant_id", user.id)
          .eq("is_active", true)
          .order("name");

        if (error) throw error;

        if (data && data.length > 0) {
          setOwnedRestaurants(data);
          // Default to the first owned restaurant
          setRestaurantId(data[0].id);
          setRestaurantName(data[0].name);
        } else {
          // Fallback: check legacy restaurant_id on user record
          if (user.restaurant_id) {
            const { data: fallbackData } = await supabase
              .from("restaurants")
              .select("*")
              .eq("id", user.restaurant_id)
              .single();

            if (fallbackData) {
              setOwnedRestaurants([fallbackData]);
              setRestaurantId(fallbackData.id);
              setRestaurantName(fallbackData.name);
            }
          } else {
            console.warn("Merchant has no restaurants assigned");
          }
        }
      } catch (error) {
        console.error("Error fetching owned restaurants:", error);
      }
    };

    fetchOwnedRestaurants();
  }, [user]);

  // Handle switching between owned restaurants
  const handleRestaurantSwitch = (newRestaurantId: string) => {
    const selected = ownedRestaurants.find((r) => r.id === newRestaurantId);
    if (selected) {
      setRestaurantId(selected.id);
      setRestaurantName(selected.name);
      setSummary(null); // Reset summary to trigger re-fetch
    }
  };

  // Fetch dashboard summary
  useEffect(() => {
    const fetchDashboardSummary = async () => {
      if (!restaurantId) return;

      try {
        setLoading(true);

        // Call the get_dashboard_summary RPC function
        const { data, error } = await supabase.rpc("get_dashboard_summary", {
          p_restaurant_id: restaurantId,
          p_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
          p_end_date: new Date().toISOString(),
        });

        if (error) throw error;

        setSummary(data as DashboardSummary);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, [restaurantId]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-6">
        <HeaderSkeleton />
        <div className="px-6 mt-6 space-y-6">
          {/* Merchant stats skeleton - 2x2 grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} variant="glass" className="border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-20 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleRefresh = async () => {
    if (!restaurantId) return;

    // Refresh the summary data
    const { data, error } = await supabase.rpc("get_dashboard_summary", {
      p_restaurant_id: restaurantId,
      p_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
      p_end_date: new Date().toISOString(),
    });

    if (error) {
      console.error("Error fetching summary:", error);
    } else if (data) {
      setSummary(data as DashboardSummary);
    }
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      pullingContent={
        <div className="flex justify-center py-4">
          <div className="text-gray-600 text-xs sm:text-sm flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Pull to refresh
          </div>
        </div>
      }
      refreshingContent={
        <div className="flex justify-center py-4">
          <div className="text-gray-900 flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Refreshing...
          </div>
        </div>
      }
    >
      <div className="min-h-screen pb-6">
        <SEO
          title={t.merchantDashboard.title}
          description="Merchant Dashboard - Monitor your restaurant's viral performance and business metrics."
        />
        <DashboardHeader
          title={t.merchantDashboard.title}
          subtitle={user?.full_name || user?.email || ""}
          actions={
            <>
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowManagement(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-primary-foreground border-0 h-12 w-12 rounded-xl shadow-lg"
                title={t.merchantDashboard.management.title}
              >
                <Briefcase className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-primary-foreground border-0 h-12 w-12 rounded-xl shadow-lg"
                title={t.merchantDashboard.settings}
              >
                <Settings className="h-6 w-6" />
              </Button>
            </>
          }
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 pb-6">
          {/* Restaurant selector for merchants with multiple restaurants */}
          {ownedRestaurants.length > 1 && (
            <div className="flex items-center gap-2 mb-4">
              <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Restaurant:</label>
              <div className="relative flex-1 max-w-xs">
                <select
                  value={restaurantId || ""}
                  onChange={(e) => handleRestaurantSwitch(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 text-sm font-medium rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {ownedRestaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          )}

          {/* Tab Navigation - Responsive */}
          <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <Button
              onClick={() => setActiveTab("viral")}
              variant={activeTab === "viral" ? "default" : "outline"}
              className="h-10 whitespace-nowrap flex-shrink-0 px-3 sm:px-4 gap-1"
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="text-xs sm:text-sm">{t.merchantDashboard.tabs.viralPerformance}</span>
            </Button>
            <Button
              onClick={() => setActiveTab("business")}
              variant={activeTab === "business" ? "default" : "outline"}
              className="h-10 whitespace-nowrap flex-shrink-0 px-3 sm:px-4 gap-1"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-xs sm:text-sm">{t.merchantDashboard.tabs.businessMetrics}</span>
            </Button>
            <Button
              onClick={() => setActiveTab("customers")}
              variant={activeTab === "customers" ? "default" : "outline"}
              className="h-10 whitespace-nowrap flex-shrink-0 px-3 sm:px-4 gap-1"
            >
              <UsersIcon className="h-4 w-4 mr-1" />
              <span className="text-xs sm:text-sm">{t.merchantDashboard.tabs.customerInsights}</span>
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === "viral" && (
            <ViralPerformanceTab restaurantId={restaurantId!} summary={summary} language={language} />
          )}
          {activeTab === "business" && (
            <BusinessMetricsTab restaurantId={restaurantId!} summary={summary} language={language} />
          )}
          {activeTab === "customers" && (
            <CustomerInsightsTab restaurantId={restaurantId!} summary={summary} language={language} />
          )}
          {activeTab === "transactions" && <TransactionsTab restaurantId={restaurantId!} language={language} />}
        </div>

        {/* Management Panel */}
        <ManagementPanel
          isOpen={showManagement}
          onClose={() => setShowManagement(false)}
          restaurantName={restaurantName}
          language={language}
        />

        {/* Settings Panel */}
        <MerchantSettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          user={user}
          onSignOut={handleSignOut}
          restaurantName={restaurantName}
          language={language}
          onLanguageChange={setLanguage}
        />

        {/* AI Chat Assistant - Secure Edge Function with streaming */}
        <MerchantAIChat
          summary={summary}
          restaurantName={restaurantName}
          restaurantId={restaurantId!}
          language={language}
        />
      </div>
    </PullToRefresh>
  );
}
