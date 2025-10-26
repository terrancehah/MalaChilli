# Frontend UI/UX Design Guide
## MalaChilli - Design Patterns & Visual Standards

**Document Purpose:**  
This guide defines the **UI/UX design patterns, visual standards, and component guidelines** for the MalaChilli frontend. It focuses exclusively on design decisions, user experience patterns, and visual consistency.

**For implementation details, refer to:**
- Technical architecture → `04-technical-architecture.md`
- API integration → `05-api-specification.md`
- Component code → `/frontend/src/` directory

**Version:** 2.1  
**Last Updated:** 2025-10-26  
**Design System:** Tailwind CSS + Shadcn/UI

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
```tsx
<div className="p-3 flex items-start justify-between">
  <div className="flex-1 min-w-0">
    <p>Label</p>                    {/* Always visible */}
    {!isEditing && <p>Value</p>}    {/* Conditional */}
    <AnimatedGrid>                  {/* Only this animates */}
      <input />
      <Button>Save</Button>
    </AnimatedGrid>
  </div>
  {!isEditing && <EditIcon />}      {/* Aligned with entire field */}
</div>
```

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
```tsx
<button className="absolute top-0 right-0 h-6 w-6">
  <X className="h-5 w-5" />
</button>
```

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

### 5. Grid Animation Technique

**Problem:** CSS doesn't animate `height: auto`

**Solution:** Use CSS Grid with `grid-template-rows`

**How it works:**
```
0fr = "0 fractions of space" = 0px (collapsed)
1fr = "1 fraction of space" = natural content height (expanded)
```

**CSS automatically calculates pixel values and animates smoothly**

**Structure:**
```tsx
<div className="grid transition-[grid-template-rows] duration-300" 
     style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
  <div className="overflow-hidden">
    <div className="px-0.5">  {/* Prevents focus ring clipping */}
      Content here
    </div>
  </div>
</div>
```

**Why `px-0.5`:** Prevents 2px focus ring from being clipped by `overflow-hidden`

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
```tsx
<Button className="bg-primary text-white hover:bg-primary/90">
```

**Outline:**
```tsx
<Button variant="outline" className="border-border hover:bg-muted">
```

**Ghost:**
```tsx
<Button variant="ghost" className="hover:bg-muted">
```

**Icon Button:**
```tsx
<Button className="h-8 w-8 p-0">
  <Icon className="h-4 w-4" />
</Button>
```

---

## Input Field Standards

### Text Input

```tsx
<input className="w-full px-3 py-2 text-sm bg-background border border-border 
                 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
```

### Validation States

**Invalid:**
```tsx
<input className="border-red-500 focus:ring-red-500" />
<p className="text-xs text-red-500 mt-1">Error message</p>
```

**Valid:**
```tsx
<input className="border-green-500 focus:ring-green-500" />
```

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
