/**
 * E2E Test User Creation Script
 * 
 * Creates a dedicated test user in Supabase Auth and users table.
 * Run with: npx tsx e2e/setup/create-e2e-user.ts
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

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// E2E Test User Credentials - exported for use in tests
export const E2E_TEST_USER = {
  email: 'e2e.customer@makantak.test',
  password: 'E2ETestPassword123!',
  name: 'E2E Test Customer',
  birthday: '1990-01-15',
  role: 'customer' as const,
};

export const E2E_TEST_STAFF = {
  email: 'e2e.staff@makantak.test',
  password: 'E2ETestPassword123!',
  name: 'E2E Test Staff',
  birthday: '1985-06-20',
  role: 'staff' as const,
};

type E2EUserConfig = {
  email: string;
  password: string;
  name: string;
  birthday: string;
  role: 'customer' | 'staff' | 'merchant' | 'admin';
};

async function createE2EUser(userConfig: E2EUserConfig) {
  console.log(`\n👤 Creating E2E user: ${userConfig.email}`);

  // Step 1: Check if user already exists in Auth
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const existingAuthUser = existingUsers?.users?.find(u => u.email === userConfig.email);

  let userId: string;

  if (existingAuthUser) {
    console.log(`   ℹ️  Auth user already exists: ${existingAuthUser.id}`);
    userId = existingAuthUser.id;
  } else {
    // Step 2: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userConfig.email,
      password: userConfig.password,
      email_confirm: true, // Auto-confirm email for testing
      user_metadata: {
        full_name: userConfig.name,
      },
    });

    if (authError) {
      console.error(`   ❌ Failed to create auth user: ${authError.message}`);
      throw authError;
    }

    userId = authData.user.id;
    console.log(`   ✅ Auth user created: ${userId}`);
  }

  // Step 3: Check if profile exists in users table
  const { data: existingProfile } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (existingProfile) {
    console.log(`   ℹ️  User profile already exists`);
  } else {
    // Step 4: Create user profile in users table
    const { error: profileError } = await supabaseAdmin.from('users').insert({
      id: userId,
      email: userConfig.email,
      full_name: userConfig.name,
      birthday: userConfig.birthday,
      role: userConfig.role,
      referral_code: `E2E-${userConfig.role.toUpperCase()}`,
      is_deleted: false,
    });

    if (profileError) {
      console.error(`   ❌ Failed to create user profile: ${profileError.message}`);
      throw profileError;
    }

    console.log(`   ✅ User profile created`);
  }

  return userId;
}

async function main() {
  console.log('🚀 E2E Test User Setup');
  console.log('========================');

  try {
    // Create customer user
    await createE2EUser(E2E_TEST_USER);

    // Create staff user (for checkout tests)
    await createE2EUser(E2E_TEST_STAFF);

    console.log('\n✅ E2E users ready!');
    console.log('\n📋 Test Credentials:');
    console.log(`   Customer: ${E2E_TEST_USER.email} / ${E2E_TEST_USER.password}`);
    console.log(`   Staff:    ${E2E_TEST_STAFF.email} / ${E2E_TEST_STAFF.password}`);

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
