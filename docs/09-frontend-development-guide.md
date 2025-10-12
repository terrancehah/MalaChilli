# Frontend Development Guide
## MalaChilli - React Web Application

**Version:** 1.1  
**Date:** 2025-10-12  
**Tech Stack:** React 18, Vite, Tailwind CSS, Supabase Client

**Recent Updates:**
- ✅ Authentication implemented (Login & Register pages connected to Supabase)
- ✅ Age validation (18+) on registration
- ✅ Referral code support in registration URL
- ✅ Error handling and loading states
- ✅ Auto-redirect after successful auth

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
- Full name required
- Birthday optional (validates 18+ if provided)
- Profile image upload (UI ready, storage integration pending)
- Referral code detection from URL
- Age calculation and validation
- Error handling with user-friendly messages
- Success message with auto-redirect to dashboard

**Implementation:**
```tsx
// Uses AuthContext
const { signUp } = useAuth();

await signUp(email, password, {
  full_name: fullName,
  birthday: birthday || null,
  age: calculatedAge,
  role: 'customer'
});
```

**Validation:**
- Email format validated by browser
- Password minimum 8 characters
- Age must be 18+ if birthday provided
- All errors displayed inline

---

### Login Flow ✅ IMPLEMENTED

**Route:** `/login`

**Features:**
- Email/password authentication
- Password recovery link (UI ready, flow pending)
- Error handling with user-friendly messages
- Loading state during authentication
- Auto-redirect to dashboard on success

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

### Profile Image Upload

```jsx
<div className="profile-upload">
  <img src={profileUrl || '/default-avatar.png'} alt="Profile" className="profile-img" />
  <button className="upload-btn">+</button>
</div>

<style>
.profile-upload {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}
.profile-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #FFFFFF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: #0A5F0A;
  color: #FFFFFF;
  border-radius: 50%;
  border: 3px solid #FFFFFF;
  font-size: 24px;
  cursor: pointer;
}
</style>
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
