# Project Tracker & Changelog

## MakanTak - Development Status

**Document Type:** Project Management  
**Last Updated:** 2026-06-07 (RLS InitPlan Optimization, SECURITY DEFINER Lockdown, Frontend Audit Fixes)  
**Overall Status:** 🟢 Production Ready (100%)

---

## 1. Recent Updates (Changelog)

### 📅 Jun 2026 Updates

**Security & Performance Audit — Deep Fixes** ✅ (Jun 6-7)

- **SECURITY DEFINER Lockdown (P0):** Revoked `EXECUTE` from both `anon` and `public` roles on all 19 user-facing `SECURITY DEFINER` functions. Re-granted to `authenticated` for 18 functions. `generate_restaurant_referral_code` fully locked (internal-only). Migrations: `revoke_anon_execute_on_security_definer_functions`, `revoke_public_execute_regrant_authenticated`.
- **RLS InitPlan Optimization (P1):** Rewrote all 44 RLS policies to wrap `auth.uid()` in `(SELECT auth.uid())`, forcing PostgreSQL to evaluate the JWT once per query instead of per-row. Eliminates O(n) function calls on every table scan. Migrations: `fix_rls_initplan_wrap_auth_uid_in_select`, `fix_rls_initplan_remaining_policies_batch2`.
- **Configurable Discount Percentages (P1):** Removed hardcoded `5%` discount and `20%` max redemption from `CheckoutSheet`. Staff Dashboard now fetches `guaranteed_discount_percent` and `max_redemption_percent` from the `restaurants` table at runtime and passes them as props.
- **ErrorBoundary Production Guard (P2):** Wrapped technical error details in `import.meta.env.DEV` check. Vite dead-code eliminates the entire block in production builds.
- **Body Scroll Lock Dedup (P2):** Removed redundant manual `document.body.style.overflow` management from `CustomerDashboard`. The vaul Drawer component handles scroll locking natively.

**Security Hardening & Performance Fixes** ✅ (Jun 5-6)

- **Gemini API Key Migration (P0):** Moved Gemini API key from client-side (`VITE_GEMINI_API_KEY`) to server-side. Created `receipt-ocr` edge function to proxy Gemini Vision API calls securely. Removed `@google/generative-ai` from frontend dependencies.
- **Audit Log RLS Fix (P1):** Replaced permissive `WITH CHECK (true)` INSERT policy on `audit_logs` with `WITH CHECK (false)`. All legitimate inserts use SECURITY DEFINER functions or service role (both bypass RLS). Migration: `20260605000001_fix_audit_logs_insert_policy.sql`.
- **N+1 Query Fix (P1):** Customer dashboard was firing 1 + N queries (one per transaction) to fetch VC earned. Replaced with a single batch query using `.in()` filter, reducing 11 queries to 2.
- **CORS Hardening (P1):** Replaced wildcard `Access-Control-Allow-Origin: *` on all edge functions with an origin whitelist (`www.makantak.com`, `makantak.com`, `localhost:5173`). Removed CORS from `expire-vc` entirely (cron-only, never called from browsers).

### 📅 Mar 2026 Updates

**Security Audit — Function Authorization & RLS Policy Fixes** ✅ (Mar 6)

- **Function Authorization:** Added caller identity and role verification to 4 critical `SECURITY DEFINER` functions: `process_checkout_transaction` (staff-only, branch-scoped), `void_transaction` (staff at same restaurant or admin), `update_transaction_with_receipt` (staff at same restaurant or admin), `find_transaction_by_receipt` (staff at same restaurant or admin).
- **RLS Policy Fix:** Fixed 12 RLS policies that referenced the invalid `'owner'` role (not in check constraint). Updated all to use correct `'merchant'` role.
- **Multi-Restaurant Support:** Upgraded merchant RLS policies from single-restaurant scoping (`users.restaurant_id`) to multi-restaurant support via `restaurants.merchant_id`.
- **Dashboard & Referral Authorization:** Added merchant/admin authorization to `get_dashboard_summary` and `get_top_sharers`. Added staff/admin authorization to `create_referral_chain` (defense-in-depth since it's called internally from `process_checkout_transaction`).
- **Rate Limit & Referral Code Authorization:** Added caller identity verification to `check_ai_chat_rate_limit`, `get_ai_chat_rate_limit_status`, and `generate_restaurant_referral_code`. Allows service role calls (from edge functions) while blocking cross-user abuse via direct RPC.
- **Migrations:** `20260306000003_fix_function_authorization.sql`, `20260306000004_fix_owner_to_merchant_rls_policies.sql`, `20260306000005_fix_dashboard_referral_authorization.sql`, `20260306000006_fix_rate_limit_referral_code_authorization.sql`.

### 📅 Feb 2026 Updates

**Merchant AI Chat Assistant** ✅ (Feb 3)

- **Edge Function:** Secure `ai-chat` function deployed with streaming support.
- **Gemini Integration:** Uses `gemini-2.5-flash` model for business analytics insights.
- **Rate Limiting:** Database-backed rate limiting (50 messages/hour per user).
- **Session Persistence:** Chat history stored in `ai_chat_sessions` and `ai_chat_messages` tables.
- **Security:** API key secured server-side, JWT authentication required.

**RFM Customer Segmentation** ✅ (Feb 3)

- **Database Views:** Implemented proper RFM (Recency, Frequency, Monetary) scoring.
- **Segments:** Champions, Loyal Customers, Potential Loyalists, At Risk, New Customers, Promising, Hibernating.
- **Dashboard:** `get_dashboard_summary` now returns `rfm_segmentation` data.
- **Referral Codes:** Updated schema to support longer referral codes (VARCHAR 255).

### 📅 Dec 2025 Updates

**Security Audit & Database Hardening** ✅ (Dec 25)

- **RLS Policies:** Fixed `staff_view_customer_ledger` to scope to restaurant only.
- **Signup Policy:** `users_allow_signup` now requires `id = auth.uid()`.
- **Function Security:** Added `SET search_path = public, pg_temp` to 19 functions.
- **Result:** Security warnings reduced from 21 → 2 (remaining require Pro Plan).

**E2E Testing Setup** ✅ (Dec 25)

- **Playwright:** Configured with auth fixtures for customer/staff roles.
- **Test Files:** `auth.spec.ts`, `navigation.spec.ts`, `customer.spec.ts`, `staff.spec.ts`.
- **Auth Setup:** Dedicated E2E test users created in Supabase Auth.

**Database Function Tests** ✅ (Dec 25)

- **Vitest:** Configured for database function testing.
- **Test Data:** Seeding script created (`seed-test-data.ts`).
- **Coverage:** Referral chains, virtual currency, transaction voids, PDPA deletion.

**Role & Schema Standardization** ✅

- **Database:** Migrated legacy `owner` roles to `merchant`.
- **Constraint:** Updated `users` table constraint to strictly enforce `merchant` role.
- **Frontend:** Standardized all protected routes to use `merchant` role.

**UX & Reliability Improvements** ✅

- **Mobile UX:** Enhanced Merchant Dashboard tabs for better readability on small screens.
- **Visuals:** Improved `StatsCard` contrast and visibility against green backgrounds.
- **Login:** Fixed race condition in redirection logic and added autocomplete attributes.
- **Analytics:** Fixed 406 error on empty states by handling zero-row returns gracefully.

### 📅 Nov 2025 Updates

**VC Expiry Cron Job Deployed** ✅

- **Edge Function:** `expire-vc` deployed to Supabase.
- **Automation:** Runs daily at 2:00 AM MYT via `pg_cron`.
- **Logic:** Expires virtual currency older than 30 days.

**Production Ready - Legal & Security** ✅

- **PDPA:** Privacy Policy (`/privacy`) and Terms (`/terms`) published.
- **Consent:** Checkbox added to registration.
- **Auth:** Password recovery flow implemented (`/forgot-password`).
- **Validation:** Age verification (18+) enforced.

**Staff Dashboard Redesign** ✅

- **Streamlined Checkout:** Single-screen flow (Scan -> Verify -> Redeem -> Pay).
- **QR Scanner:** Replaced `html5-qrcode` with `@yudiel/react-qr-scanner` (Faster, lighter).
- **Responsive:** Split-view for iPad landscape mode.

**Merchant Dashboard Analytics** ✅

- **Three Tabs:** Customer Insights, Business Metrics, Viral Performance.
- **RFM Analysis:** Customer segmentation (Champions, At Risk, etc.) using percentile scoring.
- **Charts:** Visualized revenue trends and network growth.

---

## 2. Phase Roadmap

### ✅ PHASE 1: Foundation (Customer Portal)

**Goal:** Core identity, Referral logic, and Wallet.

- [x] **Auth:** Register, Login, Profile Management.
- [x] **Wallet:** VC Balance, Transaction History.
- [x] **Referrals:** Auto-generate restaurant-specific codes.
- [x] **Sharing:** Social share buttons, Link copying.

### ✅ PHASE 2: Operations (Staff Portal)

**Goal:** Efficient point-of-sale interaction.

- [x] **QR Scanner:** Camera integration.
- [x] **Verification:** Detect "First Visit" & "Birthday".
- [x] **Transactions:** Manual bill entry + VC Redemption logic.
- [x] **Receipts:** Photo upload & AI OCR extraction.

### ✅ PHASE 3: Scale & Analytics (Merchant Portal)

**Goal:** Data visibility and automation.

- [x] **Analytics Dashboard:** Revenue & ROI charts.
- [x] **Management:** Staff & Branch CRUD.
- [x] **Automated OCR:** Full Gemini AI integration with fuzzy menu matching.
- [x] **AI Chat Assistant:** Gemini-powered business insights with streaming responses.
- [ ] **Email Automation:** SendGrid integration for "Earning" notifications (Edge Function not yet implemented).

### ✅ PHASE 4: Production Readiness

**Goal:** Security, testing, and reliability.

- [x] **Security Audit:** RLS policies reviewed, function hardening applied.
- [x] **E2E Tests:** Playwright configured with auth fixtures.
- [x] **Database Tests:** Vitest setup for RPC function testing.
- [x] **Edge Cases:** Test coverage for referrals, VC, voids, PDPA.

---

## 3. User Stories Status (Epics)

### Customer Features

| ID     | Feature                     | Status              |
| :----- | :-------------------------- | :------------------ |
| US-C01 | Register with Referral Code | ✅ Done             |
| US-C02 | View/Share Code & QR        | ✅ Done             |
| US-C05 | View Wallet Balance         | ✅ Done             |
| US-C08 | View Referral Network       | ✅ Done (List view) |

### Staff Features

| ID     | Feature                               | Status  |
| :----- | :------------------------------------ | :------ |
| US-S01 | Scan Customer QR                      | ✅ Done |
| US-S04 | Calculate Discounts (Guaranteed + VC) | ✅ Done |
| US-S05 | Record Transaction                    | ✅ Done |
| US-S06 | Upload Receipt Photo & Auto-Extract   | ✅ Done |

### System Features

| ID     | Feature                           | Status  |
| :----- | :-------------------------------- | :------ |
| US-T04 | Create Referral Chain (3 Levels)  | ✅ Done |
| US-T05 | Distribute Rewards (1% per level) | ✅ Done |
| US-T07 | Daily Expiry Cron                 | ✅ Done |
