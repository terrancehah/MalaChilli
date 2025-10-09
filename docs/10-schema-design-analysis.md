# Database Schema Design Analysis
## ShareSaji - Table Redundancy & Design Decisions

**Version:** 1.0  
**Date:** 2025-10-10  
**Purpose:** Explain design decisions and analyze potential redundancies

---

## Schema Overview: 11 Tables

### Core Business Tables (6)
1. **restaurants** - Business entity configuration
2. **branches** - Physical locations
3. **users** - All user roles (customers, staff, owners)
4. **referrals** - Upline-downline relationships
5. **transactions** - Checkout records
6. **virtual_currency_ledger** - Currency events

### Supporting Tables (5)
7. **saved_referral_codes** - Pre-visit code collection
8. **customer_restaurant_history** - First-visit tracking
9. **menu_items** - Inventory/products
10. **email_notifications** - Email tracking
11. **audit_logs** - Security logging
12. **system_config** - Runtime parameters

---

## Design Decision Analysis

### Question 1: Why separate `restaurants` and `branches` tables?

**Current Structure:**
```
restaurants (1) ──────< branches (N)
    │                      │
    │                      ├── transactions (logged per branch)
    │                      └── staff (assigned to branch)
    └── Configuration (discount %, expiry days)
```

#### **Scenario A: Restaurant with Multiple Locations**

**Example: McDonald's Malaysia**
- **Restaurant level**: "McDonald's" (one entity)
  - Brand name, logo, slug (`mcdonalds-malaysia`)
  - **Centralized configuration**: 5% guaranteed discount, 30-day expiry
  - Owner manages all branches
  
- **Branch level**: Multiple physical locations
  - Branch 1: "McDonald's KLCC" (address: KLCC, phone: 012-345-6789)
  - Branch 2: "McDonald's Mid Valley" (address: Mid Valley, phone: 012-345-6790)
  - Branch 3: "McDonald's Bukit Bintang" (address: Bukit Bintang, phone: 012-345-6791)

**Why Separation Matters:**

1. **Transaction Tracking per Location**
   - Customer spends RM100 at KLCC branch → Transaction logged to KLCC branch
   - Owner can see which branch generates most revenue
   - Analytics: "KLCC branch: RM50,000/month, Mid Valley: RM30,000/month"

2. **Staff Assignment**
   - Staff John works at KLCC branch only
   - Staff Mary works at Mid Valley only
   - RLS policy: Staff can only see/process transactions at their assigned branch
   - Prevents staff from seeing other branches' data

3. **Branch-Level Analytics**
   - "Which branch has highest customer acquisition?"
   - "Which branch gives most discounts?"
   - "Which branch needs more staff?"

4. **Centralized Configuration**
   - Owner changes discount from 5% → 6% **once** at restaurant level
   - All branches automatically use new configuration
   - No need to update each branch individually

#### **Scenario B: Single-Location Restaurant**

**Example: Nasi Lemak Corner (only 1 location)**
- Still has 1 restaurant + 1 branch
- Why? **Future scalability**
  - If they open 2nd location later, schema already supports it
  - Just insert new branch, no schema changes needed

#### **If We Merged Restaurants + Branches:**

**Problems:**
```sql
-- Bad design: All-in-one table
CREATE TABLE restaurants (
  id UUID,
  name VARCHAR(255),
  address TEXT, -- What if 3 locations? Store as JSON? Messy.
  phone VARCHAR(20), -- Which branch's phone?
  ...
);
```

1. **Multi-location support impossible** without schema redesign
2. **Transaction tracking unclear** - which location did customer visit?
3. **Staff assignment unclear** - which location does staff work at?
4. **Analytics broken** - can't compare branch performance

**Verdict: ✅ KEEP SEPARATE - Not redundant, necessary for multi-location support**

---

### Question 2: Why separate `referrals` and `customer_restaurant_history`?

**Current Structure:**
```sql
-- referrals: Tracks upline-downline chains
-- customer_restaurant_history: Tracks first-visit status
```

#### **They Serve Different Purposes:**

**referrals table:**
- **Purpose:** Build and query referral network
- **Data:** Who referred whom (upline → downline relationship)
- **Scope:** Per restaurant (same customer can have different uplines at different restaurants)
- **Usage:** 
  - "Show me all my downlines"
  - "Calculate rewards for uplines"
  - "Display referral tree"

**customer_restaurant_history table:**
- **Purpose:** Track first-visit eligibility for 5% discount
- **Data:** Has customer visited this restaurant before?
- **Scope:** Per customer per restaurant
- **Usage:**
  - "Is this customer's first visit?" → Give 5% discount
  - "How many times has customer visited?"
  - "What's their total spend?"

#### **Why Not Merge Them?**

**Scenario: Customer visits WITHOUT referral code**
- No referral chain created (no entry in `referrals`)
- But still need to track first visit (entry in `customer_restaurant_history`)
- Customer still gets 5% guaranteed discount on first visit

```sql
-- Customer visits without code:
-- referrals: NO ENTRY (no referrer)
-- customer_restaurant_history: YES ENTRY (tracks first visit)
```

**Scenario: Customer uses referral code**
- Referral chain created (entries in `referrals` for up to 3 uplines)
- First visit tracked (entry in `customer_restaurant_history`)
- Both tables have data

```sql
-- Customer uses code SAJI-ABC123:
-- referrals: 3 entries (Level 1, 2, 3 uplines)
-- customer_restaurant_history: 1 entry (first visit + code used)
```

**Different Query Patterns:**
```sql
-- "Is this first visit?" (Need answer in 1 query, fast)
SELECT EXISTS (
  SELECT 1 FROM customer_restaurant_history 
  WHERE customer_id = ? AND restaurant_id = ?
);
-- ✅ Simple, fast, indexed

-- If we used referrals table for this:
SELECT EXISTS (
  SELECT 1 FROM referrals 
  WHERE downline_id = ? AND restaurant_id = ?
);
-- ❌ Fails if customer didn't use referral code!
```

**Verdict: ✅ KEEP SEPARATE - Different purposes, customer may visit without referral**

---

### Question 3: Why separate `saved_referral_codes` table?

**Current Structure:**
```sql
saved_referral_codes
  ├── user_id (who saved it)
  ├── restaurant_id (where it's valid)
  ├── referral_code (the code)
  └── is_used (used or not)
```

#### **The Problem It Solves:**

**User Journey:**
1. Customer sees friend's Facebook post with link: `sharesaji.com/join/nasi-lemak/SAJI-ABC123`
2. Customer clicks link but **doesn't visit restaurant yet**
3. 2 weeks later, customer visits restaurant
4. How does system know which code to use?

**Without this table:**
- Code would be lost after link click
- Customer would need to remember code manually
- Bad user experience

**With this table:**
- Link click saves code to database
- Customer visits restaurant 2 weeks later
- Staff sees: "You have 1 saved code: SAJI-ABC123 (from Friend A)"
- Customer confirms which code to use

#### **Multiple Saved Codes Scenario:**

Customer activity:
1. Clicks Friend A's link → Code SAJI-ABC123 saved
2. Clicks Friend B's link → Code SAJI-BBB222 saved (also for same restaurant)
3. Visits restaurant → Staff shows both codes
4. Customer chooses Friend A → Mark SAJI-ABC123 as used
5. SAJI-BBB222 remains unused (could be used at different restaurant later)

**Why Not Store in `referrals` Table?**
- Referrals are only created **after transaction**
- Saved codes exist **before transaction**
- Different lifecycle stages

**Verdict: ✅ KEEP - Critical for user experience, tracks pre-transaction state**

---

### Question 4: Why separate `virtual_currency_ledger` from `transactions`?

**Current Structure:**
```sql
transactions
  ├── bill_amount (RM100)
  ├── guaranteed_discount (RM5)
  └── virtual_currency_redeemed (RM2)

virtual_currency_ledger
  ├── earn: +RM1 (from downline spend)
  ├── redeem: -RM2 (used at checkout)
  └── expire: -RM0.50 (expired after 30 days)
```

#### **Why Separate?**

**1. Ledger Pattern (Accounting Best Practice)**
- Every currency event is immutable record
- Full audit trail: "How did my balance change?"
- Can reconstruct balance at any point in time

**2. Different Transaction Types**
- **Earn**: No relation to transactions table (upline earns when downline spends)
- **Redeem**: Links to transactions table (customer redeems at checkout)
- **Expire**: No relation to transactions (daily cron job)

**3. Balance Calculation**
```sql
-- Current balance = SUM of all ledger entries
SELECT SUM(amount) FROM virtual_currency_ledger WHERE user_id = ?;
-- ✅ Simple, accurate, auditable
```

**If we stored balance in users table:**
```sql
-- Bad design:
ALTER TABLE users ADD COLUMN balance DECIMAL(10,2);

-- Problems:
-- 1. How to track history? (can't see past balances)
-- 2. Expiry entries have no place (not linked to transaction)
-- 3. Earnings from downlines have no place
-- 4. Race conditions when updating balance
```

**Verdict: ✅ KEEP - Ledger pattern is industry standard for currency tracking**

---

### Question 5: Why separate `email_notifications` table?

**Purpose:** Track sent emails to prevent duplicates and monitor delivery

**Scenario:**
1. Customer earns RM5 from downline → Send email
2. Server crashes before marking email as sent
3. Server restarts → Without tracking, sends duplicate email
4. Customer annoyed by spam

**With tracking:**
```sql
-- Before sending:
SELECT COUNT(*) FROM email_notifications 
WHERE user_id = ? 
  AND notification_type = 'earning' 
  AND related_entity_id = ? 
  AND sent_at > NOW() - INTERVAL '1 hour';

-- If count > 0: Skip (already sent)
-- If count = 0: Send and insert record
```

**Also tracks delivery status:**
- sent → delivered → opened (SendGrid webhook)
- sent → bounced (bad email address)
- sent → failed (server error)

**Verdict: ✅ KEEP - Prevents duplicate emails, tracks delivery status**

---

### Question 6: Why separate `menu_items` table?

**Could we store items in `restaurants` table?**

**Bad design:**
```sql
ALTER TABLE restaurants ADD COLUMN menu_items JSONB;
-- All items stored as JSON array in single column

-- Problems:
-- 1. Can't query by category efficiently
-- 2. Can't filter by price range
-- 3. Can't track inventory per item
-- 4. Can't join with transactions (no foreign key)
```

**Good design (current):**
```sql
CREATE TABLE menu_items (
  restaurant_id UUID, -- NULL = global catalog
  name VARCHAR(255),
  category VARCHAR(100),
  price DECIMAL(10,2),
  stock_quantity DECIMAL(10,2)
);

-- Benefits:
-- ✅ Can query: SELECT * FROM menu_items WHERE category = 'vegetables'
-- ✅ Can filter: SELECT * FROM menu_items WHERE price < 10
-- ✅ Can track stock: UPDATE menu_items SET stock_quantity = ? WHERE id = ?
-- ✅ Future: Link transactions to menu items (what did customer order?)
```

**Verdict: ✅ KEEP - Proper relational design, supports inventory and ordering**

---

## Potential Redundancies Found: 2

### 🔴 Redundancy 1: `age` field in users table

**Current:**
```sql
users
  ├── birthday DATE
  └── age INTEGER -- ❌ Can be calculated from birthday
```

**Why Redundant:**
```sql
-- Age can always be calculated:
SELECT EXTRACT(YEAR FROM AGE(CURRENT_DATE, birthday)) AS age FROM users;
```

**Recommendation:**
```sql
-- Option 1: Remove age column
ALTER TABLE users DROP COLUMN age;

-- Option 2: Make age a computed column (PostgreSQL 12+)
ALTER TABLE users DROP COLUMN age;
ALTER TABLE users ADD COLUMN age INTEGER GENERATED ALWAYS AS (
  EXTRACT(YEAR FROM AGE(CURRENT_DATE, birthday))
) STORED;
```

**However, keeping it may be intentional for:**
- Users who don't want to provide birthday (privacy)
- Age is required field, birthday is optional bonus
- Faster queries (no calculation needed)

**Verdict: ⚠️ MINOR REDUNDANCY - Consider removing or making computed**

---

### 🔴 Redundancy 2: `total_discount` and `final_amount` in transactions

**Current:**
```sql
transactions
  ├── bill_amount DECIMAL(10,2)
  ├── guaranteed_discount_amount DECIMAL(10,2)
  ├── virtual_currency_redeemed DECIMAL(10,2)
  ├── total_discount DECIMAL(10,2) GENERATED ALWAYS AS (...) STORED
  └── final_amount DECIMAL(10,2) GENERATED ALWAYS AS (...) STORED
```

**Why It's NOT Redundant:**
- ✅ Uses PostgreSQL GENERATED ALWAYS columns (computed automatically)
- ✅ Database guarantees accuracy (no calculation bugs in application code)
- ✅ Improves query performance (no need to calculate in SELECT)
- ✅ Simplifies application code

```sql
-- Without generated columns:
SELECT bill_amount - guaranteed_discount_amount - virtual_currency_redeemed AS final_amount
FROM transactions; -- Every query needs this calculation

-- With generated columns:
SELECT final_amount FROM transactions; -- Already calculated!
```

**Verdict: ✅ NOT REDUNDANT - Computed columns are best practice**

---

## Summary: Schema Design is Sound

### ✅ No Significant Redundancies

All table separations serve clear purposes:

1. **restaurants ↔ branches**: Multi-location support, branch-level analytics
2. **referrals ↔ customer_restaurant_history**: Different purposes (network vs first-visit)
3. **saved_referral_codes**: Pre-transaction state, UX critical
4. **virtual_currency_ledger**: Ledger pattern (accounting best practice)
5. **email_notifications**: Duplicate prevention, delivery tracking
6. **menu_items**: Proper relational design, future ordering system
7. **audit_logs**: Security compliance, debugging
8. **system_config**: Runtime configuration without code deployment

### ⚠️ Minor Optimization Opportunities

1. **Consider removing `age` column** (can be calculated from birthday)
2. **Add computed indexes** for frequently filtered columns
3. **Consider partitioning** transactions and ledger tables (when data grows large)

### 🎯 Design Follows Best Practices

- ✅ Proper normalization (3NF)
- ✅ No data duplication (except computed columns)
- ✅ Clear separation of concerns
- ✅ Scalable for multi-restaurant expansion
- ✅ Supports all documented workflows
- ✅ Ledger pattern for financial transactions
- ✅ Audit trail for compliance

**Conclusion:** The schema is well-designed for the ShareSaji platform. The separation of restaurants/branches is essential, not redundant. All tables serve distinct, necessary purposes.
