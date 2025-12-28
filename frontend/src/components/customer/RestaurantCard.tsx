import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Share2, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { getTranslation } from "../../translations";
import type { Language } from "../../translations";

interface Restaurant {
  id: string;
  restaurant_id: string;
  restaurant: {
    name: string;
    slug: string;
  };
  referral_code: string;
  total_visits?: number;
  first_visit_date?: string;
  last_visit_date?: string;
  total_spent?: number;
  // Virtual currency fields (restaurant-specific)
  balance?: number;
  earned?: number;
  redeemed?: number;
}

interface Transaction {
  id: string;
  bill_amount: number;
  created_at: string;
  guaranteed_discount_amount: number;
  virtual_currency_redeemed: number;
  vc_earned: number;
  is_first_transaction: boolean;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  getTimeAgo: (date: string) => string;
  onShare: (
    name: string,
    slug: string,
    code: string,
    balance: number,
    totalSpent: number
  ) => void;
  language?: Language;
  transactions?: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

export function RestaurantCard({
  restaurant,
  getTimeAgo,
  onShare,
  language = "en",
  transactions = [],
  onTransactionClick,
}: RestaurantCardProps) {
  const t = getTranslation(language);
  const [showTransactions, setShowTransactions] = useState(false);

  // Default values for VC fields
  const balance = restaurant.balance ?? 0;
  const totalSpent = restaurant.total_spent ?? 0;

  // Calculate total unrealized earnings from all transactions at this restaurant
  const totalUnrealizedEarnings = transactions.reduce((sum, transaction) => {
    const hasEarnings = transaction.vc_earned > 0;
    if (!hasEarnings) {
      const potentialEarningPerLevel = transaction.bill_amount * 0.01;
      const totalPotentialEarning = potentialEarningPerLevel * 3; // 3 levels
      return sum + totalPotentialEarning;
    }
    return sum;
  }, 0);

  return (
    <Card
      variant="default"
      className="hover:shadow-lg transition-all duration-300"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">
              {restaurant.restaurant.name}
            </h3>
            {restaurant.total_visits && restaurant.last_visit_date && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {restaurant.total_visits}{" "}
                {restaurant.total_visits === 1
                  ? t.restaurantCard.visit
                  : t.restaurantCard.visits}{" "}
                • Last: {getTimeAgo(restaurant.last_visit_date)}
              </p>
            )}
          </div>
          <Badge
            variant="outline"
            className="bg-green-200 text-green-800 dark:bg-green-800/40 dark:text-green-300 border-0"
          >
            {t.restaurantCard.active}
          </Badge>
        </div>

        {/* Restaurant VC Balance - Compact Design */}
        <div className="bg-primary/5 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground leading-tight">
                {t.restaurantCard.vcBalance}
              </p>
              <p className="text-xl font-bold text-foreground leading-tight">
                {formatCurrency(balance)}
              </p>
            </div>
            {/* Unrealized Earnings - FOMO Badge */}
            {totalUnrealizedEarnings > 0 && (
              <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-md px-2 py-1">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-tight">
                  💰 {t.restaurantCard.earnUpTo}
                </p>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-300 leading-tight">
                  {formatCurrency(totalUnrealizedEarnings)}
                </p>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={() =>
            onShare(
              restaurant.restaurant.name,
              restaurant.restaurant.slug,
              restaurant.referral_code,
              balance,
              totalSpent
            )
          }
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {t.restaurantCard.share}
        </Button>

        {/* Expandable Transactions Section */}
        {transactions.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowTransactions(!showTransactions)}
              className="w-full flex items-center justify-between text-xs text-muted-foreground active:text-foreground active:bg-muted/30 rounded-md transition-colors py-2 px-2 -mx-2"
            >
              <span>
                {t.restaurantCard.recentActivity} ({transactions.length})
              </span>
              {showTransactions ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showTransactions && (
              <div className="space-y-2 mt-2">
                {transactions.map((transaction) => {
                  const potentialEarningPerLevel =
                    transaction.bill_amount * 0.01;
                  const totalPotentialEarning = potentialEarningPerLevel * 3;
                  const hasEarnings = transaction.vc_earned > 0;

                  return (
                    <div
                      key={transaction.id}
                      onClick={() => onTransactionClick?.(transaction)}
                      className="bg-muted/30 rounded-lg border border-border/30 p-3 cursor-pointer active:bg-muted/50 active:scale-[0.98] transition-all relative"
                    >
                      {/* Transaction Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">
                            {(() => {
                              const date = new Date(transaction.created_at);
                              const malaysiaTime = new Date(
                                date.getTime() + 8 * 60 * 60 * 1000
                              );
                              return malaysiaTime.toLocaleString("en-MY", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                            })()}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              RM {transaction.bill_amount}
                            </p>
                            {transaction.is_first_transaction && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                {t.recentTransactions.firstVisit}
                              </p>
                            )}
                          </div>
                          {/* Tap indicator */}
                          <ChevronDown className="h-4 w-4 text-muted-foreground rotate-[-90deg]" />
                        </div>
                      </div>

                      {/* Transaction Summary */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        {transaction.guaranteed_discount_amount > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="text-green-600 dark:text-green-400">
                              -RM {transaction.guaranteed_discount_amount}
                            </span>
                            <span>{t.recentTransactions.discount}</span>
                          </span>
                        )}
                        {transaction.virtual_currency_redeemed > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="text-primary">
                              -RM {transaction.virtual_currency_redeemed}
                            </span>
                            <span>{t.recentTransactions.vcUsed}</span>
                          </span>
                        )}
                        {hasEarnings && (
                          <span className="flex items-center gap-1">
                            <span className="text-green-600 dark:text-green-400">
                              +RM {transaction.vc_earned.toFixed(2)}
                            </span>
                            <span>{t.recentTransactions.vcEarned}</span>
                          </span>
                        )}
                      </div>

                      {/* Unrealized Earnings - Highlighted FOMO */}
                      {!hasEarnings && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-md p-2.5 border border-amber-300 dark:border-amber-700 mt-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                                💰 {t.recentTransactions.unrealized}
                              </p>
                              <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                                RM {totalPotentialEarning.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-xs text-amber-700 dark:text-amber-500 text-right max-w-[120px]">
                              {t.recentTransactions.unrealizedDesc}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Tap to view indicator */}
                      <div className="mt-2 pt-2 border-t border-border/30">
                        <p className="text-xs text-primary font-medium text-center">
                          {t.recentTransactions.tapToView} →
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
