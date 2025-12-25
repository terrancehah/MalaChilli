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
