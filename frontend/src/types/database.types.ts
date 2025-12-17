// Database types based on our schema design

export type UserRole = 'customer' | 'staff' | 'merchant' | 'admin';

export type TransactionType = 'earn' | 'redeem' | 'expire' | 'adjust';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  birthday: string | null; // Date of birth for birthday rewards
  referral_code: string | null; // Customer ID for QR scanning at counter
  role: UserRole;
  branch_id: string | null; // For staff - which branch they work at
  restaurant_id: string | null; // For staff and merchants - which restaurant they belong to
  email_verified: boolean;
  preferred_language: 'en' | 'ms' | 'zh'; // User preferred UI language
  is_deleted: boolean; // Soft-delete flag for PDPA compliance
  deleted_at: string | null; // When user was soft-deleted
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier used in referral links
  description: string | null;
  logo_url: string | null; // Cloud storage URL for restaurant logo
  guaranteed_discount_percent: number; // Discount given on first transaction (default 5%)
  upline_reward_percent: number; // Percentage given to each upline (default 1%)
  max_redemption_percent: number; // Max VC redemption percentage (default 20%)
  virtual_currency_expiry_days: number; // Days until VC expires (default 30)
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  restaurant_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  city: string | null; // Future: city for location filtering
  state: string | null; // Future: state for location filtering
  postal_code: string | null; // Future: postal code for location filtering
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  downline_id: string;
  upline_id: string;
  restaurant_id: string; // Referrals are restaurant-specific
  upline_level: number; // 1=direct, 2=level 2, 3=level 3
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

// Restaurant-specific referral codes generated for sharing (format: MAKANTAK-{slug}-{name})
export interface UserRestaurantReferralCode {
  id: string;
  user_id: string;
  restaurant_id: string;
  referral_code: string; // Format: MAKANTAK-{restaurant_slug}-{customer_name}
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Transaction status for voiding/completing transactions
export type TransactionStatus = 'completed' | 'voided';

export interface Transaction {
  id: string;
  customer_id: string;
  branch_id: string; // Required - links to restaurant via branch
  staff_id: string; // Required - who processed the transaction
  bill_amount: number;
  guaranteed_discount_amount: number;
  virtual_currency_redeemed: number;
  total_discount: number; // Computed: guaranteed_discount + vc_redeemed
  final_amount: number; // Computed: bill_amount - total_discount
  is_first_transaction: boolean;
  receipt_photo_url: string | null;
  ocr_processed: boolean; // Whether OCR has been run on receipt
  ocr_data: Record<string, unknown> | null; // Extracted data from OCR (JSONB)
  transaction_date: string; // When transaction occurred
  status: TransactionStatus; // completed or voided
  created_at: string;
}

export interface VirtualCurrencyLedger {
  id: string;
  user_id: string;
  restaurant_id: string; // Which restaurant this VC belongs to
  transaction_type: TransactionType;
  amount: number; // Positive for earn, negative for redeem/expire
  balance_after: number; // Running balance after this transaction
  related_transaction_id: string | null; // For earn/redeem: the checkout transaction
  related_user_id: string | null; // For earn: the downline who spent
  upline_level: number | null; // For earn: which level upline (1, 2, or 3)
  expires_at: string | null; // For earn: when this earning expires
  expired_at: string | null; // For expire: when expiry was processed
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
}

// Transaction line items extracted from receipts via OCR or manual entry
export type TransactionItemSource = 'ocr' | 'manual' | 'corrected';

export interface TransactionItem {
  id: string;
  transaction_id: string;
  menu_item_id: string | null; // NULL if not matched or custom item
  item_name: string; // Name as it appears on receipt
  matched_name: string | null; // Matched menu item name (if different)
  quantity: number;
  unit_price: number | null;
  total_price: number;
  line_number: number | null; // Order in receipt (1, 2, 3...)
  is_matched: boolean; // Successfully matched to menu_items
  match_confidence: number | null; // Confidence score 0-100 for fuzzy matching
  source: TransactionItemSource; // How item was added: ocr, manual, corrected
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
