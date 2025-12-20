/**
 * Vitest Test Setup
 * 
 * This file runs before all tests to set up the test environment.
 * It initializes the Supabase client for database function testing.
 */

import { beforeAll, afterAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Test Supabase client - uses environment variables
// For local testing, ensure .env.test exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
export let supabase: SupabaseClient;

beforeAll(() => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials not found. Database tests will be skipped.');
    console.warn('   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.test');
    return;
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized for testing');
});

afterAll(() => {
  // Cleanup if needed
  console.log('🧹 Test cleanup complete');
});
