# Implementation Guides & Design System
## MalaChilli - Developer Handbook

**Document Type:** Implementation Guide  
**Last Updated:** 2025-11-21 (Consolidated)  
**Covers:** Design System, Frontend Architecture, and Critical Feature Flows.

---

# PART A: Development Setup

## 1. Prerequisites
*   **Node.js:** Version 20 (enforced by `.nvmrc`)
*   **Supabase:** Account and project created.

## 2. Installation
```bash
cd frontend
npm install
```

## 3. Environment Configuration
1.  Create `.env` file in `frontend/` directory:
    ```bash
    cp .env.example .env
    ```
2.  Add Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

## 4. Running Locally
```bash
npm run dev
# App available at http://localhost:5173
```

---

# PART B: Design System

## 1. Core Principles
*   **Mobile-First:** All designs start with mobile viewport.
*   **Touch-Optimized:** Min 44px touch targets.
*   **Shadow Depth:** Use shadows to simulate physical button presses (`shadow-md` -> `shadow-sm` on press).

## 2. Color Palette
*   **Forest Green:** `#0A5F0A` (Primary Branding)
*   **Lime Green:** `#7CB342` (Secondary / Accents)
*   **Soft Cream:** `#FEF7ED` (Backgrounds)
*   **Functional:** Success (`#10B981`), Warning (`#F59E0B`), Error (`#EF4444`).

## 3. Key Component Patterns

### Bottom Sheet (Mobile) / Side Panel (Tablet)
*   **Usage:** Transaction details, QR Scanner, Share options.
*   **Behavior:** Slides from bottom on mobile. Slides from **left** (60% width) on iPad landscape to create a split-view dashboard.

### QR Scanner Frame
*   **Design:** Full-screen camera view with a 256x256px transparent cutout.
*   **Markers:** White "L" shaped corner brackets (4px thick).
*   **Library:** `@yudiel/react-qr-scanner` (Lightweight, React Native friendly).

### Interactive Cards
*   **Pattern:** `className="cursor-pointer shadow-md hover:shadow-sm active:shadow-none transition-shadow"`
*   **Why:** Mimics tactile feedback. Pressing "down" reduces the shadow.

---

# PART C: Frontend Architecture

## 1. Directory Structure
```
/src
  ├── /components          # UI Components
  │   ├── /common          # Buttons, Modals, Cards
  │   ├── /customer        # Customer-specific logic
  │   ├── /staff           # Staff dashboard & checkout
  │   └── /owner           # Analytics charts
  ├── /contexts            # Global State (AuthContext)
  ├── /pages               # Route Views
  ├── /translations        # i18n (en.ts, ms.ts, zh.ts)
  └── /lib                 # Supabase client, Utils
```

## 2. Internationalization (i18n)
*   **Files:** `/src/translations/{en,ms,zh}.ts`
*   **Pattern:** centralized `getTranslation(lang)` function.
*   **Usage:** `const t = getTranslation(language);` -> `{t.dashboard.title}`.
*   **Storage:** User preference stored in `users.preferred_language` column.

## 3. Authentication Flow
1.  **Register:** `/register` -> Supabase Auth (`signUp`) -> Auto-login.
2.  **Login:** `/login` -> Supabase Auth (`signInWithPassword`).
3.  **Protected Routes:** `AuthContext` checks `user.role`. Redirects unauthorized access to `/login`.

---

# PART D: Feature Deep Dives

## 1. Referral System Implementation

### The "One Customer, Multiple Codes" Model
A user has one **Customer ID** (`CHILLI-ABC123`) for identification, but generates unique **Promotion Codes** for *each* restaurant they visit.

**Flow:**
1.  **First Visit:** Backend detects `first_transaction` = true.
2.  **Auto-Generate:** Edge Function creates a code for that restaurant (e.g., `CHILLI-REST1-XYZ`).
3.  **Storage:** Stored in `user_restaurant_referral_codes`.
4.  **Sharing:** Customer shares `malachilli.com/join/restaurant-slug/CHILLI-REST1-XYZ`.

### Link Handling
*   **Route:** `/join/:restaurantSlug/:code`
*   **Logic:**
    *   Validates code belongs to that restaurant.
    *   If user logged in -> Saves code to `saved_referral_codes`.
    *   If user new -> Redirects to Register (code persists in session).

## 2. OCR Receipt Scanning (Staff)

### Engine: Google Gemini 2.5 Flash
*   **Why:** Contextual understanding of receipts vs raw text OCR.
*   **Cost:** ~RM0.00075 per scan.

### Workflow
1.  **Scan:** Staff uploads/snaps receipt photo in Dashboard.
2.  **Process:** Gemini extracts Date, Time, Total, and Line Items.
3.  **Match:** System looks for a transaction in the DB with matching `bill_amount` (+/- RM1) and `timestamp` (+/- 30 mins).
4.  **Link:** Updates the transaction with `receipt_photo_url` and structured item data (`transaction_items` table).

## 3. Staff Checkout Flow (Streamlined)
1.  **Scan Customer QR:** Opens `CustomerVerifiedModal`.
2.  **Badges:** Checks for "First Visit" (5% off) and "Birthday" (Gradient badge).
3.  **Input:** Staff enters Bill Amount.
4.  **Redeem:** System calculates Max Redeemable (20%). Staff confirms amount.
5.  **Submit:** Transaction created -> Rewards distributed to uplines immediately.
