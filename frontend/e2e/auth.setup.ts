/**
 * Playwright Auth Setup
 * 
 * Logs in as E2E test users and saves browser state for reuse.
 * This runs before authenticated tests.
 */

import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// E2E Test User Credentials (must match create-e2e-user.ts)
const E2E_TEST_USER = {
  email: 'e2e.customer@makantak.test',
  password: 'E2ETestPassword123!',
};

const E2E_TEST_STAFF = {
  email: 'e2e.staff@makantak.test',
  password: 'E2ETestPassword123!',
};

// Storage state file paths
export const CUSTOMER_AUTH_FILE = path.join(__dirname, '.auth/customer.json');
export const STAFF_AUTH_FILE = path.join(__dirname, '.auth/staff.json');

/**
 * Setup: Authenticate as customer
 */
setup('authenticate as customer', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');
  
  // Wait for form to be ready
  await expect(page.locator('input[type="email"]')).toBeVisible();
  
  // Fill in credentials
  await page.fill('input[type="email"]', E2E_TEST_USER.email);
  await page.fill('input[type="password"]', E2E_TEST_USER.password);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard (indicates successful login)
  await page.waitForURL(/\/dashboard|\/customer/, { timeout: 15000 });
  
  // Wait for page to stabilize and session to be stored
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Save storage state (cookies, localStorage, sessionStorage)
  await page.context().storageState({ path: CUSTOMER_AUTH_FILE });
  console.log('✅ Customer auth state saved');
});

/**
 * Setup: Authenticate as staff
 */
setup('authenticate as staff', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');
  
  // Wait for form to be ready
  await expect(page.locator('input[type="email"]')).toBeVisible();
  
  // Fill in credentials
  await page.fill('input[type="email"]', E2E_TEST_STAFF.email);
  await page.fill('input[type="password"]', E2E_TEST_STAFF.password);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard (indicates successful login)
  await page.waitForURL(/\/dashboard|\/staff/, { timeout: 15000 });
  
  // Wait for page to stabilize and session to be stored
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Save storage state
  await page.context().storageState({ path: STAFF_AUTH_FILE });
  console.log('✅ Staff auth state saved');
});
