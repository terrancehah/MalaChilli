/**
 * Customer API service.
 * Centralizes all customer-related Supabase operations.
 */

import { supabase } from '../../lib/supabase';

/**
 * Fetch visited restaurants for a customer with visit history.
 */
export async function fetchVisitedRestaurants(customerId: string) {
  const { data, error } = await supabase
    .from('customer_restaurant_history')
    .select(`
      restaurant_id,
      first_visit_date,
      last_visit_date,
      total_visits,
      total_spent,
      restaurants (name, slug)
    `)
    .eq('customer_id', customerId);

  if (error) throw error;
  return data;
}

/**
 * Fetch restaurant-specific virtual currency balances for a customer.
 */
export async function fetchWalletBalancesByRestaurant(userId: string) {
  const { data, error } = await supabase
    .from('customer_wallet_balance_by_restaurant')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

/**
 * Fetch total wallet balance for a customer at a specific restaurant.
 */
export async function fetchWalletBalance(
  userId: string,
  restaurantId: string
) {
  const { data, error } = await supabase
    .from('customer_wallet_balance')
    .select('available_balance')
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch customer referral codes for all restaurants.
 */
export async function fetchCustomerReferralCodes(userId: string) {
  const { data, error } = await supabase
    .from('user_restaurant_referral_codes')
    .select(`
      id,
      restaurant_id,
      referral_code,
      restaurants (name, slug)
    `)
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) throw error;
  return data;
}

/**
 * Fetch customer referral count (unique downlines).
 */
export async function fetchReferralCount(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('referrals')
    .select('downline_id')
    .eq('upline_id', userId);

  if (error) throw error;

  // Count unique downlines
  const uniqueReferrals = new Set((data || []).map((r) => r.downline_id)).size;
  return uniqueReferrals;
}

/**
 * Fetch customer by user ID.
 */
export async function fetchCustomerById(customerId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, referral_code, birthday')
    .eq('id', customerId)
    .eq('role', 'customer')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Check if customer has visited a restaurant before.
 */
export async function checkFirstVisit(
  customerId: string,
  restaurantId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('customer_restaurant_history')
    .select('total_visits')
    .eq('customer_id', customerId)
    .eq('restaurant_id', restaurantId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "no rows returned", which means first visit
    throw error;
  }

  return !data || data.total_visits === 0;
}

/**
 * Validate a referral code for a specific restaurant.
 */
export async function validateReferralCode(
  referralCode: string,
  restaurantId: string
) {
  const { data, error } = await supabase.rpc('validate_referral_code', {
    p_referral_code: referralCode,
    p_restaurant_id: restaurantId,
  });

  if (error) throw error;
  return data;
}

/**
 * Save a referral code for later use.
 */
export async function saveReferralCode(
  userId: string,
  restaurantId: string,
  referralCode: string,
  uplineUserId: string
) {
  const { error } = await supabase.from('saved_referral_codes').insert({
    user_id: userId,
    restaurant_id: restaurantId,
    referral_code: referralCode,
    upline_user_id: uplineUserId,
    is_used: false,
  });

  if (error) throw error;
}
