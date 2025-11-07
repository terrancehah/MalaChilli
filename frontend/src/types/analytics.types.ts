// Analytics Types for Owner Dashboard
// Date: 2025-11-01

/**
 * Viral Performance Metrics
 */
export interface ViralityMetrics {
  restaurant_id: string;
  total_sharers: number;
  total_downlines: number;
  virality_coefficient: number;
  level_1_downlines: number;
  level_2_downlines: number;
  level_3_downlines: number;
}

export interface CustomerSharingStats {
  customer_id: string;
  full_name: string;
  email: string;
  referral_code: string;
  restaurant_id: string;
  total_downlines: number;
  direct_downlines: number;
  total_earned: number;
  last_referral_date: string | null;
  sharer_category: 'super_sharer' | 'active_sharer' | 'passive_sharer' | 'non_sharer';
}

export interface SavedCodesPipeline {
  restaurant_id: string;
  total_saved_codes: number;
  unused_codes: number;
  converted_codes: number;
  conversion_rate: number;
  avg_days_to_first_visit: number;
}

export interface NetworkGrowthDaily {
  restaurant_id: string;
  date: string;
  new_customers: number;
  active_sharers: number;
}

/**
 * Business Metrics
 */
export interface RevenueAnalytics {
  restaurant_id: string;
  date: string;
  transaction_count: number;
  gross_revenue: number;
  guaranteed_discount_total: number;
  vc_redeemed_total: number;
  total_discount: number;
  net_revenue: number;
  avg_bill_amount: number;
  new_customer_transactions: number;
  discount_percentage: number;
}

export interface UplineRewardsStats {
  restaurant_id: string;
  upline_level: number;
  reward_count: number;
  total_rewards_paid: number;
  avg_reward_amount: number;
  unique_recipients: number;
}

export interface DiscountBreakdown {
  restaurant_id: string;
  guaranteed_discount_total: number;
  vc_redeemed_total: number;
  total_discount: number;
  guaranteed_percentage: number;
  vc_percentage: number;
}

export interface PeakHoursAnalysis {
  restaurant_id: string;
  hour_of_day: number;
  day_of_week: number;
  transaction_count: number;
  total_revenue: number;
  avg_bill_amount: number;
}

/**
 * Customer Insights
 */
export interface CustomerSegmentation {
  customer_id: string;
  full_name: string;
  email: string;
  referral_code: string;
  restaurant_id: string;
  total_visits: number;
  total_spent: number;
  first_visit_date: string;
  last_visit_date: string;
  days_since_last_visit: number;
  current_balance: number;
  total_downlines: number;
  total_earned: number;
  recency_score: number;
  frequency_score: number;
  monetary_score: number;
  rfm_segment: 'Champions' | 'Loyal Customers' | 'Potential Loyalists' | 'At Risk' | 'Cant Lose Them' | 'Hibernating' | 'New Customers' | 'Promising';
}

export interface CustomerAcquisitionSource {
  restaurant_id: string;
  customer_id: string;
  full_name: string;
  first_visit_date: string;
  acquisition_source: 'referral' | 'walk_in';
  lifetime_value: number;
}

export interface CohortRetention {
  restaurant_id: string;
  cohort_month: string;
  activity_month: string;
  months_since_first_visit: number;
  active_customers: number;
}

export interface CustomerLifetimeValue {
  customer_id: string;
  full_name: string;
  restaurant_id: string;
  actual_clv: number;
  total_visits: number;
  avg_order_value: number;
  avg_days_between_visits: number;
  predicted_clv: number;
}

/**
 * Dashboard Summary
 */
export interface DashboardSummary {
  viral_performance: {
    virality_coefficient: number;
    total_sharers: number;
    total_downlines: number;
    network_depth: {
      level_1: number;
      level_2: number;
      level_3: number;
    };
  };
  business_metrics: {
    total_revenue: number;
    net_revenue: number;
    total_transactions: number;
    total_discounts: number;
    avg_bill_amount: number;
    discount_percentage: number;
  };
  customer_insights: {
    total_customers: number;
    active_customers: number;
    at_risk_customers: number;
    avg_lifetime_value: number;
    rfm_segmentation: {
      Champions: number;
      'Loyal Customers': number;
      'Potential Loyalists': number;
      'At Risk': number;
      'Cant Lose Them': number;
      Hibernating: number;
      'New Customers': number;
      Promising: number;
    };
  };
}

/**
 * Top Sharers
 */
export interface TopSharer {
  customer_id: string;
  full_name: string;
  referral_code: string;
  total_downlines: number;
  total_earned: number;
  sharer_category: string;
  network_value: number;
}

/**
 * Date Range Filter
 */
export type DateRangePreset = 'today' | '7d' | '30d' | '90d' | 'all' | 'custom';

export interface DateRange {
  start_date: Date;
  end_date: Date;
  preset: DateRangePreset;
}

/**
 * Chart Data Types
 */
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MultiSeriesChartData {
  date: string;
  [key: string]: string | number;
}

/**
 * Export Options
 */
export type ExportFormat = 'csv' | 'excel' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  date_range: DateRange;
  include_charts: boolean;
  sections: ('viral' | 'business' | 'customers')[];
}

/**
 * AI Insights
 */
export interface AIInsight {
  id: string;
  type: 'recommendation' | 'alert' | 'prediction' | 'anomaly';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: string;
  data?: any;
  created_at: string;
}

export interface AIQuery {
  query: string;
  context: 'viral' | 'business' | 'customers' | 'general';
}

export interface AIResponse {
  answer: string;
  data?: any;
  visualizations?: {
    type: 'chart' | 'table' | 'metric';
    config: any;
  }[];
  follow_up_questions?: string[];
}
