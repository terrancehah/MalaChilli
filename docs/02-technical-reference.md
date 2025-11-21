# Technical Reference
## MalaChilli - System Architecture & Data Model

**Document Type:** Technical Reference  
**Last Updated:** 2025-11-21 (Consolidated)  
**Source of Truth:**  
*   **Database Schema:** `/supabase/migrations/`
*   **Frontend Types:** `/frontend/src/types/`
*   **API Client:** `/frontend/src/lib/supabase.ts`

---

## 1. Technology Stack

### Frontend
*   **Framework:** React 18+ (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Shadcn/UI
*   **State:** React Context + Hooks
*   **Internationalization:** Custom i18n (EN/MS/ZH)
*   **Key Libraries:** `react-qr-code` (Gen), `@yudiel/react-qr-scanner` (Scan), `recharts` (Analytics)

### Backend (Supabase BaaS)
*   **Database:** PostgreSQL 15
*   **Auth:** Supabase Auth (Email/Password + Magic Link)
*   **API:** Auto-generated REST API + Edge Functions
*   **Realtime:** Supabase Realtime (Wallet updates)
*   **Storage:** Supabase Storage (Receipt photos)

### Infrastructure
*   **Frontend Hosting:** Vercel
*   **Backend Hosting:** Supabase Cloud
*   **Email:** SendGrid (via Edge Functions)

---

## 2. Database Schema Overview

> **Note:** For the exact schema definition, always check the latest migration file in `/supabase/migrations/`.

### Core Entity Relationship Diagram (ERD)

```
[Restaurants] 1 -- * [Branches]
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
   +-- 1 -- * [UserRestaurantReferralCodes]
```

### Key Tables

| Table Name | Purpose | Key Notes |
| :--- | :--- | :--- |
| **`users`** | All accounts (Customer, Staff, Owner). | Managed via Supabase Auth. Includes `preferred_language`, `role`. |
| **`restaurants`** | Restaurant entities. | Configures `guaranteed_discount_percent`, `upline_reward_percent`. |
| **`branches`** | Physical locations. | Linked to Staff users. |
| **`transactions`** | Checkout records. | Stores `bill_amount`, `final_amount`, `receipt_photo_url`. |
| **`transaction_items`** | Line items from receipts. | **NEW (Nov 1)**: Supports OCR extraction and item-level analytics. |
| **`referrals`** | Upline-Downline links. | Tracks relationships **per restaurant**. Max 3 levels deep. |
| **`virtual_currency_ledger`** | Wallet history. | Tracks `earn`, `redeem`, `expire` events. FIFO redemption logic. |
| **`user_restaurant_referral_codes`** | Share codes. | One unique code per user per restaurant (e.g., `CHILLI-REST1-ABC`). |
| **`customer_restaurant_history`** | Visit tracking. | Used to determine "First Visit" eligibility. |

---

## 3. Security Architecture

### Authentication & Authorization
*   **JWT:** All API requests are authenticated via Supabase JWT.
*   **RBAC:** Users have a `role` column (`customer`, `staff`, `owner`).
*   **RLS (Row Level Security):** Database policies enforce access control at the SQL level.
    *   *Customers* can only see their own data.
    *   *Staff* can see data for their assigned branch.
    *   *Owners* can see data for their restaurant.

### Data Compliance (PDPA)
*   **Consent:** Explicit checkbox during registration.
*   **Right to Erasure:** Soft-delete mechanism implemented (`is_deleted` flag).
*   **Minimal Collection:** Only Email, Birthday (for age verification), and Name required.

---

## 4. API & Business Logic

### Key Edge Functions / RPCs
Instead of exposing raw table access for complex logic, we use **PostgreSQL Stored Procedures** (RPCs) or **Edge Functions**.

| Function Name | Type | Purpose |
| :--- | :--- | :--- |
| `create_referral_chain` | RPC | Links a new customer to their referrer (up to 3 levels) upon first transaction. |
| `distribute_upline_rewards` | RPC | Calculates and inserts VC earnings for the upline chain (1% per level). |
| `redeem_virtual_currency` | RPC | Deducts VC from wallet during checkout (FIFO logic). |
| `expire_virtual_currency` | Cron | Runs daily. Expires VC older than 30 days. |
| `send-earning-notification` | Edge | Sends email via SendGrid when a user earns VC. |

### API Patterns
*   **REST:** Used for standard CRUD (e.g., fetching transaction history, updating profile).
*   **Realtime:** Used for immediate wallet balance updates on the dashboard.
