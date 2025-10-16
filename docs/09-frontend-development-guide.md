# Frontend Development Guide
## MalaChilli - React Web Application

**Version:** 1.2  
**Date:** 2025-10-16  
**Tech Stack:** React 18, Vite, Tailwind CSS, Supabase Client

**Recent Updates (2025-10-16):**
- ✅ **Improved Sharing UI** - Link-first approach with social sharing buttons
- ✅ **One-Click Social Sharing** - WhatsApp, Facebook, and native share integration
- ✅ **Collapsible Code Display** - Code reference as secondary action
- ✅ **Better Conversion Flow** - Recipients get clickable links, not codes
- ✅ **Customer Dashboard Redesigned** - Restaurant-specific referral code system
- ✅ **"Promote Restaurants" Section** - Users generate codes per visited restaurant
- ✅ **QR Code Modal** - Staff can scan customer ID at counter
- ✅ **Restaurant Visit Tracking** - Shows eligible restaurants for code generation
- ✅ **Demo Dashboard Updated** - Matches real dashboard structure and features
- ✅ TypeScript config fixed - Removed invalid compiler option `erasableSyntaxOnly`

**Previous Updates (2025-10-13):**
- ✅ Authentication implemented (Login & Register pages connected to Supabase)
- ✅ Form validation with red borders and error messages
- ✅ All fields required including birthday (18+ validation)
- ✅ **Schema validation** - Only inserts fields that exist in database
- ✅ **Fixed registration bug** - Removed non-existent columns (nickname, age, is_email_verified, email_notifications_enabled)
- ✅ Referral code support in registration URL
- ✅ Toast notifications (react-hot-toast) for success/error messages
- ✅ Auto-redirect after successful auth
- ✅ Profile image upload removed (simplified registration)

---

## 1. Application Structure

```
/src
├── /components          # Reusable UI components
│   ├── /common          # Buttons, inputs, modals, cards
│   ├── /customer        # Customer-specific components
│   ├── /staff           # Staff-specific components
│   └── /owner           # Owner-specific components
├── /pages               # Page-level components (routes)
│   ├── /customer        # Customer portal pages
│   ├── /staff           # Staff portal pages
│   └── /owner           # Owner portal pages
├── /contexts            # React Context providers
│   ├── AuthContext.jsx  # User authentication state
│   └── WalletContext.jsx # Virtual currency state
├── /hooks               # Custom React hooks
│   ├── useAuth.js       # Authentication logic
│   ├── useWallet.js     # Wallet balance logic
│   └── useQRScanner.js  # QR scanning logic
├── /services            # API service layer
│   ├── authService.js   # Auth API calls
│   ├── walletService.js # Wallet API calls
│   └── transactionService.js # Transaction API calls
├── /utils               # Utility functions
│   ├── formatCurrency.js # RM formatting
│   ├── generateReferralCode.js # Code generation
│   └── validators.js    # Form validation
├── /config              # Configuration files
│   └── supabase.js      # Supabase client setup
├── App.jsx              # Root component
└── main.jsx             # Entry point
```

---

## 2. Routing Structure

```javascript
// Customer Portal Routes
/                        → Landing page (login/register)
/register                → Registration form
/login                   → Login form
/dashboard               → Customer dashboard (wallet, referrals)
/wallet                  → Wallet details (balance, history)
/referrals               → Referral tree visualization
/share                   → Share code/QR page

// Staff Portal Routes
/staff/login             → Staff login
/staff/dashboard         → Staff dashboard (today's stats)
/staff/checkout          → Checkout flow (scan, verify, apply discount)
/staff/transactions      → Transaction history (today)

// Owner Portal Routes
/owner/login             → Owner login
/owner/dashboard         → Owner analytics dashboard
/owner/customers         → Customer list
/owner/transactions      → Transaction list
/owner/staff             → Staff management
/owner/settings          → Restaurant settings
```

---

## 3. State Management

### Global State (Context API)
- **AuthContext:** ✅ IMPLEMENTED
  - Current user, session management
  - Methods: `signUp()`, `signIn()`, `signOut()`, `resetPassword()`
  - Auto-fetches user profile from database
  - Listens for auth state changes
- **WalletContext:** 🚧 TO BE IMPLEMENTED
  - Current balance, transaction history (for customers)

### Local State (useState)
- Form inputs, UI toggles, loading states
- Error and success messages
- Form validation states

### Server State (Supabase Realtime)
- Wallet balance updates (when downline spends) - 🚧 TO BE IMPLEMENTED
- Transaction notifications - 🚧 TO BE IMPLEMENTED

---

## 4. Authentication Flow

### Registration Flow ✅ IMPLEMENTED

**Route:** `/register` or `/join/:restaurantSlug/:referralCode`

**Features:**
- Email/password registration
- All fields required (full name, email, password, birthday)
- Real-time field validation with error messages
- Red border highlight on invalid fields
- Helper text below each field
- Referral code detection from URL
- Age calculation and validation (18+)
- Toast notifications for errors and success
- Auto-redirect to dashboard (1.5s delay)

**Implementation:**
```tsx
// Uses AuthContext with field validation
const { signUp } = useAuth();

// Validates all fields before submission
// Shows red borders and error messages
// Birthday is required, age is calculated in database

await signUp(email, password, {
  full_name: fullName,
  birthday: birthday, // Required - age calculated from this in DB
  role: 'customer'
});

// Note: Age is NOT stored in database
// It's calculated via SQL: EXTRACT(YEAR FROM AGE(CURRENT_DATE, birthday))
// Available in customer_profiles_with_age view
```

**Validation Rules:**
- **Full Name:** Required, minimum 2 characters
- **Email:** Required, valid email format (regex validated)
- **Password:** Required, minimum 8 characters
- **Birthday:** Required, must be 18+ years old
- Validation triggers on blur (when user leaves field)
- Real-time error clearing when user corrects input
- Red border and error text for invalid fields
- Gray helper text for valid fields

**Duplicate Email Handling:**
- Supabase Auth automatically prevents duplicate emails
- If email already exists, shows user-friendly error:
  - "This email is already registered. Please login or use a different email."
- Error appears as toast notification
- User can click "Login" link to go to login page

---

### Login Flow ✅ IMPLEMENTED

**Route:** `/login`

**Features:**
- Email/password authentication
- Password recovery link (UI ready, flow pending)
- Toast notifications for errors and success
- Loading state during authentication
- Auto-redirect to dashboard (0.5s delay)

**Implementation:**
```tsx
// Uses AuthContext
const { signIn } = useAuth();

await signIn(email, password);
// Auto-redirects to /dashboard
```

---

### Protected Routes 🚧 PENDING

**To be implemented:**
- Route guard component
- Redirect unauthenticated users to login
- Role-based access control (customer/staff/owner)

---

## 4.5 Customer Dashboard ✅ IMPLEMENTED

**Route:** `/dashboard`

**Features:**
- Profile header with avatar and verification badge
- Virtual currency balance display
- Quick stats (Earned, Redeemed, Referred)
- Restaurant-specific referral code management
- QR code modal for staff scanning
- Transaction history

**Restaurant Promotion System:**
The dashboard now features a **restaurant-specific referral code system** where users can:
1. View restaurants they've visited (from `customer_restaurant_history` table)
2. Generate unique referral codes for each restaurant they've visited
3. Share restaurant-specific links to promote individual restaurants
4. Track which restaurants have active promotion codes

**Implementation:**
```tsx
// Fetches both existing codes and visited restaurants
useEffect(() => {
  // 1. Fetch existing restaurant-specific codes
  const { data: codesData } = await supabase
    .from('user_restaurant_referral_codes')
    .select(`
      id,
      restaurant_id,
      referral_code,
      restaurants (name, slug)
    `)
    .eq('user_id', user.id)
    .eq('is_active', true);
  
  // 2. Fetch visited restaurants
  const { data: visitedData } = await supabase
    .from('customer_restaurant_history')
    .select(`
      restaurant_id,
      first_visit_date,
      total_visits,
      total_spent,
      restaurants (name, slug)
    `)
    .eq('customer_id', user.id);
}, [user]);

// Generate code for a restaurant
const handleGenerateCode = async (restaurantId: string) => {
  await supabase.rpc('generate_restaurant_referral_code', {
    p_user_id: user.id,
    p_restaurant_id: restaurantId
  });
  // Refresh codes list
};
```

**UI Components:**

1. **Active Restaurant Codes (with codes already generated):**
   - Shows restaurant name and description
   - Displays unique referral code in large, monospaced font
   - Copy button with "Copied!" feedback
   - Share link showing full URL with restaurant slug
   - Green "Active" badge

2. **Eligible Restaurants (visited but no code yet):**
   - Shows restaurant name and visit statistics
   - Display total visits and amount spent
   - "Generate Referral Code" button
   - Blue "Eligible" badge

3. **QR Code Modal:**
   - Triggered by QR icon button in header
   - Displays customer ID as QR code for staff scanning
   - Shows user name and truncated ID
   - Full-screen overlay with backdrop blur
   - Click outside to close

**Improved Sharing UI (Link-First Approach):**

The UI now prioritizes link sharing over code copying, based on UX research showing that:
1. Links have 70%+ higher conversion rates than codes
2. Links work on all social platforms (clickable)
3. Links reduce friction - no manual typing required
4. Links provide one-tap experience for recipients

**Visual Hierarchy:**
```
1. PRIMARY: "Copy Link" button (large, prominent)
2. SUPPORTING: Social share buttons (WhatsApp, Facebook, More)
3. REFERENCE: View code (collapsible, secondary)
```

**Code Structure:**
```tsx
<Card className="restaurant-code-card">
  {/* Header */}
  <h3>{code.restaurant.name}</h3>
  <Badge>Active</Badge>
  
  {/* PRIMARY ACTION: Copy Link */}
  <div className="share-link-section">
    <p className="label">Share this link:</p>
    <div className="link-display">
      <p className="truncated-url">
        {window.location.origin}/join/{code.restaurant.slug}/...
      </p>
      {copied === `link-${code.referral_code}` && (
        <span className="success">Link copied!</span>
      )}
    </div>
    <Button 
      onClick={() => handleCopyLink(slug, code)}
      size="lg" 
      className="primary w-full"
    >
      <Share2 /> Copy Link
    </Button>
  </div>
  
  {/* SOCIAL SHARING */}
  <div className="social-buttons grid-cols-3">
    <Button onClick={() => handleShareWhatsApp(name, slug, code)}>
      WhatsApp
    </Button>
    <Button onClick={() => handleShareFacebook(slug, code)}>
      Facebook
    </Button>
    <Button onClick={() => handleNativeShare(name, slug, code)}>
      More
    </Button>
  </div>
  
  {/* SECONDARY: Code Reference (Collapsible) */}
  <div className="code-reference">
    <button onClick={() => toggleCode(code.id)}>
      View promotion code {expanded ? '▲' : '▼'}
    </button>
    {expanded && (
      <div className="code-display">
        <code>{code.referral_code}</code>
        <Button onClick={() => handleCopyCode(code)}>
          <Copy />
        </Button>
      </div>
    )}
  </div>
</Card>
```

**Social Sharing Functions:**
```tsx
// WhatsApp share with pre-filled message
const handleShareWhatsApp = (name: string, slug: string, code: string) => {
  const link = `${window.location.origin}/join/${slug}/${code}`;
  const message = `Hey! I love ${name}. Join me there and get a discount: ${link}`;
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

// Facebook share
const handleShareFacebook = (slug: string, code: string) => {
  const link = `${window.location.origin}/join/${slug}/${code}`;
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
  window.open(url, '_blank');
};

// Native share API (mobile)
const handleNativeShare = async (name: string, slug: string, code: string) => {
  const link = `${window.location.origin}/join/${slug}/${code}`;
  if (navigator.share) {
    await navigator.share({
      title: `Join me at ${name}`,
      text: `Check out ${name}!`,
      url: link
    });
  } else {
    // Fallback to copy link
    handleCopyLink(slug, code);
  }
};
```

**Benefits of Link-First Approach:**
- **Higher Conversion:** Recipients click link → auto-redirect to registration with restaurant pre-selected
- **Social Media Ready:** Links are clickable on WhatsApp, Facebook, Instagram stories
- **Less Friction:** No need to remember/type codes
- **Mobile Optimized:** Native share on mobile devices
- **Better Tracking:** Can track link clicks vs code usage

**User Flow:**
1. Customer generates promotion code for restaurant
2. Clicks "Copy Link" (primary action)
3. Shares link via WhatsApp/Facebook/etc.
4. Recipient clicks link → lands on `/join/{slug}/{code}`
5. Registration page pre-fills restaurant context
6. One-click signup = higher conversion

**Database Tables Used:**
- `user_restaurant_referral_codes` - Stores generated restaurant-specific codes
- `customer_restaurant_history` - Tracks which restaurants user has visited
- `restaurants` - Restaurant details

**Share Link Format:**
```
{origin}/join/{restaurant-slug}/{referral-code}

Example: https://malachi lli.com/join/nasi-lemak-corner/CHILLI-REST1-ABC
```

---

## 5. Component Design Patterns

### Atomic Design Approach
- **Atoms:** Button, Input, Label, Badge
- **Molecules:** FormField (Label + Input + Error), QRDisplay (QR + Copy button)
- **Organisms:** RegistrationForm, CheckoutForm, AnalyticsDashboard
- **Templates:** CustomerLayout, StaffLayout, OwnerLayout
- **Pages:** CustomerDashboard, StaffCheckout, OwnerAnalytics

---

## 5. UI/UX Design System

**Design Reference:** Clean, food-centric interfaces with Malaysian cultural adaptation

### Color Palette

**Primary Colors:**
- **Forest Green:** `#0A5F0A` - Primary actions, branding
- **Lime Green:** `#7CB342` - Accents, success states
- **Deep Green:** `#004D00` - Headings, emphasis

**Secondary Colors:**
- **White:** `#FFFFFF` - Backgrounds, cards
- **Off-White:** `#F9FAFB` - Subtle backgrounds
- **Light Gray:** `#E5E7EB` - Borders, dividers

**Semantic Colors:**
- **Success:** `#10B981` - Transactions complete, rewards earned
- **Warning:** `#F59E0B` - Expiring balance (7 days)
- **Error:** `#EF4444` - Validation errors
- **Info:** `#3B82F6` - Information badges

**Text Colors:**
- **Primary:** `#111827` - Body text, headings
- **Secondary:** `#6B7280` - Labels, hints
- **Muted:** `#9CA3AF` - Placeholders, disabled

### Typography

**Font Family:**
```css
/* Primary: Clean, modern sans-serif */
font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;

/* Accent: For logo, headings */
font-family: 'Pacifico', 'Brush Script MT', cursive;
```

**Font Scales:**
- Display: 48px/60px (Logo, landing hero)
- H1: 36px/44px (Page titles)
- H2: 30px/38px (Section headers)
- H3: 24px/32px (Card headers)
- H4: 20px/28px (Subsections)
- Body Large: 18px/28px (Important text, CTAs)
- Body: 16px/24px (Default text)
- Body Small: 14px/20px (Helper text, labels)
- Caption: 12px/16px (Tiny labels, badges)

**Font Weights:**
- Regular: 400, Medium: 500, Semibold: 600, Bold: 700

### Button Styles

**Primary Button (Green Pill):**
```css
.btn-primary {
  background: #0A5F0A;
  color: #FFFFFF;
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 8px rgba(10, 95, 10, 0.2);
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: #004D00;
  box-shadow: 0 4px 12px rgba(10, 95, 10, 0.3);
  transform: translateY(-1px);
}
```

**Secondary Button (Outlined):**
```css
.btn-secondary {
  background: transparent;
  color: #0A5F0A;
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid #0A5F0A;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background: rgba(10, 95, 10, 0.05);
}
```

### Input Fields

**Text Input (Minimal, Bottom-Border):**
```css
.input-field {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
  color: #111827;
  background: transparent;
  border: none;
  border-bottom: 1px solid #E5E7EB;
  outline: none;
  transition: border-color 0.2s ease;
}
.input-field:focus {
  border-bottom-color: #0A5F0A;
  border-bottom-width: 2px;
}
```

### Card Styles

```css
.card {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stat-card {
  background: linear-gradient(135deg, #0A5F0A 0%, #7CB342 100%);
  color: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
}
```

### Layout Patterns

**Centered Auth Layout:**
```jsx
<div className="auth-layout">
  <div className="auth-card">
    <img src="/logo.svg" alt="MalaChilli" className="logo" />
    <h1>Welcome Back</h1>
    {/* Form content */}
  </div>
</div>

<style>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(10,95,10,0.05) 0%, rgba(124,179,66,0.05) 100%);
  padding: 24px;
}
.auth-card {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 48px;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}
</style>
```

### Imagery & Iconography

**Visual Theme:** Malaysian food culture
- Icons: Lucide React (clean line icons)
- Food Imagery: Nasi lemak, satay, teh tarik, roti canai
- Decorative: Pandan leaves, rice bowls, batik patterns
- Texture: Rattan/woven patterns (Malaysian dining vibe)

### Spacing System (8px Base)

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 24px;  --space-6: 32px;  --space-7: 48px;  --space-8: 64px;
```

### Responsive Breakpoints

```css
--mobile: 0px;     --tablet: 640px;   --laptop: 1024px;
--desktop: 1280px; --wide: 1536px;
```

### Animations

```css
/* Standard transitions */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Button hover */
transition: transform 0.15s ease, box-shadow 0.15s ease;

/* Micro-interactions */
- Button press: Scale 0.98x
- Card hover: Lift 2px with shadow
- Success: Green checkmark bounce
- Loading: Subtle pulse
```

### Accessibility

- WCAG 2.1 Level AA compliance
- Color contrast: 4.5:1 minimum
- Focus indicators: 2px solid outline
- Keyboard nav: Tab order matches visual
- Touch targets: 44x44px minimum

---

## 6. Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0A5F0A', dark: '#004D00', light: '#7CB342' },
        gray: { 50: '#F9FAFB', 100: '#E5E7EB', 600: '#6B7280', 900: '#111827' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Pacifico', 'cursive'],
      },
      borderRadius: {
        'pill': '50px',
        'card': '24px',
      },
    },
  },
}
```

---

## 7. Key UI Components

### Registration Form

```jsx
<div className="auth-card">
  <Logo className="logo" />
  <h1>Join MalaChilli</h1>
  
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label className="input-label">Full Name</label>
      <input type="text" className="input-field" placeholder="Jaslin Shah" />
    </div>
    
    <div className="form-group">
      <label className="input-label">Email</label>
      <input type="email" className="input-field" placeholder="jaslin.shah@gmail.com" />
    </div>
    
    <div className="form-group">
      <label className="input-label">Password</label>
      <input type="password" className="input-field" placeholder="••••••••" />
    </div>
    
    <button type="submit" className="btn-primary w-full">Sign Up Now!</button>
  </form>
  
  <p className="text-center text-sm text-gray-600 mt-4">
    Already have an account? <a href="/login" className="text-primary">Login</a>
  </p>
</div>
```

### Customer Dashboard

```jsx
<div className="dashboard">
  <header className="dashboard-header">
    <h1>Welcome back, {customer.name}!</h1>
    <div className="wallet-summary">
      <span>Balance:</span>
      <span className="balance">RM {balance.toFixed(2)}</span>
    </div>
  </header>
  
  <div className="stats-grid">
    <StatCard 
      title="Total Downlines"
      value={downlines.count}
      icon={<UsersIcon />}
    />
    <StatCard 
      title="Lifetime Earnings"
      value={`RM ${earnings.total}`}
      icon={<CoinsIcon />}
    />
  </div>
  
  <ReferralSection code={customer.referralCode} />
</div>
```

### Staff Checkout Interface

```jsx
<div className="checkout-interface">
  <h1>Process Transaction</h1>
  
  <div className="customer-lookup">
    <input 
      type="text" 
      placeholder="Enter customer code: SAJI-ABC123"
      onChange={handleCodeInput}
      className="input-field"
    />
    <button onClick={verifyCode} className="btn-primary">Verify</button>
  </div>
  
  {customer && (
    <div className="customer-info">
      <h3>{customer.name}</h3>
      <p>Balance: RM {customer.balance}</p>
      <span className="badge-success">Always gets 5% discount</span>
    </div>
  )}
  
  <div className="bill-calculation">
    <label>Bill Amount (RM)</label>
    <input type="number" value={billAmount} onChange={handleBillChange} />
    
    <div className="discounts">
      <div>Guaranteed (5%): -RM {(billAmount * 0.05).toFixed(2)}</div>
      <div>VC Redemption: -RM {vcRedeemed}</div>
    </div>
    
    <div className="final-amount">
      Total: RM {finalAmount.toFixed(2)}
    </div>
  </div>
  
  <button onClick={processTransaction} className="btn-primary w-full">
    Complete Transaction
  </button>
</div>
```

---

## 8. Development Tools

### Tech Stack
- **Framework:** React 18+ (Hooks)
- **Routing:** React Router v6
- **UI Library:** Tailwind CSS + Shadcn/UI
- **QR Code:** react-qr-code, html5-qrcode
- **HTTP Client:** Supabase JS Client
- **Build Tool:** Vite

### NPM Scripts

```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run test        # Run tests
```

### Environment Variables

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_URL=https://sharesaji.com
```

---

**Related Documents:**
- Backend: `04-technical-architecture.md` (Section 3+)
- Database: `03-database-schema-design.md`
- API: `05-api-specification.md`
