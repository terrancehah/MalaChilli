/**
 * Test Helper Utilities
 * 
 * Provides helper functions for database testing including:
 * - Test data creation and cleanup
 * - Common query patterns
 * - Assertion helpers
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create a test Supabase client
export function createTestClient(): SupabaseClient | null {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

// Generate a unique test email to avoid conflicts
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test_${timestamp}_${random}@test.makantak.local`;
}

// Generate a unique referral code for testing
export function generateTestReferralCode(): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TEST-${random}`;
}

// Helper to check if Supabase is configured for testing
export function isSupabaseConfigured(): boolean {
  return !!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY);
}

// Skip test if Supabase is not configured
export function skipIfNoSupabase(testFn: () => void | Promise<void>) {
  if (!isSupabaseConfigured()) {
    console.log('⏭️ Skipping test - Supabase not configured');
    return;
  }
  return testFn();
}
