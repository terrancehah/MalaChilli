/**
 * Authentication E2E Tests
 * 
 * Tests for login, signup, and authentication flows.
 * Based on edge cases: EC-AUTH-001, EC-AUTH-002, EC-AUTH-003
 */

import { test, expect } from '@playwright/test';

// Test configuration
const TEST_USER = {
  email: 'e2e.test@makantak.local',
  password: 'TestPassword123!',
  name: 'E2E Test User',
};

test.describe('Authentication', () => {
  
  test.describe('Login Page', () => {
    
    test('should display login form', async ({ page }) => {
      await page.goto('/login');
      
      // Check for MakanTak branding and login form elements
      await expect(page.getByText('MakanTak')).toBeVisible();
      await expect(page.getByText('Welcome back!')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      // Fill in invalid credentials
      await page.fill('input[type="email"]', 'invalid@test.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.getByText(/invalid|incorrect|error/i)).toBeVisible({ timeout: 10000 });
    });

    test('should show error for empty fields', async ({ page }) => {
      await page.goto('/login');
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation error or required field indication
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveAttribute('required', '');
    });
  });

  test.describe('Register Page', () => {
    
    test('should display register form', async ({ page }) => {
      await page.goto('/register');
      
      // Check for MakanTak branding and register form elements
      await expect(page.getByText('MakanTak')).toBeVisible();
      await expect(page.getByText('Join and start saving!')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/register');
      
      // Fill in invalid email and trigger validation
      await page.fill('input[name="email"]', 'notanemail');
      await page.locator('input[name="email"]').blur();
      
      // Should show validation error
      await expect(page.getByText(/valid email/i)).toBeVisible({ timeout: 5000 });
    });

    test('should have link to login page', async ({ page }) => {
      await page.goto('/register');
      
      // Should have link to login
      await expect(page.getByText(/Already have an account/i)).toBeVisible();
      await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
    });
  });

  test.describe('Navigation Guards', () => {
    
    test('should redirect unauthenticated users from protected routes', async ({ page }) => {
      // Try to access dashboard without login
      await page.goto('/dashboard');
      
      // Should redirect to login or show unauthorized message
      await page.waitForURL(/\/(login|signin|auth)/i, { timeout: 5000 }).catch(() => {
        // If no redirect, check for unauthorized message
      });
      
      const url = page.url();
      const isOnAuthPage = /\/(login|signin|auth)/i.test(url);
      const hasUnauthorizedMessage = await page.getByText(/unauthorized|please log in|sign in/i).isVisible().catch(() => false);
      
      expect(isOnAuthPage || hasUnauthorizedMessage).toBe(true);
    });
  });
});
