/**
 * Transaction API service.
 * Centralizes all transaction-related Supabase operations.
 */

import { supabase } from '../../lib/supabase';

/**
 * Fetch recent transactions for a customer.
 */
export async function fetchCustomerTransactions(
  customerId: string,
  limit: number = 10
) {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
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
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Fetch transactions for a specific branch with date filtering.
 */
export async function fetchBranchTransactions(
  branchId: string,
  startDate?: Date
) {
  let query = supabase
    .from('transactions')
    .select(`
      id,
      created_at,
      bill_amount,
      guaranteed_discount_amount,
      virtual_currency_redeemed,
      customer:users!transactions_customer_id_fkey (
        full_name,
        email
      )
    `)
    .eq('branch_id', branchId);

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  // Transform data: Supabase returns customer as array, extract first element
  return (data || []).map((transaction: any) => ({
    ...transaction,
    customer: Array.isArray(transaction.customer)
      ? transaction.customer[0] || null
      : transaction.customer,
  }));
}

/**
 * Fetch virtual currency earned from a specific transaction.
 */
export async function fetchVCEarnedFromTransaction(
  userId: string,
  transactionId: string
): Promise<number> {
  const { data, error } = await supabase
    .from('virtual_currency_ledger')
    .select('amount')
    .eq('user_id', userId)
    .eq('related_transaction_id', transactionId)
    .eq('transaction_type', 'earn');

  if (error) throw error;

  return (data || []).reduce((sum, vc) => sum + parseFloat(vc.amount), 0);
}

/**
 * Create a new transaction.
 */
export async function createTransaction(transactionData: {
  customer_id: string;
  branch_id: string;
  bill_amount: number;
  guaranteed_discount_amount: number;
  virtual_currency_redeemed: number;
  is_first_transaction: boolean;
}) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionData)
    .select()
    .single();

  if (error) throw error;
  return data;
}
