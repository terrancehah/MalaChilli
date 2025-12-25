# Implementation Guides & Design System

## MakanTak - Developer Handbook

**Document Type:** Implementation Guide  
**Last Updated:** 2025-12-19 (Schema Sync)  
**Covers:** Design System, Frontend Architecture, and Critical Feature Flows.

---

## PART A: Development Setup

### 1. Prerequisites

* **Node.js:** Version 20 (enforced by `.nvmrc`)
* **Supabase:** Account and project created.

### 2. Installation

```bash
cd frontend
npm install
```

### 3. Environment Configuration

1. Create `.env` file in `frontend/` directory:

    ```bash
    cp .env.example .env
    ```

2. Add Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

### 4. Running Locally

```bash
npm run dev
# App available at http://localhost:5173
```

---

## PART B: Design System

> **📖 Full Reference:** See `05-design-system.md` for comprehensive visual design standards including typography, colors, spacing, components, and state patterns.
>
> **📝 Content Guidelines:** See `06-content-voice-guidelines.md` for UX writing standards, terminology, and tone guidelines.

### Quick Reference

* **Mobile-First:** All designs start with mobile viewport.
* **Touch-Optimized:** Min 44px touch targets.
* **Shadow Depth:** Use shadows to simulate physical button presses (`shadow-md` -> `shadow-sm` on press).
* **QR Scanner:** `@yudiel/react-qr-scanner` library with 256x256px transparent cutout.

---

## PART C: Frontend Architecture

### 1. Directory Structure

``
/src
  ├── /components          # UI Components
  │   ├── /auth            # Authentication (ProtectedRoute, etc.)
  │   ├── /customer        # Customer dashboard components
  │   ├── /merchant        # Merchant analytics & management
  │   ├── /shared          # Reusable components (StatsCard, LanguageSelector, etc.)
  │   ├── /staff           # Staff dashboard & checkout
  │   └── /ui              # Base UI primitives (Button, Card, Input, etc.)
  ├── /contexts            # Global State (AuthContext)
  ├── /hooks               # Custom React hooks (useLanguagePreference, etc.)
  ├── /lib                 # Supabase client, Utils, OCR helpers
  ├── /pages               # Route Views
  ├── /services            # API service layer
  ├── /translations        # i18n (en/, ms/, zh/ subdirectories)
  └── /types               # TypeScript type definitions
``

### 2. Internationalization (i18n)

* **Files:** `/src/translations/{en,ms,zh}.ts`
* **Pattern:** centralized `getTranslation(lang)` function.
* **Usage:** `const t = getTranslation(language);` -> `{t.dashboard.title}`.
* **Storage:** User preference stored in `users.preferred_language` column.

### 3. Authentication Flow

1. **Register:** `/register` -> Supabase Auth (`signUp`) -> Auto-login.
2. **Login:** `/login` -> Supabase Auth (`signInWithPassword`).
3. **Protected Routes:** `AuthContext` checks `user.role`. Redirects unauthorized access to `/login`.

---

## PART D: Feature Deep Dives

### 1. Referral System Implementation

#### The "One Customer, Multiple Codes" Model

A user has one **Customer ID** (stored in `users.referral_code`) for identification, but generates unique **Promotion Codes** for *each* restaurant they visit.

**Flow:**

1. **First Visit:** Backend detects `first_transaction` = true.
2. **Auto-Generate:** Database function creates a code for that restaurant (format: `MAKANTAK-{restaurant_slug}-{customer_name}`).
3. **Storage:** Stored in `user_restaurant_referral_codes` table.
4. **Sharing:** Customer shares `makantak.com/join/{restaurant-slug}/{MAKANTAK-SLUG-NAME}`.

#### Link Handling

* **Route:** `/join/:restaurantSlug/:code`
* **Logic:**
  * Validates code belongs to that restaurant.
  * If user logged in -> Saves code to `saved_referral_codes`.
  * If user new -> Redirects to Register (code persists in session).

### 2. OCR Receipt Scanning (Staff) - ✅ Implemented

#### Engine: Google Gemini 2.5 Flash

* **Why:** Contextual understanding of receipts vs raw text OCR.
* **Capabilities:** Extracts Date, Time, Total, and Line Items. Matches items against restaurant menu.

#### Workflow

1. **Scan:** Staff uploads/snaps receipt photo in Dashboard.
2. **Process:** Gemini extracts structured data (JSON).
3. **Match:**
   * **Fuzzy Match:** Compares extracted text with `menu_items` using Levenshtein distance.
   * **Transaction Match:** Looks for existing transaction by `bill_amount` and `timestamp`.
4. **Link:** Updates the transaction with `receipt_photo_url` and structured item data.

### 3. Staff Checkout Flow (Streamlined)

1. **Scan Customer QR:** Opens `CustomerVerifiedModal`.
2. **Badges:** Checks for "First Visit" (5% off) and "Birthday" (Gradient badge).
3. **Input:** Staff enters Bill Amount.
4. **Redeem:** System calculates Max Redeemable (20%). Staff confirms amount.
5. **Submit:** Transaction created -> Rewards distributed to uplines immediately.
