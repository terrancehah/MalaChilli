/**
 * Test Data Seeding Script
 * 
 * Creates test data for QA edge case testing.
 * Run with: npx tsx tests/seed-test-data.ts
 * 
 * WARNING: Only run this in test/development environments!
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Try both VITE_ prefixed and non-prefixed versions
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
// Use service role key for seeding (bypasses RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  console.error('   Set these in your .env file or export them');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test data IDs (UUIDs for consistency across runs)
export const TEST_IDS = {
  // Restaurant & Branch
  restaurant: '11111111-1111-1111-1111-111111111111',
  branch: '22222222-2222-2222-2222-222222222222',
  
  // Users (customers only - staff/merchant require special handling)
  customer1: '33333333-3333-3333-3333-333333333333',
  customer2: '44444444-4444-4444-4444-444444444444',
  customer3: '55555555-5555-5555-5555-555555555555',
  customerWithVC: '66666666-6666-6666-6666-666666666666',
  customerDeleted: '77777777-7777-7777-7777-777777777777',
  customerUpline: '88888888-8888-8888-8888-888888888888',
  
  // Transactions (skipped - require staff user)
  transaction1: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  transactionVoided: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
};

// Referral codes for test users (max 20 chars due to DB constraint)
export const TEST_CODES = {
  customer1: 'QA-CUST1-TEST',
  customer2: 'QA-CUST2-TEST',
  customer3: 'QA-CUST3-TEST',
  customerWithVC: 'QA-VCUSER-TEST',
  customerDeleted: 'QA-DELETED-TEST',
  customerUpline: 'QA-UPLINE-TEST',
};

async function cleanTestData() {
  console.log('🧹 Cleaning existing test data...');
  
  // Delete in reverse dependency order
  const tables = [
    'audit_logs',
    'virtual_currency_ledger',
    'transaction_items',
    'transactions',
    'customer_restaurant_history',
    'referrals',
    'saved_referral_codes',
    'user_restaurant_referral_codes',
    'users',
    'branches',
    'restaurants',
  ];
  
  for (const table of tables) {
    // Delete records with test IDs
    const testIdValues = Object.values(TEST_IDS);
    
    // Try different ID columns based on table
    const idColumns = ['id', 'user_id', 'customer_id', 'restaurant_id', 'branch_id'];
    
    for (const col of idColumns) {
      try {
        await supabase.from(table).delete().in(col, testIdValues);
      } catch {
        // Column doesn't exist in this table, skip
      }
    }
  }
  
  console.log('✅ Test data cleaned');
}

async function seedRestaurant() {
  console.log('🏪 Creating test restaurant...');
  
  const { error: restError } = await supabase.from('restaurants').upsert({
    id: TEST_IDS.restaurant,
    name: 'QA Test Restaurant',
    slug: 'qa-test-restaurant',
    description: 'Restaurant for QA testing',
    guaranteed_discount_percent: 5.00,
    upline_reward_percent: 1.00,
    max_redemption_percent: 20.00,
    virtual_currency_expiry_days: 30,
    is_active: true,
  });
  
  if (restError) {
    console.error('❌ Failed to create restaurant:', restError.message);
    return false;
  }
  
  const { error: branchError } = await supabase.from('branches').upsert({
    id: TEST_IDS.branch,
    restaurant_id: TEST_IDS.restaurant,
    name: 'QA Main Branch',
    address: '123 Test Street, QA City',
    is_active: true,
  });
  
  if (branchError) {
    console.error('❌ Failed to create branch:', branchError.message);
    return false;
  }
  
  console.log('✅ Restaurant and branch created');
  return true;
}

async function seedUsers() {
  console.log('👥 Creating test users...');
  
  const users = [
    {
      id: TEST_IDS.customer1,
      email: 'test.customer1@qa.makantak.local',
      password_hash: '$2b$10$test_hash_not_real',
      role: 'customer',
      full_name: 'Test Customer One',
      birthday: '1990-01-15',
      referral_code: TEST_CODES.customer1,
      email_verified: true,
      is_deleted: false,
    },
    {
      id: TEST_IDS.customer2,
      email: 'test.customer2@qa.makantak.local',
      password_hash: '$2b$10$test_hash_not_real',
      role: 'customer',
      full_name: 'Test Customer Two',
      birthday: '1985-06-20',
      referral_code: TEST_CODES.customer2,
      email_verified: true,
      is_deleted: false,
    },
    {
      id: TEST_IDS.customer3,
      email: 'test.customer3@qa.makantak.local',
      password_hash: '$2b$10$test_hash_not_real',
      role: 'customer',
      full_name: 'Test Customer Three',
      birthday: '1995-03-10',
      referral_code: TEST_CODES.customer3,
      email_verified: true,
      is_deleted: false,
    },
    {
      id: TEST_IDS.customerWithVC,
      email: 'test.vcuser@qa.makantak.local',
      password_hash: '$2b$10$test_hash_not_real',
      role: 'customer',
      full_name: 'Test VC User',
      birthday: '1988-12-01',
      referral_code: TEST_CODES.customerWithVC,
      email_verified: true,
      is_deleted: false,
    },
    {
      id: TEST_IDS.customerDeleted,
      email: 'deleted_77777777@deleted.local',
      password_hash: '$2b$10$test_hash_not_real',
      role: 'customer',
      full_name: 'Deleted User',
      birthday: null,
      referral_code: TEST_CODES.customerDeleted,
      email_verified: true,
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      deletion_reason: 'Test data - simulated deletion',
    },
    {
      id: TEST_IDS.customerUpline,
      email: 'test.upline@qa.makantak.local',
      password_hash: '$2b$10$test_hash_not_real',
      role: 'customer',
      full_name: 'Test Upline User',
      birthday: '1980-07-25',
      referral_code: TEST_CODES.customerUpline,
      email_verified: true,
      is_deleted: false,
    },
    // Staff and owner users are skipped - they require special handling
    // due to role constraints and foreign key relationships
  ];
  
  for (const user of users) {
    const { error } = await supabase.from('users').upsert(user);
    if (error) {
      console.error(`❌ Failed to create user ${user.email}:`, error.message);
      return false;
    }
  }
  
  console.log(`✅ Created ${users.length} test users`);
  return true;
}

async function seedReferralChain() {
  console.log('🔗 Creating test referral chain...');
  
  // Create a 3-level chain: customerUpline -> customer1 -> customer2
  const referrals = [
    {
      downline_id: TEST_IDS.customer1,
      upline_id: TEST_IDS.customerUpline,
      upline_level: 1,
      restaurant_id: TEST_IDS.restaurant,
    },
    {
      downline_id: TEST_IDS.customer2,
      upline_id: TEST_IDS.customer1,
      upline_level: 1,
      restaurant_id: TEST_IDS.restaurant,
    },
    {
      downline_id: TEST_IDS.customer2,
      upline_id: TEST_IDS.customerUpline,
      upline_level: 2,
      restaurant_id: TEST_IDS.restaurant,
    },
  ];
  
  for (const ref of referrals) {
    const { error } = await supabase.from('referrals').upsert(ref);
    if (error) {
      console.error('❌ Failed to create referral:', error.message);
      return false;
    }
  }
  
  console.log('✅ Referral chain created (3 levels)');
  return true;
}

async function seedVirtualCurrency() {
  console.log('💰 Creating test VC balances...');
  
  // Give customerWithVC some balance
  const vcEntries = [
    {
      user_id: TEST_IDS.customerWithVC,
      restaurant_id: TEST_IDS.restaurant,
      transaction_type: 'earn',
      amount: 50.00,
      balance_after: 50.00,
      related_user_id: TEST_IDS.customer1,
      upline_level: 1,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      notes: 'Test earning - seed data',
    },
    {
      user_id: TEST_IDS.customerWithVC,
      restaurant_id: TEST_IDS.restaurant,
      transaction_type: 'earn',
      amount: 25.00,
      balance_after: 75.00,
      related_user_id: TEST_IDS.customer2,
      upline_level: 1,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Test earning 2 - seed data',
    },
    // Give customerUpline some balance too
    {
      user_id: TEST_IDS.customerUpline,
      restaurant_id: TEST_IDS.restaurant,
      transaction_type: 'earn',
      amount: 30.00,
      balance_after: 30.00,
      related_user_id: TEST_IDS.customer2,
      upline_level: 2,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Test earning - upline seed data',
    },
  ];
  
  for (const entry of vcEntries) {
    const { error } = await supabase.from('virtual_currency_ledger').insert(entry);
    if (error) {
      console.error('❌ Failed to create VC entry:', error.message);
      return false;
    }
  }
  
  console.log('✅ VC balances created (customerWithVC: RM75, customerUpline: RM30)');
  return true;
}

async function seedTransactions() {
  console.log('📝 Creating test transactions...');
  
  // Skip transactions - they require staff_id which needs a staff user
  // The tests will skip transaction-related assertions when no data exists
  console.log('⏭️ Skipping transactions (requires staff user)');
  return true;
}

async function seedCustomerHistory() {
  console.log('📊 Creating customer restaurant history...');
  
  const histories = [
    {
      customer_id: TEST_IDS.customer1,
      restaurant_id: TEST_IDS.restaurant,
      total_visits: 5,
      total_spent: 450.00,
      first_visit_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      last_visit_date: new Date().toISOString(),
    },
    {
      customer_id: TEST_IDS.customer2,
      restaurant_id: TEST_IDS.restaurant,
      total_visits: 2,
      total_spent: 150.00,
      first_visit_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_visit_date: new Date().toISOString(),
    },
    {
      customer_id: TEST_IDS.customerWithVC,
      restaurant_id: TEST_IDS.restaurant,
      total_visits: 3,
      total_spent: 200.00,
      first_visit_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      last_visit_date: new Date().toISOString(),
    },
  ];
  
  for (const history of histories) {
    const { error } = await supabase.from('customer_restaurant_history').upsert(history);
    if (error) {
      console.error('❌ Failed to create history:', error.message);
      return false;
    }
  }
  
  console.log('✅ Customer history created');
  return true;
}

async function main() {
  console.log('🚀 Starting test data seeding...\n');
  console.log(`   Supabase URL: ${supabaseUrl}`);
  console.log('');
  
  // Clean first
  await cleanTestData();
  
  // Seed in dependency order
  const steps = [
    seedRestaurant,
    seedUsers,
    seedReferralChain,
    seedVirtualCurrency,
    seedTransactions,
    seedCustomerHistory,
  ];
  
  for (const step of steps) {
    const success = await step();
    if (!success) {
      console.error('\n❌ Seeding failed. Stopping.');
      process.exit(1);
    }
  }
  
  console.log('\n✅ All test data seeded successfully!');
  console.log('\n📋 Test Data Summary:');
  console.log('   - 1 Restaurant (QA Test Restaurant)');
  console.log('   - 1 Branch (QA Main Branch)');
  console.log('   - 6 Users (customers only)');
  console.log('   - 3 Referral relationships (3-level chain)');
  console.log('   - 3 VC ledger entries (RM75 + RM30 balances)');
  console.log('   - 3 Customer history records');
}

main().catch(console.error);
