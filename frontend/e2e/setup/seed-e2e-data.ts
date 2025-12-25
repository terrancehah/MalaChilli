/**
 * E2E Test Data Seeding Script
 * 
 * Populates the e2e.customer@makantak.test account with realistic data:
 * - Restaurant visits
 * - Spending history
 * - Virtual currency balance
 * - Referral codes
 * 
 * Run with: npx tsx e2e/setup/seed-e2e-data.ts
 * 
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Set these in your .env file');
  process.exit(1);
}

// Create admin client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// E2E Test User Email
const E2E_CUSTOMER_EMAIL = 'e2e.customer@makantak.test';

async function getE2ECustomerId(): Promise<string | null> {
  // First check users table
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', E2E_CUSTOMER_EMAIL)
    .single();

  if (error || !user) {
    console.error('❌ E2E customer not found. Run create-e2e-user.ts first.');
    return null;
  }

  return user.id;
}

async function getOrCreateTestRestaurant(): Promise<{ restaurantId: string; branchId: string } | null> {
  // Check if test restaurant exists
  const { data: existing } = await supabase
    .from('restaurants')
    .select('id')
    .eq('slug', 'e2e-test-restaurant')
    .single();

  if (existing) {
    // Get branch
    const { data: branch } = await supabase
      .from('branches')
      .select('id')
      .eq('restaurant_id', existing.id)
      .single();

    return { restaurantId: existing.id, branchId: branch?.id || '' };
  }

  // Create test restaurant
  console.log('   Creating E2E test restaurant...');
  
  const { data: restaurant, error: restError } = await supabase
    .from('restaurants')
    .insert({
      name: 'E2E Test Restaurant',
      slug: 'e2e-test-restaurant',
      description: 'Restaurant for E2E testing',
      guaranteed_discount_percent: 5.00,
      upline_reward_percent: 1.00,
      max_redemption_percent: 20.00,
      virtual_currency_expiry_days: 30,
      is_active: true,
    })
    .select('id')
    .single();

  if (restError || !restaurant) {
    console.error('❌ Failed to create restaurant:', restError?.message);
    return null;
  }

  // Create branch
  const { data: branch, error: branchError } = await supabase
    .from('branches')
    .insert({
      restaurant_id: restaurant.id,
      name: 'E2E Main Branch',
      address: '123 E2E Test Street, Kuala Lumpur',
      is_active: true,
    })
    .select('id')
    .single();

  if (branchError || !branch) {
    console.error('❌ Failed to create branch:', branchError?.message);
    return null;
  }

  return { restaurantId: restaurant.id, branchId: branch.id };
}

async function seedCustomerReferralCode(customerId: string, restaurantId: string): Promise<boolean> {
  console.log('   Creating restaurant referral code...');

  // Check if already exists
  const { data: existing } = await supabase
    .from('user_restaurant_referral_codes')
    .select('id')
    .eq('user_id', customerId)
    .eq('restaurant_id', restaurantId)
    .single();

  if (existing) {
    console.log('   ℹ️  Referral code already exists');
    return true;
  }

  const { error } = await supabase
    .from('user_restaurant_referral_codes')
    .insert({
      user_id: customerId,
      restaurant_id: restaurantId,
      referral_code: 'MAKANTAK-E2E-TEST-CUSTOMER',
      is_active: true,
    });

  if (error) {
    console.error('❌ Failed to create referral code:', error.message);
    return false;
  }

  return true;
}

async function seedCustomerHistory(customerId: string, restaurantId: string): Promise<boolean> {
  console.log('   Creating customer restaurant history...');

  // Check if already exists
  const { data: existing } = await supabase
    .from('customer_restaurant_history')
    .select('customer_id')
    .eq('customer_id', customerId)
    .eq('restaurant_id', restaurantId)
    .single();

  if (existing) {
    // Update existing record
    const { error } = await supabase
      .from('customer_restaurant_history')
      .update({
        total_visits: 8,
        total_spent: 650.00,
        last_visit_date: new Date().toISOString(),
      })
      .eq('customer_id', customerId)
      .eq('restaurant_id', restaurantId);

    if (error) {
      console.error('❌ Failed to update history:', error.message);
      return false;
    }
    console.log('   ℹ️  Updated existing history');
    return true;
  }

  const { error } = await supabase
    .from('customer_restaurant_history')
    .insert({
      customer_id: customerId,
      restaurant_id: restaurantId,
      total_visits: 8,
      total_spent: 650.00,
      first_visit_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
      last_visit_date: new Date().toISOString(),
    });

  if (error) {
    console.error('❌ Failed to create history:', error.message);
    return false;
  }

  return true;
}

async function seedVirtualCurrency(customerId: string, restaurantId: string): Promise<boolean> {
  console.log('   Creating virtual currency balance...');

  // Check current balance
  const { data: existingEntries } = await supabase
    .from('virtual_currency_ledger')
    .select('amount')
    .eq('user_id', customerId)
    .eq('restaurant_id', restaurantId);

  const currentBalance = existingEntries?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

  if (currentBalance >= 25) {
    console.log(`   ℹ️  VC balance already exists: RM${currentBalance.toFixed(2)}`);
    return true;
  }

  // Add VC earnings to reach ~RM 35 balance
  const vcEntries = [
    {
      user_id: customerId,
      restaurant_id: restaurantId,
      transaction_type: 'earn',
      amount: 15.00,
      balance_after: 15.00,
      upline_level: 1,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'E2E Test - Referral earning from downline visit',
    },
    {
      user_id: customerId,
      restaurant_id: restaurantId,
      transaction_type: 'earn',
      amount: 12.50,
      balance_after: 27.50,
      upline_level: 1,
      expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'E2E Test - Referral earning from another downline',
    },
    {
      user_id: customerId,
      restaurant_id: restaurantId,
      transaction_type: 'earn',
      amount: 8.00,
      balance_after: 35.50,
      upline_level: 2,
      expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'E2E Test - Level 2 referral earning',
    },
  ];

  for (const entry of vcEntries) {
    const { error } = await supabase.from('virtual_currency_ledger').insert(entry);
    if (error) {
      console.error('❌ Failed to create VC entry:', error.message);
      return false;
    }
  }

  console.log('   ✅ Added RM 35.50 to VC balance');
  return true;
}

async function seedTransactions(customerId: string, restaurantId: string, branchId: string): Promise<boolean> {
  console.log('   Creating transaction history...');

  // Check if transactions already exist
  const { data: existing } = await supabase
    .from('transactions')
    .select('id')
    .eq('customer_id', customerId)
    .limit(1);

  if (existing && existing.length > 0) {
    console.log('   ℹ️  Transactions already exist');
    return true;
  }

  // We need a staff user to create transactions
  // Check if there's any staff user we can use
  const { data: staffUser } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'staff')
    .limit(1)
    .single();

  if (!staffUser) {
    console.log('   ⏭️  Skipping transactions (no staff user available)');
    return true;
  }

  // Create sample transactions
  const transactions = [
    {
      customer_id: customerId,
      branch_id: branchId,
      staff_id: staffUser.id,
      bill_amount: 85.00,
      guaranteed_discount_amount: 4.25,
      virtual_currency_redeemed: 0,
      is_first_transaction: true,
      status: 'completed',
      created_at: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customer_id: customerId,
      branch_id: branchId,
      staff_id: staffUser.id,
      bill_amount: 120.00,
      guaranteed_discount_amount: 6.00,
      virtual_currency_redeemed: 10.00,
      is_first_transaction: false,
      status: 'completed',
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customer_id: customerId,
      branch_id: branchId,
      staff_id: staffUser.id,
      bill_amount: 95.50,
      guaranteed_discount_amount: 4.78,
      virtual_currency_redeemed: 0,
      is_first_transaction: false,
      status: 'completed',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customer_id: customerId,
      branch_id: branchId,
      staff_id: staffUser.id,
      bill_amount: 150.00,
      guaranteed_discount_amount: 7.50,
      virtual_currency_redeemed: 15.00,
      is_first_transaction: false,
      status: 'completed',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customer_id: customerId,
      branch_id: branchId,
      staff_id: staffUser.id,
      bill_amount: 200.00,
      guaranteed_discount_amount: 10.00,
      virtual_currency_redeemed: 0,
      is_first_transaction: false,
      status: 'completed',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (const txn of transactions) {
    const { error } = await supabase.from('transactions').insert(txn);
    if (error) {
      console.error('❌ Failed to create transaction:', error.message);
      // Continue anyway - transactions are optional
    }
  }

  console.log('   ✅ Created 5 sample transactions');
  return true;
}

async function main() {
  console.log('🚀 E2E Test Data Seeding');
  console.log('========================\n');

  // Step 1: Get E2E customer ID
  console.log('1️⃣ Finding E2E customer...');
  const customerId = await getE2ECustomerId();
  if (!customerId) {
    process.exit(1);
  }
  console.log(`   ✅ Found customer: ${customerId}\n`);

  // Step 2: Get or create test restaurant
  console.log('2️⃣ Setting up test restaurant...');
  const restaurant = await getOrCreateTestRestaurant();
  if (!restaurant) {
    process.exit(1);
  }
  console.log(`   ✅ Restaurant ready: ${restaurant.restaurantId}\n`);

  // Step 3: Create referral code for customer at this restaurant
  console.log('3️⃣ Setting up referral code...');
  await seedCustomerReferralCode(customerId, restaurant.restaurantId);
  console.log('');

  // Step 4: Create customer history
  console.log('4️⃣ Setting up visit history...');
  await seedCustomerHistory(customerId, restaurant.restaurantId);
  console.log('');

  // Step 5: Create VC balance
  console.log('5️⃣ Setting up virtual currency...');
  await seedVirtualCurrency(customerId, restaurant.restaurantId);
  console.log('');

  // Step 6: Create transactions
  console.log('6️⃣ Setting up transactions...');
  await seedTransactions(customerId, restaurant.restaurantId, restaurant.branchId);
  console.log('');

  console.log('✅ E2E data seeding complete!');
  console.log('\n📋 Summary for e2e.customer@makantak.test:');
  console.log('   - Restaurant: E2E Test Restaurant');
  console.log('   - Referral Code: MAKANTAK-E2E-TEST-CUSTOMER');
  console.log('   - Total Visits: 8');
  console.log('   - Total Spent: RM 650.00');
  console.log('   - VC Balance: ~RM 35.50');
  console.log('   - Transactions: 5 (if staff user exists)');
}

main().catch(console.error);
