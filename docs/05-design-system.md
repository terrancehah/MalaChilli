# Design System

## MakanTak - Visual Design Standards

**Document Type:** Design System Reference  
**Last Updated:** 2025-12-25  
**Status:** Active - All components should follow these standards

---

## 1. Typography

### Font Families

| Usage | Font | Tailwind Class |
|-------|------|----------------|
| **Headings** | Quicksand | `font-display` (auto-applied via CSS) |
| **Body Text** | Inter | `font-sans` (default) |
| **Decorative** | Pacifico | `font-cursive` |

### Type Scale

| Name | Size | Tailwind | Usage |
|------|------|----------|-------|
| **Display** | 36-48px | `text-4xl` / `text-5xl` | Hero headings, landing page |
| **H1** | 30px | `text-3xl` | Page titles, dashboard headers |
| **H2** | 24px | `text-2xl` | Section headings |
| **H3** | 20px | `text-xl` | Card titles, modal headers |
| **H4** | 18px | `text-lg` | Subsection titles |
| **Body** | 16px | `text-base` | Primary content |
| **Body Small** | 14px | `text-sm` | Secondary content, descriptions |
| **Caption** | 12px | `text-xs` | Labels, timestamps, metadata |
| **Micro** | 10px | `text-[10px]` | Badges, tags, fine print only |

> **Rule:** Avoid arbitrary sizes. Use `text-[10px]` sparingly for badges/tags only.

### Font Weights

| Weight | Tailwind | Usage |
|--------|----------|-------|
| Regular | `font-normal` | Body text |
| Medium | `font-medium` | Labels, buttons |
| Semibold | `font-semibold` | Emphasis, card titles |
| Bold | `font-bold` | Headings, important values |
| Extrabold | `font-extrabold` | Hero text, page titles |

---

## 2. Color Palette

### Brand Colors

| Name | Hex | CSS Variable | Tailwind | Usage |
|------|-----|--------------|----------|-------|
| **Primary** | `#2E7D32` | `--primary` | `bg-primary` | Main actions, headers |
| **Primary Dark** | `#1B5E20` | - | `bg-primary-dark` | Hover states, emphasis |
| **Primary Light** | `#4CAF50` | - | `bg-primary-light` | Gradients, accents |
| **Secondary** | `#81C784` | `--secondary` | `bg-secondary` | Secondary elements |
| **Accent** | `#FF9800` | `--accent` | `bg-accent` | CTAs, highlights |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#2E7D32` | Positive actions, confirmations |
| **Warning** | `#ED6C02` | Alerts, caution states |
| **Error** | `#D32F2F` | Errors, destructive actions |
| **Info** | `#0288D1` | Informational messages |

### Background Colors

| Name | Tailwind | Usage |
|------|----------|-------|
| **Page Background** | `bg-background` | Main page background |
| **Card Background** | `bg-card` / `bg-white` | Card surfaces |
| **Muted Background** | `bg-muted` / `bg-muted/50` | Input backgrounds, sections |
| **Overlay** | `bg-black/50` | Modal/sheet backdrops |

### Text Colors

| Name | Tailwind | Usage |
|------|----------|-------|
| **Primary Text** | `text-foreground` | Main content |
| **Secondary Text** | `text-muted-foreground` | Descriptions, labels |
| **On Primary** | `text-primary-foreground` | Text on primary backgrounds |
| **Link** | `text-primary` | Interactive text |

---

## 3. Spacing

### Base Scale (4px increments)

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| **xs** | 4px | `p-1`, `gap-1` | Tight spacing, inline elements |
| **sm** | 8px | `p-2`, `gap-2` | Compact spacing |
| **md** | 12px | `p-3`, `gap-3` | Default component padding |
| **lg** | 16px | `p-4`, `gap-4` | Card padding, section gaps |
| **xl** | 24px | `p-6`, `gap-6` | Page padding, large gaps |
| **2xl** | 32px | `p-8`, `gap-8` | Hero sections |

### Standard Patterns

| Context | Padding | Gap |
|---------|---------|-----|
| **Page Container** | `px-6` | - |
| **Card Content** | `p-4` | - |
| **Modal/Sheet** | `p-6` | - |
| **Form Fields** | `p-3` | `space-y-3` |
| **Button Groups** | - | `gap-2` or `gap-3` |
| **List Items** | `p-3` | `space-y-2` or `space-y-3` |

---

## 4. Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| **None** | 0 | `rounded-none` | Sharp edges |
| **Small** | 6px | `rounded-md` | Inputs, small buttons |
| **Default** | 8px | `rounded-lg` | Buttons, badges |
| **Large** | 12px | `rounded-xl` | Cards, modals |
| **XL** | 16px | `rounded-2xl` | Large cards, sheets |
| **3XL** | 24px | `rounded-3xl` | Dashboard headers |
| **Full** | 9999px | `rounded-full` | Avatars, pills, icon buttons |

### Standard Patterns

| Component | Radius |
|-----------|--------|
| **Cards** | `rounded-xl` or `rounded-2xl` |
| **Modals** | `rounded-2xl` |
| **Bottom Sheets** | `rounded-t-3xl` |
| **Buttons** | `rounded-md` (default) or `rounded-full` (pill) |
| **Inputs** | `rounded-lg` |
| **Badges** | `rounded-md` or `rounded-full` |
| **Icon Buttons** | `rounded-xl` |

---

## 5. Shadows & Elevation

| Level | Tailwind | Usage |
|-------|----------|-------|
| **None** | `shadow-none` | Flat elements, pressed state |
| **Soft** | `shadow-soft` | Subtle elevation (custom) |
| **Small** | `shadow-sm` | Hover state (reduced) |
| **Default** | `shadow` | Cards at rest |
| **Medium** | `shadow-md` | Elevated cards, buttons |
| **Large** | `shadow-lg` | Modals, dropdowns |
| **XL** | `shadow-xl` | Popovers |
| **2XL** | `shadow-2xl` | Sheets, overlays |

### Interactive Shadow Pattern

```
Default: shadow-md
Hover: shadow-lg (or shadow-sm for "press down" effect)
Active: shadow-none
```

---

## 6. Animation & Transitions

### Duration Tokens

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| **Fast** | 150ms | `duration-150` | Micro-interactions |
| **Default** | 200ms | `duration-200` | Standard transitions |
| **Medium** | 300ms | `duration-300` | Modal/sheet animations |
| **Slow** | 500ms | `duration-500` | Page transitions |

### Easing

| Type | CSS | Usage |
|------|-----|-------|
| **Default** | `ease-out` | Most transitions |
| **In-Out** | `ease-in-out` | Symmetric animations |

### Standard Transitions

| Element | Classes |
|---------|---------|
| **Buttons** | `transition-colors` or `transition-all duration-200` |
| **Cards (hover)** | `transition-all duration-300` |
| **Modals** | `transition-all duration-200` |
| **Sheets** | `transition-transform duration-300 ease-out` |
| **Opacity** | `transition-opacity duration-200` |

### Animation Patterns

**Modal Enter/Exit:**

```
Enter: scale-95 opacity-0 → scale-100 opacity-100
Exit: scale-100 opacity-100 → scale-95 opacity-0
```

**Sheet Enter/Exit:**

```
Bottom Sheet: translateY(100%) → translateY(0)
Side Panel: translateX(100%) → translateX(0)
```

**Backdrop:**

```
Enter: opacity-0 → opacity-100
Exit: opacity-100 → opacity-0
```

---

## 7. Icon Sizing

| Size | Dimensions | Tailwind | Usage |
|------|------------|----------|-------|
| **XS** | 12×12 | `h-3 w-3` | Inline indicators |
| **Small** | 16×16 | `h-4 w-4` | Buttons, inline icons |
| **Default** | 20×20 | `h-5 w-5` | Standard icons |
| **Large** | 24×24 | `h-6 w-6` | Header actions, emphasis |
| **XL** | 32×32 | `h-8 w-8` | Feature icons |
| **2XL** | 48×48 | `h-12 w-12` | Hero icons, empty states |
| **3XL** | 56×56 | `h-14 w-14` | Dashboard action buttons |

### Icon Button Sizes

| Size | Button | Icon |
|------|--------|------|
| **Small** | `h-8 w-8` | `h-4 w-4` |
| **Default** | `h-10 w-10` | `h-5 w-5` |
| **Large** | `h-12 w-12` | `h-6 w-6` |

---

## 8. Component Patterns

### Cards

```tsx
// Standard Card
<Card className="glass-card border-0">
  <CardContent className="p-4">
    {/* content */}
  </CardContent>
</Card>

// Interactive Card
<Card className="glass-card border-0 hover:shadow-lg transition-all duration-300">
  {/* content */}
</Card>
```

### Buttons

| Variant | Usage |
|---------|-------|
| `default` | Primary actions |
| `secondary` | Secondary actions |
| `outline` | Tertiary actions |
| `ghost` | Subtle actions |
| `destructive` | Dangerous actions |

**Touch Target:** Minimum `h-10` (40px) for mobile, `h-12` (48px) preferred.

### Modals

```tsx
// Backdrop
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-200">

// Modal Container
<div className="bg-background rounded-2xl max-w-md w-full shadow-2xl border border-border">
  <div className="p-6">
    {/* Header with close button */}
    {/* Content */}
    {/* Actions */}
  </div>
</div>
```

### Bottom Sheets

```tsx
// Container
<div className="fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out">
  <div className="bg-background rounded-t-3xl shadow-2xl border-t border-border">
    {/* Handle bar */}
    <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
    {/* Content */}
  </div>
</div>
```

### Side Panels

```tsx
// Container
<div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-2xl border-l border-border">
  <div className="p-6">
    {/* Header */}
    {/* Content */}
  </div>
</div>
```

### Form Fields

```tsx
// Input
<input className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all" />

// Field Container
<div className="p-3 bg-muted/50 rounded-lg">
  <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
  <p className="text-sm text-muted-foreground">{value}</p>
</div>
```

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| **Default** | 0px+ | Mobile-first base |
| **sm** | 640px+ | Large phones |
| **md** | 768px+ | Tablets |
| **lg** | 1024px+ | Laptops |
| **xl** | 1280px+ | Desktops |

### Common Patterns

```tsx
// Text scaling
className="text-lg sm:text-xl md:text-2xl"

// Padding scaling
className="px-4 sm:px-6 lg:px-8"

// Grid columns
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 10. Glass Morphism

### Standard Glass Card

```css
.glass-card {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 shadow-soft rounded-card;
}
```

### Usage

```tsx
<Card className="glass-card border-0 bg-white/50 dark:bg-gray-900/50">
```

---

## 11. Dark Mode

All components should support dark mode using Tailwind's `dark:` prefix.

### Pattern

```tsx
// Background
className="bg-white dark:bg-gray-900"

// Text
className="text-gray-900 dark:text-gray-100"

// Borders
className="border-gray-200 dark:border-gray-700"
```

---

## 12. Accessibility

### Touch Targets

- Minimum size: 44×44px for interactive elements
- Preferred: 48×48px for primary actions

### Focus States

```tsx
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
```

### Color Contrast

- Text on backgrounds must meet WCAG AA (4.5:1 for normal text)
- Use `text-foreground` on `bg-background`
- Use `text-primary-foreground` on `bg-primary`

---

## Quick Reference

### Most Common Classes

| Purpose | Classes |
|---------|---------|
| **Card** | `glass-card border-0` |
| **Card Padding** | `p-4` |
| **Page Padding** | `px-6` |
| **Section Gap** | `space-y-6` |
| **Item Gap** | `space-y-3` or `gap-3` |
| **Heading** | `text-xl font-bold text-foreground` |
| **Subheading** | `text-lg font-semibold text-foreground` |
| **Body** | `text-sm text-muted-foreground` |
| **Caption** | `text-xs text-muted-foreground` |
| **Interactive Hover** | `hover:shadow-lg transition-all duration-300` |
| **Button Transition** | `transition-colors` |

---

## 13. State Patterns

State patterns define how the UI communicates different data conditions to users. Consistent state handling improves user experience by setting clear expectations.

### Overview

| State | Purpose | Example |
|-------|---------|---------|
| **Empty** | No data exists yet | No orders, no menu items, no reviews |
| **Loading** | Data is being fetched | Fetching restaurant details, loading order history |
| **Error** | Something went wrong | Network failure, server error, permission denied |
| **Success** | Action completed | Order placed, menu item saved, settings updated |
| **No Results** | Search/filter returned nothing | No restaurants match filter, no search results |

---

### 13.1 Empty States

Empty states appear when there is no data to display. They should guide users toward taking action.

#### When to Use

- First-time user with no data (e.g., new restaurant with no menu items)
- User has cleared all data (e.g., empty cart)
- Feature area with no content yet (e.g., no reviews)

#### Anatomy

| Element | Required | Description |
|---------|----------|-------------|
| **Icon** | Yes | Lucide icon representing the empty context |
| **Heading** | Yes | Brief statement of the empty state |
| **Description** | Optional | Explains why it's empty or what will appear here |
| **Action Button** | Recommended | Primary action to populate the state |

#### Full-Page Empty State

Use when the entire view has no content.

```tsx
// Full-page empty state structure
<div className="flex flex-col items-center justify-center min-h-[400px] px-6 text-center">
  {/* Icon container with muted background */}
  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
    <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
  </div>
  
  {/* Heading */}
  <h3 className="text-xl font-bold text-foreground mb-2">
    No menu items yet
  </h3>
  
  {/* Description */}
  <p className="text-sm text-muted-foreground max-w-xs mb-6">
    Start building your menu by adding your first dish or beverage.
  </p>
  
  {/* Action button */}
  <Button>
    <Plus className="h-4 w-4 mr-2" />
    Add Menu Item
  </Button>
</div>
```

#### Inline Empty State

Use within cards or sections when a specific area has no content.

```tsx
// Inline empty state (compact)
<div className="flex flex-col items-center py-8 text-center">
  <ShoppingBag className="h-10 w-10 text-muted-foreground mb-3" />
  <p className="text-sm font-medium text-foreground mb-1">Your cart is empty</p>
  <p className="text-xs text-muted-foreground">Add items to get started</p>
</div>
```

#### Content Guidelines

| Do | Don't |
|----|-------|
| Be specific about what will appear when populated | Use generic messages like "Nothing here" |
| Provide a clear next action | Leave users at a dead end |
| Use friendly, encouraging tone | Blame the user or use negative language |
| Keep text concise (1-2 sentences max) | Write lengthy explanations |

#### Common Empty State Icons

| Context | Lucide Icon |
|---------|-------------|
| No menu items | `UtensilsCrossed` |
| No orders | `ClipboardList` |
| No reviews | `MessageSquare` |
| Empty cart | `ShoppingBag` |
| No notifications | `Bell` |
| No search results | `Search` |
| No images | `ImageOff` |
| No customers | `Users` |

---

### 13.2 Loading States

Loading states indicate that content is being fetched. Use skeleton loaders to maintain layout stability and reduce perceived wait time.

#### When to Use

- Initial page load
- Fetching data after navigation
- Refreshing content
- Loading more items (pagination/infinite scroll)

#### Skeleton Principles

| Principle | Description |
|-----------|-------------|
| **Match layout** | Skeleton shape should mirror the actual content structure |
| **Animate subtly** | Use pulse animation, not aggressive flashing |
| **Maintain dimensions** | Prevent layout shift when content loads |
| **Show hierarchy** | Larger skeletons for headings, smaller for body text |

#### Base Skeleton Classes

```tsx
// Base skeleton element
<div className="animate-pulse bg-muted rounded-md" />

// Common skeleton shapes
const skeletonText = "h-4 bg-muted rounded-md animate-pulse";
const skeletonHeading = "h-6 bg-muted rounded-md animate-pulse";
const skeletonImage = "bg-muted rounded-lg animate-pulse";
const skeletonAvatar = "rounded-full bg-muted animate-pulse";
```

#### Card Skeleton

```tsx
// Menu item card skeleton
<Card className="glass-card border-0">
  <CardContent className="p-4">
    {/* Image skeleton */}
    <div className="h-32 w-full bg-muted rounded-lg animate-pulse mb-3" />
    
    {/* Title skeleton */}
    <div className="h-5 w-3/4 bg-muted rounded-md animate-pulse mb-2" />
    
    {/* Description skeleton (2 lines) */}
    <div className="space-y-2">
      <div className="h-4 w-full bg-muted rounded-md animate-pulse" />
      <div className="h-4 w-2/3 bg-muted rounded-md animate-pulse" />
    </div>
    
    {/* Price skeleton */}
    <div className="h-5 w-16 bg-muted rounded-md animate-pulse mt-3" />
  </CardContent>
</Card>
```

#### List Item Skeleton

```tsx
// Order list item skeleton
<div className="flex items-center gap-4 p-4">
  {/* Avatar/icon skeleton */}
  <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
  
  {/* Content skeleton */}
  <div className="flex-1 space-y-2">
    <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse" />
    <div className="h-3 w-1/3 bg-muted rounded-md animate-pulse" />
  </div>
  
  {/* Action skeleton */}
  <div className="h-8 w-20 bg-muted rounded-md animate-pulse" />
</div>
```

#### Text Block Skeleton

```tsx
// Paragraph skeleton
<div className="space-y-3">
  <div className="h-4 w-full bg-muted rounded-md animate-pulse" />
  <div className="h-4 w-full bg-muted rounded-md animate-pulse" />
  <div className="h-4 w-4/5 bg-muted rounded-md animate-pulse" />
</div>
```

#### Grid Skeleton

```tsx
// Grid of card skeletons
<div className="grid grid-cols-2 gap-4">
  {[...Array(4)].map((_, i) => (
    <Card key={i} className="glass-card border-0">
      <CardContent className="p-4">
        <div className="h-24 bg-muted rounded-lg animate-pulse mb-3" />
        <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse mb-2" />
        <div className="h-3 w-1/2 bg-muted rounded-md animate-pulse" />
      </CardContent>
    </Card>
  ))}
</div>
```

#### Table Skeleton

```tsx
// Table row skeleton
<div className="divide-y divide-border">
  {[...Array(5)].map((_, i) => (
    <div key={i} className="flex items-center gap-4 py-3">
      <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
      <div className="h-4 w-32 bg-muted rounded-md animate-pulse" />
      <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
      <div className="h-4 w-16 bg-muted rounded-md animate-pulse ml-auto" />
    </div>
  ))}
</div>
```

#### Loading Spinner (Fallback)

Use spinners only for quick actions (< 1 second) or when skeleton layout is impractical.

```tsx
// Inline spinner
<div className="flex items-center justify-center py-8">
  <Loader2 className="h-6 w-6 animate-spin text-primary" />
</div>

// Button loading state
<Button disabled>
  <Loader2 className="h-4 w-4 animate-spin mr-2" />
  Saving...
</Button>
```

---

### 13.3 Error States

Error states communicate that something went wrong and guide users toward resolution.

#### When to Use

- Network/server errors
- Permission denied
- Resource not found
- Validation failures
- Timeout errors

#### Anatomy

| Element | Required | Description |
|---------|----------|-------------|
| **Icon** | Yes | `AlertCircle`, `WifiOff`, `ShieldX`, or context-specific |
| **Heading** | Yes | Clear statement of the problem |
| **Description** | Yes | Explains what happened and/or how to fix it |
| **Action Button** | Recommended | Retry, go back, or alternative action |

#### Full-Page Error State

```tsx
// Full-page error (e.g., failed to load page)
<div className="flex flex-col items-center justify-center min-h-[400px] px-6 text-center">
  {/* Error icon */}
  <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
    <WifiOff className="h-8 w-8 text-destructive" />
  </div>
  
  {/* Heading */}
  <h3 className="text-xl font-bold text-foreground mb-2">
    Unable to load content
  </h3>
  
  {/* Description */}
  <p className="text-sm text-muted-foreground max-w-xs mb-6">
    Please check your internet connection and try again.
  </p>
  
  {/* Actions */}
  <div className="flex gap-3">
    <Button variant="outline" onClick={() => router.back()}>
      Go Back
    </Button>
    <Button onClick={handleRetry}>
      <RefreshCw className="h-4 w-4 mr-2" />
      Try Again
    </Button>
  </div>
</div>
```

#### Inline Error State

```tsx
// Inline error (e.g., failed to load a section)
<div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
  <div className="flex-1">
    <p className="text-sm font-medium text-foreground">Failed to load orders</p>
    <p className="text-xs text-muted-foreground">Tap to retry</p>
  </div>
  <Button size="sm" variant="ghost" onClick={handleRetry}>
    <RefreshCw className="h-4 w-4" />
  </Button>
</div>
```

#### Form Validation Error

```tsx
// Field-level error
<div className="space-y-1">
  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
  <Input 
    id="email" 
    className="border-destructive focus:ring-destructive" 
    aria-invalid="true"
  />
  <p className="text-xs text-destructive flex items-center gap-1">
    <AlertCircle className="h-3 w-3" />
    Please enter a valid email address
  </p>
</div>
```

#### Content Guidelines

| Do | Don't |
|----|-------|
| Use plain language, no error codes | Show technical jargon like "Error 500" |
| Explain what the user can do | Just say "Something went wrong" |
| Provide a recovery action | Leave users stuck |
| Be respectful and calm | Use alarming or blaming language |

#### Common Error Icons

| Error Type | Lucide Icon |
|------------|-------------|
| General error | `AlertCircle` |
| Network error | `WifiOff` |
| Permission denied | `ShieldX` |
| Not found | `FileQuestion` |
| Server error | `ServerCrash` |
| Timeout | `Clock` |

---

### 13.4 Success States

Success states confirm that an action completed successfully. Use toast notifications as the default.

#### When to Use

- Form submitted successfully
- Item saved/updated/deleted
- Action completed (e.g., order placed)
- Settings changed

#### Toast Notifications (Default)

Toasts are non-blocking, auto-dismiss notifications that appear at the top or bottom of the screen.

```tsx
// Success toast structure
<div className="flex items-center gap-3 p-4 bg-primary text-primary-foreground rounded-xl shadow-lg">
  <CheckCircle className="h-5 w-5 flex-shrink-0" />
  <div className="flex-1">
    <p className="text-sm font-medium">Menu item saved</p>
    <p className="text-xs opacity-90">Your changes have been published.</p>
  </div>
  <button className="p-1 hover:bg-white/10 rounded-md transition-colors">
    <X className="h-4 w-4" />
  </button>
</div>
```

#### Toast Variants

| Variant | Background | Icon | Usage |
|---------|------------|------|-------|
| **Success** | `bg-primary` | `CheckCircle` | Positive confirmations |
| **Info** | `bg-blue-600` | `Info` | Neutral information |
| **Warning** | `bg-amber-500` | `AlertTriangle` | Caution, non-blocking |
| **Error** | `bg-destructive` | `AlertCircle` | Failed actions |

#### Toast Behavior

| Property | Value |
|----------|-------|
| **Duration** | 4-5 seconds (auto-dismiss) |
| **Position** | Top center or bottom center |
| **Animation** | Slide in from top/bottom, fade out |
| **Stacking** | Max 3 visible, queue additional |

#### Inline Success (Forms)

Use inline success for form submissions where the user stays on the same page.

```tsx
// Inline success message
<div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
  <p className="text-sm font-medium text-foreground">
    Your profile has been updated successfully.
  </p>
</div>
```

#### Success with Next Action

For significant completions, show a success state with a clear next step.

```tsx
// Success with next action (e.g., order placed)
<div className="flex flex-col items-center justify-center min-h-[400px] px-6 text-center">
  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
    <CheckCircle className="h-8 w-8 text-primary" />
  </div>
  
  <h3 className="text-xl font-bold text-foreground mb-2">
    Order Placed!
  </h3>
  
  <p className="text-sm text-muted-foreground max-w-xs mb-6">
    Your order #1234 has been sent to the kitchen.
  </p>
  
  <Button onClick={() => router.push('/orders')}>
    View Order Status
  </Button>
</div>
```

---

### 13.5 No Results States

No results states appear when a search or filter returns zero matches. They differ from empty states because data exists, but none matches the criteria.

#### When to Use

- Search query returns no matches
- Applied filters exclude all items
- Category has no items

#### Anatomy

| Element | Required | Description |
|---------|----------|-------------|
| **Icon** | Yes | `Search`, `Filter`, or context-specific |
| **Heading** | Yes | Acknowledges the search/filter attempt |
| **Description** | Yes | Suggests how to find results |
| **Action** | Recommended | Clear filters, modify search, or browse all |

#### No Search Results

```tsx
// No search results
<div className="flex flex-col items-center py-12 text-center">
  <Search className="h-12 w-12 text-muted-foreground mb-4" />
  
  <h3 className="text-lg font-semibold text-foreground mb-2">
    No results for "{searchQuery}"
  </h3>
  
  <p className="text-sm text-muted-foreground max-w-xs mb-4">
    Try adjusting your search or check for typos.
  </p>
  
  <Button variant="outline" onClick={() => setSearchQuery('')}>
    Clear Search
  </Button>
</div>
```

#### No Filter Results

```tsx
// No filter results
<div className="flex flex-col items-center py-12 text-center">
  <Filter className="h-12 w-12 text-muted-foreground mb-4" />
  
  <h3 className="text-lg font-semibold text-foreground mb-2">
    No items match your filters
  </h3>
  
  <p className="text-sm text-muted-foreground max-w-xs mb-4">
    Try removing some filters to see more results.
  </p>
  
  <Button variant="outline" onClick={clearFilters}>
    Clear All Filters
  </Button>
</div>
```

#### Content Guidelines

| Do | Don't |
|----|-------|
| Echo the user's search term | Use generic "No results" |
| Suggest alternatives (broaden search, check spelling) | Leave users without guidance |
| Provide a clear action to reset | Require manual clearing |

---

### State Pattern Quick Reference

| State | Icon Background | Icon Color | Heading Style | Action |
|-------|-----------------|------------|---------------|--------|
| **Empty** | `bg-muted` | `text-muted-foreground` | `text-xl font-bold` | Primary CTA |
| **Loading** | N/A (skeleton) | N/A | N/A | N/A |
| **Error** | `bg-destructive/10` | `text-destructive` | `text-xl font-bold` | Retry + Back |
| **Success** | `bg-primary/10` | `text-primary` | `text-xl font-bold` | Next action |
| **No Results** | None | `text-muted-foreground` | `text-lg font-semibold` | Clear/Reset |

---

## 14. Overlay & Content Hierarchy

This section defines when to use each overlay pattern (Toast, Modal, Bottom Sheet, Panel) to present content consistently across MakanTak.

### 14.1 Overview

Choose the right overlay based on **content complexity**, **user action required**, and **blocking behavior**.

```text
Low Complexity ←――――――――――――――――――――――――――→ High Complexity
     Toast          Modal       Bottom Sheet      Panel
```

| Factor | Toast | Modal | Bottom Sheet | Panel |
|--------|-------|-------|--------------|-------|
| **Blocks interaction** | No | Yes | Yes | Partial |
| **User action required** | No | Usually | Usually | No |
| **Content complexity** | 1-2 lines | Low-Medium | Medium-High | High |
| **Auto-dismisses** | Yes (4-5s) | No | No | No |
| **Mobile behavior** | Top overlay | Centered | Slide from bottom | Slide from side |

---

### 14.2 Toast

Toasts are **non-blocking, ephemeral notifications** for quick feedback that doesn't require user action.

#### When to Use

| Use Case | Example |
|----------|---------|
| **Action confirmation** | "Link copied!", "Settings saved" |
| **Background success** | "Profile updated" |
| **Non-critical errors** | "Unable to refresh. Try again later." |
| **Informational updates** | "New referral earned!" |

#### When NOT to Use

| Avoid For | Use Instead |
|-----------|-------------|
| **Critical errors blocking workflow** | Error Modal |
| **Success requiring next action** | Success Modal |
| **Content needing user decision** | Modal or Bottom Sheet |
| **Multi-line or complex content** | Modal |

#### Variants

| Variant | Icon | Background | Duration | Use Case |
|---------|------|------------|----------|----------|
| **Success** | `CheckCircle` | `bg-primary` | 4s | Confirmations |
| **Error** | `AlertCircle` | `bg-destructive` | 5s | Errors |
| **Warning** | `AlertTriangle` | `bg-amber-500` | 4s | Cautions |
| **Info** | `Info` | `bg-blue-600` | 4s | Neutral info |

#### Implementation

```tsx
import { showSuccessToast, showErrorToast } from '@/components/ui/toast';

// Success toast
showSuccessToast('Menu item saved');

// Error toast with description
showErrorToast('Unable to save', { 
  description: 'Check your connection and try again' 
});

// Custom duration
showSuccessToast('Copied!', { duration: 2000 });
```

#### Anatomy

```
┌─────────────────────────────────────────┐
│  [Icon]  Message text              [X]  │
│          Optional description           │
└─────────────────────────────────────────┘
```

#### Guidelines

| Guideline | Reason |
|-----------|--------|
| **Keep messages under 60 characters** | Toasts are meant to be glanceable |
| **Use sentence case** | "Link copied" not "Link Copied" |
| **No periods for single sentences** | "Saved successfully" not "Saved successfully." |
| **Include dismiss button** | Users should be able to dismiss early |

---

### 14.3 Modal

Modals are **blocking overlays** that focus user attention on a specific task or information.

#### When to Use

| Use Case | Example |
|----------|---------|
| **Confirmations requiring decision** | "Delete account?" with Cancel/Confirm |
| **Critical success with summary** | Transaction success with breakdown |
| **Critical errors** | Permission denied, session expired |
| **Authentication forms** | Login, Register |
| **Quick informational content** | "How it works" explanation |
| **QR code display** | Customer ID QR for scanning |

#### When NOT to Use

| Avoid For | Use Instead |
|-----------|-------------|
| **Simple confirmations** | Toast |
| **Multi-step workflows** | Bottom Sheet |
| **Content requiring scrolling** | Bottom Sheet or Page |
| **Settings/navigation** | Panel |

#### Variants

| Variant | Size | Use Case | Component Example |
|---------|------|----------|-------------------|
| **Small** | `max-w-sm` | Quick confirmations, verified status | `CustomerVerifiedModal` |
| **Medium** | `max-w-md` | Forms, success summaries | `TransactionSuccessModal`, `AuthModal` |
| **Large** | `max-w-lg` | Detailed info, complex forms | `InfoModal` |

#### Implementation

```tsx
// Base modal pattern
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop with blur */}
  <div 
    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  />
  
  {/* Modal content */}
  <div 
    className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full p-6"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Close button */}
    <button className="absolute top-4 right-4">
      <X className="h-5 w-5" />
    </button>
    
    {/* Content */}
    {children}
  </div>
</div>
```

#### Anatomy

```
┌─────────────────────────────────────────┐
│                                    [X]  │
│                                         │
│              [Icon/Image]               │
│                                         │
│               Title Text                │
│            Description text             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Primary Action          │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │        Secondary Action         │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

#### Guidelines

| Guideline | Reason |
|-----------|--------|
| **One primary action** | Clear user path |
| **Always include close button** | Escape hatch for users |
| **Backdrop click dismisses** | Standard expectation |
| **Escape key dismisses** | Keyboard accessibility |
| **Lock body scroll** | Prevent background scrolling |
| **Center vertically and horizontally** | Consistent positioning |

---

### 14.4 Bottom Sheet

Bottom Sheets are **mobile-first slide-up panels** for workflows, detail views, and interactive content.

#### When to Use

| Use Case | Example |
|----------|---------|
| **Multi-step workflows** | Checkout flow, QR scanning |
| **Detail views** | Transaction details, restaurant info |
| **Action menus** | Share options, social sharing |
| **Forms with context** | Edit customer, manual code entry |
| **Content requiring scroll** | Long lists, detailed breakdowns |

#### When NOT to Use

| Avoid For | Use Instead |
|-----------|-------------|
| **Quick confirmations** | Toast or Modal |
| **Critical blocking errors** | Error Modal |
| **Simple yes/no decisions** | Modal |
| **Persistent navigation** | Panel |

#### Variants

| Variant | Height | Use Case | Component Example |
|---------|--------|----------|-------------------|
| **Compact** | `max-h-[50vh]` | Action menus, share options | `ShareBottomSheet` |
| **Standard** | `max-h-[70vh]` | Detail views, forms | `TransactionDetailSheet` |
| **Full** | `max-h-[85vh]` | Complex workflows | `CheckoutSheet`, `QRScannerSheet` |

#### Implementation

```tsx
// Bottom sheet pattern with swipe-to-dismiss
<>
  {/* Backdrop */}
  <div 
    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
      isAnimating ? 'opacity-100' : 'opacity-0'
    }`}
    onClick={onClose}
  />
  
  {/* Sheet */}
  <div 
    className="fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out"
    style={{
      transform: isDragging && touchCurrent > touchStart 
        ? `translateY(${touchCurrent - touchStart}px)` 
        : isAnimating ? 'translateY(0)' : 'translateY(100%)'
    }}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    <div className="bg-background rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
      {/* Handle bar */}
      <div className="w-12 h-1.5 bg-muted rounded-full mx-auto my-4" />
      
      {/* Content */}
      <div className="p-6 pt-0">
        {children}
      </div>
    </div>
  </div>
</>
```

#### Anatomy

```
┌─────────────────────────────────────────┐
│              ═══════════                │  ← Handle bar (drag indicator)
│                                    [X]  │  ← Close button
│                                         │
│  Title                                  │
│  Subtitle or description                │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │         Content Area            │   │
│  │      (scrollable if needed)     │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Primary Action          │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

#### Swipe-to-Dismiss Behavior

| Gesture | Threshold | Action |
|---------|-----------|--------|
| **Swipe down** | > 100px | Dismiss sheet |
| **Swipe down** | < 100px | Snap back to open |
| **Tap backdrop** | N/A | Dismiss sheet |

#### Guidelines

| Guideline | Reason |
|-----------|--------|
| **Include handle bar** | Visual affordance for swipe |
| **Lock body scroll when open** | Prevent background scrolling |
| **Swipe-to-dismiss on mobile** | Natural mobile gesture |
| **Close button always visible** | Fallback for non-touch users |
| **Rounded top corners** | Visual distinction from page |

#### Tablet/Desktop Adaptation

On larger screens (iPad landscape, desktop), bottom sheets can adapt:

| Screen Size | Behavior |
|-------------|----------|
| **Mobile** | Full-width, slides from bottom |
| **Tablet landscape** | 60% width, slides from left (split-view) |
| **Desktop** | Consider using Modal instead |

---

### 14.5 Panel

Panels are **persistent or semi-persistent side overlays** for navigation, settings, or contextual tools.

#### When to Use

| Use Case | Example |
|----------|---------|
| **Settings and preferences** | User settings, language selection |
| **Navigation menus** | Mobile nav drawer |
| **Contextual tools** | Filters, sorting options |

#### When NOT to Use

| Avoid For | Use Instead |
|-----------|-------------|
| **Quick feedback** | Toast |
| **Focused tasks** | Modal or Bottom Sheet |
| **Detail views** | Bottom Sheet |

#### Implementation

```tsx
// Settings panel pattern
<div 
  className={`fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-2xl z-50 
    transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}
>
  {/* Header */}
  <div className="flex items-center justify-between p-4 border-b">
    <h2 className="text-lg font-semibold">Settings</h2>
    <button onClick={onClose}>
      <X className="h-5 w-5" />
    </button>
  </div>
  
  {/* Content */}
  <div className="p-4 overflow-y-auto">
    {children}
  </div>
</div>
```

#### Guidelines

| Guideline | Reason |
|-----------|--------|
| **Slide from edge** | Natural drawer behavior |
| **Partial backdrop** | Show context behind panel |
| **Persistent header** | Always show close option |

---

### 14.6 Decision Matrix

Use this quick reference to choose the right pattern:

| Scenario | Pattern | Reason |
|----------|---------|--------|
| "Item saved successfully" | **Toast** | Quick confirmation, no action needed |
| "Are you sure you want to delete?" | **Modal** | Requires decision |
| "Transaction complete" with summary | **Modal** | Important info, single action |
| "Network error, please retry" | **Toast** (recoverable) or **Modal** (blocking) | Depends on severity |
| Share to social media | **Bottom Sheet** | Multiple options, mobile-friendly |
| View transaction details | **Bottom Sheet** | Scrollable content, detail view |
| Checkout workflow | **Bottom Sheet** | Multi-step, interactive |
| User settings | **Panel** | Persistent, navigation-like |
| Login/Register | **Modal** | Focused task, auth flow |
| QR code display | **Modal** | Focused, single purpose |

### Overlay Pattern Quick Reference

| Pattern | Z-Index | Backdrop | Dismissal | Body Scroll |
|---------|---------|----------|-----------|-------------|
| **Toast** | `z-50` | None | Auto (4-5s) or swipe | Allowed |
| **Modal** | `z-50` | `bg-black/50 backdrop-blur-sm` | Click backdrop, X, Escape | Locked |
| **Bottom Sheet** | `z-50` | `bg-black/50 backdrop-blur-sm` | Swipe down, X, backdrop | Locked |
| **Panel** | `z-50` | Optional `bg-black/30` | X, backdrop | Locked |
