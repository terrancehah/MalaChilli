# Project Tracker & Changelog

## MakanTak - Development Status

**Document Type:** Project Management  
**Last Updated:** 2025-12-25 (Security Audit & E2E Tests)  
**Overall Status:** 🟢 Production Ready (99%) - Final Polish

---

## 1. Recent Updates (Changelog)

### 📅 Dec 2025 Updates

**Security Audit & Database Hardening** ✅ (Dec 25)

* **RLS Policies:** Fixed `staff_view_customer_ledger` to scope to restaurant only.
* **Signup Policy:** `users_allow_signup` now requires `id = auth.uid()`.
* **Function Security:** Added `SET search_path = public, pg_temp` to 19 functions.
* **Result:** Security warnings reduced from 21 → 2 (remaining require Pro Plan).

**E2E Testing Setup** ✅ (Dec 25)

* **Playwright:** Configured with auth fixtures for customer/staff roles.
* **Test Files:** `auth.spec.ts`, `navigation.spec.ts`, `customer.spec.ts`, `staff.spec.ts`.
* **Auth Setup:** Dedicated E2E test users created in Supabase Auth.

**Database Function Tests** ✅ (Dec 25)

* **Vitest:** Configured for database function testing.
* **Test Data:** Seeding script created (`seed-test-data.ts`).
* **Coverage:** Referral chains, virtual currency, transaction voids, PDPA deletion.

**Role & Schema Standardization** ✅

* **Database:** Migrated legacy `owner` roles to `merchant`.
* **Constraint:** Updated `users` table constraint to strictly enforce `merchant` role.
* **Frontend:** Standardized all protected routes to use `merchant` role.

**UX & Reliability Improvements** ✅

* **Mobile UX:** Enhanced Merchant Dashboard tabs for better readability on small screens.
* **Visuals:** Improved `StatsCard` contrast and visibility against green backgrounds.
* **Login:** Fixed race condition in redirection logic and added autocomplete attributes.
* **Analytics:** Fixed 406 error on empty states by handling zero-row returns gracefully.

### 📅 Nov 2025 Updates

**VC Expiry Cron Job Deployed** ✅

* **Edge Function:** `expire-vc` deployed to Supabase.
* **Automation:** Runs daily at 2:00 AM MYT via `pg_cron`.
* **Logic:** Expires virtual currency older than 30 days.

**Production Ready - Legal & Security** ✅

* **PDPA:** Privacy Policy (`/privacy`) and Terms (`/terms`) published.
* **Consent:** Checkbox added to registration.
* **Auth:** Password recovery flow implemented (`/forgot-password`).
* **Validation:** Age verification (18+) enforced.

**Staff Dashboard Redesign** ✅

* **Streamlined Checkout:** Single-screen flow (Scan -> Verify -> Redeem -> Pay).
* **QR Scanner:** Replaced `html5-qrcode` with `@yudiel/react-qr-scanner` (Faster, lighter).
* **Responsive:** Split-view for iPad landscape mode.

**Merchant Dashboard Analytics** ✅

* **Three Tabs:** Customer Insights, Business Metrics, Viral Performance.
* **RFM Analysis:** Customer segmentation (Champions, At Risk, etc.) using percentile scoring.
* **Charts:** Visualized revenue trends and network growth.

---

## 2. Phase Roadmap

### ✅ PHASE 1: Foundation (Customer Portal)

**Goal:** Core identity, Referral logic, and Wallet.

* [x] **Auth:** Register, Login, Profile Management.
* [x] **Wallet:** VC Balance, Transaction History.
* [x] **Referrals:** Auto-generate restaurant-specific codes.
* [x] **Sharing:** Social share buttons, Link copying.

### ✅ PHASE 2: Operations (Staff Portal)

**Goal:** Efficient point-of-sale interaction.

* [x] **QR Scanner:** Camera integration.
* [x] **Verification:** Detect "First Visit" & "Birthday".
* [x] **Transactions:** Manual bill entry + VC Redemption logic.
* [x] **Receipts:** Photo upload & AI OCR extraction.

### ✅ PHASE 3: Scale & Analytics (Merchant Portal)

**Goal:** Data visibility and automation.

* [x] **Analytics Dashboard:** Revenue & ROI charts.
* [x] **Management:** Staff & Branch CRUD.
* [x] **Automated OCR:** Full Gemini AI integration with fuzzy menu matching.
* [ ] **Email Automation:** SendGrid integration for "Earning" notifications (Edge Function not yet implemented).

### ✅ PHASE 4: Production Readiness

**Goal:** Security, testing, and reliability.

* [x] **Security Audit:** RLS policies reviewed, function hardening applied.
* [x] **E2E Tests:** Playwright configured with auth fixtures.
* [x] **Database Tests:** Vitest setup for RPC function testing.
* [x] **Edge Cases:** Test coverage for referrals, VC, voids, PDPA.

---

## 3. User Stories Status (Epics)

### Customer Features

| ID | Feature | Status |
| :--- | :--- | :--- |
| US-C01 | Register with Referral Code | ✅ Done |
| US-C02 | View/Share Code & QR | ✅ Done |
| US-C05 | View Wallet Balance | ✅ Done |
| US-C08 | View Referral Network | ✅ Done (List view) |

### Staff Features

| ID | Feature | Status |
| :--- | :--- | :--- |
| US-S01 | Scan Customer QR | ✅ Done |
| US-S04 | Calculate Discounts (Guaranteed + VC) | ✅ Done |
| US-S05 | Record Transaction | ✅ Done |
| US-S06 | Upload Receipt Photo & Auto-Extract | ✅ Done |

### System Features

| ID | Feature | Status |
| :--- | :--- | :--- |
| US-T04 | Create Referral Chain (3 Levels) | ✅ Done |
| US-T05 | Distribute Rewards (1% per level) | ✅ Done |
| US-T07 | Daily Expiry Cron | ✅ Done |
