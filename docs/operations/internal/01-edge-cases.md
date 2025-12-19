# Edge Cases & QA Test Scenarios

## MakanTak - Internal QA Documentation

**Document Type:** QA Test Cases  
**Last Updated:** 2025-12-19  
**Audience:** Internal (Development & QA Team)

---

## Severity Ratings

| Rating | Description |
|--------|-------------|
| 🔴 **Critical** | System failure, data corruption, or security breach |
| 🟠 **High** | Feature broken, user cannot complete core flow |
| 🟡 **Medium** | Degraded experience, workaround available |
| 🟢 **Low** | Minor issue, cosmetic, or rare edge case |

---

## 1. Registration & Authentication

### EC-AUTH-001: Self-Referral Attempt

**Severity:** 🟠 High  
**Description:** User tries to use their own referral code during registration or first transaction.

**Expected Behavior:** Rejected with error "Cannot use your own referral code"

**Frontend Test:**

1. Register User A with referral code
2. Log in as User A
3. Attempt to save User A's own code at a restaurant
4. Verify error message displayed

**SQL Verification:**

```sql
-- Setup: Get a user's referral code
SELECT id, referral_code FROM users WHERE role = 'customer' LIMIT 1;

-- Test: Attempt self-referral (should fail)
SELECT create_referral_chain(
  'USER_ID_HERE'::uuid,           -- downline_id (same user)
  'USER_REFERRAL_CODE_HERE',      -- their own code
  'RESTAURANT_ID_HERE'::uuid
);
-- Expected: ERROR "Cannot use your own referral code"
```

---

### EC-AUTH-002: Invalid Referral Code

**Severity:** 🟡 Medium  
**Description:** User enters a referral code that doesn't exist in the system.

**Expected Behavior:** Rejected with error "Invalid referral code"

**Frontend Test:**

1. Navigate to `/join/restaurant-slug/INVALID-CODE-123`
2. Verify error message or redirect to registration without code

**SQL Verification:**

```sql
-- Test: Attempt with non-existent code
SELECT create_referral_chain(
  'VALID_USER_ID'::uuid,
  'NONEXISTENT-CODE-123',
  'RESTAURANT_ID_HERE'::uuid
);
-- Expected: ERROR "Invalid referral code"
```

---

### EC-AUTH-003: Referral Code from Deleted User

**Severity:** 🟡 Medium  
**Description:** User tries to use a referral code belonging to a soft-deleted user.

**Expected Behavior:** Rejected (function checks `is_deleted = FALSE`)

**SQL Verification:**

```sql
-- Setup: Find a deleted user's code (or create test data)
SELECT id, referral_code, is_deleted FROM users WHERE is_deleted = TRUE;

-- Test: Attempt to use deleted user's code
SELECT create_referral_chain(
  'NEW_USER_ID'::uuid,
  'DELETED_USER_CODE',
  'RESTAURANT_ID'::uuid
);
-- Expected: ERROR "Invalid referral code"
```

---

### EC-AUTH-004: Duplicate Email Registration

**Severity:** 🟠 High  
**Description:** User attempts to register with an email that already exists.

**Expected Behavior:** Supabase Auth rejects with appropriate error

**Frontend Test:**

1. Register with email `test@example.com`
2. Log out
3. Attempt to register again with `test@example.com`
4. Verify error "User already registered" or similar

---

### EC-AUTH-005: Underage Registration (Age < 18)

**Severity:** 🟠 High  
**Description:** User enters a birthday that makes them under 18.

**Expected Behavior:** Frontend validation blocks registration

**Frontend Test:**

1. Navigate to registration page
2. Enter birthday as today minus 17 years
3. Verify form validation error before submission

---

## 2. Referral Chain Creation

### EC-REF-001: Duplicate Referral Chain at Same Restaurant

**Severity:** 🟠 High  
**Description:** Customer already has a referral chain at a restaurant and attempts to create another.

**Expected Behavior:** Rejected "Customer already has a referral chain at this restaurant"

**SQL Verification:**

```sql
-- Setup: Find a user with existing referral at a restaurant
SELECT DISTINCT downline_id, restaurant_id FROM referrals LIMIT 1;

-- Test: Attempt duplicate chain
SELECT create_referral_chain(
  'EXISTING_DOWNLINE_ID'::uuid,
  'ANY_VALID_CODE',
  'SAME_RESTAURANT_ID'::uuid
);
-- Expected: ERROR "Customer already has a referral chain at this restaurant"
```

---

### EC-REF-002: Partial Upline Chain (Level 2/3 Missing)

**Severity:** 🟢 Low  
**Description:** Referrer has no upline, so Level 2 and 3 cannot be created.

**Expected Behavior:** Only Level 1 referral created, no error

**SQL Verification:**

```sql
-- Setup: Find a user with no upline (first in chain)
SELECT u.id, u.referral_code 
FROM users u
LEFT JOIN referrals r ON u.id = r.downline_id
WHERE r.id IS NULL AND u.role = 'customer' AND u.is_deleted = FALSE
LIMIT 1;

-- Test: Create chain using this user's code
SELECT create_referral_chain(
  'NEW_CUSTOMER_ID'::uuid,
  'FIRST_IN_CHAIN_CODE',
  'RESTAURANT_ID'::uuid
);

-- Verify: Only 1 referral created
SELECT * FROM referrals WHERE downline_id = 'NEW_CUSTOMER_ID'::uuid;
-- Expected: 1 row with upline_level = 1
```

---

### EC-REF-003: Cross-Restaurant Referral Code

**Severity:** 🟡 Medium  
**Description:** User tries to use a restaurant-specific code at a different restaurant.

**Expected Behavior:** Code validation should fail or chain should not be created

**Frontend Test:**

1. User A has code `MAKANTAK-RESTA-JOHN` for Restaurant A
2. User B visits Restaurant B
3. User B enters `MAKANTAK-RESTA-JOHN`
4. Verify code is rejected or not applied

---

## 3. Virtual Currency & Redemption

### EC-VC-001: Redeem More Than Balance

**Severity:** 🔴 Critical  
**Description:** User attempts to redeem more VC than available balance.

**Expected Behavior:** Rejected "Insufficient virtual currency balance"

**SQL Verification:**

```sql
-- Setup: Get user with known balance
SELECT user_id, SUM(amount) as balance 
FROM virtual_currency_ledger 
GROUP BY user_id 
HAVING SUM(amount) > 0 
LIMIT 1;

-- Test: Attempt to redeem more than balance
SELECT redeem_virtual_currency(
  'USER_ID'::uuid,
  'TRANSACTION_ID'::uuid,
  999999.00  -- Amount greater than balance
);
-- Expected: ERROR "Insufficient virtual currency balance"
```

---

### EC-VC-002: Redeem Exceeds 20% Cap

**Severity:** 🟠 High  
**Description:** Staff attempts to apply VC redemption exceeding max_redemption_percent.

**Expected Behavior:** Frontend caps redemption at 20% of bill amount

**Frontend Test:**

1. Customer has RM100 VC balance
2. Bill amount is RM50
3. Max redemption = 50 * 0.20 = RM10
4. Verify redemption input is capped at RM10

---

### EC-VC-003: Race Condition - Double Redemption

**Severity:** 🔴 Critical  
**Description:** Two simultaneous checkout attempts try to redeem the same VC.

**Expected Behavior:** `FOR UPDATE` lock prevents double-spend; second request waits or fails

**SQL Verification:**

```sql
-- This requires two concurrent sessions to test properly
-- Session 1:
BEGIN;
SELECT redeem_virtual_currency('USER_ID'::uuid, 'TXN_1'::uuid, 50.00);
-- Don't commit yet

-- Session 2 (in parallel):
SELECT redeem_virtual_currency('USER_ID'::uuid, 'TXN_2'::uuid, 50.00);
-- Expected: Session 2 blocks until Session 1 commits/rollbacks
```

---

### EC-VC-004: Zero Bill Amount Transaction

**Severity:** 🟢 Low  
**Description:** Staff enters RM0.00 as bill amount.

**Expected Behavior:** Transaction processes, rewards = 0, no errors

**SQL Verification:**

```sql
-- Test: Process zero-amount transaction
SELECT process_checkout_transaction(
  'CUSTOMER_ID'::uuid,
  'BRANCH_ID'::uuid,
  'STAFF_ID'::uuid,
  0.00,   -- bill_amount
  0.00,   -- guaranteed_discount
  0.00,   -- vc_redeemed
  FALSE,  -- is_first_transaction
  NULL    -- receipt_photo_url
);
-- Expected: Transaction created, no rewards distributed
```

---

### EC-VC-005: VC Expires Mid-Checkout

**Severity:** 🟡 Medium  
**Description:** Customer's VC expires while they are in the checkout process.

**Expected Behavior:** If balance was locked before expiry, redemption succeeds

**Notes:** The `FOR UPDATE` lock captures balance at lock time. Expiry cron runs separately.

---

## 4. Transaction Processing

### EC-TXN-001: First Transaction Without Saved Code

**Severity:** 🟢 Low  
**Description:** Customer's first transaction at a restaurant without any referral code saved.

**Expected Behavior:** Transaction succeeds, no referral chain created, customer still gets guaranteed discount

**SQL Verification:**

```sql
-- Test: First transaction without saved code
SELECT process_checkout_transaction(
  'NEW_CUSTOMER_ID'::uuid,
  'BRANCH_ID'::uuid,
  'STAFF_ID'::uuid,
  100.00,
  5.00,   -- guaranteed discount
  0.00,
  TRUE,   -- is_first_transaction
  NULL,
  NULL    -- p_saved_code_id is NULL
);
-- Expected: Transaction created, no referral chain
SELECT * FROM referrals WHERE downline_id = 'NEW_CUSTOMER_ID'::uuid;
-- Expected: 0 rows
```

---

### EC-TXN-002: Staff Processing Transaction for Different Branch

**Severity:** 🔴 Critical  
**Description:** Staff from Branch A attempts to process transaction for Branch B.

**Expected Behavior:** RLS policy should block this action

**Frontend Test:**

1. Log in as Staff assigned to Branch A
2. Attempt to select Branch B in checkout (if UI allows)
3. Verify action is blocked

---

### EC-TXN-003: Transaction for Deleted Customer

**Severity:** 🟠 High  
**Description:** Staff scans QR code of a soft-deleted customer.

**Expected Behavior:** Customer lookup fails or shows "User not found"

**Frontend Test:**

1. Soft-delete a test customer
2. Attempt to scan their QR code
3. Verify error handling

---

### EC-TXN-004: Void Transaction After Rewards Distributed

**Severity:** 🔴 Critical  
**Description:** Transaction is voided after upline rewards have been distributed.

**Expected Behavior:** Requires manual rollback procedure (see Emergency Runbooks)

**Notes:** Currently no automatic rollback. Need to:

1. Update transaction status to 'voided'
2. Create negative adjustment entries in VC ledger
3. Update customer_restaurant_history

---

### EC-TXN-005: OCR Extraction Fails

**Severity:** 🟢 Low  
**Description:** Gemini OCR fails to extract data from receipt photo.

**Expected Behavior:** Transaction still valid, `ocr_processed = FALSE`, staff can manually enter items

**Frontend Test:**

1. Upload a blurry or non-receipt image
2. Verify graceful error handling
3. Verify transaction can still be completed manually

---

## 5. VC Expiry Cron Job

### EC-EXP-001: Partial Redemption Before Expiry

**Severity:** 🟡 Medium  
**Description:** User earns RM10, redeems RM3, then RM7 expires.

**Expected Behavior:** Only the unredeemed portion (RM7) should expire

**SQL Verification:**

```sql
-- Check expiry logic handles partial redemptions
-- The current implementation expires the full earning amount
-- This may need review if FIFO redemption is required

SELECT * FROM virtual_currency_ledger 
WHERE user_id = 'USER_ID'::uuid 
ORDER BY created_at;
```

---

### EC-EXP-002: Cron Runs Twice in Same Day

**Severity:** 🟡 Medium  
**Description:** Expiry cron job accidentally triggered twice.

**Expected Behavior:** `expired_at IS NULL` check prevents double-expiry

**SQL Verification:**

```sql
-- First run
SELECT expire_virtual_currency();

-- Second run (same day)
SELECT expire_virtual_currency();
-- Expected: Returns 0 (no new expirations)
```

---

## 6. User Deletion (PDPA Compliance)

### EC-DEL-001: Delete User with Active VC Balance

**Severity:** 🟡 Medium  
**Description:** User requests account deletion while having VC balance.

**Expected Behavior:** User anonymized, VC ledger entries remain for audit trail

**SQL Verification:**

```sql
-- Test: Anonymize user with VC
SELECT anonymize_user('USER_WITH_VC_ID'::uuid);

-- Verify: User anonymized
SELECT email, full_name, is_deleted FROM users WHERE id = 'USER_WITH_VC_ID'::uuid;
-- Expected: email = 'deleted_xxx@deleted.local', full_name = 'Deleted User'

-- Verify: VC ledger intact
SELECT * FROM virtual_currency_ledger WHERE user_id = 'USER_WITH_VC_ID'::uuid;
-- Expected: Records still exist
```

---

### EC-DEL-002: Delete User Who Is Upline

**Severity:** 🟡 Medium  
**Description:** User who has downlines requests account deletion.

**Expected Behavior:** Downlines keep their referral chain, upline user is anonymized

**SQL Verification:**

```sql
-- Find user who is an upline
SELECT DISTINCT upline_id FROM referrals LIMIT 1;

-- Anonymize them
SELECT anonymize_user('UPLINE_USER_ID'::uuid);

-- Verify: Referral chain intact
SELECT * FROM referrals WHERE upline_id = 'UPLINE_USER_ID'::uuid;
-- Expected: Records still exist, pointing to anonymized user
```

---

## 7. Frontend-Specific Edge Cases

### EC-FE-001: Browser Closed Mid-Checkout

**Severity:** 🟠 High  
**Description:** Staff closes browser after scanning customer but before completing transaction.

**Expected Behavior:** No partial transaction created, customer can be scanned again

**Frontend Test:**

1. Scan customer QR
2. Enter bill amount
3. Close browser before clicking "Complete"
4. Reopen and scan same customer
5. Verify no duplicate or orphan records

---

### EC-FE-002: Network Timeout During Transaction Submit

**Severity:** 🟠 High  
**Description:** Network fails while submitting transaction.

**Expected Behavior:** Error message displayed, user can retry

**Frontend Test:**

1. Use browser DevTools to simulate offline
2. Attempt to submit transaction
3. Verify error handling and retry capability

---

### EC-FE-003: Session Expires During Checkout

**Severity:** 🟠 High  
**Description:** Staff's JWT expires while in the middle of checkout flow.

**Expected Behavior:** Redirect to login, preserve checkout state if possible

**Frontend Test:**

1. Start checkout flow
2. Wait for session timeout (or manually clear auth)
3. Verify graceful redirect and state handling

---

### EC-FE-004: QR Scanner Permission Denied

**Severity:** 🟡 Medium  
**Description:** Staff denies camera permission for QR scanner.

**Expected Behavior:** Show manual code entry fallback

**Frontend Test:**

1. Deny camera permission when prompted
2. Verify manual entry option is available

---

### EC-FE-005: Multiple Tabs - Same User

**Severity:** 🟡 Medium  
**Description:** Staff opens checkout in multiple browser tabs.

**Expected Behavior:** Each tab operates independently, no conflicts

**Frontend Test:**

1. Open checkout in Tab A
2. Open checkout in Tab B
3. Process different customers in each
4. Verify no cross-contamination of data

---

## Appendix: Test Data Setup

### Create Test Users

```sql
-- Insert test customer (for QA environment only)
INSERT INTO users (email, role, full_name, birthday, referral_code, email_verified)
VALUES 
  ('test.customer@qa.local', 'customer', 'Test Customer', '1990-01-01', 'TEST-QA-001', TRUE),
  ('test.customer2@qa.local', 'customer', 'Test Customer 2', '1990-01-01', 'TEST-QA-002', TRUE);
```

### Create Test Restaurant & Branch

```sql
-- Insert test restaurant
INSERT INTO restaurants (name, slug, guaranteed_discount_percent, upline_reward_percent)
VALUES ('QA Test Restaurant', 'qa-test', 5.00, 1.00)
RETURNING id;

-- Insert test branch
INSERT INTO branches (restaurant_id, name, address)
VALUES ('RESTAURANT_ID_FROM_ABOVE', 'QA Main Branch', '123 Test Street');
```

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-19 | System | Initial document creation |
