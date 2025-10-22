import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
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
  TotalStatsCard
} from '../components/customer';

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

interface VisitedRestaurant {
  restaurant_id: string;
  first_visit_date: string;
  total_visits: number;
  total_spent: string;
  restaurant: {
    name: string;
    slug: string;
  };
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
  { text: 'Generate your unique referral code for each restaurant you\'ve visited' },
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

// Sample user data for demo
const demoUser = {
  id: 'demo-123',
  email: 'sarah.chen@example.com',
  full_name: 'Sarah Chen',
  nickname: 'Sarah',
  birthday: '1995-03-15',
  age: 29,
  referral_code: 'CHILLI-ABC123',
  role: 'customer' as const,
  is_email_verified: true,
  email_notifications_enabled: true,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
};

// Sample data
const mockData = {
  totalEarned: 0,
  totalRedeemed: 0,
  totalReferred: 0,
};

// Mock restaurant codes with visit stats and virtual currency
const mockRestaurantCodes: RestaurantCode[] = [
  {
    id: '1',
    restaurant_id: 'rest-1',
    referral_code: 'CHILLI-REST1-ABC',
    restaurant: {
      name: 'Nasi Lemak Corner',
      slug: 'nasi-lemak-corner',
    },
    total_visits: 5,
    first_visit_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    balance: 0,
    earned: 0,
    redeemed: 0,
  },
  {
    id: '2',
    restaurant_id: 'rest-2',
    referral_code: 'CHILLI-REST2-XYZ',
    restaurant: {
      name: 'Mama\'s Kitchen',
      slug: 'mamas-kitchen',
    },
    total_visits: 2,
    first_visit_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    balance: 0,
    earned: 0,
    redeemed: 0,
  },
];

// Mock visited restaurants without codes
const mockVisitedRestaurants: VisitedRestaurant[] = [
  {
    restaurant_id: 'rest-3',
    first_visit_date: '2024-03-01',
    total_visits: 3,
    total_spent: '125.50',
    restaurant: {
      name: 'Satay Station',
      slug: 'satay-station',
    },
    balance: 0,
    earned: 0,
    redeemed: 0,
  },
];

export default function DemoDashboard() {
  // Modal states
  const [showQR, setShowQR] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCurrencyInfoModal, setShowCurrencyInfoModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  
  // Data states
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    name: string;
    slug: string;
    code: string;
    balance: number;
  } | null>(null);

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

  const handleSignOut = () => {
    window.location.href = '/';
  };

  const handleSaveName = async (name: string) => {
    console.log('Demo mode: Name editing not available', name);
  };

  const handleShare = (name: string, slug: string, code: string, balance: number = 0) => {
    setSelectedRestaurant({ name, slug, code, balance });
    setShowShareSheet(true);
  };

  const initials = demoUser.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Demo Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-6 py-3">
        <p className="text-center text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Demo Mode</strong> - This is a preview with sample data. Database not connected.
        </p>
      </div>

      {/* Header with Profile */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="h-14 w-14 border-2 border-white/20 flex-shrink-0">
              <AvatarImage src="" alt={demoUser.full_name} />
              <AvatarFallback className="bg-white/10 text-primary-foreground text-base">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                {demoUser.full_name}
              </h1>
              <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-xl bg-white/95 hover:bg-white shadow-lg"
              onClick={() => setShowQR(!showQR)}
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

        {/* Total Stats Card */}
        <TotalStatsCard 
          totalEarned={mockData.totalEarned} 
          totalReferred={mockData.totalReferred}
          totalRedeemed={mockData.totalRedeemed}
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

          {mockVisitedRestaurants.length === 0 ? (
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
              {mockRestaurantCodes.map((code) => (
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

        {/* Recent Transactions - Coming Soon */}
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
        userId={demoUser.id}
        userName={demoUser.full_name}
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
        user={demoUser}
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
