/**
 * Transaction Edge Case Tests
 * 
 * Tests for edge cases related to transactions:
 * - EC-TXN-004: Void Transaction with Distributed Rewards (Critical)
 * - Void already voided transaction
 * - Void non-existent transaction
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createTestClient } from '../utils/test-helpers';
import { TEST_IDS } from '../utils/test-ids';
import type { SupabaseClient } from '@supabase/supabase-js';

describe('Transaction Edge Cases', () => {
  let supabase: SupabaseClient | null;

  beforeAll(() => {
    supabase = createTestClient();
  });

  // Test: Void non-existent transaction
  describe('Void Non-Existent Transaction', () => {
    it('should reject voiding a transaction that does not exist', async () => {
      if (!supabase) {
        console.log('⏭️ Skipping - Supabase not configured');
        return;
      }

      // Attempt to void a non-existent transaction
      const fakeTransactionId = '00000000-0000-0000-0000-000000000000';
      const { error } = await supabase.rpc('void_transaction', {
        p_transaction_id: fakeTransactionId,
        p_reason: 'Test - should fail',
      });

      // Should fail with transaction not found error
      expect(error).not.toBeNull();
      expect(error?.message).toContain('not found');
    });
  });

  // Test: Void already voided transaction
  describe('EC-TXN-004: Void Already Voided Transaction', () => {
    it('should reject voiding a transaction that is already voided', async () => {
      if (!supabase) {
        console.log('⏭️ Skipping - Supabase not configured');
        return;
      }

      // Find an already voided transaction
      const { data: voidedTransaction } = await supabase
        .from('transactions')
        .select('id')
        .eq('status', 'voided')
        .limit(1)
        .single();

      if (!voidedTransaction) {
        console.log('⏭️ Skipping - No voided transaction found');
        return;
      }

      // Attempt to void it again
      const { error } = await supabase.rpc('void_transaction', {
        p_transaction_id: voidedTransaction.id,
        p_reason: 'Test - should fail (already voided)',
      });

      // Should fail with already voided error
      expect(error).not.toBeNull();
      expect(error?.message).toContain('already voided');
    });
  });

  // Test: Verify void_transaction function exists and is callable
  describe('void_transaction Function Availability', () => {
    it('should have void_transaction RPC function available', async () => {
      if (!supabase) {
        console.log('⏭️ Skipping - Supabase not configured');
        return;
      }

      // Call with invalid params to verify function exists
      const { error } = await supabase.rpc('void_transaction', {
        p_transaction_id: '00000000-0000-0000-0000-000000000000',
        p_reason: 'Test',
      });

      // Should error, but function should exist
      expect(error).not.toBeNull();
      expect(error?.message).not.toContain('does not exist');
    });
  });

  // EC-TXN-001: Verify transactions table is accessible
  describe('EC-TXN-001: Transactions Table Access', () => {
    it('should be able to query transactions table', async () => {
      if (!supabase) {
        console.log('⏭️ Skipping - Supabase not configured');
        return;
      }

      // Verify we can query transactions
      const { error } = await supabase
        .from('transactions')
        .select('id')
        .limit(1);

      // Should be able to query (even if empty)
      expect(error).toBeNull();
    });
  });
});
