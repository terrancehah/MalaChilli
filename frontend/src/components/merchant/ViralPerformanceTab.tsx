import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Target,
  Users,
  TrendingUp,
  TrendingDown,
  Share2,
} from "lucide-react";
import type {
  DashboardSummary,
  CustomerSharingStats,
  SavedCodesPipeline,
} from "../../types/analytics.types";
import { getTranslation, type Language } from "../../translations";
import { InfoButton } from "../shared";

import { ViralPerformanceCharts } from './ViralPerformanceCharts';

interface ViralPerformanceTabProps {
  restaurantId: string;
  summary: DashboardSummary | null;
  language: Language;
}

export function ViralPerformanceTab({
  restaurantId,
  summary,
  language,
}: ViralPerformanceTabProps) {
  const t = getTranslation(language);
  const [loading, setLoading] = useState(true);
  const [topSharers, setTopSharers] = useState<CustomerSharingStats[]>([]);
  const [savedCodesPipeline, setSavedCodesPipeline] =
    useState<SavedCodesPipeline | null>(null);

  useEffect(() => {
    const fetchViralData = async () => {
      try {
        setLoading(true);

        // Fetch top sharers
        const { data: sharersData } = await supabase
          .from("customer_sharing_stats")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("total_downlines", { ascending: false })
          .limit(10);

        if (sharersData) {
          setTopSharers(sharersData);
        }

        // Fetch saved codes pipeline
        const { data: pipelineData } = await supabase
          .from("saved_codes_pipeline")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .single();

        if (pipelineData) {
          setSavedCodesPipeline(pipelineData);
        }
      } catch (error) {
        console.error("Error fetching viral data:", error);
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
              <span className="text-sm font-medium text-muted-foreground">
                {t.merchantDashboard.viralPerformance.viralityCoefficient}
              </span>
              <InfoButton
                title={t.merchantDashboard.viralPerformance.viralityCoefficient}
                description={
                  t.merchantDashboard.viralPerformance.viralityCoefficientInfo
                }
              />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {viralMetrics?.virality_coefficient.toFixed(2) || "0.00"}
              </p>
              {viralMetrics && viralMetrics.virality_coefficient >= 1 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-orange-600" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {viralMetrics && viralMetrics.virality_coefficient >= 2
                ? t.merchantDashboard.viralPerformance.exponentialGrowth
                : viralMetrics && viralMetrics.virality_coefficient >= 1
                ? t.merchantDashboard.viralPerformance.steadyGrowth
                : t.merchantDashboard.viralPerformance.belowViralThreshold}
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
                  <span className="text-sm font-medium text-muted-foreground">
                    {t.merchantDashboard.viralPerformance.networkSize}
                  </span>
                  <InfoButton
                    title={t.merchantDashboard.viralPerformance.networkSize}
                    description={
                      t.merchantDashboard.viralPerformance.networkSizeInfo
                    }
                  />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {viralMetrics?.total_downlines || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-semibold text-foreground">
                    {viralMetrics?.total_sharers || 0}
                  </span>{" "}
                  {t.merchantDashboard.viralPerformance.activeSharersCount}
                </p>
              </div>

              {/* Network Depth */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {t.merchantDashboard.viralPerformance.networkDepth}
                  </span>
                  <InfoButton
                    title={t.merchantDashboard.viralPerformance.networkDepth}
                    description={
                      t.merchantDashboard.viralPerformance.networkDepthInfo
                    }
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">L1:</span>
                    <span className="font-semibold">
                      {viralMetrics?.network_depth.level_1 || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">L2:</span>
                    <span className="font-semibold">
                      {viralMetrics?.network_depth.level_2 || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">L3:</span>
                    <span className="font-semibold">
                      {viralMetrics?.network_depth.level_3 || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <ViralPerformanceCharts
        savedCodesPipeline={savedCodesPipeline || undefined}
        networkGrowthData={[]} // TODO: Add network growth data from summary
        language={language}
      />

      {/* Top Sharers Leaderboard */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            {t.merchantDashboard.viralPerformance.topSharers}
            <InfoButton
              title={t.merchantDashboard.viralPerformance.topSharers}
              description={t.merchantDashboard.viralPerformance.topSharersInfo}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topSharers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t.merchantDashboard.viralPerformance.noSharers}
            </p>
          ) : (
            <div className="space-y-3">
              {topSharers.map((sharer, index) => (
                <div
                  key={sharer.customer_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                          ? "bg-gray-100 text-gray-700"
                          : index === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-muted text-muted-foreground"
                      }
                    `}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {sharer.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sharer.referral_code}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      {sharer.total_downlines}{" "}
                      {t.merchantDashboard.viralPerformance.downlines}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      RM {sharer.total_earned.toFixed(2)}{" "}
                      {t.merchantDashboard.viralPerformance.earned}
                    </p>
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
            {t.merchantDashboard.viralPerformance.comingSoon}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
