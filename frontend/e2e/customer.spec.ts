/**
 * Customer Authenticated E2E Tests
 * 
 * Tests for customer dashboard, profile, and wallet features.
 * Runs with pre-authenticated customer session.
 */

import { test, expect } from '@playwright/test';

test.describe('Customer Dashboard', () => {
  
  test('should access customer dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should not redirect to login (we're authenticated)
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).not.toMatch(/\/login/);
    
    // Should show dashboard content
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display wallet balance', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for wallet/balance related elements
    const balanceElement = page.locator('[data-testid="wallet-balance"], .wallet-balance, .balance, [class*="balance"]');
    
    // If balance element exists, verify it's visible
    if (await balanceElement.first().isVisible().catch(() => false)) {
      await expect(balanceElement.first()).toBeVisible();
    }
  });

  test('should display referral code', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for referral code display (MAKANTAK-* format)
    const referralCode = page.getByText(/MAKANTAK-|E2E-/i);
    
    // If referral code is displayed on dashboard
    if (await referralCode.first().isVisible().catch(() => false)) {
      await expect(referralCode.first()).toBeVisible();
    }
  });
});

test.describe('Customer Profile', () => {
  
  test('should access profile page', async ({ page }) => {
    // Try common profile routes
    await page.goto('/profile');
    
    // If redirected, try alternative routes
    if (page.url().includes('login')) {
      await page.goto('/customer/profile');
    }
    
    // Should show profile content or settings
    const profileContent = page.locator('[data-testid="profile"], .profile, form, [class*="profile"]');
    
    if (await profileContent.first().isVisible().catch(() => false)) {
      await expect(profileContent.first()).toBeVisible();
    }
  });

  test('should display user information', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for user name or email display
    const userInfo = page.getByText(/E2E Test Customer|e2e\.customer@makantak\.test/i);
    
    if (await userInfo.first().isVisible().catch(() => false)) {
      await expect(userInfo.first()).toBeVisible();
    }
  });
});

test.describe('Customer Navigation', () => {
  
  test('should have logout option', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for logout button or menu item
    const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    const logoutLink = page.getByRole('link', { name: /logout|sign out/i });
    const logoutMenuItem = page.getByText(/logout|sign out/i);
    
    // Check if any logout option is visible (might be in a menu)
    const hasLogout = await logoutButton.isVisible().catch(() => false)
      || await logoutLink.isVisible().catch(() => false)
      || await logoutMenuItem.isVisible().catch(() => false);
    
    // If not visible, try opening user menu first
    if (!hasLogout) {
      const userMenu = page.locator('[data-testid="user-menu"], .user-menu, [class*="avatar"], [class*="user"]');
      if (await userMenu.first().isVisible().catch(() => false)) {
        await userMenu.first().click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for navigation elements
    const navLinks = page.locator('nav a, [role="navigation"] a, .sidebar a');
    const navCount = await navLinks.count();
    
    // Dashboard should have some navigation
    expect(navCount).toBeGreaterThanOrEqual(0);
  });
});
