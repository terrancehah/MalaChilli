/**
 * Test Data IDs
 * 
 * Consistent UUIDs used across all tests.
 * These match the IDs in seed-test-data.ts
 */

export const TEST_IDS = {
  // Restaurant & Branch
  restaurant: '11111111-1111-1111-1111-111111111111',
  branch: '22222222-2222-2222-2222-222222222222',
  
  // Users (customers only - staff/merchant require special handling)
  customer1: '33333333-3333-3333-3333-333333333333',
  customer2: '44444444-4444-4444-4444-444444444444',
  customer3: '55555555-5555-5555-5555-555555555555',
  customerWithVC: '66666666-6666-6666-6666-666666666666',
  customerDeleted: '77777777-7777-7777-7777-777777777777',
  customerUpline: '88888888-8888-8888-8888-888888888888',
  
  // Transactions (skipped - require staff user)
  transaction1: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  transactionVoided: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
};

// Referral codes (max 20 chars due to DB constraint)
export const TEST_CODES = {
  customer1: 'QA-CUST1-TEST',
  customer2: 'QA-CUST2-TEST',
  customer3: 'QA-CUST3-TEST',
  customerWithVC: 'QA-VCUSER-TEST',
  customerDeleted: 'QA-DELETED-TEST',
  customerUpline: 'QA-UPLINE-TEST',
};
