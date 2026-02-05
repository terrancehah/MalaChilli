import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Sparkles,
  Share2,
  Info,
  QrCode as QrCodeIcon,
  Settings,
  Receipt,
} from "lucide-react";
import {
  QRCodeModal,
  InfoModal,
  SettingsPanel,
  ShareBottomSheet,
  RestaurantCard,
} from "../components/customer";
import { DashboardHeader } from "../components/shared/DashboardHeader";
import { StatsCard } from "../components/shared/StatsCard";
import { SEO } from "../components/shared";

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

  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  const months = Math.floor(diffInDays / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
};

// Info modal content
const RESTAURANT_INFO = [
  {
    text: "Visit a restaurant and make a transaction to unlock promotion for that restaurant",
  },
  {
    text: "Generate your unique referral code for each restaurant you've visited",
  },
  {
    text: "Share your referral link with friends via WhatsApp, Facebook, or copy the link",
  },
  {
    text: "When someone uses your link and makes their first transaction at that restaurant, you both earn virtual currency",
  },
] as const;

const CURRENCY_INFO = [
  {
    text: "<strong>Restaurant-Specific:</strong> Each restaurant has its own separate virtual currency balance",
  },
  {
    text: "Earn virtual currency by referring friends to specific restaurants",
  },
  {
    text: "Currency earned from one restaurant can only be redeemed at that same restaurant",
  },
  {
    text: "This ensures fair distribution and prevents exploitation across different restaurants",
  },
  {
    text: "<strong>Earned:</strong> Total virtual currency you've earned from referrals at this restaurant",
    color: "green" as const,
  },
  {
    text: "<strong>Redeemed:</strong> Total amount you've used for discounts at this restaurant",
    color: "primary" as const,
  },
];

// Sample user data for demo
const demoUser = {
  id: "demo-123",
  email: "sarah.chen@example.com",
  full_name: "Sarah Chen",
  nickname: "Sarah",
  birthday: "1995-03-15",
  age: 29,
  referral_code: "MAKAN-ABC123",
  role: "customer" as const,
  is_email_verified: true,
  email_notifications_enabled: true,
  created_at: "2024-01-15T00:00:00Z",
  updated_at: "2024-01-15T00:00:00Z",
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
    id: "1",
    restaurant_id: "rest-1",
    referral_code: "MAKAN-REST1-ABC",
    restaurant: {
      name: "Nasi Lemak Corner",
      slug: "nasi-lemak-corner",
    },
    total_visits: 5,
    first_visit_date: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000
    ).toISOString(), // 5 days ago
    balance: 0,
    earned: 0,
    redeemed: 0,
  },
  {
    id: "2",
    restaurant_id: "rest-2",
    referral_code: "MAKAN-REST2-XYZ",
    restaurant: {
      name: "Mama's Kitchen",
      slug: "mamas-kitchen",
    },
    total_visits: 2,
    first_visit_date: new Date(
      Date.now() - 14 * 24 * 60 * 60 * 1000
    ).toISOString(), // 2 weeks ago
    balance: 0,
    earned: 0,
    redeemed: 0,
  },
];

// Mock visited restaurants without codes
const mockVisitedRestaurants: VisitedRestaurant[] = [
  {
    restaurant_id: "rest-3",
    first_visit_date: "2024-03-01",
    total_visits: 3,
    total_spent: "125.50",
    restaurant: {
      name: "Satay Station",
      slug: "satay-station",
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showShareSheet]);

  const handleSignOut = () => {
    window.location.href = "/";
  };

  const handleSaveName = async (name: string) => {
    console.log("Demo mode: Name editing not available", name);
  };

  const handleShare = (
    name: string,
    slug: string,
    code: string,
    balance: number = 0
  ) => {
    setSelectedRestaurant({ name, slug, code, balance });
    setShowShareSheet(true);
  };

  const demoStats = [
    {
      label: "Earned",
      value: `RM ${mockData.totalEarned.toFixed(2)}`,
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      label: "Referred",
      value: mockData.totalReferred,
      icon: <Share2 className="h-5 w-5" />,
    },
    {
      label: "Redeemed",
      value: `RM ${mockData.totalRedeemed.toFixed(2)}`,
      icon: <Receipt className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen pb-6 bg-gradient-to-b from-background to-background/80">
      <SEO
        title="Demo Dashboard"
        description="Experience the MakanTak dashboard in demo mode."
      />
      {/* Demo Banner - Enhanced with better visual hierarchy */}
      <div className="bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 border-b border-orange-200 dark:border-orange-800 px-6 py-3.5 backdrop-blur-sm shadow-sm">
        <p className="text-center text-sm text-orange-900 dark:text-orange-100 font-semibold tracking-wide">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <strong>Demo Mode</strong> - This is a preview with sample data.
          </span>
        </p>
      </div>

      <DashboardHeader
        title={demoUser.full_name}
        subtitle="Verified Customer"
        actions={
          <>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md"
              onClick={() => setShowQR(!showQR)}
            >
              <QrCodeIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-6 w-6" />
            </Button>
          </>
        }
      >
        <StatsCard stats={demoStats} />
      </DashboardHeader>

      <div className="px-6 mt-8 space-y-8">
        {/* Restaurant-Specific Referral Codes - Enhanced section header */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-display font-bold text-primary-dark tracking-tight">
                🍽️ Promote Restaurants
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Share codes for restaurants you've visited and earn rewards
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfoModal(true)}
              className="h-9 w-9 p-0 rounded-full hover:bg-primary/10 transition-all duration-200 hover:scale-110 cursor-pointer"
              title="How it works"
            >
              <Info className="h-5 w-5 text-primary" />
            </Button>
          </div>

          {mockVisitedRestaurants.length === 0 ? (
            <Card variant="glass" className="border-0 overflow-hidden">
              <CardContent className="p-12 text-center">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-5 flex items-center justify-center shadow-lg">
                    <Share2 className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-primary/5 animate-ping" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base font-semibold mb-2">
                  No visited restaurants yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                  Visit a restaurant and make your first transaction to start promoting and earning rewards!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Restaurants with codes (auto-generated on first visit) */}
              {mockRestaurantCodes.map((code, index) => (
                <div
                  key={code.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <RestaurantCard
                    restaurant={code}
                    getTimeAgo={getTimeAgo}
                    onShare={handleShare}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions - Coming Soon - Enhanced empty state */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-display font-bold text-primary-dark tracking-tight">
                📝 Recent Transactions
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Track your dining history and rewards
              </p>
            </div>
          </div>

          <Card variant="glass" className="border-0 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-12 text-center">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-orange-100 dark:to-orange-900/20 mx-auto mb-5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Receipt className="h-10 w-10 text-primary" />
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-base font-semibold mb-2">
                No transactions yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                Start dining at our partner restaurants to earn rewards and build your transaction history!
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs text-primary font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Ready to get started
              </div>
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
