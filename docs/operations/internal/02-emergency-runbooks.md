# Emergency Runbooks

## MakanTak - Incident Response Procedures

**Document Type:** Emergency Operations  
**Last Updated:** 2025-12-19 (Schema verified)  
**Audience:** Internal (On-call Support, Operations, Developers)

---

## How to Use This Document

1. **Identify the incident type** from the table of contents below
2. **Follow the step-by-step procedure** exactly as written
3. **Verify the fix** using the provided verification queries
4. **Document the incident** in the changelog at the bottom

---

## Table of Contents

| ID | Incident Type | Severity | Related Edge Case |
|----|---------------|----------|-------------------|
| [RB-001](#rb-001-void-transaction-with-distributed-rewards) | Void Transaction with Distributed Rewards | 🔴 Critical | EC-TXN-004 |
| [RB-002](#rb-002-vc-balance-discrepancy) | VC Balance Discrepancy | 🔴 Critical | EC-VC-001 |
| [RB-003](#rb-003-duplicate-referral-chain) | Duplicate Referral Chain | 🟠 High | EC-REF-001 |
| [RB-004](#rb-004-orphaned-transaction-records) | Orphaned Transaction Records | 🟠 High | EC-FE-001 |
| [RB-005](#rb-005-incorrect-upline-rewards) | Incorrect Upline Rewards | 🟠 High | - |
| [RB-006](#rb-006-user-data-recovery-pdpa) | User Data Recovery (PDPA) | 🟡 Medium | EC-DEL-001/002 |

---

## RB-001: Void Transaction with Distributed Rewards

**Severity:** 🔴 Critical  
**Related Edge Case:** EC-TXN-004  
**Trigger:** Staff or merchant requests to void a completed transaction after rewards have been distributed to uplines.

### Prerequisites

- Transaction ID of the voided transaction
- Access to Supabase SQL Editor or database client
- Confirmation from merchant/manager to proceed

### Procedure

#### Step 1: Identify the Transaction

```sql
-- Get transaction details including current status
SELECT 
    t.id,
    t.customer_id,
    t.branch_id,
    t.bill_amount,
    t.guaranteed_discount_amount,
    t.virtual_currency_redeemed,
    t.status,
    t.created_at,
    b.restaurant_id
FROM transactions t
JOIN branches b ON t.branch_id = b.id
WHERE t.id = 'TRANSACTION_ID_HERE'::uuid;
```

#### Step 2: Identify Distributed Rewards (Optional - for review)

```sql
-- Find all VC earnings from this transaction
SELECT 
    vcl.id,
    vcl.user_id,
    vcl.amount,
    vcl.upline_level,
    vcl.balance_after,
    u.email,
    u.full_name
FROM virtual_currency_ledger vcl
JOIN users u ON vcl.user_id = u.id
WHERE vcl.related_transaction_id = 'TRANSACTION_ID_HERE'::uuid
AND vcl.transaction_type = 'earn';
```

#### Step 3: Execute Void Transaction (RECOMMENDED)

Use the built-in `void_transaction()` function which handles everything atomically:

```sql
-- This function automatically:
-- 1. Reverses all upline earnings (creates 'void' entries)
-- 2. Refunds customer redemptions (creates 'refund' entries)
-- 3. Updates customer_restaurant_history
-- 4. Sets transaction status to 'voided'
-- 5. Creates audit log entry

SELECT void_transaction(
    'TRANSACTION_ID_HERE'::uuid,
    'REASON_FOR_VOID'  -- e.g., 'Customer complaint - wrong order'
);
```

#### Step 3 (Alternative): Manual Void Steps

Only use if `void_transaction()` fails or you need granular control:

```sql
-- 3a. Reverse VC Earnings (creates 'void' entries)
INSERT INTO virtual_currency_ledger (
    user_id,
    restaurant_id,
    transaction_type,
    amount,
    balance_after,
    related_transaction_id,
    notes
)
SELECT 
    vcl.user_id,
    vcl.restaurant_id,
    'void',
    -vcl.amount,
    (SELECT COALESCE(SUM(amount), 0) FROM virtual_currency_ledger WHERE user_id = vcl.user_id AND restaurant_id = vcl.restaurant_id) - vcl.amount,
    vcl.related_transaction_id,
    'Voided transaction reversal - ' || NOW()::text
FROM virtual_currency_ledger vcl
WHERE vcl.related_transaction_id = 'TRANSACTION_ID_HERE'::uuid
AND vcl.transaction_type = 'earn';

-- 3b. Refund Customer Redemption (if any)
INSERT INTO virtual_currency_ledger (
    user_id,
    restaurant_id,
    transaction_type,
    amount,
    balance_after,
    related_transaction_id,
    notes
)
SELECT 
    vcl.user_id,
    vcl.restaurant_id,
    'refund',
    -vcl.amount,  -- Double negative = positive
    (SELECT COALESCE(SUM(amount), 0) FROM virtual_currency_ledger WHERE user_id = vcl.user_id AND restaurant_id = vcl.restaurant_id) - vcl.amount,
    vcl.related_transaction_id,
    'Voided transaction - VC refunded - ' || NOW()::text
FROM virtual_currency_ledger vcl
WHERE vcl.related_transaction_id = 'TRANSACTION_ID_HERE'::uuid
AND vcl.transaction_type = 'redeem';

-- 3c. Update Customer Restaurant History
UPDATE customer_restaurant_history
SET 
    total_visits = GREATEST(total_visits - 1, 0),
    total_spent = total_spent - (SELECT bill_amount FROM transactions WHERE id = 'TRANSACTION_ID_HERE'::uuid)
WHERE customer_id = 'CUSTOMER_ID_HERE'::uuid
AND restaurant_id = 'RESTAURANT_ID_HERE'::uuid;

-- 3d. Mark Transaction as Voided
UPDATE transactions
SET status = 'voided'
WHERE id = 'TRANSACTION_ID_HERE'::uuid;

-- 3e. Log the Action
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
VALUES (
    'ADMIN_USER_ID'::uuid,
    'transaction_voided',
    'transaction',
    'TRANSACTION_ID_HERE'::uuid,
    jsonb_build_object(
        'reason', 'REASON_FOR_VOID',
        'voided_at', NOW()
    )
);
```

### Verification

```sql
-- Verify transaction is voided
SELECT id, status FROM transactions WHERE id = 'TRANSACTION_ID_HERE'::uuid;
-- Expected: status = 'voided'

-- Verify void/refund entries exist
SELECT * FROM virtual_currency_ledger
WHERE related_transaction_id = 'TRANSACTION_ID_HERE'::uuid
AND transaction_type IN ('void', 'refund');
-- Expected: Matching void entries for each earn, refund entry if redemption existed

-- Verify VC balances are corrected
SELECT user_id, SUM(amount) as current_balance
FROM virtual_currency_ledger
WHERE user_id IN (
    SELECT user_id FROM virtual_currency_ledger 
    WHERE related_transaction_id = 'TRANSACTION_ID_HERE'::uuid
)
GROUP BY user_id;

-- Verify audit log exists
SELECT * FROM audit_logs 
WHERE entity_id = 'TRANSACTION_ID_HERE'::uuid 
AND action = 'transaction_voided'
ORDER BY created_at DESC LIMIT 1;
```

---

## RB-002: VC Balance Discrepancy

**Severity:** 🔴 Critical  
**Related Edge Case:** EC-VC-001  
**Trigger:** Customer reports incorrect VC balance, or balance shows negative/impossible value.

### Prerequisites

- Customer user ID or email
- Restaurant ID (if restaurant-specific)
- Expected vs actual balance details

### Procedure

#### Step 1: Audit Current Balance

```sql
-- Get full ledger history for user
SELECT 
    vcl.id,
    vcl.transaction_type,
    vcl.amount,
    vcl.balance_after,
    vcl.related_transaction_id,
    vcl.upline_level,
    vcl.expires_at,
    vcl.expired_at,
    vcl.created_at,
    vcl.notes
FROM virtual_currency_ledger vcl
WHERE vcl.user_id = 'USER_ID_HERE'::uuid
ORDER BY vcl.created_at;

-- Calculate expected balance
SELECT SUM(amount) as calculated_balance
FROM virtual_currency_ledger
WHERE user_id = 'USER_ID_HERE'::uuid;
```

#### Step 2: Identify Discrepancy Source

```sql
-- Check for duplicate entries
SELECT related_transaction_id, COUNT(*) 
FROM virtual_currency_ledger 
WHERE user_id = 'USER_ID_HERE'::uuid 
AND transaction_type = 'earn'
GROUP BY related_transaction_id 
HAVING COUNT(*) > 1;

-- Check for missing expiry entries
SELECT * FROM virtual_currency_ledger
WHERE user_id = 'USER_ID_HERE'::uuid
AND transaction_type = 'earn'
AND expires_at < NOW()
AND expired_at IS NULL;
```

#### Step 3: Create Adjustment Entry

```sql
-- Calculate adjustment amount
-- ADJUSTMENT_AMOUNT = expected_balance - calculated_balance

-- Use 'refund' for positive adjustments, 'void' for negative adjustments
INSERT INTO virtual_currency_ledger (
    user_id,
    restaurant_id,
    transaction_type,
    amount,
    balance_after,
    notes
)
VALUES (
    'USER_ID_HERE'::uuid,
    'RESTAURANT_ID_HERE'::uuid,
    'refund',  -- Use 'refund' for positive, 'void' for negative adjustments
    ADJUSTMENT_AMOUNT,  -- Positive to add, negative to subtract
    EXPECTED_BALANCE,
    'Manual balance correction - Ticket #XXX - ' || NOW()::text
);
```

#### Step 4: Log the Action

```sql
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
VALUES (
    'ADMIN_USER_ID'::uuid,
    'vc_balance_adjusted',
    'user',
    'USER_ID_HERE'::uuid,
    jsonb_build_object(
        'previous_balance', CALCULATED_BALANCE,
        'new_balance', EXPECTED_BALANCE,
        'adjustment', ADJUSTMENT_AMOUNT,
        'reason', 'REASON_FOR_ADJUSTMENT'
    )
);
```

### Verification

```sql
-- Verify new balance
SELECT SUM(amount) as current_balance
FROM virtual_currency_ledger
WHERE user_id = 'USER_ID_HERE'::uuid;
```

---

## RB-003: Duplicate Referral Chain

**Severity:** 🟠 High  
**Related Edge Case:** EC-REF-001  
**Trigger:** Customer somehow has multiple referral entries at the same restaurant (constraint violation or data corruption).

### Procedure

#### Step 1: Identify Duplicates

```sql
-- Find duplicate referral chains
SELECT downline_id, restaurant_id, upline_level, COUNT(*)
FROM referrals
GROUP BY downline_id, restaurant_id, upline_level
HAVING COUNT(*) > 1;
```

#### Step 2: Determine Correct Entry

```sql
-- Get all entries for the duplicate
SELECT * FROM referrals
WHERE downline_id = 'DOWNLINE_ID'::uuid
AND restaurant_id = 'RESTAURANT_ID'::uuid
ORDER BY created_at;

-- Usually keep the FIRST entry (oldest)
```

#### Step 3: Remove Duplicate Entries

```sql
-- Delete duplicates, keeping the oldest
DELETE FROM referrals
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (
            PARTITION BY downline_id, restaurant_id, upline_level 
            ORDER BY created_at
        ) as rn
        FROM referrals
        WHERE downline_id = 'DOWNLINE_ID'::uuid
        AND restaurant_id = 'RESTAURANT_ID'::uuid
    ) sub
    WHERE rn > 1
);
```

#### Step 4: Log the Action

```sql
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
VALUES (
    'ADMIN_USER_ID'::uuid,
    'duplicate_referral_removed',
    'referral',
    'DOWNLINE_ID'::uuid,
    jsonb_build_object(
        'restaurant_id', 'RESTAURANT_ID',
        'duplicates_removed', DUPLICATE_COUNT
    )
);
```

---

## RB-004: Orphaned Transaction Records

**Severity:** 🟠 High  
**Related Edge Case:** EC-FE-001  
**Trigger:** Partial transaction data exists without completion (e.g., browser crash mid-checkout).

### Procedure

#### Step 1: Identify Orphaned Records

```sql
-- Find transactions that may be orphaned or incomplete
-- Transactions table has 'status' column: 'completed' or 'voided'
SELECT t.*, b.restaurant_id
FROM transactions t
JOIN branches b ON t.branch_id = b.id
LEFT JOIN audit_logs al ON al.entity_id = t.id AND al.action = 'transaction_created'
WHERE t.created_at < NOW() - INTERVAL '1 hour'
AND al.id IS NULL;
```

#### Step 2: Assess Each Record

For each orphaned record, determine if it should be:

- **Completed:** If customer was charged
- **Deleted:** If no payment was made
- **Voided:** If partially processed

#### Step 3: Clean Up (if deletion appropriate)

```sql
-- Only if confirmed no payment was made
DELETE FROM transactions
WHERE id = 'ORPHANED_TRANSACTION_ID'::uuid;

-- Log the action
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
VALUES (
    'ADMIN_USER_ID'::uuid,
    'orphaned_transaction_deleted',
    'transaction',
    'ORPHANED_TRANSACTION_ID'::uuid,
    jsonb_build_object('reason', 'Browser crash - no payment made')
);
```

---

## RB-005: Incorrect Upline Rewards

**Severity:** 🟠 High  
**Trigger:** Upline received wrong reward amount (too much or too little).

### Procedure

#### Step 1: Identify the Issue

```sql
-- Get transaction and expected reward
SELECT 
    t.id,
    t.bill_amount,
    r.upline_reward_percent,
    t.bill_amount * (r.upline_reward_percent / 100) as expected_reward
FROM transactions t
JOIN branches b ON t.branch_id = b.id
JOIN restaurants r ON b.restaurant_id = r.id
WHERE t.id = 'TRANSACTION_ID'::uuid;

-- Get actual distributed rewards
SELECT * FROM virtual_currency_ledger
WHERE related_transaction_id = 'TRANSACTION_ID'::uuid
AND transaction_type = 'earn';
```

#### Step 2: Calculate Adjustment

```sql
-- For each upline, calculate: expected - actual = adjustment needed
```

#### Step 3: Apply Adjustment

```sql
INSERT INTO virtual_currency_ledger (
    user_id,
    restaurant_id,
    transaction_type,
    amount,
    balance_after,
    related_transaction_id,
    notes
)
VALUES (
    'UPLINE_USER_ID'::uuid,
    'RESTAURANT_ID'::uuid,
    'adjust',
    ADJUSTMENT_AMOUNT,
    (SELECT COALESCE(SUM(amount), 0) + ADJUSTMENT_AMOUNT FROM virtual_currency_ledger WHERE user_id = 'UPLINE_USER_ID'::uuid),
    'TRANSACTION_ID'::uuid,
    'Reward correction - ' || NOW()::text
);
```

---

## RB-006: User Data Recovery (PDPA)

**Severity:** 🟡 Medium  
**Related Edge Case:** EC-DEL-001, EC-DEL-002  
**Trigger:** User requests data export before deletion, or accidental deletion needs review.

### Procedure

#### Step 1: Export User Data

```sql
-- Get all user data for PDPA export
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.birthday,
    u.role,
    u.created_at,
    u.preferred_language
FROM users u
WHERE u.id = 'USER_ID'::uuid;

-- Get transaction history
SELECT * FROM transactions WHERE customer_id = 'USER_ID'::uuid;

-- Get VC history
SELECT * FROM virtual_currency_ledger WHERE user_id = 'USER_ID'::uuid;

-- Get referral relationships
SELECT * FROM referrals WHERE downline_id = 'USER_ID'::uuid OR upline_id = 'USER_ID'::uuid;
```

#### Step 2: Verify Anonymization (if already deleted)

```sql
-- Check if user was properly anonymized
SELECT 
    id,
    email,
    full_name,
    is_deleted,
    deleted_at,
    deletion_reason
FROM users
WHERE id = 'USER_ID'::uuid;
```

---

## Escalation Contacts

| Role | Contact | When to Escalate |
|------|---------|------------------|
| **Tech Lead** | [TBD] | Any 🔴 Critical incident |
| **Database Admin** | [TBD] | Data corruption, bulk fixes |
| **Product Owner** | [TBD] | Customer-facing decisions |

---

## Incident Log Template

When an incident occurs, document it here:

```markdown
### Incident: [DATE] - [BRIEF DESCRIPTION]

**Runbook Used:** RB-XXX  
**Severity:** 🔴/🟠/🟡  
**Reported By:** [Name/Email]  
**Resolved By:** [Name/Email]  
**Duration:** [Start Time] - [End Time]  

**Summary:**
[What happened]

**Root Cause:**
[Why it happened]

**Resolution:**
[What was done to fix it]

**Prevention:**
[What will prevent recurrence]
```

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-19 | System | Initial document creation |
