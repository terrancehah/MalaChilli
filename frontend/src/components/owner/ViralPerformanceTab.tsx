import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Target, Users, TrendingUp, TrendingDown, Link2, Share2 } from 'lucide-react';
import type { DashboardSummary, CustomerSharingStats, SavedCodesPipeline } from '../../types/analytics.types';
import { ViralPerformanceCharts } from './ViralPerformanceCharts';

interface ViralPerformanceTabProps {
  restaurantId: string;
  summary: DashboardSummary | null;
}

export function ViralPerformanceTab({ restaurantId, summary }: ViralPerformanceTabProps) {
  const [loading, setLoading] = useState(true);
  const [topSharers, setTopSharers] = useState<CustomerSharingStats[]>([]);
  const [savedCodesPipeline, setSavedCodesPipeline] = useState<SavedCodesPipeline | null>(null);

  useEffect(() => {
    const fetchViralData = async () => {
      try {
        setLoading(true);

        // Fetch top sharers
        const { data: sharersData } = await supabase
          .from('customer_sharing_stats')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('total_downlines', { ascending: false })
          .limit(10);

        if (sharersData) {
          setTopSharers(sharersData);
        }

        // Fetch saved codes pipeline
        const { data: pipelineData } = await supabase
          .from('saved_codes_pipeline')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .single();

        if (pipelineData) {
          setSavedCodesPipeline(pipelineData);
        }
      } catch (error) {
        console.error('Error fetching viral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchViralData();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const viralMetrics = summary?.viral_performance;
  const viralityCoefficient = viralMetrics?.virality_coefficient || 0;
  const isHealthy = viralityCoefficient >= 2.0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Virality Coefficient */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Virality Coefficient
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${
                viralityCoefficient >= 2 ? 'text-green-600' :
                viralityCoefficient >= 1.5 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {viralityCoefficient.toFixed(2)}
              </span>
              {isHealthy ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isHealthy ? 'Exponential growth!' : 'Target: >2.0 for viral growth'}
            </p>
          </CardContent>
        </Card>

        {/* Network Size */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Network Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-3xl font-bold text-foreground">
                  {viralMetrics?.total_downlines || 0}
                </span>
                <p className="text-xs text-muted-foreground">Total Customers</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="font-semibold text-foreground">{viralMetrics?.total_sharers || 0}</span>
                  <span className="text-muted-foreground ml-1">Sharers</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Depth */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Network Depth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Level 1:</span>
                <span className="font-semibold">{viralMetrics?.network_depth.level_1 || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Level 2:</span>
                <span className="font-semibold">{viralMetrics?.network_depth.level_2 || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Level 3:</span>
                <span className="font-semibold">{viralMetrics?.network_depth.level_3 || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Codes Pipeline */}
      {savedCodesPipeline && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Link2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Saved Codes Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{savedCodesPipeline.total_saved_codes}</p>
                <p className="text-xs text-muted-foreground">Total Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{savedCodesPipeline.unused_codes}</p>
                <p className="text-xs text-muted-foreground">Awaiting Visit</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{savedCodesPipeline.converted_codes}</p>
                <p className="text-xs text-muted-foreground">Converted</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {savedCodesPipeline.conversion_rate != null 
                    ? `${savedCodesPipeline.conversion_rate.toFixed(1)}%`
                    : '0.0%'}
                </p>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Avg time to first visit: <span className="font-semibold">
                {savedCodesPipeline.avg_days_to_first_visit != null 
                  ? `${savedCodesPipeline.avg_days_to_first_visit.toFixed(1)} days`
                  : 'N/A'}
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Visual Charts */}
      <ViralPerformanceCharts 
        savedCodesPipeline={savedCodesPipeline || undefined}
      />

      {/* Top Sharers Leaderboard */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Top Sharers Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {topSharers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No sharing activity yet. Encourage customers to share their referral codes!
            </p>
          ) : (
            <div className="space-y-3">
              {topSharers.map((sharer, index) => (
                <div
                  key={sharer.customer_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-muted text-muted-foreground'}
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{sharer.full_name}</p>
                      <p className="text-xs text-muted-foreground">{sharer.referral_code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{sharer.total_downlines} downlines</p>
                    <p className="text-xs text-muted-foreground">RM {sharer.total_earned.toFixed(2)} earned</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            📊 More viral analytics coming soon: Network visualization, sharing behavior analysis, K-factor tracking
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
