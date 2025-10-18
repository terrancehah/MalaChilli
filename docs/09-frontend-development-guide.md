# Frontend Development Guide
## MalaChilli - React Web Application

**Version:** 1.5  
**Date:** 2025-10-18  
**Tech Stack:** React 18, Vite, Tailwind CSS, Supabase Client

**Recent Updates (2025-10-18 - Latest):**
- ✅ **Corner Radius Hierarchy** - Implemented proper visual hierarchy: nested elements use smaller radius (stats: `rounded-lg` 8px inside `rounded-2xl` 16px card)
- ✅ **Split Information Modals** - Separated into two focused modals: Restaurant Promotion Info and Virtual Currency Info
- ✅ **Contextual Help Buttons** - Info icons placed next to relevant sections (Promote Restaurants heading, Virtual Currency label)
- ✅ **Optimized Modal Headers** - Removed subtitles, used `leading-none` on headings, added `pt-2` for alignment
- ✅ **Absolute Positioned Close Buttons** - Close button no longer affects heading height, positioned at top-right with `absolute top-0 right-0`
- ✅ **Improved Visual Hierarchy** - Following Apple's design language: parent containers have larger radius, children have progressively smaller radius
- ✅ **Improved Virtual Currency Layout** - Grouped heading and amount together with wallet icon aligned to the group
- ✅ **Consolidated Stats Display** - Earned/Referred/Redeemed moved into virtual currency card with horizontal layout
- ✅ **Separate Stat Backgrounds** - Each stat has distinct colored background (green/blue/primary)
- ✅ **Simplified Restaurant Cards** - Single "Share Restaurant" button replaces complex multi-button layout
- ✅ **Swipeable Bottom Sheet** - Mobile-friendly sharing modal with gesture support
- ✅ **Touch Gesture Detection** - Bottom sheet follows finger during drag, dismisses on 100px+ swipe
- ✅ **Background Scroll Prevention** - Body scroll locked when bottom sheet is open
- ✅ **Progressive Disclosure** - All sharing options (link, social, code) in organized bottom sheet

**Previous Updates (2025-10-17):**
- ✅ **Visit Context Display** - Restaurant cards show "X visits • Last: Y days ago" to remind users
- ✅ **Dynamic Time Formatting** - Smart time ago function (today, yesterday, X days/weeks/months)
- ✅ **Improved Data Fetching** - Merged visit history with referral codes for complete context

**Previous Updates (2025-10-16):**
- ✅ **Improved Sharing UI** - Link-first approach with social sharing buttons
- ✅ **One-Click Social Sharing** - WhatsApp, Facebook, and native share integration  
- ✅ **Minimal Design** - Removed unnecessary text, icons-only social buttons
- ✅ **Better Spacing** - Tighter code container (p-2, mt-1.5), reduced dropdown margins (-mb-3)
- ✅ **Smooth Transitions** - 300ms animations for dropdown expand/collapse
- ✅ **Consistent Icon Sizing** - All icons (social, copy, check) use `h-5 w-5` (20px)
- ✅ **Active Button States** - Click feedback with `active:bg-muted/50` on dropdown button
- ✅ **Responsive Text** - Stats cards use `text-sm md:text-base` with `whitespace-nowrap`
- ✅ **Icon-Only Copy Button** - `h-8 w-8 p-0` with larger h-5 w-5 copy icon
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
- Virtual currency balance display with integrated stats
- Consolidated stats row (Earned, Referred, Redeemed) with color-coded backgrounds
- Restaurant-specific referral code management
- Swipeable bottom sheet for sharing options
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

1. **Virtual Currency Card with Integrated Stats:**
   - Large balance display at top
   - Horizontal stats row with color-coded backgrounds:
     - **Earned**: Light green background (`bg-green-50` / `dark:bg-green-950/20`)
     - **Referred**: Light blue background (`bg-blue-50` / `dark:bg-blue-950/20`)
     - **Redeemed**: Primary color background (`bg-primary/10`)
   - Each stat in rounded container with padding
   - Separated by small gaps for visual distinction
   - Member since date at bottom

2. **Simplified Restaurant Cards:**
   - Restaurant name and visit statistics
   - Green "Active" badge
   - Single prominent "Share Restaurant" button
   - Clean, minimal design with reduced clutter

3. **Swipeable Bottom Sheet (Sharing Modal):**
   - Slides up from bottom with smooth animation
   - Touch gesture support - follows finger during drag
   - Dismisses when swiped down >100px
   - Snaps back if swipe is <100px
   - Prevents background scrolling when open
   - Contains all sharing options:
     - **Referral Link** section with copy button
     - **Social Media** buttons (WhatsApp, Facebook, More)
     - **Promotion Code** section with copy button
   - Backdrop overlay with blur effect
   - Handle bar at top for visual affordance

4. **Eligible Restaurants (visited but no code yet):**
   - Shows restaurant name and visit statistics
   - Display total visits and amount spent
   - "Generate Referral Code" button
   - Blue "Eligible" badge

5. **QR Code Modal:**
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
1. PRIMARY: "Share Restaurant" button (single, prominent CTA)
2. MODAL: Bottom sheet with organized sharing options
   - Referral link section
   - Social media buttons  
   - Promotion code section
```

**Code Structure:**

**1. Virtual Currency Card with Stats:**
```tsx
<Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
  <CardContent className="p-5">
    {/* Grouped Balance Display with Info Button */}
    <div className="flex items-start justify-between">
      <div>
        {/* Heading with Info Button */}
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm text-muted-foreground">Virtual Currency</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCurrencyInfoModal(true)}
            className="h-5 w-5 p-0"
            title="How virtual currency works"
          >
            <Info className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        {/* Amount */}
        <p className="text-4xl font-bold text-foreground">
          {formatCurrency(0)}
        </p>
      </div>
      {/* Wallet Icon aligned with entire group */}
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Wallet className="h-8 w-8 text-primary" />
      </div>
    </div>
    
    {/* Consolidated Stats Row - Children Use Smaller Radius */}
    <div className="flex items-center gap-2 pt-4 mt-2 border-t border-border/20 -mx-5 px-5 pb-4">
      <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">
        <p className="text-xs text-muted-foreground mb-0.5">Earned</p>
        <p className="text-sm font-semibold text-green-600">
          {formatCurrency(0)}
        </p>
      </div>
      <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">
        <p className="text-xs text-muted-foreground mb-0.5">Referred</p>
        <p className="text-sm font-semibold text-blue-600">0</p>
      </div>
      <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">
        <p className="text-xs text-muted-foreground mb-0.5">Redeemed</p>
        <p className="text-sm font-semibold text-primary">
          {formatCurrency(0)}
        </p>
      </div>
    </div>
    
    <p className="text-xs text-muted-foreground text-center mt-2">
      Member since {memberSince}
    </p>
  </CardContent>
</Card>
```

**2. Simplified Restaurant Card:**
```tsx
<Card className="restaurant-code-card">
  <CardContent className="p-5">
    {/* Header with visit stats */}
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3>{code.restaurant.name}</h3>
        {code.total_visits && code.first_visit_date && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {code.total_visits} visits • Last: {getTimeAgo(code.first_visit_date)}
          </p>
        )}
      </div>
      <Badge>Active</Badge>
    </div>

    {/* Single Share Button */}
    <Button
      onClick={() => {
        setSelectedRestaurant({
          name: code.restaurant.name,
          slug: code.restaurant.slug,
          code: code.referral_code
        });
        setShowShareSheet(true);
      }}
      className="w-full bg-primary hover:bg-primary/90"
      size="lg"
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share Restaurant
    </Button>
  </CardContent>
</Card>
```

**3. Swipeable Bottom Sheet:**
```tsx
{/* State management */}
const [showShareSheet, setShowShareSheet] = useState(false);
const [selectedRestaurant, setSelectedRestaurant] = useState(null);
const [touchStart, setTouchStart] = useState(0);
const [touchCurrent, setTouchCurrent] = useState(0);
const [isDragging, setIsDragging] = useState(false);

{/* Prevent body scroll when sheet is open */}
useEffect(() => {
  if (showShareSheet) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [showShareSheet]);

{/* Bottom Sheet Component */}
{showShareSheet && selectedRestaurant && (
  <>
    {/* Backdrop */}
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in overflow-hidden"
      onClick={() => setShowShareSheet(false)}
      style={{ touchAction: 'none' }}
    />
    
    {/* Swipeable Sheet */}
    <div 
      className="fixed inset-x-0 bottom-0 z-50"
      style={{
        transform: isDragging && touchCurrent > touchStart 
          ? `translateY(${touchCurrent - touchStart}px)` 
          : 'translateY(0)',
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
      onTouchStart={(e) => {
        setTouchStart(e.targetTouches[0].clientY);
        setTouchCurrent(e.targetTouches[0].clientY);
        setIsDragging(true);
      }}
      onTouchMove={(e) => {
        if (isDragging) {
          const current = e.targetTouches[0].clientY;
          if (current > touchStart) {
            setTouchCurrent(current);
          }
        }
      }}
      onTouchEnd={() => {
        setIsDragging(false);
        const dragDistance = touchCurrent - touchStart;
        if (dragDistance > 100) {
          setShowShareSheet(false);
        } else {
          setTouchCurrent(touchStart);
        }
      }}
    >
      <div className="bg-background rounded-t-3xl shadow-2xl border-t border-border max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          {/* Handle Bar */}
          <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6"></div>
          
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl font-bold">Share {selectedRestaurant.name}</h3>
            <p className="text-sm text-muted-foreground">
              Choose how you'd like to share this restaurant
            </p>
          </div>

          {/* Referral Link Section */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Referral Link</label>
            <div className="bg-muted/50 rounded-lg p-4 border">
              <p className="text-xs font-mono break-all leading-relaxed mb-3">
                {window.location.origin}/join/{selectedRestaurant.slug}/{selectedRestaurant.code}
              </p>
              <Button onClick={() => handleCopyLink()} className="w-full" size="lg">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Social Share Options */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Share via Social Media</label>
            <div className="grid grid-cols-3 gap-3">
              <Button onClick={() => handleShareWhatsApp()}>
                <WhatsAppIcon />
                <span className="text-xs">WhatsApp</span>
              </Button>
              {/* Facebook, More buttons... */}
            </div>
          </div>

          {/* Promotion Code Section */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Promotion Code</label>
            <div className="bg-muted/50 rounded-lg p-4 border">
              <div className="flex items-center justify-between gap-3">
                <code className="text-base font-mono flex-1">
                  {selectedRestaurant.code}
                </code>
                <Button size="sm" onClick={() => handleCopyCode()}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button onClick={() => setShowShareSheet(false)} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  </>
)}
```

**Design Details:**

**Virtual Currency Card:**
- **Card padding:** `p-5` - uniform padding
- **Layout:** `flex items-start justify-between` - heading/amount grouped on left, wallet icon on right
- **Heading group:** 
  - Info button inline with label: `flex items-center gap-2 mb-1`
  - Amount below label with minimal spacing
  - Wallet icon aligned to entire group (not just amount)
- **Stats row layout:** `flex items-center gap-2` - horizontal with small gaps
- **Stat backgrounds:** `bg-primary/10` - consistent primary color tint
- **Stat containers:** `rounded-lg py-3` - medium rounded corners (8px) with vertical padding
- **Stat spacing:** `-mx-5 px-5` - extends to card edges for full-width background
- **Border radius hierarchy:** Stats use `rounded-lg` (8px) because they're nested inside a `rounded-2xl` (16px) card - following the principle that child elements should have smaller radius than their parent

**Restaurant Cards:**
- **Card padding:** `p-5` - uniform padding
- **Header spacing:** `mb-4` - adequate space before button
- **Visit stats:** `text-xs text-muted-foreground mt-0.5` - shows "X visits • Last: Y days ago"
- **Time ago helper:** Dynamic formatting (today, yesterday, X days/weeks/months ago)
- **Share button:** `w-full size-lg` - prominent, full-width CTA

**Bottom Sheet:**
- **Animation:** Slides up with `animate-in slide-in-from-bottom duration-300`
- **Backdrop:** `bg-black/50 backdrop-blur-sm` with fade-in animation
- **Gesture tracking:** Real-time `translateY()` follows finger position
- **Drag threshold:** 100px swipe down to dismiss
- **Snap-back:** Smooth 0.3s ease-out transition if swipe < 100px
- **Touch handling:**
  - `touchAction: 'none'` on backdrop - prevents background scroll
  - Real-time `touchCurrent` state updates during drag
  - `isDragging` flag disables transition during touch
- **Visual affordance:** 12px × 1.5px handle bar at top
- **Max height:** `max-h-[85vh]` with `overflow-y-auto` for scrollable content
- **Border radius:** `rounded-t-3xl` for smooth top corners
- **Z-index:** `z-50` ensures it appears above other content

**Social Media Icons:**
```tsx
// WhatsApp Icon (!h-5 !w-5 with !important to override Button's default size-4)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="!h-5 !w-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..." />
  </svg>
);

// Facebook Icon (!h-5 !w-5 with !important to override Button's default size-4)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="!h-5 !w-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12..." />
  </svg>
);
```

**Important Note:** The `!` prefix (important flag) is required because the Button component has a default CSS rule `[&_svg]:size-4` that forces all SVG elements to 16px. Using `!h-5 !w-5` overrides this to display icons at 20px.

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

**Benefits of Bottom Sheet Approach:**
- **Progressive Disclosure:** Keeps main interface clean, shows options only when needed
- **Reduced Decision Paralysis:** Single "Share Restaurant" button vs multiple choices
- **Native Mobile Feel:** Swipeable bottom sheet is familiar iOS/Android pattern
- **Better Organization:** All sharing options logically grouped in one place
- **Touch-Optimized:** Large touch targets, swipe gestures, native interactions
- **Focus Mode:** Backdrop blur helps user focus on sharing task

**Benefits of Link-First Approach:**
- **Higher Conversion:** Recipients click link → auto-redirect to registration with restaurant pre-selected
- **Social Media Ready:** Links are clickable on WhatsApp, Facebook, Instagram stories
- **Less Friction:** No need to remember/type codes
- **Mobile Optimized:** Native share on mobile devices
- **Better Tracking:** Can track link clicks vs code usage

**User Flow:**
1. Customer generates promotion code for restaurant
2. Clicks "Share Restaurant" button (single, clear CTA)
3. Bottom sheet slides up with all sharing options
4. Chooses method: Copy link, WhatsApp, Facebook, or copy code
5. Swipes down or taps backdrop to close
6. Recipient clicks link → lands on `/join/{slug}/{code}`
7. Registration page pre-fills restaurant context
8. One-click signup = higher conversion

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

## 4.6 Information Modal Architecture ✅ IMPLEMENTED

### Overview
The dashboard features two focused information modals that provide contextual help to users about different aspects of the platform. This architecture follows the principle of **progressive disclosure** - information is available when needed, but doesn't clutter the main interface.

### Modal Structure

#### 1. Restaurant Promotion Info Modal
**Trigger:** Info icon button next to "Promote Restaurants" section heading
**Purpose:** Explains how to promote restaurants and earn virtual currency

**Content:**
- Visit a restaurant and make a transaction to unlock promotion for that restaurant
- Generate your unique referral code for each restaurant you've visited
- Share your referral link with friends via WhatsApp, Facebook, or copy the link
- When someone uses your link and makes their first transaction at that restaurant, you both earn virtual currency

#### 2. Virtual Currency Info Modal
**Trigger:** Info icon button next to "Virtual Currency" label in balance card
**Purpose:** Explains the virtual currency system and balance breakdown

**Content:**
- Redeem your virtual currency for discounts at participating restaurants
- Check your balance and transaction history in the dashboard
- The more friends you refer, the more you earn!
- **Earned:** Total virtual currency you've earned from referrals
- **Referred:** Number of friends you've successfully referred
- **Redeemed:** Total amount you've used for discounts

### Implementation Details

**Info Button Placement:**
```tsx
{/* Restaurant Promotion Info Button */}
<div className="flex items-center justify-between mb-4">
  <div>
    <h2 className="text-lg font-bold text-foreground">Promote Restaurants</h2>
    <p className="text-sm text-muted-foreground">Share codes for restaurants you've visited</p>
  </div>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setShowInfoModal(true)}
    className="h-8 w-8 p-0"
    title="How it works"
  >
    <Info className="h-5 w-5 text-muted-foreground" />
  </Button>
</div>

{/* Virtual Currency Info Button */}
<div className="flex items-center gap-2 mb-1">
  <p className="text-sm text-muted-foreground">Virtual Currency</p>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setShowCurrencyInfoModal(true)}
    className="h-5 w-5 p-0"
    title="How virtual currency works"
  >
    <Info className="h-4 w-4 text-muted-foreground" />
  </Button>
</div>
```

**Modal Structure with Optimized Close Button:**
```tsx
{showInfoModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={() => setShowInfoModal(false)}
  >
    <div
      className="bg-background rounded-2xl max-w-lg w-full shadow-2xl border border-border"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        {/* Header with Absolute Positioned Close Button */}
        <div className="relative mb-6">
          <h3 className="text-xl font-bold text-foreground leading-none pt-2">
            How It Works
          </h3>
          <button
            onClick={() => setShowInfoModal(false)}
            className="absolute top-0 right-0 h-6 w-6 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-sm">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Visit a restaurant and make a transaction...</span>
            </li>
            {/* More items... */}
          </ul>
        </div>

        <Button
          onClick={() => setShowInfoModal(false)}
          className="w-full mt-6"
        >
          Got it!
        </Button>
      </div>
    </div>
  </div>
)}
```

### Close Button Positioning Solution

**Challenge:** The close button needed to be at the top-right corner without affecting the heading's height.

**Evolution of Solution:**

1. **Initial Attempt:** Used `flex justify-between` with button in same row
   - Issue: Button's height (32px) expanded the entire container

2. **Second Attempt:** Tried `items-start` alignment
   - Issue: Button was vertically centered, not top-aligned

3. **Third Attempt:** Replaced shadcn Button with native `<button>`
   - Issue: Still had centering issues

4. **Final Solution:** Absolute positioning
   ```tsx
   <div className="relative mb-6">
     <h3 className="text-xl font-bold text-foreground leading-none pt-2">
       Modal Title
     </h3>
     <button
       className="absolute top-0 right-0 h-6 w-6 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center"
       aria-label="Close"
     >
       <X className="h-5 w-5" />
     </button>
   </div>
   ```

**Key Implementation Details:**
- **Container:** `relative mb-6` provides positioning context
- **Heading:** 
  - `leading-none` removes default line-height spacing
  - `pt-2` (8px) aligns heading baseline with button for visual balance
- **Button:**
  - `absolute top-0 right-0` positions independently of heading
  - `h-6 w-6` (24px) compact size that doesn't overwhelm
  - `flex items-center justify-center` centers X icon within button
  - Native `<button>` instead of shadcn Button to avoid internal flex centering

### Visual Consistency & Corner Radius Hierarchy

**Design Principle: Nested Elements Use SMALLER Radius**

Following Apple's design language and industry best practices, corner radius should follow a hierarchical system where:
- Larger/parent elements → Larger radius
- Smaller/child elements → Smaller radius
- This creates visual harmony and helps users understand parent-child relationships

**Border Radius Hierarchy:**

| Element | Border Radius | Size | Usage |
|---------|---------------|------|-------|
| Modals/Sheets | `rounded-3xl` | 24px | Largest overlays, bottom sheets |
| Profile Header | `rounded-b-3xl` | 24px | Hero section, visual anchor |
| Cards (parent) | `rounded-2xl` | 16px | Virtual currency card, restaurant cards |
| Action Buttons | `rounded-xl` | 12px | QR button, Logout button |
| Stats Cards (nested) | `rounded-lg` | 8px | Inside virtual currency card (children smaller than parent) |
| Small Buttons | `rounded-md` | 6px | Modal close button, subtle elements |
| Modal Container | `rounded-2xl` | 16px | Modal windows |
| Avatar/Icons | `rounded-full` | - | Circular elements |

**Why Stats Use `rounded-lg` Instead of `rounded-xl`:**

Stats cards are **nested inside** the Virtual Currency Card, so they use a smaller radius (8px vs 16px) to:
1. **Visual Hierarchy**: Clearly indicate they're children of the parent container
2. **Depth Perception**: Create layering effect showing containment
3. **Professional Polish**: Matches expectations from well-designed apps (Apple, Google)
4. **Proportional Harmony**: Each element's radius proportional to its size

**Correct Implementation:**
```tsx
{/* Parent: Virtual Currency Card */}
<Card className="rounded-2xl shadow-lg">  {/* 16px - parent */}
  
  {/* Children: Stats Cards */}
  <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">  {/* 8px - child */}
    <p>Earned</p>
    <p>RM 150.00</p>
  </div>
  
</Card>
```

**Incorrect Implementation (Avoid):**
```tsx
{/* Parent and child same size - creates visual confusion */}
<Card className="rounded-xl">  {/* 12px */}
  <div className="rounded-xl">  {/* 12px - should be smaller! */}
    {/* Content */}
  </div>
</Card>
```

**Real-World Examples:**
- **Apple iOS**: App icons (22% radius) → Widget buttons (~12px) → Badges (~6px)
- **Material Design**: Cards (16px) → Chips (8px) → Buttons (4-8px)
- **Our Implementation**: Card (16px) → Stats (8px) → Close button (6px)

### Design Principles Applied

1. **Contextual Help:** Info icons placed directly next to the sections they explain
2. **Progressive Disclosure:** Complex information hidden until user requests it
3. **Consistent Positioning:** All close buttons use same positioning strategy
4. **Visual Hierarchy:** Heading size and weight clearly indicate modal purpose
5. **Typography Control:** `leading-none` prevents unwanted spacing
6. **Accessibility:** 
   - `aria-label="Close"` on icon-only buttons
   - Click outside to close functionality
   - Large touch targets (24px minimum)

### User Experience Benefits

- **Reduced Cognitive Load:** Main interface stays clean, help is available on demand
- **Faster Learning:** Users can access help exactly when they need it
- **Better Organization:** Related information grouped in focused modals
- **Consistent Interaction:** All info modals follow same structure and behavior
- **Mobile Friendly:** Modals are responsive and touch-optimized

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
