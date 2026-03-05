# Self-Hosted Fonts

This directory contains self-hosted font files to improve LCP performance by eliminating external Google Fonts requests.

## Font Files Structure

Fonts are organized in subdirectories by family name:

### Comforter (Display/Brand Font - `font-display`)
**Used for:** Brand name display
**Location:** `/fonts/Comforter/`
**Weights loaded:**
- Regular (400) - `Comforter-Regular.ttf`

### Montserrat (Body Font - `font-montserrat`)
**Used for:** Body text, buttons, labels
**Location:** `/fonts/Montserrat/static/`
**Weights loaded (based on actual usage audit):**
- Regular (400) - `Montserrat-Regular.ttf` - fallback/default
- Medium (500) - `Montserrat-Medium.ttf` - `font-medium` (134 uses)
- SemiBold (600) - `Montserrat-SemiBold.ttf` - `font-semibold` (217 uses)
- Bold (700) - `Montserrat-Bold.ttf` - `font-bold` (182 uses)
- ExtraBold (800) - `Montserrat-ExtraBold.ttf` - `font-extrabold` (2 uses)

**Deleted unused weights:**
- Thin (100), ExtraLight (200), Light (300), Black (900), all Italic variants

### Zain (Heading Font - `font-sans`, h1-h6)
**Used for:** Headings, titles
**Location:** `/fonts/Zain/`
**Weights loaded (based on actual usage audit):**
- Regular (400) - `Zain-Regular.ttf` - fallback/default
- Bold (700) - `Zain-Bold.ttf` - `font-bold` (used in headings)
- ExtraBold (800) - `Zain-ExtraBold.ttf` - `font-extrabold` (2 uses)

**Deleted unused weights:**
- ExtraLight, Light, Black (900), all Italic variants

## Performance Impact

**Before (Google Fonts):**
- Critical path latency: 563ms
- 4-level dependency chain
- External DNS lookups to googleapis.com and gstatic.com

**After (Self-Hosted):**
- Expected critical path latency: ~200-300ms
- 2-level dependency chain
- All resources from same domain
- **Estimated LCP improvement: 260-360ms**

## File Naming Convention

The font files follow the Google Fonts naming convention:
- Format: `{family}-v{version}-{subset}-{weight}.woff2`
- Example: `montserrat-v26-latin-regular.woff2`

Make sure the downloaded files match these exact names as referenced in `fonts.css`.
