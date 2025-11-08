import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Target, Users, TrendingUp, TrendingDown, Link2, Share2 } from 'lucide-react';
import type { DashboardSummary, CustomerSharingStats, SavedCodesPipeline } from '../../types/analytics.types';
import { getTranslation, type Language } from '../../translations';
import { InfoButton } from '../common';

interface ViralPerformanceTabProps {
  restaurantId: string;
  summary: DashboardSummary | null;
  language: Language;
}

export function ViralPerformanceTab({ restaurantId, summary, language }: ViralPerformanceTabProps) {
  const t = getTranslation(language);
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics Cards - Compact Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Virality Coefficient - Hero Metric */}
        <Card className="border-border/50 md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t.ownerDashboard.viralPerformance.viralityCoefficient}</span>
              <InfoButton 
                title={t.ownerDashboard.viralPerformance.viralityCoefficient}
                description={t.ownerDashboard.viralPerformance.viralityCoefficientInfo}
              />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-foreground">
                {viralMetrics?.virality_coefficient.toFixed(2) || '0.00'}
              </p>
              {viralMetrics && viralMetrics.virality_coefficient >= 1 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-orange-600" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {viralMetrics && viralMetrics.virality_coefficient >= 2 
                ? t.ownerDashboard.viralPerformance.exponentialGrowth
                : viralMetrics && viralMetrics.virality_coefficient >= 1
                ? t.ownerDashboard.viralPerformance.steadyGrowth
                : t.ownerDashboard.viralPerformance.belowViralThreshold}
            </p>
          </CardContent>
        </Card>

        {/* Network Stats - Compact */}
        <Card className="border-border/50 md:col-span-2">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Network Size */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t.ownerDashboard.viralPerformance.networkSize}</span>
                  <InfoButton 
                    title={t.ownerDashboard.viralPerformance.networkSize}
                    description={t.ownerDashboard.viralPerformance.networkSizeInfo}
                  />
                </div>
                <p className="text-3xl font-bold text-foreground">{viralMetrics?.total_downlines || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-semibold text-foreground">{viralMetrics?.total_sharers || 0}</span> {t.ownerDashboard.viralPerformance.activeSharersCount}
                </p>
              </div>

              {/* Network Depth */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t.ownerDashboard.viralPerformance.networkDepth}</span>
                  <InfoButton 
                    title={t.ownerDashboard.viralPerformance.networkDepth}
                    description={t.ownerDashboard.viralPerformance.networkDepthInfo}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">L1:</span>
                    <span className="font-semibold">{viralMetrics?.network_depth.level_1 || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">L2:</span>
                    <span className="font-semibold">{viralMetrics?.network_depth.level_2 || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">L3:</span>
                    <span className="font-semibold">{viralMetrics?.network_depth.level_3 || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Codes Pipeline - Combined Stats + Chart */}
      {savedCodesPipeline && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Link2 className="h-4 w-4 sm:h-5 sm:w-5" />
              {t.ownerDashboard.viralPerformance.savedCodesPipeline}
              <InfoButton 
                title={t.ownerDashboard.viralPerformance.savedCodesPipeline}
                description={t.ownerDashboard.viralPerformance.savedCodesPipelineInfo}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Key Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.ownerDashboard.viralPerformance.totalSaved}</span>
                  <span className="text-xl font-bold">{savedCodesPipeline.total_saved_codes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.ownerDashboard.viralPerformance.awaitingVisit}</span>
                  <span className="text-xl font-bold text-orange-600">{savedCodesPipeline.unused_codes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.ownerDashboard.viralPerformance.converted}</span>
                  <span className="text-xl font-bold text-green-600">{savedCodesPipeline.converted_codes}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t.ownerDashboard.viralPerformance.conversionRate}</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {savedCodesPipeline.conversion_rate != null 
                        ? `${savedCodesPipeline.conversion_rate.toFixed(1)}%`
                        : '0.0%'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.ownerDashboard.viralPerformance.avgTime}: {savedCodesPipeline.avg_days_to_first_visit != null 
                      ? `${savedCodesPipeline.avg_days_to_first_visit.toFixed(1)} ${t.ownerDashboard.viralPerformance.days}`
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Mini Bar Chart */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[280px]">
                  <div className="flex items-end justify-around h-32 gap-2">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div 
                        className="w-full bg-chart-1 rounded-t transition-all"
                        style={{ 
                          height: `${(savedCodesPipeline.total_saved_codes / Math.max(savedCodesPipeline.total_saved_codes, 1)) * 100}%`,
                          minHeight: '20px'
                        }}
                      />
                      <span className="text-xs text-muted-foreground">{t.ownerDashboard.viralPerformance.saved}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div 
                        className="w-full bg-orange-500 rounded-t transition-all"
                        style={{ 
                          height: `${(savedCodesPipeline.unused_codes / Math.max(savedCodesPipeline.total_saved_codes, 1)) * 100}%`,
                          minHeight: '20px'
                        }}
                      />
                      <span className="text-xs text-muted-foreground">{t.ownerDashboard.viralPerformance.pending}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div 
                        className="w-full bg-green-500 rounded-t transition-all"
                        style={{ 
                          height: `${(savedCodesPipeline.converted_codes / Math.max(savedCodesPipeline.total_saved_codes, 1)) * 100}%`,
                          minHeight: '20px'
                        }}
                      />
                      <span className="text-xs text-muted-foreground">{t.ownerDashboard.viralPerformance.done}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Sharers Leaderboard */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            {t.ownerDashboard.viralPerformance.topSharers}
            <InfoButton 
              title={t.ownerDashboard.viralPerformance.topSharers}
              description={t.ownerDashboard.viralPerformance.topSharersInfo}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topSharers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t.ownerDashboard.viralPerformance.noSharers}
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
                    <p className="font-bold text-foreground">{sharer.total_downlines} {t.ownerDashboard.viralPerformance.downlines}</p>
                    <p className="text-xs text-muted-foreground">RM {sharer.total_earned.toFixed(2)} {t.ownerDashboard.viralPerformance.earned}</p>
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
            {t.ownerDashboard.viralPerformance.comingSoon}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
