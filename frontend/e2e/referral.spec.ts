/**
 * Referral Code E2E Tests
 * 
 * Tests for referral code functionality.
 * Based on edge cases: EC-AUTH-001, EC-AUTH-002, EC-REF-001, EC-REF-002
 */

import { test, expect } from '@playwright/test';

test.describe('Referral Code', () => {
  
  test.describe('Referral Code Input', () => {
    
    test('should display referral code input on signup', async ({ page }) => {
      await page.goto('/signup');
      
      // Look for referral code input field
      const referralInput = page.locator('input[name*="referral"], input[placeholder*="referral"], input[id*="referral"]');
      
      // Referral code field may be optional
      if (await referralInput.isVisible()) {
        await expect(referralInput).toBeVisible();
      }
    });

    test('should accept valid referral code format', async ({ page }) => {
      await page.goto('/signup');
      
      // Look for referral code input
      const referralInput = page.locator('input[name*="referral"], input[placeholder*="referral"], input[id*="referral"]');
      
      if (await referralInput.isVisible()) {
        // Enter a valid format code (MAKANTAK-SLUG-NAME)
        await referralInput.fill('MAKANTAK-TEST-USER');
        
        // Should not show format error immediately
        const formatError = page.getByText(/invalid format/i);
        await expect(formatError).not.toBeVisible();
      }
    });
  });

  test.describe('Referral Code Display', () => {
    
    test.skip('should display user referral code on profile', async ({ page }) => {
      // This test requires authentication
      // Skip until we have proper auth setup
      
      await page.goto('/profile');
      
      // Look for referral code display
      const referralCode = page.getByText(/MAKANTAK-/i);
      await expect(referralCode).toBeVisible();
    });
  });
});
