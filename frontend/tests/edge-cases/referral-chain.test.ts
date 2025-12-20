/**
 * Referral Chain Edge Case Tests
 * 
 * Tests for edge cases related to referral chain creation:
 * - EC-AUTH-001: Self-Referral Attempt
 * - EC-AUTH-002: Invalid Referral Code
 * - EC-AUTH-003: Referral Code from Deleted User
 * - EC-REF-001: Duplicate Referral Chain at Same Restaurant
 * - EC-REF-002: Partial Upline Chain (Level 2/3 Missing)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createTestClient, isSupabaseConfigured } from '../utils/test-helpers';
import type { SupabaseClient } from '@supabase/supabase-js';

describe('Referral Chain Edge Cases', () => {
  let supabase: SupabaseClient | null;

  beforeAll(() => {
    supabase = createTestClient();
  });

  // EC-AUTH-001: Self-Referral Attempt
  describe('EC-AUTH-001: Self-Referral Attempt', () => {
    it('should reject when user tries to use their own referral code', async () => {
      if (!supabase) {
        console.log('⏭️ Skipping - Supabase not configured');
        return;
      }

      // Get a customer with a referral code
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, referral_code')
        .eq('role', 'customer')
        .not('referral_code', 'is', null)
        .limit(1)
        .single();

      if (userError || !user) {
        console.log('⏭️ Skipping - No test user found');
        return;
      }

      // Get a restaurant for testing
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .limit(1)
        .single();

      if (!restaurant) {
        console.log('⏭️ Skipping - No restaurant found');
        return;
      }

      // Attempt self-referral via RPC
      const { error } = await supabase.rpc('create_referral_chain', {
        p_downline_id: user.id,
        p_referral_code: user.referral_code,
        p_restaurant_id: restaurant.id,
      });

      // Should fail with self-referral error
      expect(error).not.toBeNull();
      expect(error?.message).toContain('Cannot use your own referral code');
    });
  });

  // EC-AUTH-002: Invalid Referral Code
  describe('EC-AUTH-002: Invalid Referral Code', () => {
    it('should reject non-existent referral code', async () => {
      if (!supabase) {
        console.log('⏭️ Skipping - Supabase not configured');
        return;
      }

      // Get a valid user to be the downline
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'customer')
        .limit(1)
        .single();

      // Get a restaurant
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .limit(1)
        .single();

      if (!user || !restaurant) {
        console.log('⏭️ Skipping - No test data found');
        return;
      }

      // Attempt with non-existent code
      const { error } = await supabase.rpc('create_referral_chain', {
        p_downline_id: user.id,
        p_referral_code: 'NONEXISTENT-CODE-12345',
        p_restaurant_id: restaurant.id,
      });

      // Should fail with invalid code error
      expect(error).not.toBeNull();
      expect(error?.message).toContain('Invalid referral code');
    });
  });

  // EC-AUTH-003: Referral Code from Deleted User
  describe('EC-AUTH-003: Referral Code from Deleted User', () => {
    it('should reject referral code from soft-deleted user', async () => {
      if (!supabase) {
        console.log('⏭️ Skipping - Supabase not configured');
        return;
      }

      // Find a deleted user with a referral code
      const { data: deletedUser } = await supabase
        .from('users')
        .select('id, referral_code')
        .eq('is_deleted', true)
        .not('referral_code', 'is', null)
        .limit(1)
        .single();

      if (!deletedUser) {
        console.log('⏭️ Skipping - No deleted user with referral code found');
        return;
      }

      // Get an active user to be the downline
      const { data: activeUser } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'customer')
        .eq('is_deleted', false)
        .neq('id', deletedUser.id)
        .limit(1)
        .single();

      // Get a restaurant
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .limit(1)
        .single();

      if (!activeUser || !restaurant) {
        console.log('⏭️ Skipping - No test data found');
        return;
      }

      // Attempt to use deleted user's code
      const { error } = await supabase.rpc('create_referral_chain', {
        p_downline_id: activeUser.id,
        p_referral_code: deletedUser.referral_code,
        p_restaurant_id: restaurant.id,
      });

      // Should fail - deleted user's code should be invalid
      expect(error).not.toBeNull();
      expect(error?.message).toContain('Invalid referral code');
    });
  });

  // EC-REF-001: Duplicate Referral Chain at Same Restaurant
  describe('EC-REF-001: Duplicate Referral Chain at Same Restaurant', () => {
    it('should reject creating duplicate referral chain at same restaurant', async () => {
      if (!supabase) {
        console.log('⏭️ Skipping - Supabase not configured');
        return;
      }

      // Find a user who already has a referral chain at a restaurant
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('downline_id, restaurant_id')
        .limit(1)
        .single();

      if (!existingReferral) {
        console.log('⏭️ Skipping - No existing referral found');
        return;
      }

      // Find a different user's referral code to attempt duplicate
      const { data: otherUser } = await supabase
        .from('users')
        .select('referral_code')
        .eq('role', 'customer')
        .eq('is_deleted', false)
        .not('referral_code', 'is', null)
        .neq('id', existingReferral.downline_id)
        .limit(1)
        .single();

      if (!otherUser) {
        console.log('⏭️ Skipping - No other user found');
        return;
      }

      // Attempt to create duplicate chain
      const { error } = await supabase.rpc('create_referral_chain', {
        p_downline_id: existingReferral.downline_id,
        p_referral_code: otherUser.referral_code,
        p_restaurant_id: existingReferral.restaurant_id,
      });

      // Should fail with duplicate chain error
      expect(error).not.toBeNull();
      expect(error?.message).toContain('already has a referral chain');
    });
  });
});
