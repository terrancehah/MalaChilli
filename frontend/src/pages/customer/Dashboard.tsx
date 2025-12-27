import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Info,
  QrCode as QrCodeIcon,
  Settings,
  TrendingUp,
  Users,
  Gift,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { getTranslation } from "../../translations";
import {
  QRCodeModal,
  InfoModal,
  SettingsPanel,
  ShareBottomSheet,
  RestaurantCard,
} from "../../components/customer";
import { TransactionDetailSheet } from "../../components/customer/TransactionDetailSheet";
import { DashboardHeader } from "../../components/shared/DashboardHeader";
import { StatsCard } from "../../components/shared/StatsCard";
import { ListSkeleton } from "../../components/ui/skeleton";
import { LanguageSelector, SEO } from "../../components/shared";
import { useLanguagePreference } from "../../hooks/useLanguagePreference";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Loader2 } from "lucide-react";

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
  last_visit_date?: string;
  // Virtual currency fields (restaurant-specific)
  balance?: number;
  earned?: number;
  redeemed?: number;
}

// Helper function to calculate time ago (Malaysia timezone) moved inside component

export default function CustomerDashboard() {
  const { user, signOut, loading, updateProfile, deleteAccount } = useAuth();
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
  const [sortBy, setSortBy] = useState<"recent" | "balance">("recent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    name: string;
    slug: string;
    code: string;
    balance: number;
    totalSpent?: number;
  } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const [showTransactionSheet, setShowTransactionSheet] = useState(false);

  // Language preference with database persistence
  const { language, setLanguage } = useLanguagePreference(user?.id);

  // Get translations based on current language
  const t = getTranslation(language);

  // Helper function to calculate time ago (Malaysia timezone)
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const malaysiaDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    const malaysiaNow = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
    const diffInMs = malaysiaNow.getTime() - malaysiaDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return t.timeAgo.today;
    if (diffInDays === 1) return t.timeAgo.yesterday;
    if (diffInDays < 7)
      return t.timeAgo.daysAgo.replace("{count}", diffInDays.toString());
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1
        ? t.timeAgo.weekAgo
        : t.timeAgo.weeksAgo.replace("{count}", weeks.toString());
    }
    const months = Math.floor(diffInDays / 30);
    return months === 1
      ? t.timeAgo.monthAgo
      : t.timeAgo.monthsAgo.replace("{count}", months.toString());
  };

  // Info modal content constructed from translations
  const restaurantInfoItems = [
    { text: t.dashboardInfo.restaurantInfo.item1 },
    { text: t.dashboardInfo.restaurantInfo.item2 },
    { text: t.dashboardInfo.restaurantInfo.item3 },
    { text: t.dashboardInfo.restaurantInfo.item4 },
  ];

  const currencyInfoItems = [
    { text: t.dashboardInfo.currencyInfo.item1 },
    { text: t.dashboardInfo.currencyInfo.item2 },
    { text: t.dashboardInfo.currencyInfo.item3 },
    { text: t.dashboardInfo.currencyInfo.item4 },
    { text: t.dashboardInfo.currencyInfo.item5, color: "green" as const },
    { text: t.dashboardInfo.currencyInfo.item6, color: "primary" as const },
  ];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (showShareSheet || showTransactionSheet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
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
          .from("customer_restaurant_history")
          .select(
            `
            restaurant_id,
            first_visit_date,
            last_visit_date,
            total_visits,
            total_spent,
            restaurants (name, slug)
          `
          )
          .eq("customer_id", user.id);

        if (visitedError) throw visitedError;

        // Fetch restaurant-specific virtual currency balances
        const { data: walletData, error: walletError } = await supabase
          .from("customer_wallet_balance_by_restaurant")
          .select("*")
          .eq("user_id", user.id);

        if (walletError) throw walletError;

        // Fetch total referred count (count unique downlines where user is upline)
        const { data: referralData, error: referralError } = await supabase
          .from("referrals")
          .select("downline_id")
          .eq("upline_id", user.id);

        if (referralError) throw referralError;
        const uniqueReferrals = new Set(
          (referralData || []).map((r) => r.downline_id)
        ).size;
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
            last_visit_date: item.last_visit_date,
            total_visits: item.total_visits,
            total_spent: item.total_spent,
          });
        });

        // Fetch existing referral codes
        const { data: codesData, error: codesError } = await supabase
          .from("user_restaurant_referral_codes")
          .select(
            `
            id,
            restaurant_id,
            referral_code,
            restaurants (name, slug)
          `
          )
          .eq("user_id", user.id)
          .eq("is_active", true);

        if (codesError) throw codesError;

        // Transform and merge data with VC balances
        const transformedCodes: RestaurantCode[] = (codesData || []).map(
          (item: any) => {
            const visitInfo = visitHistoryMap.get(item.restaurant_id);
            const walletInfo = walletMap.get(item.restaurant_id);
            return {
              id: item.id,
              restaurant_id: item.restaurant_id,
              referral_code: item.referral_code,
              restaurant: item.restaurants || {
                name: "Unknown",
                slug: "unknown",
              },
              total_visits: visitInfo?.total_visits,
              first_visit_date: visitInfo?.first_visit_date,
              last_visit_date: visitInfo?.last_visit_date,
              balance: walletInfo?.balance,
              earned: walletInfo?.earned,
              redeemed: walletInfo?.redeemed,
            };
          }
        );

        setRestaurantCodes(transformedCodes);

        // Calculate totals across all restaurants
        const totalEarnedAmount = (walletData || []).reduce(
          (sum: number, wallet: any) =>
            sum + (parseFloat(wallet.total_earned) || 0),
          0
        );
        const totalRedeemedAmount = (walletData || []).reduce(
          (sum: number, wallet: any) =>
            sum + (parseFloat(wallet.total_redeemed) || 0),
          0
        );

        setTotalEarned(totalEarnedAmount);
        setTotalRedeemed(totalRedeemedAmount);

        // Fetch recent transactions with VC earned
        const { data: transactionsData, error: transactionsError } =
          await supabase
            .from("transactions")
            .select(
              `
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
                id,
                slug
              )
            )
          `
            )
            .eq("customer_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);

        if (transactionsError) throw transactionsError;

        // Fetch VC earned from each transaction (from downlines)
        const transactionsWithVC = await Promise.all(
          (transactionsData || []).map(async (transaction: any) => {
            const { data: vcEarned } = await supabase
              .from("virtual_currency_ledger")
              .select("amount")
              .eq("user_id", user.id)
              .eq("related_transaction_id", transaction.id)
              .eq("transaction_type", "earn");

            const totalVCEarned = (vcEarned || []).reduce(
              (sum, vc) => sum + parseFloat(vc.amount),
              0
            );

            return {
              ...transaction,
              vc_earned: totalVCEarned,
            };
          })
        );

        setRecentTransactions(transactionsWithVC);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingCodes(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSaveName = async (name: string) => {
    if (user) {
      await updateProfile(user.id, { full_name: name });
    }
  };

  const handleShare = (
    name: string,
    slug: string,
    code: string,
    balance: number = 0,
    totalSpent: number = 0
  ) => {
    setSelectedRestaurant({ name, slug, code, balance, totalSpent });
    setShowShareSheet(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">
          {t.common.loading}
        </div>
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
      icon: (
        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
      ),
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

  const handleRefresh = async () => {
    // Reload all data
    window.location.reload();
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
        <SEO
          title="Dashboard"
          description="View your savings, rewards, and restaurant codes."
        />
        <DashboardHeader
          title={t.profile.welcome}
          subtitle={user.full_name || user.email}
          actions={
            <>
              <LanguageSelector
                language={language}
                onLanguageChange={setLanguage}
              />
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-xl bg-white hover:bg-gray-50 text-primary border-0 shadow-lg transition-transform hover:-translate-y-0.5"
                onClick={() => setShowQR(true)}
              >
                <QrCodeIcon className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-xl bg-white hover:bg-gray-50 text-primary border-0 shadow-lg transition-transform hover:-translate-y-0.5"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-6 w-6" />
              </Button>
            </>
          }
        >
          <StatsCard stats={customerStats} />
        </DashboardHeader>

        <div className="px-6 mt-6 space-y-6">
          {/* My Restaurants - Combined Section */}
          <div>
            <div className="mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <h2 className="text-xl font-bold text-foreground">
                      {t.promoteRestaurants.title}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInfoModal(true)}
                      className="h-6 w-6 p-0"
                      title={t.dashboardInfo.restaurantInfo.title}
                    >
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.promoteRestaurants.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex w-fit ml-auto gap-1 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => {
                    if (sortBy === "recent") {
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    } else {
                      setSortBy("recent");
                      setSortOrder("desc");
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    sortBy === "recent"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{t.restaurantSorting.recent}</span>
                  {sortBy === "recent" &&
                    (sortOrder === "desc" ? (
                      <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUp className="h-3 w-3" />
                    ))}
                </button>
                <button
                  onClick={() => {
                    if (sortBy === "balance") {
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    } else {
                      setSortBy("balance");
                      setSortOrder("desc");
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    sortBy === "balance"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{t.restaurantSorting.balance}</span>
                  {sortBy === "balance" &&
                    (sortOrder === "desc" ? (
                      <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUp className="h-3 w-3" />
                    ))}
                </button>
              </div>
            </div>

            {loadingCodes ? (
              <ListSkeleton items={3} />
            ) : restaurantCodes.length === 0 ? (
              <Card className="glass-card border-0">
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
                    let comparison = 0;
                    if (sortBy === "balance") {
                      comparison = (b.balance || 0) - (a.balance || 0);
                    } else {
                      // Sort by recent (last_visit_date)
                      comparison =
                        new Date(b.last_visit_date || 0).getTime() -
                        new Date(a.last_visit_date || 0).getTime();
                    }
                    return sortOrder === "desc" ? comparison : -comparison;
                  })
                  .map((code) => {
                    // Filter transactions for this restaurant
                    const restaurantTransactions = recentTransactions.filter(
                      (t: any) =>
                        t.branches.restaurants.slug === code.restaurant.slug
                    );

                    return (
                      <RestaurantCard
                        key={code.id}
                        restaurant={code}
                        getTimeAgo={getTimeAgo}
                        onShare={handleShare}
                        language={language}
                        transactions={restaurantTransactions}
                        onTransactionClick={(transaction) => {
                          setSelectedTransaction(transaction);
                          setShowTransactionSheet(true);
                        }}
                      />
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
          title={t.dashboardInfo.restaurantInfo.title}
          items={restaurantInfoItems}
        />

        <InfoModal
          isOpen={showCurrencyInfoModal}
          onClose={() => setShowCurrencyInfoModal(false)}
          title={t.dashboardInfo.currencyInfo.title}
          items={currencyInfoItems}
        />

        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          user={user}
          onSaveName={handleSaveName}
          onDeleteAccount={deleteAccount}
          onSignOut={handleSignOut}
          language={language}
          onLanguageChange={setLanguage}
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
    </PullToRefresh>
  );
}
