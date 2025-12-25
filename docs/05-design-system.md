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
