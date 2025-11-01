import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { DollarSign, TrendingUp, Percent, PieChart, CreditCard, Award } from 'lucide-react';
import type { DashboardSummary, RevenueAnalytics, UplineRewardsStats, DiscountBreakdown } from '../../types/analytics.types';
import { BusinessMetricsCharts } from './BusinessMetricsCharts';

interface BusinessMetricsTabProps {
  restaurantId: string;
  summary: DashboardSummary | null;
}

export function BusinessMetricsTab({ restaurantId, summary }: BusinessMetricsTabProps) {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueAnalytics[]>([]);
  const [uplineRewards, setUplineRewards] = useState<UplineRewardsStats[]>([]);
  const [discountBreakdown, setDiscountBreakdown] = useState<DiscountBreakdown | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);

        // Fetch revenue analytics (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: revenueData } = await supabase
          .from('revenue_analytics')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: false })
          .limit(30);

        if (revenueData) {
          setRevenueData(revenueData);
        }

        // Fetch upline rewards stats
        const { data: rewardsData } = await supabase
          .from('upline_rewards_stats')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('upline_level', { ascending: true });

        if (rewardsData) {
          setUplineRewards(rewardsData);
        }

        // Fetch discount breakdown
        const { data: discountData } = await supabase
          .from('discount_breakdown')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .single();

        if (discountData) {
          setDiscountBreakdown(discountData);
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const businessMetrics = summary?.business_metrics;
  const totalRevenue = businessMetrics?.total_revenue || 0;
  const netRevenue = businessMetrics?.net_revenue || 0;
  const totalTransactions = businessMetrics?.total_transactions || 0;
  const totalDiscounts = businessMetrics?.total_discounts || 0;
  const avgBillAmount = businessMetrics?.avg_bill_amount || 0;
  const discountPercentage = businessMetrics?.discount_percentage || 0;

  // Calculate ROI (simplified: revenue increase vs discount cost)
  const roi = totalDiscounts > 0 ? ((totalRevenue - totalDiscounts) / totalDiscounts).toFixed(1) : '0';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">
                RM {totalRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
          </CardContent>
        </Card>

        {/* Net Revenue */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Net Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-green-600">
                RM {netRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">
                {((netRevenue / totalRevenue) * 100).toFixed(1)}% of gross
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{totalTransactions}</p>
              <p className="text-xs text-muted-foreground">
                Avg: RM {avgBillAmount.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ROI */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-blue-600">{roi}:1</p>
              <p className="text-xs text-muted-foreground">Revenue vs Discount</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discount Analysis */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Discount Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Total Discounts */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm text-muted-foreground">Total Discounts Given</p>
                <p className="text-2xl font-bold text-foreground">
                  RM {totalDiscounts.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">As % of Revenue</p>
                <p className="text-2xl font-bold text-orange-600">{discountPercentage.toFixed(1)}%</p>
              </div>
            </div>

            {/* Discount Breakdown */}
            {discountBreakdown && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Guaranteed Discount (5%)</p>
                    <p className="text-sm font-bold text-blue-600">
                      {discountBreakdown.guaranteed_percentage.toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    RM {discountBreakdown.guaranteed_discount_total.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">First-time customer discount</p>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">VC Redemptions</p>
                    <p className="text-sm font-bold text-purple-600">
                      {discountBreakdown.vc_percentage.toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    RM {discountBreakdown.vc_redeemed_total.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Virtual currency redeemed</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upline Rewards Distribution */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Upline Rewards Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uplineRewards.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No upline rewards distributed yet.
            </p>
          ) : (
            <div className="space-y-3">
              {uplineRewards.map((reward) => (
                <div
                  key={reward.upline_level}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-semibold text-foreground">Level {reward.upline_level}</p>
                    <p className="text-xs text-muted-foreground">
                      {reward.unique_recipients} recipients • {reward.reward_count} rewards
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">
                      RM {reward.total_rewards_paid.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Avg: RM {reward.avg_reward_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Total */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border-2 border-primary/20">
                <p className="font-bold text-foreground">Total Upline Rewards</p>
                <p className="text-2xl font-bold text-primary">
                  RM {uplineRewards.reduce((sum, r) => sum + r.total_rewards_paid, 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visual Charts */}
      <BusinessMetricsCharts 
        revenueData={revenueData.map(r => ({
          ...r,
          discount_amount: r.gross_revenue - r.net_revenue
        }))}
        discountBreakdown={discountBreakdown ? {
          guaranteed_discount_total: discountBreakdown.guaranteed_discount_total,
          vc_redemption_total: discountBreakdown.vc_redeemed_total,
          guaranteed_percentage: discountBreakdown.guaranteed_percentage,
          vc_percentage: discountBreakdown.vc_percentage
        } : undefined}
      />

      {/* Revenue Trend (Simple Summary) */}
      {revenueData.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Recent Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Last 7 Days</p>
                  <p className="text-xl font-bold text-foreground">
                    RM {revenueData
                      .slice(0, 7)
                      .reduce((sum, d) => sum + d.gross_revenue, 0)
                      .toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last 14 Days</p>
                  <p className="text-xl font-bold text-foreground">
                    RM {revenueData
                      .slice(0, 14)
                      .reduce((sum, d) => sum + d.gross_revenue, 0)
                      .toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last 30 Days</p>
                  <p className="text-xl font-bold text-foreground">
                    RM {revenueData
                      .reduce((sum, d) => sum + d.gross_revenue, 0)
                      .toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coming Soon */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            📈 More business analytics coming soon: Revenue charts, peak hours heatmap, branch comparison, staff performance
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
