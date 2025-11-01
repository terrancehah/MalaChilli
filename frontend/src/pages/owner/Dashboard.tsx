import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton, HeaderSkeleton } from '../../components/ui/skeleton';
import { Settings, Share2, DollarSign, Users as UsersIcon } from 'lucide-react';
import type { DashboardSummary } from '../../types/analytics.types';

// Import tab components
import { 
  ViralPerformanceTab,
  BusinessMetricsTab,
  CustomerInsightsTab 
} from '../../components/owner';
import { OwnerSettingsPanel } from '../../components/owner/OwnerSettingsPanel';

type TabType = 'viral' | 'business' | 'customers';

export default function OwnerDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('viral');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  // Get restaurant ID from user
  useEffect(() => {
    const getRestaurantId = async () => {
      if (!user) return;

      try {
        // Owner users should have restaurant_id directly
        if (user.restaurant_id) {
          setRestaurantId(user.restaurant_id);
          
          // Fetch restaurant name
          const { data: restaurantData } = await supabase
            .from('restaurants')
            .select('name')
            .eq('id', user.restaurant_id)
            .single();
          
          if (restaurantData) {
            setRestaurantName(restaurantData.name);
          }
        } else {
          // Fallback: fetch from restaurants table
          const { data } = await supabase
            .from('restaurants')
            .select('id, name')
            .eq('owner_id', user.id)
            .single();
          
          if (data) {
            setRestaurantId(data.id);
            setRestaurantName(data.name);
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant ID:', error);
      }
    };

    getRestaurantId();
  }, [user]);

  // Fetch dashboard summary
  useEffect(() => {
    const fetchDashboardSummary = async () => {
      if (!restaurantId) return;

      try {
        setLoading(true);
        
        // Call the get_dashboard_summary RPC function
        const { data, error } = await supabase
          .rpc('get_dashboard_summary', {
            p_restaurant_id: restaurantId,
            p_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
            p_end_date: new Date().toISOString()
          });

        if (error) throw error;
        
        setSummary(data as DashboardSummary);
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, [restaurantId]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <HeaderSkeleton />
        <div className="px-6 mt-6 space-y-6">
          {/* Owner stats skeleton - 2x2 grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-border/50">
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

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">
              Owner Dashboard
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              {user?.full_name || user?.email}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 pb-6">
        {/* Tab Navigation - Responsive */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <Button
            onClick={() => setActiveTab('viral')}
            variant={activeTab === 'viral' ? 'default' : 'outline'}
            className="h-10 whitespace-nowrap flex-shrink-0"
          >
            <Share2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Viral Performance</span>
          </Button>
          <Button
            onClick={() => setActiveTab('business')}
            variant={activeTab === 'business' ? 'default' : 'outline'}
            className="h-10 whitespace-nowrap flex-shrink-0"
          >
            <DollarSign className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Business Metrics</span>
          </Button>
          <Button
            onClick={() => setActiveTab('customers')}
            variant={activeTab === 'customers' ? 'default' : 'outline'}
            className="h-10 whitespace-nowrap flex-shrink-0"
          >
            <UsersIcon className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Customer Insights</span>
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'viral' && (
          <ViralPerformanceTab 
            restaurantId={restaurantId!} 
            summary={summary}
          />
        )}
        {activeTab === 'business' && (
          <BusinessMetricsTab 
            restaurantId={restaurantId!} 
            summary={summary}
          />
        )}
        {activeTab === 'customers' && (
          <CustomerInsightsTab 
            restaurantId={restaurantId!} 
            summary={summary}
          />
        )}
      </div>

      {/* Settings Panel */}
      <OwnerSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onSignOut={handleSignOut}
        restaurantName={restaurantName}
      />
    </div>
  );
}
