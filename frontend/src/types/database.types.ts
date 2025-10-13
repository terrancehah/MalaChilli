// Database types based on our schema design

export type UserRole = 'customer' | 'staff' | 'owner';

export type TransactionType = 'earn' | 'redeem' | 'expire' | 'adjust';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  nickname: string | null;
  birthday: string | null;
  age: number | null;
  referral_code: string;
  role: UserRole;
  email_verified: boolean;
  email_notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  owner_id: string;
  guaranteed_discount_percentage: number;
  upline_reward_percentage: number;
  max_redemption_percentage: number;
  virtual_currency_expiry_days: number;
  max_upline_levels: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  restaurant_id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  downline_id: string;
  upline_id: string;
  restaurant_id: string;
  level: number;
  created_at: string;
}

export interface SavedReferralCode {
  id: string;
  user_id: string;
  restaurant_id: string;
  referral_code: string;
  upline_user_id: string;
  is_used: boolean;
  used_at: string | null;
  saved_at: string;
}

export interface Transaction {
  id: string;
  customer_id: string;
  restaurant_id: string;
  branch_id: string | null;
  staff_id: string | null;
  bill_amount: number;
  guaranteed_discount_amount: number;
  virtual_currency_redeemed: number;
  final_amount: number;
  receipt_photo_url: string | null;
  is_first_transaction: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VirtualCurrencyLedger {
  id: string;
  user_id: string;
  restaurant_id: string;
  transaction_type: TransactionType;
  amount: number;
  related_transaction_id: string | null;
  source_transaction_id: string | null;
  expires_at: string | null;
  expired_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface CustomerRestaurantHistory {
  customer_id: string;
  restaurant_id: string;
  referral_code_used: string | null;
  first_visit_date: string;
  last_visit_date: string;
  total_visits: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

// View types
export interface CustomerWalletBalance {
  user_id: string;
  restaurant_id: string;
  total_earned: number;
  total_redeemed: number;
  total_expired: number;
  available_balance: number;
}

export interface RestaurantAnalyticsSummary {
  restaurant_id: string;
  total_customers: number;
  total_transactions: number;
  total_revenue: number;
  total_discounts_given: number;
  total_virtual_currency_earned: number;
  total_virtual_currency_redeemed: number;
  average_transaction_amount: number;
  average_downlines_per_customer: number;
}
