# Guaranteed Discount Scenarios Analysis
## ShareSaji - Strategic Business Decision

**Version:** 1.0  
**Date:** 2025-10-10  
**Decision Required:** 5% Discount Application Model

---

## Executive Summary

### Two Scenarios Being Evaluated:

| Aspect | **Scenario A: First Transaction Only** | **Scenario B: Every Transaction** |
|--------|----------------------------------------|-----------------------------------|
| **5% Discount Applies** | Only on first transaction per restaurant | On every transaction forever |
| **Cost to Restaurant** | 5-8% on new customers, 3-23% on returning | 5-28% on every transaction |
| **Customer Perception** | "Welcome bonus" | "Loyalty program" |
| **Virality Driver** | High (must share to earn) | Low (already getting discount) |
| **Database Complexity** | Medium (track first visit) | Low (no tracking needed) |

---

## Detailed Analysis by Impact Area

### 1. Cost Structure Comparison

#### **Scenario A: First Transaction Only (Current Design)**

**Per Customer Lifecycle:**
```
First Transaction:
├─ Bill: RM100
├─ Guaranteed discount: -RM5 (5%)
├─ Upline rewards: -RM3 (3% max, if has 3 uplines)
├─ VC redemption: -RM0 (unlikely to have balance yet)
└─ Total cost: RM8 (8% of bill)

Second Transaction:
├─ Bill: RM100
├─ Guaranteed discount: -RM0 (none)
├─ Upline rewards: -RM3 (3% max)
├─ VC redemption: -RM2 (if has RM2 saved)
└─ Total cost: RM5 (5% of bill)

Third+ Transactions:
├─ Bill: RM100
├─ Guaranteed discount: -RM0 (none)
├─ Upline rewards: -RM3 (3% max)
├─ VC redemption: -RM10 (if has RM50 saved, 20% max)
└─ Total cost: RM13 (13% of bill, but RM10 is customer's own earned money)
```

**Customer Lifetime Value (10 visits):**
- Total spent: RM1,000
- First visit cost: RM8 (8%)
- Visits 2-10 average: RM6 (6% - mix of upline rewards + small redemptions)
- **Total discount given: RM62**
- **Average discount rate: 6.2%**

#### **Scenario B: Every Transaction (Alternative)**

**Per Customer Lifecycle:**
```
Every Transaction:
├─ Bill: RM100
├─ Guaranteed discount: -RM5 (5% ALWAYS)
├─ Upline rewards: -RM3 (3% max)
├─ VC redemption: -RM20 (20% max, if customer has accumulated)
└─ Total cost: RM28 (28% of bill)
```

**Customer Lifetime Value (10 visits):**
- Total spent: RM1,000
- Every visit base cost: RM5 (5% guaranteed) + RM3 (3% upline) = RM8 (8%)
- Plus VC redemption: Varies, but can reach 20% if customer has balance
- **Total discount given: RM80 base + up to RM200 VC redemption**
- **Average discount rate: 8-28%**

---

### 2. Financial Impact on Restaurants

#### **Monthly Cost Analysis (500 transactions/month)**

**Assumptions:**
- 100 new customers per month (20% are new)
- 400 returning customers per month (80% are returning)
- Average bill: RM50

#### **Scenario A: First Transaction Only**

```
New Customers (100):
├─ Revenue: RM5,000 (100 × RM50)
├─ Guaranteed discount: -RM250 (5%)
├─ Upline rewards: -RM150 (3%)
└─ Cost: RM400 (8%)

Returning Customers (400):
├─ Revenue: RM20,000 (400 × RM50)
├─ Guaranteed discount: -RM0 (none)
├─ Upline rewards: -RM600 (3%)
├─ VC redemption: -RM400 (2% average - small redemptions)
└─ Cost: RM1,000 (5%)

Total Monthly:
├─ Revenue: RM25,000
├─ Total discounts: RM1,400
├─ Discount rate: 5.6%
└─ Net revenue after discounts: RM23,600
```

#### **Scenario B: Every Transaction**

```
All Customers (500):
├─ Revenue: RM25,000 (500 × RM50)
├─ Guaranteed discount: -RM1,250 (5% on all)
├─ Upline rewards: -RM750 (3%)
├─ VC redemption: -RM500 (2% average)
└─ Cost: RM2,500 (10%)

Total Monthly:
├─ Revenue: RM25,000
├─ Total discounts: RM2,500
├─ Discount rate: 10%
└─ Net revenue after discounts: RM22,500
```

**Cost Difference: Scenario B costs RM1,100 MORE per month (78% higher)**

---

### 3. ROI Comparison

Based on your documented assumptions (30% revenue increase from ShareSaji):

#### **Scenario A: First Transaction Only**

**Baseline (No ShareSaji):**
- Monthly revenue: RM25,000
- Transactions: 500

**With ShareSaji:**
- Monthly revenue: RM32,500 (+30%)
- Discount cost: RM1,820 (5.6% of RM32,500)
- **Net gain: RM5,680**
- **ROI: 312%** (RM5,680 / RM1,820)

#### **Scenario B: Every Transaction**

**With ShareSaji:**
- Monthly revenue: RM32,500 (+30%)
- Discount cost: RM3,250 (10% of RM32,500)
- **Net gain: RM4,250**
- **ROI: 131%** (RM4,250 / RM3,250)

**Scenario A delivers 2.4× better ROI**

---

### 4. Customer Psychology & Behavior

#### **Scenario A: First Transaction Only**

**Strengths:**
- ✅ **Creates urgency:** "Use it or lose it" mentality
- ✅ **Incentivizes sharing:** Only way to keep earning is through referrals
- ✅ **Perceived fairness:** "Everyone gets 5% to start"
- ✅ **Viral loop stronger:** Must refer others to continue earning
- ✅ **Customer acquisition focus:** Rewards bringing new customers

**Customer Journey:**
1. First visit: "Great! I got 5% off"
2. Second visit: "No discount... but I can earn by sharing!"
3. Shares code to friends
4. Friends visit → Customer earns RM1-3 per friend
5. Customer returns with RM10 balance → Redeems at checkout
6. "I earned this from my friends! I'll share more"

**Psychological Trigger:** **Reciprocity + Loss Aversion**
- "I got 5% off, now I want to give my friends the same benefit"
- "If I don't share, I won't earn anything on my next visit"

#### **Scenario B: Every Transaction**

**Strengths:**
- ✅ **Predictable savings:** Customer knows they always get 5%
- ✅ **Loyalty program feel:** Consistent benefit
- ✅ **Lower friction:** No need to track "first visit"
- ✅ **Simpler messaging:** "Always 5% off at this restaurant"

**Weaknesses:**
- ❌ **No sharing urgency:** Already getting discount without effort
- ❌ **Lower virality:** Why share if I already benefit?
- ❌ **Higher cost:** Restaurant pays 5% on every transaction forever
- ❌ **Competitive disadvantage:** Other platforms offer 10-30% without referral requirement

**Customer Journey:**
1. Every visit: "I get 5% off automatically"
2. Sees virtual currency: "I have RM10 earned from friends"
3. Thinks: "Nice bonus, but I'm already getting 5% off anyway"
4. **Sharing motivation LOW:** Already satisfied with 5%
5. Platform becomes discount card, not referral network

**Psychological Trigger:** **Complacency**
- "I'm already getting 5%, no urgency to share"

---

### 5. Virality & Network Effects

#### **Mathematical Model:**

**Virality Coefficient = (Users) × (Invitations Sent) × (Conversion Rate)**

**Scenario A Assumptions:**
- Users motivated to share: 60% (need to earn for next visit)
- Invitations per motivated user: 3
- Conversion rate: 30%
- **Virality coefficient: 0.54** (near self-sustaining)

**Scenario B Assumptions:**
- Users motivated to share: 20% (already satisfied with 5%)
- Invitations per motivated user: 1
- Conversion rate: 30%
- **Virality coefficient: 0.06** (requires constant marketing push)

**Network Growth Simulation (Starting with 100 users):**

| Month | Scenario A Users | Scenario B Users | Difference |
|-------|-----------------|------------------|------------|
| 1     | 100             | 100              | 0          |
| 2     | 154             | 106              | +48        |
| 3     | 237             | 112              | +125       |
| 4     | 365             | 119              | +246       |
| 5     | 562             | 126              | +436       |
| 6     | 866             | 134              | +732       |

**After 6 months, Scenario A has 6.5× more users**

---

### 6. Competitive Positioning

#### **Current Market Landscape:**

| Platform | Discount Model | Cost to Restaurant | Virality |
|----------|---------------|-------------------|----------|
| **Fave** | 20-50% off | 10-30% commission | Low (no referral) |
| **eatigo** | 10-50% off (time-based) | 10-20% commission | None |
| **GrabFood Vouchers** | RM5-20 off | High (30% delivery fee) | Low |
| **Traditional Loyalty Cards** | 1 free after 10 | Low (free coffee cost) | None |

#### **ShareSaji Positioning:**

**Scenario A (First Transaction Only):**
- **Discount:** 5% guaranteed + up to 20% earned = **5-25% total**
- **Cost:** 5-8% average
- **Unique Value:** "Earn while you eat" - passive income model
- **Positioning:** **"Viral Loyalty Network"** - not just discount, but earning platform
- **Competitor Comparison:** Lower cost than Fave/eatigo, higher virality, similar total discount

**Scenario B (Every Transaction):**
- **Discount:** 5% always + up to 20% earned = **5-25% total**
- **Cost:** 8-10% average
- **Unique Value:** Consistent discount + some earning
- **Positioning:** **"Discount Card with Bonus"** - just another loyalty card
- **Competitor Comparison:** Lower discount than Fave (20-50%), similar cost, no differentiation

**Scenario A creates unique category, Scenario B competes in crowded loyalty space**

---

### 7. Implementation Complexity

#### **Database & Code Requirements:**

| Feature | Scenario A | Scenario B | Winner |
|---------|-----------|-----------|--------|
| **Track first visit** | Required (`customer_restaurant_history` table) | Not needed | B (simpler) |
| **Checkout logic** | Check if first visit → Apply 5% | Always apply 5% | B (simpler) |
| **Testing scenarios** | Must test first + returning | Only test one flow | B (simpler) |
| **Database queries** | Extra JOIN to check history | No extra query | B (faster) |
| **Edge cases** | "What if history deleted?" | None | B (fewer bugs) |

**Development Time:**
- Scenario A: 2-3 extra days for first-visit tracking
- Scenario B: 0 extra days

**BUT:** Scenario A is already implemented in your current schema. Removing it would require schema changes.

---

### 8. Risk Analysis

#### **Scenario A Risks:**

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Users don't share** | Medium | High | Gamification, leaderboards, email reminders |
| **First-visit tracking fails** | Low | Medium | Database triggers + redundant checks |
| **Users complain about "only first visit"** | Low | Low | Clear messaging: "Share to keep earning" |
| **Virality slower than expected** | Medium | Medium | Adjust upline % to 1.5% or 2% |

#### **Scenario B Risks:**

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Low virality** | **High** | **Critical** | Heavy marketing spend (defeats purpose) |
| **High cost unsustainable** | **High** | **Critical** | Restaurants drop out |
| **Becomes just another discount card** | **High** | **High** | None (fundamental model issue) |
| **Competitors offer higher discounts** | Medium | High | Increase to 10% (even higher cost) |

**Scenario B has higher business risk**

---

### 9. Customer Acquisition Cost (CAC) Analysis

#### **Scenario A: First Transaction Only**

**Organic Growth (via referrals):**
- CAC per customer: **RM5** (5% guaranteed discount on first RM100 spend)
- Customer brings 1.5 friends on average (virality coefficient 0.54)
- Blended CAC: **RM5 / 1.5 = RM3.33 per customer**

**With Marketing:**
- Paid CAC: RM10 per customer (Facebook ads)
- Organic CAC: RM3.33 per customer
- 70% organic, 30% paid
- **Blended CAC: RM5.30**

#### **Scenario B: Every Transaction**

**Organic Growth (via referrals):**
- CAC per customer: **RM5** (5% guaranteed discount on first RM100 spend)
- Customer brings 0.2 friends on average (virality coefficient 0.06)
- Blended CAC: **RM5 / 0.2 = RM25 per customer** (mostly paid marketing)

**With Marketing:**
- Paid CAC: RM10 per customer
- Organic CAC: RM25 per customer
- 10% organic, 90% paid
- **Blended CAC: RM11.50**

**Scenario A has 2.2× lower customer acquisition cost**

---

### 10. Long-Term Platform Viability

#### **Scenario A: Network Effects Compound**

**Year 1:**
- 1,000 customers
- Virality coefficient: 0.54
- Growth: Organic-driven

**Year 2:**
- 5,000 customers (5× growth)
- Network effect: More uplines = more earning potential
- Platform becomes indispensable: "All my friends use ShareSaji"

**Year 3:**
- 25,000 customers (25× growth)
- Can charge restaurants for access to network
- Can launch cross-restaurant features
- **Platform has intrinsic value**

#### **Scenario B: Stagnant Growth**

**Year 1:**
- 1,000 customers
- Virality coefficient: 0.06
- Growth: Marketing-driven (expensive)

**Year 2:**
- 1,200 customers (1.2× growth)
- No network effect
- Restaurants question ROI

**Year 3:**
- 1,500 customers (1.5× growth)
- Competitors offer higher discounts
- Restaurants churn to cheaper alternatives
- **Platform is commoditized discount card**

---

## Decision Matrix

### Quantitative Comparison

| Metric | Scenario A | Scenario B | Winner |
|--------|-----------|-----------|--------|
| **Restaurant cost** | 5.6% avg | 10% avg | A (-44%) |
| **Restaurant ROI** | 312% | 131% | A (+138%) |
| **Virality coefficient** | 0.54 | 0.06 | A (9× higher) |
| **6-month user growth** | 866 users | 134 users | A (6.5× more) |
| **Customer ACQ cost** | RM5.30 | RM11.50 | A (-54%) |
| **Development time** | +2-3 days | 0 days | B (faster) |
| **Database complexity** | Medium | Low | B (simpler) |

**Scenario A wins 6 out of 7 metrics**

### Qualitative Comparison

| Factor | Scenario A | Scenario B |
|--------|-----------|-----------|
| **Market positioning** | ✅ Unique "viral loyalty network" | ❌ Commodity discount card |
| **Long-term viability** | ✅ Compounds via network effects | ❌ Stagnant without marketing |
| **Customer motivation** | ✅ High (must share to earn) | ❌ Low (already getting discount) |
| **Competitive moat** | ✅ Multi-level rewards unique | ❌ Easy to copy |
| **Revenue potential** | ✅ Can monetize network access | ❌ Limited to subscription fees |

---

## Recommendation

### ✅ **Choose Scenario A: First Transaction Only**

**Primary Reasons:**

1. **2.4× better ROI for restaurants** (312% vs 131%)
2. **9× higher virality** (0.54 vs 0.06 coefficient)
3. **6.5× more users after 6 months** (866 vs 134)
4. **54% lower customer acquisition cost** (RM5.30 vs RM11.50)
5. **Unique market positioning** (not just another discount card)
6. **Sustainable long-term** (network effects compound)

**Secondary Reasons:**

7. Lower ongoing cost for restaurants (5.6% vs 10%)
8. Stronger incentive for customer sharing
9. Creates defensible competitive moat
10. Aligns with your documented "viral marketing" vision

**Trade-offs Accepted:**

- ❌ 2-3 extra days of development (negligible)
- ❌ Slightly more complex database (already designed)
- ❌ Need to track first-visit status (good data to have anyway)

### Implementation Notes:

**Keep your current design:**
- ✅ `customer_restaurant_history` table tracks first visit
- ✅ `is_first_transaction` flag in transactions table
- ✅ Discount eligibility checked at checkout

**Messaging Strategy:**
- **To Customers:** "Get 5% off your first visit, then earn unlimited rewards by sharing!"
- **To Restaurants:** "Pay only 5-8% for new customers, then they spread the word for free"
- **USP:** "The only platform where customers earn passive income from dining"

---

## Alternative: Hybrid Model (Consider for Phase 2)

If Scenario A doesn't generate enough virality in beta testing, consider:

**Scenario C: Tiered Guaranteed Discount**
- First visit: 5% guaranteed
- If customer brings 1+ friend: 3% guaranteed forever
- If customer brings 3+ friends: 5% guaranteed forever

**Benefits:**
- Rewards active sharers with ongoing discounts
- Maintains virality incentive
- Costs only slightly more than Scenario A
- Creates tier system for gamification

**Cost:** 6-7% average (vs 5.6% Scenario A, 10% Scenario B)

**Recommendation:** Start with Scenario A (pure first-transaction), test in beta, consider Scenario C if virality is below target (coefficient < 0.3).

---

## Final Decision Framework

**Choose Scenario A if:**
- ✅ You want to build a viral, network-effect platform
- ✅ You prioritize long-term sustainable growth
- ✅ You want unique competitive positioning
- ✅ You're willing to invest 2-3 extra dev days

**Choose Scenario B if:**
- ❌ You only want a simple discount card
- ❌ You have large marketing budget for customer acquisition
- ❌ You don't care about virality
- ❌ You're comfortable with 10% ongoing costs

**Your documented vision aligns with Scenario A.** The PRD, Executive Summary, and all docs emphasize "viral marketing" and "multi-level rewards" - these only work with Scenario A.

---

**Recommendation: Proceed with Scenario A (Current Design)**

No database changes needed. Your schema is already optimized for the winning scenario.
