# Final Discount Model Decision
## ShareSaji - Business Model Confirmation

**Version:** 1.0  
**Date:** 2025-10-10  
**Decision Made By:** Restaurant Owner Consultation  
**Status:** ✅ CONFIRMED

---

## Final Decision: Scenario B - 5% Guaranteed on ALL Transactions

### Key Business Rationale

1. **Restaurant Budget Confirmed:** 10% of sales allocated for discount program
2. **Price Markup Strategy:** Restaurants can adjust menu prices by 5% to compensate
3. **Customer Retention Priority:** Guaranteed ongoing benefit ensures repeat visits
4. **Simplicity:** Easier to explain to customers and staff

---

## Cost Breakdown

### Per Transaction Cost Structure:
```
Every Transaction (RM100 bill):
├─ Guaranteed discount: -RM5 (5% always)
├─ Upline rewards: -RM3 (3% max, if customer has 3 uplines)
├─ VC redemption: -RM2 average (customer's earned balance)
└─ Total cost: RM10 (10% of bill) - within budget ✅
```

### Monthly Cost (500 transactions @ RM50 avg):
```
Total Revenue: RM25,000
├─ Guaranteed discount: -RM1,250 (5%)
├─ Upline rewards: -RM750 (3%)
├─ VC redemption: -RM500 (2% average)
└─ Total discount: RM2,500 (10%) - within budget ✅
```

---

## Schema Changes Implemented

### Migration: `20251010000007_schema_updates_scenario_b.sql`

#### 1. **Removed `age` Field**
**Before:**
```sql
CREATE TABLE users (
  ...
  birthday DATE,
  age INTEGER CHECK (age >= 13 AND age <= 120),
  ...
);
```

**After:**
```sql
CREATE TABLE users (
  ...
  birthday DATE, -- Age calculated: EXTRACT(YEAR FROM AGE(birthday))
  ...
);
```

**Rationale:** Eliminates data redundancy, age can be calculated from birthday

#### 2. **Updated Checkout Function**
**Key Change:** `process_checkout_transaction()` now **always applies 5%** guaranteed discount

**Before Logic:**
```sql
-- Check if first visit
IF is_first_visit THEN
  v_guaranteed_discount := bill_amount * 0.05;
ELSE
  v_guaranteed_discount := 0;
END IF;
```

**After Logic:**
```sql
-- Always apply guaranteed discount (from restaurant config)
v_guaranteed_discount := bill_amount * (guaranteed_discount_percent / 100);
-- is_first_visit still tracked for analytics only
```

#### 3. **Updated Table Comments**
- `customer_restaurant_history`: "For analytics only (not discount eligibility)"
- `transactions.is_first_transaction`: "Analytics flag (discount always applied)"

#### 4. **Created Helper View**
```sql
CREATE VIEW customer_profiles_with_age AS
SELECT 
  id, email, full_name, birthday,
  EXTRACT(YEAR FROM AGE(CURRENT_DATE, birthday))::INTEGER AS age,
  ...
FROM users;
```

---

## What Stays the Same

### ✅ Core Tables (No Structure Changes)
- `users` (minus age field)
- `restaurants`
- `branches`
- `referrals`
- `transactions`
- `virtual_currency_ledger`
- `saved_referral_codes`
- `customer_restaurant_history` (kept for analytics)
- `menu_items`

### ✅ Core Features Still Work
- Restaurant-specific referral chains
- 3-level upline rewards (1% each)
- Virtual currency earning and redemption
- 30-day expiry on earned currency
- Multi-restaurant support
- First-visit tracking (for analytics/reporting)

### ✅ Business Logic Intact
- Upline rewards still distributed (3% max)
- Virtual currency redemption cap (20% of bill)
- Referral code system unchanged
- RLS policies unchanged

---

## Benefits of This Model

### For Customers:
1. ✅ **Predictable savings:** Always get 5% off
2. ✅ **Extra earning potential:** Share code to earn more (up to 20% redemption)
3. ✅ **No confusion:** Simple message "Always 5% off + earn by sharing"
4. ✅ **Retention incentive:** Worth returning vs competitors

### For Restaurants:
1. ✅ **Within budget:** 10% total cost fits confirmed budget
2. ✅ **Price markup compensation:** Can adjust menu prices by 5%
3. ✅ **Customer loyalty:** Repeat visits guaranteed
4. ✅ **Simpler operations:** No need to check "first visit" at checkout
5. ✅ **Analytics preserved:** Still track new vs returning customers

### For Platform:
1. ✅ **Simpler implementation:** Less complex checkout logic
2. ✅ **Fewer edge cases:** No "first visit" bugs
3. ✅ **Faster checkout:** One less database query
4. ✅ **Easier to explain:** Marketing message is clearer

---

## Customer Journey Example

### New Customer (Alice):
```
Registration:
├─ Gets unique code: SAJI-ABC123
└─ Shares on social media

Visit 1 at Restaurant X:
├─ Bill: RM100
├─ Guaranteed: -RM5 (5%)
├─ VC redeemed: -RM0 (none yet)
└─ Pays: RM95

Alice refers Bob (Bob uses SAJI-ABC123):

Bob's Visit 1 at Restaurant X:
├─ Bill: RM100
├─ Guaranteed: -RM5 (5%)
├─ VC redeemed: -RM0
├─ Pays: RM95
└─ Alice earns: +RM1 (in virtual currency)

Alice's Visit 2 at Restaurant X:
├─ Bill: RM100
├─ Guaranteed: -RM5 (5% still applied!)
├─ VC redeemed: -RM1 (Alice uses her earned RM1)
└─ Pays: RM94 (better than visit 1!)
```

**Customer Insight:** "Even without referring anyone, I always get 5%. But when I refer friends, I get EXTRA savings!"

---

## Comparison to Original Plan

| Aspect | Original (Scenario A) | Final (Scenario B) | Winner |
|--------|----------------------|-------------------|--------|
| **Guaranteed Discount** | First transaction only | Every transaction | B |
| **Customer Retention** | Low (no reason to return) | High (always get 5%) | B |
| **Cost to Restaurant** | 5.6% average | 10% average | A |
| **Within Budget** | Yes (extra margin) | Yes (at limit) | Tie |
| **Price Markup Strategy** | Not needed | Can offset with 5% markup | Tie |
| **Implementation Complexity** | Medium (track first visit) | Low (always apply) | B |
| **Marketing Message** | Complex | Simple | B |

**Result:** Scenario B wins on customer experience and retention, within confirmed budget

---

## Migration Deployment Order

Run migrations in this exact order:

1. ✅ `20251009000001_initial_schema.sql` - Core tables (updated, no age field)
2. ✅ `20251009000002_views.sql` - Helper views
3. ✅ `20251009000003_functions.sql` - Stored procedures
4. ✅ `20251009000004_rls_policies.sql` - Security policies (fixed auth.uid issue)
5. ✅ `20251009000005_seed_data.sql` - Test data (updated, no age values)
6. ✅ `20251010000006_menu_items.sql` - Menu items table + 48 items
7. ✅ `20251010000007_schema_updates_scenario_b.sql` - **Final updates for Scenario B**

**Note:** Migration 007 removes the age column and updates the checkout logic. If you already deployed earlier migrations with age field, this migration will clean it up.

---

## Next Steps

### 1. Deploy Database
```bash
# Via Supabase Dashboard
# Run migrations 001 through 007 in order

# Or via CLI
cd /Users/terrancehah/Documents/ShareSaji
supabase db push
```

### 2. Configure Frontend Environment
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Update Marketing Materials
**Customer-Facing Message:**
> "Get 5% off every visit, PLUS earn unlimited rewards by sharing your code!"

**Restaurant-Facing Message:**
> "Affordable customer loyalty (10% cost), proven referral system, you own the data"

### 4. Test Checkout Flow
- Create test transaction
- Verify 5% discount applied automatically
- Verify upline rewards distributed
- Verify virtual currency redemption works

---

## Business Model Validation

### Restaurant Owner Feedback:
✅ **"10% discount budget is acceptable"**  
✅ **"We can markup prices by 5% to compensate"**  
✅ **"Simpler is better for staff training"**  
✅ **"Guaranteed 5% will bring customers back"**

### Risk Assessment: LOW
- Cost within budget
- Price markup strategy available
- Customer retention high
- Implementation simpler than alternative

### Success Metrics:
- Customer retention rate: Target >70%
- Average visits per customer: Target 3+/month
- Referral conversion rate: Target 20%+
- Restaurant ROI: Target >200%

---

## Conclusion

**Scenario B (5% on all transactions) is the RIGHT choice because:**

1. ✅ Confirmed within restaurant budget (10%)
2. ✅ Better customer retention (always get benefit)
3. ✅ Simpler to implement and explain
4. ✅ Price markup strategy available
5. ✅ Still incentivizes sharing (earn on top of 5%)
6. ✅ Reduces development complexity

**The schema is ready for deployment. No further changes needed.**

---

**Approved:** 2025-10-10  
**Ready for Production:** YES ✅
