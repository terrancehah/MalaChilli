# Implementation Guides & Design System

## MakanTak - Developer Handbook

**Document Type:** Implementation Guide  
**Last Updated:** 2026-02-16 (Responsive Typography Implementation)  
**Covers:** Design System, Frontend Architecture, and Critical Feature Flows.

---

## PART A: Development Setup

### 1. Prerequisites

- **Node.js:** Version 20 (enforced by `.nvmrc`)
- **Supabase:** Account and project created.

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

> **📖 Full Reference:** See `05-design-system.md` for comprehensive visual design standards
> including typography, colors, spacing, components, and state patterns.
>
> **📝 Content Guidelines:** See `06-content-voice-guidelines.md` for UX writing standards, terminology, and tone guidelines.

### Quick Reference

- **Mobile-First:** All designs start with mobile viewport.
- **Touch-Optimized:** Min 44px touch targets.
- **Shadow Depth:** Use shadows to simulate physical button presses (`shadow-md` -> `shadow-sm` on press).
- **QR Scanner:** `@yudiel/react-qr-scanner` library with 256x256px transparent cutout.

### Responsive Typography Implementation (Feb 2026)

**Overview:** All pages now use mobile-first responsive typography following industry best practices.

**Implementation Pattern:**

```tsx
// Landing Page (Text-Heavy)
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Hero Title</h1>
<p className="text-base sm:text-lg">Body text</p>

// Dashboard Pages (Interaction-Heavy)
<h2 className="text-lg sm:text-xl md:text-2xl">Section Heading</h2>
<p className="text-sm sm:text-base">Body text</p>
```

**Key Principles:**

- **16px minimum** on mobile for body text (iOS requirement)
- **2-3 breakpoints maximum** (sm, md, lg) - avoid excessive scaling
- **Text-heavy pages** use larger base sizes (16-18px)
- **Interaction-heavy pages** use smaller base sizes (14-16px)

**Files Updated:**

- `frontend/src/pages/HomePage.tsx` - Landing page typography
- `frontend/src/pages/customer/Dashboard.tsx` - Customer dashboard
- `frontend/src/pages/staff/Dashboard.tsx` - Staff dashboard
- `frontend/src/pages/merchant/Dashboard.tsx` - Merchant dashboard
- `frontend/src/pages/admin/Dashboard.tsx` - Admin dashboard
- `frontend/src/pages/DemoDashboard.tsx` - Demo dashboard

**Research Source:** LearnUI.design responsive typography guidelines

---

## PART C: Frontend Architecture

### 1. Directory Structure

`/src
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
  └── /types               # TypeScript type definitions`

### 2. Internationalization (i18n)

- **Files:** `/src/translations/{en,ms,zh}.ts`
- **Pattern:** centralized `getTranslation(lang)` function.
- **Usage:** `const t = getTranslation(language);` -> `{t.dashboard.title}`.
- **Storage:** User preference stored in `users.preferred_language` column.

### 3. Authentication Flow

1. **Register:** `/register` -> Supabase Auth (`signUp`) -> Email verification required.
2. **Login:** `/login` or Login Modal -> Supabase Auth (`signInWithPassword`).
3. **Protected Routes:** `AuthContext` checks `user.role`. Redirects unauthorized access to `/login`.

#### Auth UI Features

- **Show/Hide Password:** Toggle visibility on all password fields.
- **Remember Me:** Checkbox on login forms (default: checked).
- **Rate Limiting:** Client-side protection against brute-force attacks.
- **Password Requirements:** Minimum 8 characters, 1 uppercase letter, 1 number.
- **Dark Mode:** Full dark mode support on all auth pages.

#### Auth Components

| Component      | Location                            | Purpose                            |
| :------------- | :---------------------------------- | :--------------------------------- |
| `LoginForm`    | `/components/auth/LoginForm.tsx`    | Reusable login form (modal + page) |
| `RegisterForm` | `/components/auth/RegisterForm.tsx` | Reusable registration form         |
| `Login`        | `/pages/customer/Login.tsx`         | Standalone login page wrapper      |
| `Register`     | `/pages/RegisterPage.tsx`           | Standalone registration page       |

### 4. Admin User Management

The Super Admin dashboard (`/admin/users`) provides comprehensive user management.

#### Features

- **Sortable Columns:** Click headers to sort by Name, Role, Joined Date, or Last Login.
  - Role sorting uses hierarchy: Admin > Merchant > Staff > Customer (not alphabetical).
- **Role Filter:** Dropdown to filter by Customer, Staff, Merchant, or Admin.
- **Restaurant/Branch Display:** Shows assigned restaurant(s) for merchants and staff.
  - Merchants: Displays up to 3 restaurant names, with "+N more" for additional.
  - Staff: Shows restaurant name and branch name.
- **Pagination:** 15 users per page with navigation controls.

#### Role Change Workflow

When changing a user's role via the Edit modal:

| New Role | Required Fields     | Database Updates                              |
| :------- | :------------------ | :-------------------------------------------- |
| Customer | None                | Clears `user.restaurant_id`, `user.branch_id` |
| Staff    | Restaurant + Branch | Sets `user.restaurant_id`, `user.branch_id`   |
| Merchant | Restaurant          | Sets `restaurant.merchant_id` to user ID      |
| Admin    | None                | Clears `user.restaurant_id`, `user.branch_id` |

**Note:** Merchants are linked via `restaurants.merchant_id`, not `users.restaurant_id`. One merchant can own multiple restaurants.

#### Security: Restaurant Assignment

Restaurant ownership can **only** be modified by Super Admins via the admin dashboard. Merchants cannot self-assign restaurants - this prevents abuse and ensures proper onboarding. Merchants can edit their restaurant's **settings** (discount %, reward %, etc.) but not ownership.

---

## PART D: Feature Deep Dives

### 1. Referral System Implementation

#### The "One Customer, Multiple Codes" Model

A user has one **Customer ID** (stored in `users.referral_code`) for identification,
but generates unique **Promotion Codes** for _each_ restaurant they visit.

**Flow:**

1. **First Visit:** Backend detects `first_transaction` = true.
2. **Auto-Generate:** Database function creates a code for that restaurant (format: `MAKANTAK-{restaurant_slug}-{customer_name}`).
3. **Storage:** Stored in `user_restaurant_referral_codes` table.
4. **Sharing:** Customer shares `makantak.com/join/{restaurant-slug}/{MAKANTAK-SLUG-NAME}`.

#### Link Handling

- **Route:** `/join/:restaurantSlug/:code`
- **Logic:**
  - Validates code belongs to that restaurant.
  - If user logged in -> Saves code to `saved_referral_codes`.
  - If user new -> Redirects to Register (code persists in session).

### 2. OCR Receipt Scanning (Staff) - ✅ Implemented

#### Engine: Google Gemini 2.5 Flash (via `receipt-ocr` Edge Function)

- **Why:** Contextual understanding of receipts vs raw text OCR.
- **Capabilities:** Extracts Date, Time, Total, and Line Items. Matches items against restaurant menu.
- **Security:** Gemini API key is stored server-side as a Supabase secret. The frontend calls the `receipt-ocr` edge function which authenticates the caller (JWT), verifies staff/merchant/admin role, then proxies the request to Gemini.

#### Workflow

1. **Scan:** Staff uploads/snaps receipt photo in Dashboard.
2. **Proxy:** Frontend sends base64 image to `receipt-ocr` edge function (auth required).
3. **Process:** Edge function calls Gemini Vision API and returns structured data (JSON).
4. **Match:**
   - **Fuzzy Match:** Compares extracted text with `menu_items` using Levenshtein distance.
   - **Transaction Match:** Looks for existing transaction by `bill_amount` and `timestamp`.
5. **Link:** Updates the transaction with `receipt_photo_url` and structured item data.

### 3. Staff Checkout Flow (Streamlined)

1. **Scan Customer QR:** Opens `CustomerVerifiedModal`.
2. **Badges:** Checks for "First Visit" (5% off) and "Birthday" (Gradient badge).
3. **Input:** Staff enters Bill Amount.
4. **Redeem:** System calculates Max Redeemable (20%). Staff confirms amount.
5. **Submit:** Transaction created -> Rewards distributed to uplines immediately.
