/**
 * Playwright Configuration
 * 
 * E2E testing configuration for MakanTak frontend.
 * Run with: npx playwright test
 */

import { defineConfig, devices } from '@playwright/test';

// Auth state file paths
const CUSTOMER_AUTH_FILE = './e2e/.auth/customer.json';
const STAFF_AUTH_FILE = './e2e/.auth/staff.json';

export default defineConfig({
  // Test directory
  testDir: './e2e',
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: 'html',
  
  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:5173',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for different auth states
  projects: [
    // Setup project - runs first to authenticate
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    
    // Unauthenticated tests (login, register, public pages)
    {
      name: 'unauthenticated',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /authenticated|customer|staff/,
      testMatch: /auth\.spec|navigation\.spec|referral\.spec/,
    },
    
    // Customer authenticated tests
    {
      name: 'customer',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: CUSTOMER_AUTH_FILE,
      },
      dependencies: ['setup'],
      testMatch: /customer\.spec/,
    },
    
    // Staff authenticated tests
    {
      name: 'staff',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: STAFF_AUTH_FILE,
      },
      dependencies: ['setup'],
      testMatch: /staff\.spec/,
    },
  ],

  // Run local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
