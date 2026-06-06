# Technical Reference

## MakanTak - System Architecture & Data Model

**Document Type:** Technical Reference  
**Last Updated:** 2026-06-06 (Security Hardening — API Key Migration, CORS, RLS & N+1 Fix)  
**Source of Truth:**

- **Database Schema:** `/supabase/migrations/`
- **Frontend Types:** `/frontend/src/types/`
- **API Client:** `/frontend/src/lib/supabase.ts`

---

## 1. Technology Stack

### Frontend

- **Framework:** React 18+ (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **State:** React Context + Hooks
- **Internationalization:** Custom i18n (EN/MS/ZH)
- **Key Libraries:** `react-qr-code` (Gen), `@yudiel/react-qr-scanner` (Scan), `recharts` (Analytics)

### Backend (Supabase BaaS)

- **Database:** PostgreSQL 15
- **Auth:** Supabase Auth (Email/Password + Magic Link)
- **API:** Auto-generated REST API + Edge Functions
- **Realtime:** Supabase Realtime (Planned for wallet updates - not yet implemented)
- **Storage:** Supabase Storage (Receipt photos)

### Infrastructure

- **Frontend Hosting:** Vercel
- **Backend Hosting:** Supabase Cloud
- **Email:** SendGrid (via Edge Functions)

---

## 2. Database Schema Overview

> **Note:** For the exact schema definition, always check the latest migration file in `/supabase/migrations/`.

### Core Entity Relationship Diagram (ERD)

`[Restaurants] 1 -- * [Branches]
      |
      1
      |
      *
[Users] 1 -- * [Transactions] 1 -- * [TransactionItems]
   |
   +-- 1 -- * [Referrals] (Self-referencing: Upline/Downline)
   |
   +-- 1 -- * [VirtualCurrencyLedger]
   |
   +-- 1 -- * [UserRestaurantReferralCodes]`

### Key Tables

| Table Name                           | Purpose                                          | Key Notes                                                                                                                                                                                              |
| :----------------------------------- | :----------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`users`**                          | All accounts (Customer, Staff, Merchant, Admin). | Role-based access. Includes `preferred_language`, `last_login`, PDPA fields (`is_deleted`, `deleted_at`, `deletion_reason`).                                                                           |
| **`restaurants`**                    | Restaurant entities.                             | `merchant_id` links to owner (one merchant can own multiple restaurants). Configures `guaranteed_discount_percent`, `upline_reward_percent`, `max_redemption_percent`, `virtual_currency_expiry_days`. |
| **`branches`**                       | Physical locations.                              | Required `address`. Optional `city`, `state`, `postal_code` for location filtering.                                                                                                                    |
| **`transactions`**                   | Checkout records.                                | Stores amounts, OCR data (`ocr_processed`, `ocr_data`), `status` (completed/voided).                                                                                                                   |
| **`transaction_items`**              | Line items from receipts.                        | Supports OCR extraction with `match_confidence` and item-level analytics.                                                                                                                              |
| **`referrals`**                      | Upline-Downline links.                           | Tracks relationships **per restaurant**. `upline_level` (1-3).                                                                                                                                         |
| **`virtual_currency_ledger`**        | Wallet history.                                  | Tracks `earn`, `redeem`, `expire`. Includes `balance_after`, `upline_level`, `related_user_id`.                                                                                                        |
| **`user_restaurant_referral_codes`** | Share codes.                                     | Format: `MAKANTAK-{restaurant_slug}-{customer_name}`.                                                                                                                                                  |
| **`saved_referral_codes`**           | Pending referrals.                               | Codes saved before first visit. `upline_user_id` derived from lookup.                                                                                                                                  |
| **`customer_restaurant_history`**    | Visit tracking.                                  | Tracks `first_visit_date`, `total_visits`, `total_spent` per restaurant.                                                                                                                               |
| **`menu_items`**                     | Restaurant menu/products.                        | For OCR matching and inventory management.                                                                                                                                                             |
| **`email_notifications`**            | Email tracking.                                  | Tracks sent emails to prevent duplicates.                                                                                                                                                              |
| **`audit_logs`**                     | Action logging.                                  | Tracks critical actions for security and debugging.                                                                                                                                                    |
| **`system_config`**                  | System settings.                                 | System-wide configuration parameters.                                                                                                                                                                  |
| **`ai_chat_sessions`**               | AI chat sessions.                                | Stores chat sessions with context snapshots for merchant AI assistant.                                                                                                                                 |
| **`ai_chat_messages`**               | Chat messages.                                   | Individual messages within AI chat sessions (user and model roles).                                                                                                                                    |
| **`ai_chat_rate_limits`**            | Rate limiting.                                   | Tracks message counts per user for rate limiting (50/hour).                                                                                                                                            |

---

## 3. Security Architecture

### Authentication & Authorization

- **JWT:** All API requests are authenticated via Supabase JWT.
- **RBAC:** Users have a `role` column (`customer`, `staff`, `merchant`, `admin`).
- **RLS (Row Level Security):** Database policies enforce access control at the SQL level.
  - _Customers_ can only see their own data.
  - _Staff_ can see data for their assigned branch/restaurant.
  - _Merchants_ can see data for all restaurants they own (via `restaurants.merchant_id`).
  - _Admins_ have full system access (via specific admin policies).
- **SECURITY DEFINER Functions:** Critical transaction functions include explicit authorization checks at the start of the function body, verifying the caller's role and restaurant/branch assignment before executing business logic. This prevents unauthorized access even though these functions bypass RLS.

### Client-Side Security Utilities

| Utility                | Location                                  | Purpose                                                                                                |
| :--------------------- | :---------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **Rate Limiter**       | `/frontend/src/lib/rate-limiter.ts`       | Prevents brute-force attacks on auth endpoints. Tracks attempts per action with configurable lockouts. |
| **Password Validator** | `/frontend/src/lib/password-validator.ts` | Enforces standardized password requirements: 8+ chars, 1 uppercase, 1 number.                          |

#### Rate Limiting Configuration

| Action          | Max Attempts | Window     | Lockout Duration |
| :-------------- | :----------- | :--------- | :--------------- |
| Login           | 5            | 15 minutes | 5 minutes        |
| Signup          | 3            | 1 hour     | 15 minutes       |
| Forgot Password | 3            | 1 hour     | 30 minutes       |

### Data Compliance (PDPA)

- **Consent:** Explicit checkbox during registration.
- **Right to Erasure:** Soft-delete mechanism implemented (`is_deleted` flag).
- **Minimal Collection:** Only Email, Birthday (for age verification), and Name required.

---

## 4. API & Business Logic

### Key Edge Functions / RPCs

Instead of exposing raw table access for complex logic, we use **PostgreSQL Stored Procedures** (RPCs) or **Edge Functions**.

| Function Name                       | Type | Purpose                                                                                                                                 |
| :---------------------------------- | :--- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| `create_referral_chain`             | RPC  | Links a new customer to their referrer (up to 3 levels) upon first transaction. **Auth: staff at same restaurant or admin.**            |
| `distribute_upline_rewards`         | RPC  | Calculates and inserts VC earnings for the upline chain (1% per level).                                                                 |
| `redeem_virtual_currency`           | RPC  | Deducts VC from wallet during checkout (FIFO logic).                                                                                    |
| `expire_virtual_currency`           | Cron | Runs daily. Expires VC older than 30 days.                                                                                              |
| `get_dashboard_summary`             | RPC  | Returns comprehensive dashboard data including RFM segmentation. **Auth: merchant who owns the restaurant or admin.**                   |
| `process_checkout_transaction`      | RPC  | Creates a checkout transaction with discount calculation, referral chain, and reward distribution. **Auth: staff-only, branch-scoped.** |
| `void_transaction`                  | RPC  | Voids a transaction and reverses all ledger entries. **Auth: staff at same restaurant or admin.**                                       |
| `update_transaction_with_receipt`   | RPC  | Updates a transaction with receipt photo URL and OCR data. **Auth: staff at same restaurant or admin.**                                 |
| `find_transaction_by_receipt`       | RPC  | Finds transactions matching receipt date/time and amount. **Auth: staff at same restaurant or admin.**                                  |
| `get_top_sharers`                   | RPC  | Returns top referral sharers for a restaurant with network value. **Auth: merchant who owns the restaurant or admin.**                  |
| `generate_restaurant_referral_code` | RPC  | Generates a unique referral code for a user at a restaurant. **Auth: service role or caller = target user.**                            |
| `check_ai_chat_rate_limit`          | RPC  | Validates user hasn't exceeded 50 messages/hour limit. **Auth: service role or caller = target user.**                                  |
| `ai-chat`                           | Edge | Secure AI chat endpoint with Gemini streaming and session persistence.                                                                  |
| `receipt-ocr`                       | Edge | Proxies Gemini Vision API for receipt OCR. Authenticates caller and enforces staff/merchant/admin role. API key stays server-side.      |
| `expire-vc`                         | Edge | Cron job (daily 2 AM MYT). Expires VC older than 30 days via `expire_virtual_currency()` RPC.                                           |
| `send-earning-notification`         | Edge | Sends email via SendGrid when a user earns VC.                                                                                          |

### API Patterns

- **REST:** Used for standard CRUD (e.g., fetching transaction history, updating profile).
- **Realtime:** Used for immediate wallet balance updates on the dashboard.
