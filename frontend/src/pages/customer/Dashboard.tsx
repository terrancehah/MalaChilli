import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Info,
  QrCode as QrCodeIcon,
  Settings,
  Receipt,
  TrendingUp, 
  Users, 
  Gift,
  Languages
} from 'lucide-react';
import { getTranslation } from '../../translations';
import type { Language } from '../../translations';
import {
  QRCodeModal,
  InfoModal,
  SettingsPanel,
  ShareBottomSheet,
  RestaurantCard,
} from '../../components/customer';
import { TransactionDetailSheet } from '../../components/customer/TransactionDetailSheet';
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
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'balance' | 'visits'>('recent');
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    name: string;
    slug: string;
    code: string;
    balance: number;
    totalSpent?: number;
  } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [showTransactionSheet, setShowTransactionSheet] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  // Get translations based on current language
  const t = getTranslation(language);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (showShareSheet || showTransactionSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showShareSheet, showTransactionSheet]);

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
          .from('customer_wallet_balance_by_restaurant')
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
        
        // Create wallet balance map by restaurant_id (restaurant-specific VC)
        const walletMap = new Map();
        (walletData || []).forEach((wallet: any) => {
          walletMap.set(wallet.restaurant_id, {
            balance: parseFloat(wallet.available_balance) || 0,
            earned: parseFloat(wallet.total_earned) || 0,
            redeemed: parseFloat(wallet.total_redeemed) || 0,
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
            restaurant: item.restaurants || { name: 'Unknown', slug: 'unknown' },
            total_visits: visitInfo?.total_visits,
            first_visit_date: visitInfo?.first_visit_date,
            balance: walletInfo?.balance,
            earned: walletInfo?.earned,
            redeemed: walletInfo?.redeemed,
          };
        });
        
        setRestaurantCodes(transformedCodes);
        
        // Calculate totals across all restaurants
        const totalEarnedAmount = (walletData || []).reduce((sum: number, wallet: any) => 
          sum + (parseFloat(wallet.total_earned) || 0), 0);
        const totalRedeemedAmount = (walletData || []).reduce((sum: number, wallet: any) => 
          sum + (parseFloat(wallet.total_redeemed) || 0), 0);
        
        setTotalEarned(totalEarnedAmount);
        setTotalRedeemed(totalRedeemedAmount);
        
        // Fetch recent transactions with VC earned
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select(`
            id,
            bill_amount,
            guaranteed_discount_amount,
            virtual_currency_redeemed,
            is_first_transaction,
            created_at,
            branches!inner (
              name,
              restaurants!inner (
                name,
                id
              )
            )
          `)
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (transactionsError) throw transactionsError;
        
        // Fetch VC earned from each transaction (from downlines)
        const transactionsWithVC = await Promise.all(
          (transactionsData || []).map(async (transaction: any) => {
            const { data: vcEarned } = await supabase
              .from('virtual_currency_ledger')
              .select('amount')
              .eq('user_id', user.id)
              .eq('related_transaction_id', transaction.id)
              .eq('transaction_type', 'earn');
            
            const totalVCEarned = (vcEarned || []).reduce((sum, vc) => sum + parseFloat(vc.amount), 0);
            
            return {
              ...transaction,
              vc_earned: totalVCEarned
            };
          })
        );
        
        setRecentTransactions(transactionsWithVC);
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

  const handleShare = (name: string, slug: string, code: string, balance: number = 0, totalSpent: number = 0) => {
    setSelectedRestaurant({ name, slug, code, balance, totalSpent });
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
      label: t.stats.totalEarned,
      value: `RM ${totalEarned.toFixed(2)}`,
      icon: <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />,
    },
    {
      label: t.stats.totalReferred,
      value: totalReferred,
      icon: <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    },
    {
      label: t.stats.totalRedeemed,
      value: `RM ${totalRedeemed.toFixed(2)}`,
      icon: <Gift className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      <DashboardHeader
        user={user}
        title={user.full_name || user.email}
        subtitle={t.profile.welcome}
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
            <div className="relative">
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-xl bg-white/95 hover:bg-white shadow-lg"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                <Languages className="h-6 w-6 text-primary" />
              </Button>
              {showLanguageMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowLanguageMenu(false)}
                  />
                  <div className="absolute right-0 top-14 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-border/50 overflow-hidden min-w-[140px]">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between ${
                        language === 'en' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                      }`}
                    >
                      <span>English</span>
                      {language === 'en' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('ms');
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between ${
                        language === 'ms' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                      }`}
                    >
                      <span>Bahasa Malaysia</span>
                      {language === 'ms' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('zh');
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between ${
                        language === 'zh' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                      }`}
                    >
                      <span>中文</span>
                      {language === 'zh' && <span className="text-xs">✓</span>}
                    </button>
                  </div>
                </>
              )}
            </div>
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
      >
        <StatsCard stats={customerStats} />
      </DashboardHeader>

      <div className="px-6 mt-6 space-y-6">
        {/* Restaurant-Specific Referral Codes */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">{t.promoteRestaurants.title}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInfoModal(true)}
                    className="h-6 w-6 p-0"
                    title="How it works"
                  >
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{t.promoteRestaurants.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setSortBy('recent')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  sortBy === 'recent'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.restaurantSorting.recent}
              </button>
              <button
                onClick={() => setSortBy('balance')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  sortBy === 'balance'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.restaurantSorting.balance}
              </button>
              <button
                onClick={() => setSortBy('visits')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  sortBy === 'visits'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.restaurantSorting.visits}
              </button>
            </div>
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
                <p className="text-lg font-semibold text-muted-foreground mb-2">
                  {t.promoteRestaurants.noRestaurants}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.promoteRestaurants.noRestaurantsDesc}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Restaurants with codes (auto-generated on first visit) */}
              {[...restaurantCodes]
                .sort((a, b) => {
                  if (sortBy === 'balance') {
                    return (b.balance || 0) - (a.balance || 0);
                  } else if (sortBy === 'visits') {
                    return (b.total_visits || 0) - (a.total_visits || 0);
                  } else {
                    // Sort by recent (first_visit_date)
                    return new Date(b.first_visit_date || 0).getTime() - new Date(a.first_visit_date || 0).getTime();
                  }
                })
                .map((code) => (
                  <RestaurantCard
                    key={code.id}
                    restaurant={code}
                    getTimeAgo={getTimeAgo}
                    onShare={handleShare}
                    language={language}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">{t.recentTransactions.title}</h2>
          </div>
          {recentTransactions.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Receipt className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">
                  {t.recentTransactions.noTransactions}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction: any) => {
                // Calculate potential earnings from all 3 referral levels (1% each)
                const potentialEarningPerLevel = transaction.bill_amount * 0.01;
                const totalPotentialEarning = potentialEarningPerLevel * 3; // 3 levels
                const hasEarnings = transaction.vc_earned > 0;
                
                return (
                  <Card 
                    key={transaction.id} 
                    className="border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowTransactionSheet(true);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {transaction.branches.restaurants.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(transaction.created_at).toLocaleString('en-MY', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">RM {transaction.bill_amount}</p>
                          {transaction.is_first_transaction && (
                            <p className="text-xs text-green-600 dark:text-green-400">{t.recentTransactions.firstVisit}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Transaction Details */}
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {transaction.guaranteed_discount_amount > 0 && (
                            <span className="flex items-center gap-1">
                              <span className="text-green-600 dark:text-green-400">-RM {transaction.guaranteed_discount_amount}</span>
                              <span>{t.recentTransactions.discount}</span>
                            </span>
                          )}
                          {transaction.virtual_currency_redeemed > 0 && (
                            <span className="flex items-center gap-1">
                              <span className="text-primary">-RM {transaction.virtual_currency_redeemed}</span>
                              <span>{t.recentTransactions.vcUsed}</span>
                            </span>
                          )}
                          {hasEarnings && (
                            <span className="flex items-center gap-1">
                              <span className="text-green-600 dark:text-green-400">+RM {transaction.vc_earned.toFixed(2)}</span>
                              <span>{t.recentTransactions.vcEarned}</span>
                            </span>
                          )}
                        </div>
                        
                        {/* Potential Earnings Banner */}
                        {!hasEarnings && (
                          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-md p-2 border border-amber-200 dark:border-amber-800">
                            <p className="text-xs text-amber-800 dark:text-amber-200">
                              <span className="font-semibold">💡 {t.recentTransactions.unrealized}:</span> <span className="font-bold">RM {totalPotentialEarning.toFixed(2)}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals and Panels */}
      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        userId={user.id}
        userName={user.full_name || user.email}
        language={language}
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
        language={language}
      />

      <ShareBottomSheet
        isOpen={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        restaurant={selectedRestaurant}
        language={language}
      />

      <TransactionDetailSheet
        isOpen={showTransactionSheet}
        onClose={() => setShowTransactionSheet(false)}
        transaction={selectedTransaction}
        language={language}
      />
    </div>
  );
}
