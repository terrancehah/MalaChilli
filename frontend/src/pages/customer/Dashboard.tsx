import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Sparkles,
  Share2,
  Info,
  QrCode as QrCodeIcon,
  Settings,
  Receipt,
} from 'lucide-react';
import {
  QRCodeModal,
  InfoModal,
  SettingsPanel,
  ShareBottomSheet,
  RestaurantCard,
  EligibleRestaurantCard,
  VirtualCurrencyCard
} from '../../components/customer';

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
}

interface VisitedRestaurant {
  restaurant_id: string;
  first_visit_date: string;
  total_visits: number;
  total_spent: string;
  restaurant: {
    name: string;
    slug: string;
  };
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
  { text: 'Generate your unique referral code for each restaurant you\'ve visited' },
  { text: 'Share your referral link with friends via WhatsApp, Facebook, or copy the link' },
  { text: 'When someone uses your link and makes their first transaction at that restaurant, you both earn virtual currency' }
] as const;

const CURRENCY_INFO = [
  { text: 'Redeem your virtual currency for discounts at participating restaurants' },
  { text: 'Check your balance and transaction history in the dashboard' },
  { text: 'The more friends you refer, the more you earn!' },
  { text: '<strong>Earned:</strong> Total virtual currency you\'ve earned from referrals', color: 'green' as const },
  { text: '<strong>Referred:</strong> Number of friends you\'ve successfully referred', color: 'blue' as const },
  { text: '<strong>Redeemed:</strong> Total amount you\'ve used for discounts', color: 'primary' as const }
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
  const [visitedRestaurants, setVisitedRestaurants] = useState<VisitedRestaurant[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    name: string;
    slug: string;
    code: string;
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

  // Fetch restaurant codes and visited restaurants
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
        
        // Transform and merge data
        const transformedCodes: RestaurantCode[] = (codesData || []).map((item: any) => {
          const visitInfo = visitHistoryMap.get(item.restaurant_id);
          return {
            id: item.id,
            restaurant_id: item.restaurant_id,
            referral_code: item.referral_code,
            restaurant: item.restaurants[0] || { name: 'Unknown', slug: 'unknown' },
            total_visits: visitInfo?.total_visits,
            first_visit_date: visitInfo?.first_visit_date,
          };
        });
        
        setRestaurantCodes(transformedCodes);
        
        const transformedVisited: VisitedRestaurant[] = (visitedData || []).map((item: any) => ({
          restaurant_id: item.restaurant_id,
          first_visit_date: item.first_visit_date,
          total_visits: item.total_visits,
          total_spent: item.total_spent,
          restaurant: item.restaurants[0] || { name: 'Unknown', slug: 'unknown' }
        }));
        
        setVisitedRestaurants(transformedVisited);
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

  const handleShare = (name: string, slug: string, code: string) => {
    setSelectedRestaurant({ name, slug, code });
    setShowShareSheet(true);
  };

  const handleGenerateCode = async (restaurantId: string) => {
    if (!user) return;
    
    setGenerating(restaurantId);
    try {
      const { error } = await supabase.rpc('generate_restaurant_referral_code', {
        p_user_id: user.id,
        p_restaurant_id: restaurantId
      });
      
      if (error) throw error;
      
      // Refresh codes list
      const { data: updatedCodes, error: fetchError } = await supabase
        .from('user_restaurant_referral_codes')
        .select(`
          id,
          restaurant_id,
          referral_code,
          restaurants (name, slug)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (fetchError) throw fetchError;
      
      const transformedData: RestaurantCode[] = (updatedCodes || []).map((item: any) => ({
        id: item.id,
        restaurant_id: item.restaurant_id,
        referral_code: item.referral_code,
        restaurant: item.restaurants[0] || { name: 'Unknown', slug: 'unknown' }
      }));
      
      setRestaurantCodes(transformedData);
    } catch (error: any) {
      console.error('Error generating code:', error);
      alert(error.message || 'Failed to generate code');
    } finally {
      setGenerating(null);
    }
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || '?';

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

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

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header with Profile */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="h-14 w-14 border-2 border-white/20 flex-shrink-0">
              <AvatarImage src="" alt={user.full_name || user.email} />
              <AvatarFallback className="bg-white/10 text-primary-foreground text-base">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                {user.full_name || user.email}
              </h1>
              <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                {user.email_verified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
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
          </div>
        </div>

        {/* Virtual Currency Card */}
        <VirtualCurrencyCard
          balance={0}
          earned={0}
          referred={0}
          redeemed={0}
          memberSince={memberSince}
          onInfoClick={() => setShowCurrencyInfoModal(true)}
        />
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
          ) : visitedRestaurants.length === 0 ? (
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
              {/* Restaurants with codes */}
              {restaurantCodes.map((code) => (
                <RestaurantCard
                  key={code.id}
                  restaurant={code}
                  getTimeAgo={getTimeAgo}
                  onShare={handleShare}
                />
              ))}
              
              {/* Eligible restaurants without codes */}
              {visitedRestaurants
                .filter(visited => !restaurantCodes.some(code => code.restaurant_id === visited.restaurant_id))
                .map((visited) => (
                  <EligibleRestaurantCard
                    key={visited.restaurant_id}
                    restaurant={visited}
                    generating={generating === visited.restaurant_id}
                    onGenerate={() => handleGenerateCode(visited.restaurant_id)}
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
        title="Virtual Currency"
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
