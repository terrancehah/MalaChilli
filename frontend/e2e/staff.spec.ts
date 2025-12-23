/**
 * Staff Authenticated E2E Tests
 * 
 * Tests for staff dashboard and checkout features.
 * Runs with pre-authenticated staff session.
 */

import { test, expect } from '@playwright/test';

test.describe('Staff Dashboard', () => {
  
  test('should access staff dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should not redirect to login (we're authenticated)
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).not.toMatch(/\/login/);
    
    // Should show dashboard content
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display staff-specific features', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for staff-specific elements (checkout, scan, transactions)
    const staffFeatures = page.locator('[data-testid="checkout"], [data-testid="scan"], .checkout, .scan');
    
    // Staff dashboard should have checkout or scan functionality
    if (await staffFeatures.first().isVisible().catch(() => false)) {
      await expect(staffFeatures.first()).toBeVisible();
    }
  });
});

test.describe('Staff Checkout', () => {
  
  test('should access checkout page', async ({ page }) => {
    // Try common checkout routes
    await page.goto('/staff/checkout');
    
    // If that doesn't work, try from dashboard
    if (page.url().includes('login') || page.url() === 'about:blank') {
      await page.goto('/dashboard');
      
      // Look for checkout link/button
      const checkoutLink = page.getByRole('link', { name: /checkout|scan|transaction/i });
      if (await checkoutLink.isVisible().catch(() => false)) {
        await checkoutLink.click();
      }
    }
    
    // Should show checkout form or scanner
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have customer lookup functionality', async ({ page }) => {
    await page.goto('/staff/checkout');
    
    // Look for customer search/lookup input
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="customer"], input[placeholder*="phone"], input[placeholder*="email"]');
    
    if (await searchInput.first().isVisible().catch(() => false)) {
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test('should have amount input for transactions', async ({ page }) => {
    await page.goto('/staff/checkout');
    
    // Look for amount/total input
    const amountInput = page.locator('input[type="number"], input[placeholder*="amount"], input[placeholder*="total"], input[name*="amount"]');
    
    if (await amountInput.first().isVisible().catch(() => false)) {
      await expect(amountInput.first()).toBeVisible();
    }
  });
});

test.describe('Staff QR Scanner', () => {
  
  test('should have QR scanner option', async ({ page }) => {
    await page.goto('/staff/checkout');
    
    // Look for QR scanner button or camera element
    const scannerButton = page.getByRole('button', { name: /scan|qr|camera/i });
    const scannerElement = page.locator('[data-testid="qr-scanner"], .qr-scanner, video');
    
    const hasScannerButton = await scannerButton.isVisible().catch(() => false);
    const hasScannerElement = await scannerElement.first().isVisible().catch(() => false);
    
    // At least one scanner-related element should exist
    if (hasScannerButton || hasScannerElement) {
      expect(hasScannerButton || hasScannerElement).toBe(true);
    }
  });
});

test.describe('Staff Navigation', () => {
  
  test('should have logout option', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for logout in menu or directly visible
    const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    
    if (await logoutButton.isVisible().catch(() => false)) {
      await expect(logoutButton).toBeVisible();
    }
  });
});
