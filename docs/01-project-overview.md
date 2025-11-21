# Project Overview
## MalaChilli - Viral Restaurant Discount Platform

**Document Type:** Master Project Overview  
**Last Updated:** 2025-11-21 (Consolidated)  
**Status:** Production Ready / Active Development

---

## 1. Vision & Value Proposition

MalaChilli is a web-based viral marketing platform that helps Malaysian local restaurants increase foot traffic and sales through multi-level discount sharing.

**Tagline:** *"Share the savings, grow the community"*

### The Core Problem
1.  **High Acquisition Costs:** Traditional ads (FB/Google) are expensive with low ROI.
2.  **No Loyalty Loop:** One-time discounts don't encourage repeat visits or referrals.
3.  **Lack of Data:** Owners lack visibility into who their top brand ambassadors are.

### The Solution
*   **For Customers:** Guaranteed 5% discount + Unlimited earning potential (1% of downline spending) + Passive income from 3 levels of referrals.
*   **For Restaurants:** Pay-for-performance (cost caps at ~8%) + Measurable ROI + Zero upfront marketing cost.

---

## 2. Core Mechanics (How It Works)

### The Viral Loop
1.  **Register:** Customer scans QR at counter, registers, and gets a unique **Customer ID** (e.g., `CHILLI-ABC123`).
2.  **First Visit:** Customer gets a **Guaranteed 5% Discount** on their first visit to *any* participating restaurant.
3.  **Share:** System automatically generates a **Restaurant-Specific Promotion Code** (e.g., `CHILLI-REST1-XYZ`) for that customer.
4.  **Earn:** When a friend uses that code:
    *   Friend gets 5% discount (First Visit).
    *   Original Customer earns **1% of the bill** as Virtual Currency (VC).
    *   Uplines (Level 2 & 3) also earn 1% each.
5.  **Redeem:** VC can be redeemed at checkout (capped at 20% of total bill).

### Multi-Level Rewards Model
*   **Level 1 (Direct Referrer):** Earns 1%
*   **Level 2 (Upline's Upline):** Earns 1%
*   **Level 3 (Grand-upline):** Earns 1%
*   **Restaurant Cost Cap:** 5% (Guaranteed) + 3% (Referrals) = **Max 8% Marketing Cost**

---

## 3. MVP Scope (MoSCoW)

### MUST HAVE (Critical Features)
**Customer Portal**
*   ✅ **Registration/Auth:** Email, Password, Birthday, Age validation.
*   ✅ **Referral System:** Unique Customer ID generation, QR display.
*   ✅ **Wallet:** Balance display, transaction history (Earnings/Redemptions).
*   ✅ **Restaurant Promotion:** Auto-generation of restaurant-specific share codes.

**Staff Portal**
*   ✅ **Checkout Flow:** QR Scanning (Camera), Manual Code Entry fallback.
*   ✅ **Transaction Processing:** Bill entry, VC redemption (max 20%), Discount calculation.
*   ✅ **Customer Verification:** First-visit detection, Birthday detection.

**Owner Portal**
*   ✅ **Analytics Dashboard:** Revenue, Discounts, ROI tracking.
*   ✅ **Customer Insights:** RFM Segmentation (Recency, Frequency, Monetary).
*   ✅ **Management:** Branch and Staff management.

**Backend**
*   ✅ **Referral Logic:** 3-level upline tracking.
*   ✅ **Expiry System:** 30-day expiry for earned VC (Cron job).
*   ✅ **Security:** RLS policies, Role-based access (Customer/Staff/Owner).

### SHOULD HAVE (High Priority Post-MVP)
*   🔶 **Detailed Tree View:** Visual graph of downlines (currently list view).
*   🔶 **CSV Exports:** Data export for owners.
*   🔶 **Transaction List:** Searchable history for owners.

### WON'T HAVE (Phase 2/3)
*   ❌ **AI OCR:** Automated receipt scanning (currently manual entry + photo upload).
*   ❌ **Cross-Restaurant Network:** Wallet is currently scoped to the specific restaurant chain for the pilot.
*   ❌ **Native Mobile Apps:** PWA/Web-only for now.

---

## 4. Market Opportunity

*   **Target:** Malaysian local restaurants (Kopitiam, Mamak, Cafes).
*   **Initial Focus:** Klang Valley (Pilot phase).
*   **Differentiation:** Unlike GrabFood/Foodpanda (high commissions) or Fave (one-off deals), MalaChilli builds **owned** referral networks for restaurants.
