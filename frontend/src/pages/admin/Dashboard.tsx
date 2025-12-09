import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Users, TrendingUp, Store, Settings, Briefcase } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardHeader } from "../../components/shared/DashboardHeader";
import { BaseSettingsPanel, SEO } from "../../components/shared";
import { LanguageSelector } from "../../components/shared";
import { useLanguagePreference } from "../../hooks/useLanguagePreference";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMerchants: 0,
    totalStaff: 0,
    totalTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  // Language preference with database persistence
  const { language, setLanguage } = useLanguagePreference(user?.id);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch user counts by role
        const { data: users, error: userError } = await supabase
          .from("users")
          .select("role");

        if (userError) throw userError;

        const { count: transactionCount, error: txError } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true });

        if (txError) throw txError;

        const totalUsers = users?.length || 0;
        const totalMerchants =
          users?.filter((u) => u.role === "merchant").length || 0;
        const totalStaff = users?.filter((u) => u.role === "staff").length || 0;

        setStats({
          totalUsers,
          totalMerchants,
          totalStaff,
          totalTransactions: transactionCount || 0,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleRefresh = async () => {
    // Reload statistics
    window.location.reload();
  };

  const handleManagement = () => {
    navigate("/admin/users");
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      pullingContent={
        <div className="flex justify-center py-4">
          <div className="text-gray-600 text-sm flex items-center gap-2">
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
        <SEO title="Admin Dashboard" description="Admin Control Center" />
        <DashboardHeader
          title="Super Admin"
          subtitle="System Control Center"
          actions={
            <>
              <LanguageSelector
                language={language}
                onLanguageChange={setLanguage}
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={handleManagement}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-primary-foreground border-0 h-12 w-12 rounded-xl shadow-lg"
                title="Management"
              >
                <Briefcase className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleSettings}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-primary-foreground border-0 h-12 w-12 rounded-xl shadow-lg"
                title="Settings"
              >
                <Settings className="h-6 w-6" />
              </Button>
            </>
          }
        />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Users
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? "..." : stats.totalUsers}
                  </h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Merchants</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? "..." : stats.totalMerchants}
                  </h3>
                </div>
                <div className="bg-purple-50 p-3 rounded-full">
                  <Store className="h-6 w-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Staff Members
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? "..." : stats.totalStaff}
                  </h3>
                </div>
                <div className="bg-orange-50 p-3 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Transactions
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? "..." : stats.totalTransactions}
                  </h3>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              Management
            </h2>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/admin/users")}
                className="bg-white glass-card border-0 text-foreground hover:shadow-lg"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {user && (
          <BaseSettingsPanel
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            title="Admin Settings"
            language={language}
            onLanguageChange={setLanguage}
            onSignOut={handleSignOut}
          >
            {/* Admin-specific settings content (empty for now) */}
            <div />
          </BaseSettingsPanel>
        )}
      </div>
    </PullToRefresh>
  );
}
