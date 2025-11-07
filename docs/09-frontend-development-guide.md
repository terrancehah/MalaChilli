# Frontend UI/UX Design Guide
## MalaChilli - Design Patterns & Visual Standards

**Document Purpose:**  
This guide defines the **UI/UX design patterns, visual standards, and component guidelines** for the MalaChilli frontend. It focuses exclusively on design decisions, user experience patterns, and visual consistency.

**For implementation details, refer to:**
- Technical architecture → `04-technical-architecture.md`
- API integration → `05-api-specification.md`
- Component code → `/frontend/src/` directory

**Version:** 2.4  
**Last Updated:** 2025-11-01  
**Design System:** Tailwind CSS + Shadcn/UI + Recharts

---

## Design Principles

1. **Mobile-First:** All designs start with mobile viewport, scale up for desktop
2. **Progressive Disclosure:** Complex information hidden until requested
3. **Familiar Patterns:** Follow iOS/Android conventions for gestures and interactions
4. **Minimal & Clean:** Remove unnecessary text, prioritize visual hierarchy
5. **Touch-Optimized:** Minimum 44px touch targets, swipe gestures where appropriate

---

## Visual Design System

### Color Palette

**Primary Colors:**
- Forest Green `#0A5F0A` - Primary actions, branding
- Soft Cream `#FEF7ED` - Warm backgrounds
- Warm Orange `#F59E0B` - Accents, highlights

**Functional Colors:**
- Success: `#10B981` (green)
- Warning: `#F59E0B` (amber)
- Error: `#EF4444` (red)
- Info: `#3B82F6` (blue)

**Text Colors:**
- Primary: `#1F2937` - Headings, important text
- Secondary: `#6B7280` - Labels, descriptions
- Muted: `#9CA3AF` - Placeholders, disabled states

### Typography Hierarchy

**Settings Panel Example:**
```
Settings (text-xl font-bold)        ← Main title
 ├─ Profile (text-base font-bold)   ← Section headers
 │   ├─ Name (text-sm font-semibold)     ← Field labels
 │   │   └─ Value (text-sm muted)         ← Field values
 │   └─ Email (text-sm font-semibold)
 └─ Preferences (text-base font-bold)
```

**Font Weights:**
- Bold (700) - Main titles, critical information
- Semibold (600) - Section headers, field labels
- Medium (500) - Buttons, emphasis
- Regular (400) - Body text, values

### Spacing System (Tailwind)

- **Micro:** 0.5 (2px), 1 (4px) - Icon padding, fine adjustments
- **Small:** 2 (8px), 3 (12px) - Element gaps, compact spacing
- **Medium:** 4 (16px), 5 (20px), 6 (24px) - Section spacing, card padding
- **Large:** 8 (32px), 10 (40px), 12 (48px) - Major sections, page padding

### Corner Radius Hierarchy

**Principle:** Nested elements use progressively SMALLER radius

```
Card (rounded-2xl = 16px)
 └─ Stat boxes (rounded-lg = 8px)
     └─ Buttons (rounded-md = 6px)
```

**Implementation Reference:**  
`/frontend/src/pages/customer/Dashboard.tsx` - Virtual Currency card

---

## Animation Standards

### Duration Guidelines

- **Micro interactions:** 150-200ms - Button press, toggle
- **UI transitions:** 300ms - Panel slide, dropdown expand
- **Page transitions:** 400-500ms - Route changes, modal appear

### Animation Patterns

**Slide-in Panel:**
```
Entry: slide-in-from-right duration-300
Exit:  slide-out-to-right duration-300
```

**Bottom Sheet (Responsive):**
```
Mobile:          slide-in-from-bottom duration-300
iPad Landscape:  slide-in-from-left duration-300
```

**Modal Backdrop:**
```
Entry: fade-in duration-300
Exit:  fade-out duration-300
```

**Dropdown Expand:**
```
CSS Grid: grid-template-rows: 0fr → 1fr (300ms)
```

**Implementation Reference:**  
`/frontend/src/pages/customer/Dashboard.tsx` - Settings panel animations

---

## Component Design Patterns

### 1. Inline Editing Pattern ⭐ STANDARD

**Use Case:** Edit profile fields without page navigation

**Visual Layout:**
```
┌─────────────────────────────────────┐
│ Label                         [✏️]  │  ← Edit icon aligned with entire field
│ Value content                       │
└─────────────────────────────────────┘
```

**Behavior:**
- Click edit → Label stays visible, input/buttons slide in smoothly
- Label creates continuity (feels like field always there)
- Only form controls animate (focus on what's changing)

**Animation Strategy:**
- Label: Static (no animation)
- Value: Instant hide/show
- Input + buttons: Smooth expand/collapse (300ms)
- Container: Ring border appears when editing

**Structure:**
- Label always visible
- Value conditionally shown when not editing
- AnimatedGrid wraps input and buttons (only this animates)
- EditIcon aligned with entire field when not editing

**Reference:** `/frontend/src/pages/customer/Dashboard.tsx` - Name field editing

**Typography:**
- Labels: `text-sm font-semibold`
- Values: `text-sm text-muted-foreground`
- Buttons: `h-9 text-sm font-medium`

**Implementation:** `/frontend/src/pages/customer/Dashboard.tsx` - Name field editing

---

### 2. Modal Architecture

**Two Types Implemented:**

#### A. Information Modal
**Purpose:** Provide contextual help without cluttering main UI

**Pattern:**
- Info icon next to section heading
- Click → Modal with focused explanation
- Absolute positioned close button (doesn't affect heading height)

**Example:** Restaurant Promotion Info, Virtual Currency Info

**Close Button Pattern:**
- Absolute positioned (top-0 right-0)
- Size: h-6 w-6
- Icon: h-5 w-5

**Implementation:** `/frontend/src/pages/customer/Dashboard.tsx` - Info modals

#### B. Bottom Sheet Modal
**Purpose:** Mobile-first progressive disclosure for actions

**Features:**
- Swipe down to dismiss (100px threshold)
- Background scroll lock
- Gesture follows finger
- Touch-optimized layout
- **Responsive:** Bottom sheet on mobile, left panel (60%) on iPad landscape

**Use Cases:** Share options, action menus, QR scanner

**Implementation Examples:**
- `/frontend/src/pages/customer/Dashboard.tsx` - Share bottom sheet
- `/frontend/src/components/staff/QRScannerSheet.tsx` - Scanner with iPad split-view

**iPad Landscape Behavior:**
- Transforms to left panel (60% width)
- Full height split-view
- Slides in from left (not bottom)
- Dashboard remains visible on right (40%)

---

### 3. Settings Panel Pattern

**Design Decision: Slide-in vs Popup**

**Why Slide-in:**
- Matches iOS/Android patterns (familiar)
- Directional alignment (slides from Settings button location)
- Better mobile experience
- Clear exit route (swipe right or tap backdrop)

**Animation Sequence:**
1. Backdrop fades in (300ms)
2. Panel slides in from right (300ms)
3. User interacts
4. Panel slides out (300ms)
5. Backdrop fades out (300ms)
6. Panel unmounted after animation completes

**State Management:**
- `showSettings` - Controls visibility
- `isSettingsClosing` - Triggers exit animation
- `onAnimationEnd` - Unmounts after animation

**Implementation:** `/frontend/src/pages/customer/Dashboard.tsx` - Settings panel

---

### 4. QR Scanner UI Pattern

**Design Decision: Corner Brackets vs Full Frame**

**Why Corner Brackets:**
- Industry standard (WhatsApp, WeChat, Instagram, banking apps)
- Less visual clutter - only shows corners
- Clear framing - user knows where to align
- Better visibility - white stands out on any background
- Professional appearance

**Visual Specifications:**
```
Scanner Area: 256x256px (w-64 h-64)
Corner Brackets: 48x48px (w-12 h-12) L-shaped
Border Width: 4px (border-4)
Color: White (border-white)
Corner Radius: 12px (rounded-xl)
```

**Camera Feed:**
```
Library: @yudiel/react-qr-scanner (React-native, 200KB lighter than html5-qrcode)
Constraints: { facingMode: 'environment' } - Back camera
Container: Black background (bg-black), 400px height (500px on iPad)
Object Fit: cover - Fills container without distortion
```

**Responsive Behavior:**
- **Mobile:** Bottom sheet, camera viewfinder with corner brackets
- **iPad Landscape:** Left panel (60%), taller scanner (500px), dashboard visible on right

**Implementation:** `/frontend/src/components/staff/QRScannerSheet.tsx`

---

### 5. Staff Dashboard Action Buttons Pattern

**Design Decision: Large Touch-Optimized Action Cards**

**Visual Design:**
- **Primary Action** (Scan for Checkout): Gradient background (primary to primary-light)
- **Secondary Actions**: Outlined style with hover effects
- Card height: `h-32 md:h-36` (128px mobile, 144px desktop)
- Icon size: `!h-12 !w-12 md:!h-14 md:!w-14` with `!important` override
- No background containers for icons - icons directly in buttons
- Hover effects: scale transform (110%), color changes, shadow elevation
- Smooth transitions: 300ms duration

**Grid Layout:**
- Mobile: 1 column (grid-cols-1)
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 4 columns (lg:grid-cols-4)

**Action Buttons:**
1. **Scan for Checkout** - Primary green gradient, checkout flow only
2. **Edit Customer** - Opens customer lookup/search
3. **Scan Receipt** - Placeholder for future OCR feature
4. **View Transactions** - Navigate to transaction history

**Implementation:** `/frontend/src/pages/staff/Dashboard.tsx`

---

### 6. Staff Checkout Flow Pattern

**Design Decision: Streamlined Single-Screen Checkout**

**Why Streamlined:**
- Fast transaction processing at counter
- No multi-step navigation
- All info visible at once
- Staff efficiency prioritized

**Checkout Flow:**
1. Scan Customer QR (QR Scanner Sheet)
2. Verify Customer (Verification Modal)
3. Enter Bill & Redeem VC (Checkout Sheet)
4. Submit (Done!)

**Customer Verification Modal Features:**
- **Birthday Detection**: Shows gradient badge if today is customer's birthday
- **First Visit Badge**: Displays for new customers at this restaurant
- Birthday check: Compares month and day (timezone-aware)
- Clean, focused design - no edit functionality (edit is separate flow)

**Key Design Decisions:**

**Receipt Upload Removed from Checkout:**
- Staff shouldn't photograph receipts during transaction (inefficient)
- Receipt OCR moved to separate dashboard feature
- Staff can upload receipts during downtime
- Checkout stays fast and focused

**Minimal Input Fields:**
- Bill amount (required)
- VC redemption (optional, max 20% of bill)
- No notes, no receipt upload during checkout
- Single "Process Transaction" button

**Visual Feedback:**
- Customer info card shows: name, referral code, wallet balance, visit status
- Real-time VC redemption calculation
- Guaranteed discount display (if applicable)
- Final amount calculation

**Implementation:** 
- `/frontend/src/pages/staff/Dashboard.tsx` - Main flow orchestration
- `/frontend/src/components/staff/CheckoutSheet.tsx` - Transaction UI
- `/frontend/src/components/staff/CustomerVerifiedModal.tsx` - Verification with badges

---

### 7. Customer Lookup & Edit Pattern

**Design Decision: Dual Search Methods (QR + Manual Search)**

**Why Both Methods:**
- QR scanning: Fast for customers with QR ready
- Manual search: Flexible when QR unavailable
- Staff can find any customer quickly
- Better counter experience

**Customer Lookup Sheet Features:**
- **QR Scan Button**: Large, prominent action to open QR scanner
- **Manual Search**: Text input with real-time search
- Search by: name, email, or referral code
- Case-insensitive partial matching
- Shows up to 10 results

**Search Results Display:**
- Avatar icon (primary colored)
- Full name (bold, hover effect)
- Email with icon
- Referral code (monospace badge)
- Birthday (if available) 🎂

**Edit Customer Flow:**
1. Click "Edit Customer" (Dashboard Button)
2. Choose Method (Lookup Sheet)
3. Find Customer (Search/Scan)
4. Edit Details (Edit Sheet)

**Edit Customer Sheet:**
- Edit full name (required)
- Edit birthday (optional, for birthday rewards)
- Clean form with validation
- Success feedback after save
- Auto-refresh customer data

**Separation from Checkout:**
- Edit customer is completely separate from checkout flow
- "Scan for Checkout" button only for transactions
- "Edit Customer" button only for profile updates
- No mixing of concerns

**Implementation:**
- `/frontend/src/components/staff/CustomerLookupSheet.tsx` - Search interface
- `/frontend/src/components/staff/EditCustomerSheet.tsx` - Edit form
- `/frontend/src/pages/staff/Dashboard.tsx` - Flow orchestration

---

### 6. Grid Animation Technique

**Problem:** CSS doesn't animate `height: auto`

**Solution:** Use CSS Grid with `grid-template-rows`

**How it works:**
- 0fr = "0 fractions of space" = 0px (collapsed)
- 1fr = "1 fraction of space" = natural content height (expanded)
- CSS automatically calculates pixel values and animates smoothly

**Structure:**
- Grid container with `transition-[grid-template-rows] duration-300`
- Style: `gridTemplateRows: isOpen ? '1fr' : '0fr'`
- Inner div with `overflow-hidden`
- Content wrapper with `px-0.5` (prevents 2px focus ring from being clipped)

**Implementation:** `/frontend/src/pages/customer/Dashboard.tsx` - Name field expansion

---

### 5. Card Hierarchy Pattern

**Visual Principle:** Parent → Child relationship through sizing

**Avatar Optimization:**
- Reduced from 64px → 56px for better proportion
- Single-line name with ellipsis (prevents wrapping)
- Responsive font sizing: `text-base md:text-lg`

**Stat Cards:**
- Individual colored backgrounds (green/blue/primary)
- Horizontal layout with icon + label + value
- `whitespace-nowrap` prevents wrapping

**Implementation:** `/frontend/src/pages/customer/Dashboard.tsx` - Virtual Currency card

---

### 6. Progressive Disclosure Pattern

**Restaurant Cards:**
- Single "Share Restaurant" button
- Click → Bottom sheet with all share options (link, social, code)
- Link-first approach (better conversion than codes)

**Information Modals:**
- Main UI stays clean
- Help available on demand (info icons)
- Focused, single-purpose modals

**Implementation:** `/frontend/src/pages/customer/Dashboard.tsx` - Share flow

---

## Button Standards

### Size Variants

- **Large:** `h-11 text-base` - Primary CTAs
- **Default:** `h-10 text-sm` - Standard buttons
- **Medium:** `h-9 text-sm` - Compact actions (Save/Cancel)
- **Small:** `h-8 text-xs` - Tight spaces, icon buttons

### Style Variants

**Primary (Green):**
- `bg-primary text-white hover:bg-primary/90`

**Outline:**
- `variant="outline" border-border hover:bg-muted`

**Ghost:**
- `variant="ghost" hover:bg-muted`

**Icon Button:**
- Size: `h-8 w-8 p-0`
- Icon: `h-4 w-4`

---

## Input Field Standards

### Text Input
- Full width: `w-full`
- Padding: `px-3 py-2`
- Text: `text-sm`
- Background: `bg-background`
- Border: `border border-border rounded-md`
- Focus: `focus:outline-none focus:ring-2 focus:ring-primary`

### Validation States

**Invalid:**
- Border: `border-red-500`
- Focus ring: `focus:ring-red-500`
- Error message: `text-xs text-red-500 mt-1`

**Valid:**
- Border: `border-green-500`
- Focus ring: `focus:ring-green-500`

---

## Layout Patterns

### Centered Auth Layout
- Max width: 400px
- Vertical/horizontal centering
- Minimal branding at top

### Dashboard Layout
- Header with avatar and stats
- Section headings with info icons
- Card-based content sections
- Bottom sheet for actions

### Settings Panel Layout
- Slide-in from right
- Section groups (Profile, Preferences, About)
- Consistent field structure
- Logout button at bottom

---

## Touch Optimization

### Minimum Touch Targets
- Buttons: 44px × 44px minimum
- Icons: 24px × 24px minimum  
- Tap zones: Add padding to increase effective area

### Swipe Gestures
- Bottom sheet: Swipe down to dismiss (100px threshold)
- Potential: Side navigation, card actions

### Scroll Behavior
- Lock body scroll when modal/sheet open
- Smooth scrolling within containers
- Pull-to-refresh (future consideration)

---

## Accessibility Standards

### Color Contrast
- Text on background: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### Focus States
- Visible focus rings on all interactive elements
- `focus:ring-2 focus:ring-primary` standard
- Skip keyboard trap in modals

### Screen Reader Support
- Semantic HTML (`<button>`, `<input>`, `<label>`)
- `aria-label` for icon-only buttons
- `role` attributes where needed

---

## Responsive Design

### Breakpoints
- Mobile: < 640px (default)
- Tablet: 640px - 1024px
- Desktop: 1024px+

### Responsive Patterns
- Single column on mobile
- Multi-column on desktop (where appropriate)
- Font sizes scale: `text-sm md:text-base`
- Spacing scales: `p-4 md:p-6`

---

## Component Checklist

When creating a new component, ensure:

- ✅ Follows design system colors
- ✅ Uses consistent spacing (Tailwind scale)
- ✅ Implements proper corner radius hierarchy
- ✅ Has smooth animations (300ms standard)
- ✅ Touch targets ≥ 44px
- ✅ Accessible (contrast, focus, semantic HTML)
- ✅ Responsive (mobile-first)
- ✅ Loading/error states defined
- ✅ Matches existing patterns (don't reinvent)

---

## Design References

### External Inspiration
- **iOS Settings App** - Slide-in panels, list structure
- **Android Material Design** - Bottom sheets, FABs
- **Food Delivery Apps** - Card layouts, color usage
- **Banking Apps** - Security, clear hierarchy

### Internal References
- Customer Dashboard: `/frontend/src/pages/customer/Dashboard.tsx`
- Demo Dashboard: `/frontend/src/pages/DemoDashboard.tsx`
- Auth Pages: `/frontend/src/pages/{Login,Register}.tsx`

---

## Recent Updates

### Staff Dashboard Enhancements (2025-10-30)

**Component:** `/frontend/src/pages/staff/Dashboard.tsx`

**New Features:**

1. **Enhanced Action Buttons**
   - Large touch-optimized cards (h-32 md:h-36)
   - Primary gradient button for checkout
   - Icons with !important size override (!h-12 !w-12 md:!h-14 md:!w-14)
   - No background containers - clean icon display
   - Smooth hover effects with scale and color transitions
   - 4-column grid on desktop (lg:grid-cols-4)

2. **Customer Lookup & Edit System**
   - **CustomerLookupSheet**: Dual search methods (QR + manual)
   - Search by name, email, or referral code
   - Real-time search with up to 10 results
   - Beautiful customer cards with all details
   - **EditCustomerSheet**: Edit name and birthday
   - Completely separate from checkout flow

3. **Birthday & First Visit Detection**
   - Automatic birthday detection on QR scan
   - Birthday badge with gradient (pink-to-purple)
   - First visit badge with gradient (green-to-emerald)
   - Displayed in CustomerVerifiedModal
   - Ready for birthday rewards implementation

**Components Added:**
- `/frontend/src/components/staff/CustomerLookupSheet.tsx`
- `/frontend/src/components/staff/EditCustomerSheet.tsx`

**Components Updated:**
- `/frontend/src/components/staff/CustomerVerifiedModal.tsx` - Added badges
- `/frontend/src/pages/staff/Dashboard.tsx` - Enhanced UI and flows

**Design Improvements:**
- Removed stats card from staff dashboard
- Separated checkout and edit flows
- Better visual hierarchy with gradients
- Touch-optimized button sizes
- Consistent 300ms transitions

---

### Previous Updates (2025-10-29)

### Transaction Detail Bottom Sheet
**Component:** `/frontend/src/components/customer/TransactionDetailSheet.tsx`

**Features:**
- Clickable transaction cards that open detailed bottom sheet
- Smooth slide-in/out animations with backdrop fade
- Swipe-down gesture to close
- Body scroll prevention when open
- Displays:
  - Transaction time (full date and time)
  - Branch location
  - Bill amount
  - Realized VC earnings from downlines (if any)
  - Unrealized potential earnings breakdown:
    - Level 1, 2, 3 referral potential (1% each)
    - Total potential from 3 referrals
  - Applied discounts (guaranteed + VC redeemed)

**Purpose:** Educate users on multi-level earning potential to motivate code sharing

### Restaurant Sorting Component
**Location:** Customer Dashboard → "Promote Restaurants" section

**Implementation:**
- Replaced dropdown with shadcn-style tab buttons
- Three sorting options: Recent | Balance | Visits
- Active state with background shadow and smooth transitions
- Inline with section header

### Unrealized Earnings Display
**Format:** "💡 Unrealized: RM X.XX"
- Extremely concise format
- Shows on transaction cards without downline earnings
- Detailed breakdown available in transaction detail sheet

### Translation System
**Location:** `/frontend/src/translations/`

**Supported Languages:**
- English (en) - Default
- Bahasa Malaysia (ms)
- Chinese Simplified (zh)

**Structure:**
```typescript
import { getTranslation } from '../../translations';
import type { Language } from '../../translations';

// In component
const t = getTranslation(language); // language: 'en' | 'ms' | 'zh'
```

**Complete Coverage:**
- Dashboard header and profile section
- Stats cards (Earned, Referred, Redeemed)
- Promote Restaurants section
- Restaurant sorting tabs
- Restaurant cards (Active badge, Share button, VC Balance, visits)
- Recent transactions section
- Transaction detail sheet (all labels and sections)
- Referral info modal (3-level system explanation)
- Share bottom sheet (all labels, buttons, social media)
- QR Code modal (title, subtitle, close button)
- Settings panel (all sections: Profile, Preferences, About, Logout)

**Translation Files:**
- `en.ts` - English translations (complete)
- `ms.ts` - Bahasa Malaysia translations (complete)
- `zh.ts` - Chinese translations (complete)
- `index.ts` - Export and helper functions

**Language Selector:**
- Located next to QR code button in dashboard header
- Globe icon (🌐) with dropdown menu
- Supports: English, Bahasa Malaysia, 中文
- Updates all UI text immediately on selection

**Translated Components:**
- `Dashboard.tsx` - All sections and labels
- `RestaurantCard.tsx` - Badge, button, labels
- `ShareBottomSheet.tsx` - Complete sheet content
- `TransactionDetailSheet.tsx` - All transaction details
- `QRCodeModal.tsx` - Title, subtitle, labels
- `SettingsPanel.tsx` - All settings sections

---

## Future Considerations

### Planned Patterns
- Pull-to-refresh for transaction list
- Skeleton loading states
- Empty state illustrations
- Success animations (confetti, checkmark)

### Design System Evolution
- Dark mode support (theme toggle)
- Color customization per restaurant
- Branded QR code styling
- Haptic feedback (mobile)

---

## Data Visualization

### Chart Components (Shadcn/UI + Recharts)

**Implementation:** `/frontend/src/components/ui/chart.tsx`

**Chart Types Used:**
- **Bar Chart**: Categorical comparisons (saved codes pipeline, customer segmentation)
- **Line Chart**: Time-series trends (revenue over time)
- **Area Chart**: Cumulative trends with visual fill (network growth)
- **Pie Chart**: Proportional data (acquisition sources, activity levels)

**Design Guidelines:**
- **Height**: 200-250px for optimal mobile viewing
- **Colors**: Use CSS variables `--chart-1` through `--chart-5` for consistency
- **Tooltips**: Always include for detailed values on hover
- **Responsive**: Charts adapt to container width
- **Grid**: Subtle `stroke-muted` with `strokeDasharray="3 3"`
- **Axes**: No axis lines, minimal tick lines for clean appearance

**Color Palette:**
```css
--chart-1: Forest Green (primary data)
--chart-2: Lime Green (secondary data)
--chart-3: Amber (warnings/pending)
--chart-4: Blue (info/neutral)
--chart-5: Red (alerts/negative)
```

**Examples:**
- Owner Dashboard Viral Performance: `/frontend/src/components/owner/ViralPerformanceCharts.tsx`
- Owner Dashboard Business Metrics: `/frontend/src/components/owner/BusinessMetricsCharts.tsx`
- Owner Dashboard Customer Insights: `/frontend/src/components/owner/CustomerInsightsCharts.tsx`

---

## Owner Dashboard Pattern

### Three-Tab Analytics Layout

**Structure:**
```
Header (gradient, restaurant name, settings button)
  ↓
Tab Navigation (horizontal scroll on mobile, full width on desktop)
  ↓
Tab Content (charts + detailed metrics)
```

**Tab Navigation:**
- Mobile: Icon-only buttons, horizontal scroll
- Tablet+: Icon + text labels
- Active tab: `variant="default"` (filled)
- Inactive tabs: `variant="outline"`

**Settings Panel:**
- Bottom sheet on mobile
- Slide-in from right on desktop
- Menu items: Manage Staff, Manage Branches, Restaurant Settings
- Sign out button at bottom

**Responsive Breakpoints:**
- Mobile: 1 column grids, stacked charts
- Tablet (sm:): 2 column grids
- Desktop (lg:): 3-4 column grids, side-by-side charts

**Implementation:** `/frontend/src/pages/owner/Dashboard.tsx`

### Dashboard Design Principles

**Information Hierarchy:**
- Lead with hero metrics (largest, most important KPIs)
- Follow F/Z reading patterns (top-left → top-right → bottom-left → bottom-right)
- Progressive disclosure: Summary first, details on demand

**Data-Ink Ratio:**
- Minimize decorative elements (backgrounds, gridlines, excessive colors)
- Every visual element should communicate data
- Remove redundancy - don't show same data twice unless it adds value

**Layout Guidelines:**
- Use consistent grid system (3-4 columns on desktop)
- Single screen view - avoid scrolling for critical information
- White space for breathing room, but keep compact
- Combine related metrics into single cards

**Component Best Practices:**
- **KPI Cards**: Large numbers (text-3xl/4xl), short labels, trend indicators
- **Charts**: Bar for comparisons, Line/Area for trends, avoid pie charts unless 2-3 simple categories
- **Tables**: For detailed data needing sorting/filtering
- **Filters**: Minimal, contextual, with sensible defaults

**Anti-Patterns to Avoid:**
- Redundant visualizations (same data in card + chart)
- Pie charts with many categories (use bar charts)
- 3D charts (distort perception)
- Too many colors (stick to 3-5 semantic colors)
- Cluttered layouts without white space

### Customer Segmentation - RFM Analysis

**Method:** Use percentile-based RFM (Recency, Frequency, Monetary) scoring for dynamic, scalable segmentation

**Why Percentiles?**
- Adapts automatically as business grows
- Fair comparison regardless of customer base size
- A customer with 5 visits is "frequent" for a new restaurant but "infrequent" for an established one
- Avoids hardcoded thresholds that become outdated

**RFM Dimensions (1-5 scale using NTILE):**

- **Recency (R)**: Days since last visit (lower is better)
  - Score 5: Top 20% most recent visitors (e.g., within 30 days)
  - Score 4: 20-40% percentile (e.g., 31-60 days)
  - Score 3: 40-60% percentile (e.g., 61-90 days)
  - Score 2: 60-80% percentile (e.g., 91-180 days)
  - Score 1: Bottom 20% least recent (e.g., >180 days)

- **Frequency (F)**: Total visits relative to customer base
  - Score 5: Top 20% most frequent visitors
  - Score 4: 20-40% percentile
  - Score 3: 40-60% percentile
  - Score 2: 60-80% percentile
  - Score 1: Bottom 20% least frequent
  - **Note:** Scores are relative, not absolute numbers

- **Monetary (M)**: Total spent relative to customer base
  - Score 5: Top 20% highest spenders
  - Score 4: 20-40% percentile
  - Score 3: 40-60% percentile
  - Score 2: 60-80% percentile
  - Score 1: Bottom 20% lowest spenders

**Segment Definitions:**
- **Champions** (R:5, F:4-5, M:4-5): Best customers - recent, frequent, high spenders
- **Loyal** (R:3-5, F:3-5, M:3-5): Regular customers with consistent behavior
- **Potential Loyalists** (R:4-5, F:1-3, M:1-3): Recent customers showing promise
- **New Customers** (R:5, F:1, M:1-2): First-time visitors, need nurturing
- **At Risk** (R:2-3, F:2-5, M:2-5): Previously active but haven't visited recently
- **Can't Lose Them** (R:1-2, F:4-5, M:4-5): High-value customers at risk of churning
- **Hibernating** (R:1-2, F:1-2, M:1-2): Inactive low-value customers
- **Promising** (R:3-4, F:1, M:1): Recent first-timers with potential

**Database Implementation:**
```sql
-- Use NTILE(5) window function to create percentile-based scores
WITH rfm_scores AS (
  SELECT 
    customer_id,
    NTILE(5) OVER (PARTITION BY restaurant_id ORDER BY last_visit_date DESC) AS recency_score,
    NTILE(5) OVER (PARTITION BY restaurant_id ORDER BY total_visits ASC) AS frequency_score,
    NTILE(5) OVER (PARTITION BY restaurant_id ORDER BY total_spent ASC) AS monetary_score
  FROM customer_restaurant_history
)
```

**Reference:** [Optimove RFM Segmentation Guide](https://www.optimove.com/resources/learning-center/rfm-segmentation)

---

**Document Maintenance:**
- Update when new UI patterns are established
- Keep examples concise (link to code, don't duplicate)
- Focus on "why" decisions were made, not "how" to implement
- Remove outdated patterns when superseded

**Related Documentation:**
- Backend API: `05-api-specification.md`
- Database schema: `03-database-schema-design.md`
- Technical architecture: `04-technical-architecture.md`
- Implementation timeline: `06-project-timeline-sprints.md`
