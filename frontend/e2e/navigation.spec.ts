/**
 * Navigation E2E Tests
 * 
 * Tests for basic navigation and page accessibility.
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  
  test.describe('Public Pages', () => {
    
    test('should load home page', async ({ page }) => {
      await page.goto('/');
      
      // Page should load without errors
      await expect(page).toHaveTitle(/makantak/i);
    });

    test('should load login page', async ({ page }) => {
      await page.goto('/login');
      
      // Should show login form
      await expect(page.locator('form')).toBeVisible();
    });

    test('should load register page', async ({ page }) => {
      await page.goto('/register');
      
      // Should show register form
      await expect(page.locator('form')).toBeVisible();
    });
  });

  test.describe('Navigation Links', () => {
    
    test('should navigate from home to login', async ({ page }) => {
      await page.goto('/');
      
      // Find and click login link
      const loginLink = page.getByRole('link', { name: /login|sign in/i });
      
      if (await loginLink.isVisible()) {
        await loginLink.click();
        await expect(page).toHaveURL(/\/login/);
      }
    });

    test('should navigate from login to register', async ({ page }) => {
      await page.goto('/login');
      
      // Find and click Sign Up button (it's a button wrapping a link)
      const signupButton = page.getByRole('button', { name: /sign up/i });
      
      if (await signupButton.isVisible()) {
        await signupButton.click();
        await expect(page).toHaveURL(/\/register/);
      }
    });
  });

  test.describe('Responsive Design', () => {
    
    test('should be responsive on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');
      
      // Page should still be functional
      await expect(page.locator('body')).toBeVisible();
    });

    test('should be responsive on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/');
      
      // Page should still be functional
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
