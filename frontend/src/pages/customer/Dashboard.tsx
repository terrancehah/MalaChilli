import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Share2,
  Info,
  QrCode as QrCodeIcon,
  Settings,
  Receipt,
  TrendingUp, 
  Users, 
  Gift
} from 'lucide-react';
import {
  QRCodeModal,
  InfoModal,
  SettingsPanel,
  ShareBottomSheet,
  RestaurantCard,
} from '../../components/customer';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { StatsCard } from '../../components/shared/StatsCard';

// TypeScript interfaces
interface RestaurantCode {
  id: string;
  restaurant_id: string;
  referral_code: string;
  restaurant: {
    name: string;
    slug: string;
  };
  total_visits?: number;
  first_visit_date?: string;
  // Virtual currency fields (restaurant-specific)
  balance?: number;
  earned?: number;
  redeemed?: number;
}

// Helper function to calculate time ago
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'today';
  if (diffInDays === 1) return 'yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  const months = Math.floor(diffInDays / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
};

// Info modal content
const RESTAURANT_INFO = [
  { text: 'Visit a restaurant and make a transaction to unlock promotion for that restaurant' },
  { text: 'Your unique referral code is automatically created when you make your first visit' },
  { text: 'Share your referral link with friends via WhatsApp, Facebook, or copy the link' },
  { text: 'When someone uses your link and makes their first transaction at that restaurant, you both earn virtual currency' }
] as const;

const CURRENCY_INFO = [
  { text: '<strong>Restaurant-Specific:</strong> Each restaurant has its own separate virtual currency balance' },
  { text: 'Earn virtual currency by referring friends to specific restaurants' },
  { text: 'Currency earned from one restaurant can only be redeemed at that same restaurant' },
  { text: 'This ensures fair distribution and prevents exploitation across different restaurants' },
  { text: '<strong>Earned:</strong> Total virtual currency you\'ve earned from referrals at this restaurant', color: 'green' as const },
  { text: '<strong>Redeemed:</strong> Total amount you\'ve used for discounts at this restaurant', color: 'primary' as const }
];

export default function CustomerDashboard() {
  const { user, signOut, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  // Modal states
  const [showQR, setShowQR] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCurrencyInfoModal, setShowCurrencyInfoModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  
  // Data states
  const [restaurantCodes, setRestaurantCodes] = useState<RestaurantCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalRedeemed, setTotalRedeemed] = useState(0);
  const [totalReferred, setTotalReferred] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    name: string;
    slug: string;
    code: string;
    balance: number;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (showShareSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showShareSheet]);

  // Fetch restaurant codes and visited restaurants with VC balances
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoadingCodes(true);
      try {
        // Fetch visited restaurants
        const { data: visitedData, error: visitedError } = await supabase
          .from('customer_restaurant_history')
          .select(`
            restaurant_id,
            first_visit_date,
            total_visits,
            total_spent,
            restaurants (name, slug)
          `)
          .eq('customer_id', user.id);
        
        if (visitedError) throw visitedError;
        
        // Fetch restaurant-specific virtual currency balances
        const { data: walletData, error: walletError } = await supabase
          .from('customer_wallet_balance')
          .select('*')
          .eq('user_id', user.id);
        
        if (walletError) throw walletError;
        
        // Fetch total referred count (count unique downlines where user is upline)
        const { data: referralData, error: referralError } = await supabase
          .from('referrals')
          .select('downline_id')
          .eq('upline_id', user.id);
        
        if (referralError) throw referralError;
        const uniqueReferrals = new Set((referralData || []).map(r => r.downline_id)).size;
        setTotalReferred(uniqueReferrals);
        
        // Create wallet balance map by restaurant_id
        const walletMap = new Map();
        (walletData || []).forEach((wallet: any) => {
          walletMap.set(wallet.restaurant_id, {
            balance: wallet.available_balance || 0,
            earned: wallet.total_earned || 0,
            redeemed: wallet.total_redeemed || 0,
          });
        });
        
        // Create visit history map
        const visitHistoryMap = new Map();
        (visitedData || []).forEach((item: any) => {
          visitHistoryMap.set(item.restaurant_id, {
            first_visit_date: item.first_visit_date,
            total_visits: item.total_visits,
            total_spent: item.total_spent,
          });
        });
        
        // Fetch existing referral codes
        const { data: codesData, error: codesError } = await supabase
          .from('user_restaurant_referral_codes')
          .select(`
            id,
            restaurant_id,
            referral_code,
            restaurants (name, slug)
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);
        
        if (codesError) throw codesError;
        
        // Transform and merge data with VC balances
        const transformedCodes: RestaurantCode[] = (codesData || []).map((item: any) => {
          const visitInfo = visitHistoryMap.get(item.restaurant_id);
          const walletInfo = walletMap.get(item.restaurant_id);
          return {
            id: item.id,
            restaurant_id: item.restaurant_id,
            referral_code: item.referral_code,
            restaurant: item.restaurants[0] || { name: 'Unknown', slug: 'unknown' },
            total_visits: visitInfo?.total_visits,
            first_visit_date: visitInfo?.first_visit_date,
            balance: walletInfo?.balance,
            earned: walletInfo?.earned,
            redeemed: walletInfo?.redeemed,
          };
        });
        
        setRestaurantCodes(transformedCodes);
        
        // Calculate totals across all restaurants
        const totalEarnedAmount = (walletData || []).reduce((sum: number, wallet: any) => sum + (wallet.total_earned || 0), 0);
        const totalRedeemedAmount = (walletData || []).reduce((sum: number, wallet: any) => sum + (wallet.total_redeemed || 0), 0);
        setTotalEarned(totalEarnedAmount);
        setTotalRedeemed(totalRedeemedAmount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingCodes(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveName = async (name: string) => {
    if (user) {
      await updateProfile(user.id, { full_name: name });
    }
  };

  const handleShare = (name: string, slug: string, code: string, balance: number = 0) => {
    setSelectedRestaurant({ name, slug, code, balance });
    setShowShareSheet(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const customerStats = [
    {
      label: 'Earned',
      value: `RM ${totalEarned.toFixed(2)}`,
      icon: <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />,
    },
    {
      label: 'Referred',
      value: totalReferred,
      icon: <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    },
    {
      label: 'Redeemed',
      value: `RM ${totalRedeemed.toFixed(2)}`,
      icon: <Gift className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      <DashboardHeader
        user={user}
        title={user.full_name || user.email}
        subtitle={user.email_verified ? 'Verified Customer' : 'Unverified Customer'}
        actions={
          <>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-xl bg-white/95 hover:bg-white shadow-lg"
              onClick={() => setShowQR(true)}
            >
              <QrCodeIcon className="h-6 w-6 text-primary" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-xl bg-white/95 hover:bg-white shadow-lg"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-6 w-6 text-primary" />
            </Button>
          </>
        }
      />

      <div className="px-6 -mt-16 space-y-6">
        <StatsCard stats={customerStats} />
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Restaurant-Specific Referral Codes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Promote Restaurants</h2>
              <p className="text-sm text-muted-foreground">Share codes for restaurants you've visited</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfoModal(true)}
              className="h-8 w-8 p-0"
              title="How it works"
            >
              <Info className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          {loadingCodes ? (
            <Card className="border-border/50">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground text-sm">Loading restaurants...</p>
              </CardContent>
            </Card>
          ) : restaurantCodes.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Share2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  No visited restaurants yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Visit a restaurant and make your first transaction to start promoting!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Restaurants with codes (auto-generated on first visit) */}
              {restaurantCodes.map((code) => (
                <RestaurantCard
                  key={code.id}
                  restaurant={code}
                  getTimeAgo={getTimeAgo}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
          </div>
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                No transactions yet. Start dining at our partner restaurants to earn rewards!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals and Panels */}
      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        userId={user.id}
        userName={user.full_name || user.email}
      />

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="How It Works"
        items={RESTAURANT_INFO}
      />

      <InfoModal
        isOpen={showCurrencyInfoModal}
        onClose={() => setShowCurrencyInfoModal(false)}
        title="Restaurant-Specific Virtual Currency"
        items={CURRENCY_INFO}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onSaveName={handleSaveName}
        onSignOut={handleSignOut}
      />

      <ShareBottomSheet
        isOpen={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        restaurant={selectedRestaurant}
      />
    </div>
  );
}
