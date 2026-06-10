# RKicks — Design System Specification
**Engineering Reference · v1.0 · June 2026**  
Derived from the approved Design Brief. Implements the Bone Dominant — Performance Luxury direction.

---

## 1. CSS Variables

Paste this `:root` block into your global stylesheet. All values are consumed as `var(--rk-*)` to avoid collisions with other systems.

```css
:root {

  /* ── Surfaces ──────────────────────────────────────────── */
  --rk-canvas:    #F0EAE0;   /* page background — dominant         */
  --rk-surface:   #FDFAF5;   /* cards, panels on canvas            */
  --rk-surface-2: #E8E2D7;   /* section dividers, callout bg       */
  --rk-ink:       #0D0B08;   /* hero zone bg, CTAs, authority      */
  --rk-elevated:  #D9D2C7;   /* modals, bottom-sheet panels        */

  /* ── Foreground / text ─────────────────────────────────── */
  --rk-t1:        #0D0B08;   /* headings, product names, prices    */
  --rk-t2:        #2C2620;   /* body copy, secondary info          */
  --rk-t3:        #7A736C;   /* captions, eyebrows, meta           */
  --rk-t-bone:    #F0EAE0;   /* text on ink backgrounds            */
  --rk-t-bone-dim:rgba(240,234,224,0.45); /* secondary on ink     */

  /* ── Borders ───────────────────────────────────────────── */
  --rk-border-0:  rgba(13,11,8,0.08);   /* subtle — card edges     */
  --rk-border-1:  rgba(13,11,8,0.14);   /* default — inputs        */
  --rk-border-2:  rgba(13,11,8,0.22);   /* strong — focus, emphasis*/
  --rk-border-ink:rgba(240,234,224,0.12);/* borders on ink bg      */

  /* ── Status — commerce ─────────────────────────────────── */
  --rk-available:     #0A6B42;
  --rk-available-bg:  rgba(10,107,66,0.09);
  --rk-reserved:      #8A5A08;
  --rk-reserved-bg:   rgba(138,90,8,0.09);
  --rk-sold:          #7A736C;
  --rk-sold-bg:       rgba(13,11,8,0.06);
  --rk-preorder:      #2C5F8A;
  --rk-preorder-bg:   rgba(44,95,138,0.09);

  /* ── Flaw levels ────────────────────────────────────────── */
  --rk-flaw-none:     #0A6B42;   /* green                          */
  --rk-flaw-minor:    #8A7A60;   /* warm gray                      */
  --rk-flaw-visible:  #F5A524;   /* amber                          */
  --rk-flaw-heavy:    #C05020;   /* amber-red                      */

  /* ── Ecosystem accents ──────────────────────────────────── */
  --rk-gold:      #C9A961;   /* Complete The Fit / RDecants only   */
  --rk-gold-bg:   rgba(201,169,97,0.10);
  /* NOTE: violet (#7C5CFF) is R Supply OS only — NEVER use in RKicks */

  /* ── Typography ─────────────────────────────────────────── */
  --rk-font-sans:  "Inter", -apple-system, "Segoe UI", sans-serif;
  --rk-font-serif: "Cormorant Garamond", Georgia, serif;
  --rk-font-mono:  "DM Mono", ui-monospace, monospace;

  /* ── Type scale ─────────────────────────────────────────── */
  --rk-fs-price:   42px;   /* product page price — Inter 800      */
  --rk-fs-price-card: 20px;/* card price — Inter 700              */
  --rk-fs-h1:      28px;   /* page headings                       */
  --rk-fs-h2:      22px;   /* section headings                    */
  --rk-fs-h3:      18px;   /* card headings, product names (lg)   */
  --rk-fs-h4:      14px;   /* product names in cards              */
  --rk-fs-body:    13px;   /* default body                        */
  --rk-fs-small:   12px;   /* secondary body, descriptions        */
  --rk-fs-caption: 11px;   /* labels, status text — minimum       */
  --rk-fs-eyebrow: 9px;    /* brand eyebrows (MONO)               */
  --rk-fs-mono:    11px;   /* sizes, codes, specs (MONO)          */

  /* ── Line heights ───────────────────────────────────────── */
  --rk-lh-tight:   1.05;
  --rk-lh-snug:    1.2;
  --rk-lh-normal:  1.55;
  --rk-lh-relaxed: 1.7;

  /* ── Letter spacing ─────────────────────────────────────── */
  --rk-ls-price:   -0.04em;
  --rk-ls-heading: -0.02em;
  --rk-ls-eyebrow: 0.18em;
  --rk-ls-mono:    0.06em;
  --rk-ls-chip:    0.08em;

  /* ── Spacing (4pt base) ─────────────────────────────────── */
  --rk-sp-1:   4px;
  --rk-sp-2:   8px;
  --rk-sp-3:   12px;
  --rk-sp-4:   16px;
  --rk-sp-5:   20px;
  --rk-sp-6:   24px;
  --rk-sp-7:   32px;
  --rk-sp-8:   40px;
  --rk-sp-9:   56px;
  --rk-sp-10:  72px;

  /* ── Border radius ──────────────────────────────────────── */
  --rk-radius-xs:   3px;    /* stamps, badges                     */
  --rk-radius-sm:   5px;    /* chips, tags, small elements        */
  --rk-radius-md:   8px;    /* cards, buttons (default)           */
  --rk-radius-lg:   10px;   /* modals, bottom-sheets              */
  --rk-radius-pill: 999px;  /* filter chips, status pills         */

  /* ── Shadows ────────────────────────────────────────────── */
  --rk-shadow-card:
    0 1px 0 rgba(255,255,255,0.6) inset,
    0 1px 3px rgba(13,11,8,0.06);
  --rk-shadow-elevated:
    0 4px 16px rgba(13,11,8,0.10),
    0 1px 4px rgba(13,11,8,0.06);
  --rk-shadow-modal:
    0 12px 40px rgba(13,11,8,0.14),
    0 2px 8px rgba(13,11,8,0.08);

  /* ── Motion ─────────────────────────────────────────────── */
  --rk-ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --rk-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --rk-dur-fast:    120ms;
  --rk-dur-base:    200ms;
  --rk-dur-slow:    320ms;

}
```

---

## 2. Color Usage Reference

### Surface hierarchy (bone zone)
```
Page background    var(--rk-canvas)    #F0EAE0
Card surface       var(--rk-surface)   #FDFAF5
Divider / callout  var(--rk-surface-2) #E8E2D7
Modal / overlay    var(--rk-elevated)  #D9D2C7
```

### Ink zone (hero, nav, CTAs)
```
Background         var(--rk-ink)       #0D0B08
Primary text       var(--rk-t-bone)    #F0EAE0
Secondary text     var(--rk-t-bone-dim)rgba(240,234,224,0.45)
Borders            var(--rk-border-ink)rgba(240,234,224,0.12)
```

### Status colors
Always use as `color` + matching `background`. Never use as full-region fills.

```css
/* Available */
color:      var(--rk-available);     /* #0A6B42 */
background: var(--rk-available-bg);  /* rgba(10,107,66,0.09) */

/* Reserved */
color:      var(--rk-reserved);      /* #8A5A08 */
background: var(--rk-reserved-bg);   /* rgba(138,90,8,0.09) */

/* Sold */
color:      var(--rk-sold);          /* #7A736C */
background: var(--rk-sold-bg);       /* rgba(13,11,8,0.06) */
```

### Flaw dot colors
```css
.flaw-none    { background: var(--rk-flaw-none);    } /* #0A6B42 */
.flaw-minor   { background: var(--rk-flaw-minor);   } /* #8A7A60 */
.flaw-visible { background: var(--rk-flaw-visible); } /* #F5A524 */
.flaw-heavy   { background: var(--rk-flaw-heavy);   } /* #C05020 */
```

---

## 3. Typography Scale

### Font loading (Google Fonts)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,600&family=Inter:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type roles
| Role | Family | Weight | Size | Tracking | Line-height |
|------|--------|--------|------|----------|-------------|
| Price (product page) | Inter | 800 | `--rk-fs-price` 42px | `--rk-ls-price` −0.04em | `--rk-lh-tight` 1.05 |
| Price (card) | Inter | 700 | `--rk-fs-price-card` 20px | −0.02em | 1.1 |
| Product name (lg) | Inter | 700 | `--rk-fs-h3` 18–24px | −0.02em | `--rk-lh-snug` 1.2 |
| Product name (card) | Inter | 700 | `--rk-fs-h4` 14px | −0.02em | 1.2 |
| Section heading | Inter | 700 | `--rk-fs-h2` 22px | −0.02em | 1.2 |
| Brand moment / subtitle | Cormorant Garamond | 600 Italic | 16–32px | 0 | `--rk-lh-snug` |
| Body | Inter | 400 | `--rk-fs-body` 13px | 0 | `--rk-lh-normal` 1.55 |
| Brand eyebrow | DM Mono | 400 | `--rk-fs-eyebrow` 9px | `--rk-ls-eyebrow` 0.18em | 1 |
| Size / code / spec | DM Mono | 400 | `--rk-fs-mono` 11px | `--rk-ls-mono` 0.06em | 1.4 |
| Filter chip | DM Mono | 400 | 9px | `--rk-ls-chip` 0.08em | 1 |
| Status pill label | DM Mono | 400 | 9px | 0.07em | 1 |

### Cormorant Garamond — usage constraint
Used **once per major section**. Permitted in:
- Hero headline (ink zone)
- Product subtitle / colorway name (e.g. `"Chicago" 2022`)
- Brand statement / editorial pull-quote

**Never in:** navigation, prices, buttons, filter chips, specs, tables, body copy.

---

## 4. Spacing Scale

```
--rk-sp-1   4px    micro gaps, icon padding
--rk-sp-2   8px    tight component padding
--rk-sp-3   12px   default chip padding, card inner gap
--rk-sp-4   16px   card padding (mobile), section sub-gap
--rk-sp-5   20px   card padding (desktop), row gaps
--rk-sp-6   24px   section inner padding
--rk-sp-7   32px   between components in a section
--rk-sp-8   40px   between sections (mobile)
--rk-sp-9   56px   between sections (desktop)
--rk-sp-10  72px   page padding top/bottom
```

**Grid gaps:**
- Card grid: `gap: var(--rk-sp-3)` (12px)
- Section gap: `gap: var(--rk-sp-9)` (56px)
- Nav items: `gap: var(--rk-sp-5)` (20px)

---

## 5. Border Radius

```
--rk-radius-xs    3px    stamps, RCG badge, rectangular marks
--rk-radius-sm    5px    chips, condition tags, image corners
--rk-radius-md    8px    cards, buttons, inputs (default)
--rk-radius-lg    10px   modals, bottom-sheet filter panel
--rk-radius-pill  999px  status pills, filter chips
```

> **Rule:** Never exceed `--rk-radius-md` (8px) on product cards. Never exceed `--rk-radius-lg` (10px) on any surface in the bone zone.

---

## 6. Shadows

```css
/* Card — default elevation on bone canvas */
box-shadow: var(--rk-shadow-card);
/* = 0 1px 0 rgba(255,255,255,0.6) inset, 0 1px 3px rgba(13,11,8,0.06) */

/* Elevated — modals, drawers, bottom-sheet on bone */
box-shadow: var(--rk-shadow-elevated);
/* = 0 4px 16px rgba(13,11,8,0.10), 0 1px 4px rgba(13,11,8,0.06) */

/* Modal — full-screen overlays */
box-shadow: var(--rk-shadow-modal);
/* = 0 12px 40px rgba(13,11,8,0.14), 0 2px 8px rgba(13,11,8,0.08) */
```

Blur (`backdrop-filter: blur(12px)`) is permitted **only** on:
- Mobile filter bottom-sheet
- Overlay modals (lightbox, WhatsApp drawer)

Never on in-flow cards or hero elements.

---

## 7. Layout Containers

```css
/* Page wrapper */
.rk-page {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--rk-sp-4);          /* 16px mobile */
}

@media (min-width: 768px) {
  .rk-page { padding: 0 var(--rk-sp-7); }  /* 32px tablet */
}

@media (min-width: 1024px) {
  .rk-page { padding: 0 var(--rk-sp-10); } /* 72px desktop */
}

/* Dual zone layout */
.rk-zone-ink  { background: var(--rk-ink); }
.rk-zone-bone { background: var(--rk-canvas); }
/* No transition between zones. Hard cut only. */

/* Catalog grid */
.rk-catalog-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--rk-sp-3);
}

@media (min-width: 960px) {
  .rk-catalog-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Featured card — full width above grid */
.rk-featured-card {
  grid-column: 1 / -1;
  display: flex;
}
```

---

## 8. Card Rules

| Property | Value |
|----------|-------|
| Background | `--rk-surface` |
| Border | `1px solid --rk-border-0` |
| Border radius | `--rk-radius-md` (8px) |
| Shadow | `--rk-shadow-card` |
| Image area | 60% of total card height · full-bleed · no padding |
| Info padding | `10px 12px` |
| Image ratio | `aspect-ratio: 1 / 0.85` |
| Hover | Border upgrades to `--rk-border-1` |
| Sold state | `opacity: 0.55` · remains visible in grid · non-interactive |

**Featured card (catalog only):**
- Full-width horizontal layout · image left (200px) · info right
- Price at `--rk-fs-h2` (22px+) · larger than standard grid card
- One per catalog page · appears above the product grid

---

## 9. Product Card Anatomy

```
┌──────────────────────────────┐
│                        [dot] │  ← flaw dot · 8px · top-right · absolute
│          PHOTO               │  ← 60% card height · full-bleed
│                              │
├──────────────────────────────┤
│ BRAND EYEBROW                │  ← DM Mono · 9px · 0.13em · --rk-t3
│ Model Name                   │  ← Inter 700 · 14px · −0.02em · --rk-t1
│                              │
│ [SIZE]  [COND]   ●●○○       │  ← mono chip · flaw bar
│ $1,400      ● Disponible    │  ← Inter 700 · 20px · status pill
└──────────────────────────────┘
```

| Element | Font | Size | Tracking | Color |
|---------|------|------|----------|-------|
| Brand eyebrow | DM Mono | 9px | 0.13em | `--rk-t3` |
| Model name | Inter 700 | 14px | −0.02em | `--rk-t1` |
| Size | DM Mono | 9px | 0.06em | `--rk-t2` |
| Condition chip | DM Mono | 9px | 0.07em | `--rk-t3` |
| Price | Inter 700 | 20px | −0.02em | `--rk-t1` |
| Status pill label | DM Mono | 9px | 0.07em | status color |

**Flaw dot — absolute top-right of image area:**

| Level | Token | Color |
|-------|-------|-------|
| None | `--rk-flaw-none` | #0A6B42 |
| Minor | `--rk-flaw-minor` | #8A7A60 |
| Visible | `--rk-flaw-visible` | #F5A524 |
| Heavy | `--rk-flaw-heavy` | #C05020 |

- Size: 8px circle · `border: 1.5px solid --rk-surface` · always visible on grid cards

**Flaw bar — 4 segments inline:**
- Each segment: `12×3px` · `border-radius: 2px`
- Inactive segments: 40% opacity
- Active segments: 100% opacity · color matches flaw level

---

## 10. Badge Anatomy

### Status pill

| Property | Value |
|----------|-------|
| Layout | `inline-flex` · `align-items: center` · `gap: 4px` |
| Padding | `2px 7px` |
| Border radius | `--rk-radius-pill` |
| Font | DM Mono · 9px · `letter-spacing: 0.07em` · uppercase |
| Dot | 5px circle · matches text color |

| Variant | Background | Text color |
|---------|------------|------------|
| Available | `--rk-available-bg` | `--rk-available` |
| Reserved | `--rk-reserved-bg` | `--rk-reserved` |
| Sold | `--rk-sold-bg` | `--rk-sold` |
| Pre-order | `--rk-preorder-bg` | `--rk-preorder` |

### Condition chip

| Property | Value |
|----------|-------|
| Padding | `2px 7px` |
| Border | `1px solid --rk-border-1` |
| Border radius | `--rk-radius-xs` (3px) |
| Font | DM Mono · 9px · `letter-spacing: 0.07em` · uppercase |
| Color | `--rk-t3` |
| Background | transparent |

---

## 11. Real Condition Guarantee Badge

Three variants. All use DM Mono. Double-border stamp aesthetic throughout.

### A — Stamp (product pages · primary)

| Property | Value |
|----------|-------|
| Outer border | `0.5px solid --rk-border-0` |
| Inner border | `0.7px solid --rk-t1` |
| Gap between borders | 3px |
| Top line | `REAL CONDITION GUARANTEE` · DM Mono 500 · 9.5px · 0.17em · `--rk-t1` |
| Divider | `0.5px solid --rk-t1` · full width |
| Bottom line | `RKICKS · VERIFICADO · MX` · DM Mono · 8px · 0.13em · `--rk-t3` |
| Padding | `10px 14px` |
| Inverted | Swap `--rk-t1` → `--rk-t-bone` · `--rk-border-0` → `--rk-border-ink` |

### B — Emblem (small surfaces · icon · embroidery)

| Property | Value |
|----------|-------|
| Format | Square 1:1 |
| Minimum size | 32px rendered |
| Structure | Double-border square · `REAL COND.` top · `RCG` center · divider |
| Below 32px | Labels omitted · border only |

### C — Inline pill (cards · tables · listing rows)

| Property | Value |
|----------|-------|
| Structure | Extends condition chip |
| Border | `1px solid --rk-t1` |
| Color | `--rk-t1` |
| Font | DM Mono · 9px · `letter-spacing: 0.15em` |
| Dot | 5px · `--rk-t1` |
| Content | `● REAL CONDITION GARANTIZADO` |

---

## 12. Button System

### Primary — WhatsApp CTA

| Property | Value |
|----------|-------|
| Width | 100% · full-width |
| Padding | `14px 20px` |
| Background | `--rk-ink` |
| Color | `--rk-t-bone` |
| Font | Inter 700 · 13px · `letter-spacing: −0.01em` |
| Border radius | `--rk-radius-md` (8px) |
| Border | none |
| Hover | `opacity: 0.88` |
| Active | `opacity: 0.75` |
| Transition | opacity · `--rk-dur-fast` · `--rk-ease-out` |

**Mobile sticky variant:**

| Property | Value |
|----------|-------|
| Position | `fixed` · bottom 0 · left 0 · right 0 |
| Border radius | 0 |
| Min height | 52px |
| z-index | 100 |
| Bottom padding | `calc(14px + env(safe-area-inset-bottom))` |

### Secondary — outline

| Property | Value |
|----------|-------|
| Padding | `8px 16px` |
| Background | transparent |
| Border | `1px solid --rk-border-1` |
| Color | `--rk-t1` |
| Font | Inter 600 · 12px |
| Border radius | `--rk-radius-md` |
| Hover | border upgrades to `--rk-border-2` |

### Filter chip

| Property | Value |
|----------|-------|
| Padding | `4px 11px` |
| Background | `--rk-surface` |
| Border | `1px solid --rk-border-0` |
| Border radius | `--rk-radius-pill` |
| Font | DM Mono · 9px · `letter-spacing: 0.07em` |
| Color | `--rk-t2` |
| White-space | `nowrap` |
| Active bg | `--rk-available-bg` |
| Active border | `--rk-available` |
| Active color | `--rk-available` |

---

## 13. Responsive Rules

| Breakpoint | Catalog grid | Notes |
|------------|-------------|-------|
| `< 480px` | 1 column | Horizontal scroll filter rail · stacked cards |
| `480px–959px` | 2 columns | Filter rail scrolls horizontally |
| `≥ 960px` | 3 columns + featured card | Left filter sidebar optional |

| Rule | Spec |
|------|------|
| Touch target minimum | `44×44px` — all interactive elements |
| WhatsApp CTA (mobile) | Sticky fixed bottom · `min-height: 52px` |
| Filter panel (mobile) | Bottom-sheet · `backdrop-filter: blur(12px)` · `--rk-elevated` bg |
| Filter panel (desktop) | Left rail or inline chips |
| Hero headline (mobile) | Max `22px` |
| Nav items | 3 maximum |
| Image format | WebP · lazy load · hero image eager |
| Transitions (mobile) | Max `200ms` |
| Filter/sort state | Persists on browser back-navigation |

---

## 14. Form Inputs

| Property | Value |
|----------|-------|
| Background | `--rk-surface` |
| Border | `1px solid --rk-border-1` |
| Border radius | `--rk-radius-md` (8px) |
| Height | 40px (default) · 36px (compact) |
| Padding | `0 12px` |
| Font | Inter 400 · 13px · `--rk-t1` |
| Placeholder | Inter 400 · 13px · `--rk-t3` |
| Focus border | `--rk-border-2` |
| Focus ring | `0 0 0 3px rgba(13,11,8,0.06)` |
| Disabled | `opacity: 0.5` · `cursor: not-allowed` |
| Error border | `--rk-flaw-visible` (#F5A524) |

**Search input (catalog):**

| Property | Value |
|----------|-------|
| Left icon | magnifier · 14px · `--rk-t3` |
| Placeholder | DM Mono · 11px · `letter-spacing: 0.06em` · `--rk-t3` |
| Clear button | appears on value · `×` · `--rk-t3` |
| Width | full-width on mobile · 240px on desktop |

**Sort select:**

| Property | Value |
|----------|-------|
| Background | `--rk-surface` |
| Border | `1px solid --rk-border-1` |
| Font | DM Mono · 10px · `letter-spacing: 0.08em` |
| Chevron | `--rk-t3` · right-aligned |
| Padding | `5px 10px` |
| Border radius | `--rk-radius-sm` (5px) |

---

## 15. Filters

### Desktop — inline chip rail

| Property | Value |
|----------|-------|
| Layout | horizontal flex · `gap: 6px` · wraps |
| Active chip | `--rk-available-bg` bg · `--rk-available` border + color |
| Clear all | DM Mono 9px · `--rk-t3` · appears only when ≥1 filter active |

**Filter priority order (left to right):**
`Size → Availability → Brand → Condition → Flaw level → Price → Box`

### Mobile — bottom-sheet

| Property | Value |
|----------|-------|
| Trigger | Sticky "Filtrar" + "Ordenar" buttons · full-width row |
| Sheet background | `--rk-elevated` · `backdrop-filter: blur(12px)` |
| Sheet radius | `--rk-radius-lg` top corners only |
| Handle | 4×32px · `--rk-border-1` · centered top |
| Animation | slide up · `--rk-dur-slow` · `--rk-ease-out` |
| Overlay | `rgba(13,11,8,0.4)` behind sheet |
| Apply CTA | Primary button · full-width · bottom of sheet |
| Safe area | `padding-bottom: env(safe-area-inset-bottom)` |

**Filter group:**

| Property | Value |
|----------|-------|
| Group label | DM Mono · 9px · `letter-spacing: 0.16em` · uppercase · `--rk-t3` |
| Options | pill chips · `gap: 6px` · wrap |
| Multi-select | chips toggle independently |
| Size group | displayed as grid (5 columns) for compact scanning |

---

## 16. Search

| State | Behavior |
|-------|----------|
| Empty | Placeholder: `BUSCAR MARCA, MODELO` in DM Mono |
| Typing | Results filter live (client-side) · no submit required |
| No results | Empty state triggered (see §21) |
| Active | Clear `×` button appears right of input |
| Focus | Border upgrades · focus ring applied |

**Result highlighting:**
- Matching substring: Inter 600 · `--rk-t1` (bolded within DM Mono context)
- Non-matching: `--rk-t3`

---

## 17. Catalog Grid

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| `< 480px` | 1 | `--rk-sp-3` (12px) |
| `480px–959px` | 2 | `--rk-sp-3` (12px) |
| `≥ 960px` | 3 | `--rk-sp-3` (12px) |

**Featured card slot:**
- Spans full grid width (`grid-column: 1 / -1`)
- Always the first item in the grid
- Horizontal layout: image 200px · info fills remainder
- One per page load — not repeated on pagination

**Grid header:**

| Element | Spec |
|---------|------|
| Result count | Inter 700 · 16px · `--rk-t1` · `"24 pares disponibles"` |
| Eyebrow | DM Mono · 9px · `--rk-t3` · `"CATÁLOGO"` |
| Sort control | right-aligned · secondary select style |

**Sold items:**
- Remain in grid · `opacity: 0.55` · `pointer-events: none`
- No "VENDIDO" overlay — opacity signals state sufficiently
- Never removed from grid immediately after sale

**Pagination / load more:**
- "Cargar más" secondary button · centered below grid
- DM Mono · 10px · `letter-spacing: 0.1em`

---

## 18. Product Gallery

| Property | Value |
|----------|-------|
| Hero image | Full-bleed · ink background · `aspect-ratio: 4/3` (desktop) · `aspect-ratio: 1/1` (mobile) |
| Thumbnail strip | below hero · horizontal scroll · `gap: 6px` · each thumb `64×64px` |
| Active thumb | `border: 1.5px solid --rk-t1` |
| Inactive thumb | `opacity: 0.55` |
| Thumb radius | `--rk-radius-sm` (5px) |
| Lightbox trigger | tap/click on hero image |
| Mobile gesture | swipe left/right between images |

**Lightbox:**

| Property | Value |
|----------|-------|
| Background | `rgba(13,11,8,0.94)` |
| Image | centered · max `90vw × 90vh` · `object-fit: contain` |
| Close | top-right · `×` · `--rk-t-bone` · 44×44px tap target |
| Nav arrows | left/right · `--rk-t-bone` at 60% opacity · 44×44px |
| Animation | fade in · `--rk-dur-base` |

**Photo type labels (overlay on thumbnail):**

| Label | Context |
|-------|---------|
| `EDITORIAL` | Hero styled shot |
| `CONDICIÓN` | Honest condition shot |
| `DETALLE` | Close-up flaw shot |
| `LIFESTYLE` | Worn-in context shot |

Labels: DM Mono · 8px · `letter-spacing: 0.12em` · `--rk-t-bone-dim` · bottom-right of thumb

---

## 19. Real Condition Components

### Condition spec table

Full-width table on product page. Expanded by default. Never collapsible on initial load.

| Property | Value |
|----------|-------|
| Background | `--rk-surface` |
| Border | `1px solid --rk-border-1` |
| Border radius | `--rk-radius-md` |
| Row padding | `9px 14px` |
| Row divider | `1px solid --rk-border-0` |
| Label | DM Mono · 9px · `letter-spacing: 0.1em` · uppercase · `--rk-t3` |
| Value | Inter 600 · 12px · `--rk-t1` |

**Rows (in order):**
`Condición general → Caja → Talla → Autenticidad → Nivel de detalle`

### Flaw map

| Property | Value |
|----------|-------|
| Container bg | `--rk-surface-2` |
| Container radius | `--rk-radius-md` |
| Padding | `12px 14px` |
| Diagram placeholder | `96×56px` · `--rk-surface` bg · `--rk-radius-sm` |
| Pin circle | 16px · `border: 1.5px solid --rk-reserved` · `--rk-reserved` at 12% bg |
| Pin number | DM Mono · 7px · `--rk-reserved` · centered |
| Flaw title | Inter 700 · 12px · `--rk-t1` |
| Flaw description | Inter 400 · 11px · `--rk-t2` · `line-height: 1.5` |
| Photo link | DM Mono · 8px · `--rk-t1` · underline border-bottom |

### RCG section header

| Property | Value |
|----------|-------|
| Eyebrow | DM Mono · 9px · `letter-spacing: 0.14em` · `--rk-t3` · `"REAL CONDITION GUARANTEE"` |
| Title | Inter 700 · 14px · `--rk-t1` |
| Stamp | RCG Stamp variant A · right-aligned |
| Bottom gap before spec table | `--rk-sp-4` (16px) |

### Authenticity block

| Property | Value |
|----------|-------|
| Background | `--rk-surface` |
| Border | `1px solid --rk-border-0` |
| Border radius | `--rk-radius-md` |
| Padding | `11px 14px` |
| Icon | 26px circle · `--rk-surface-2` bg · checkmark · `--rk-t2` |
| Title | Inter 600 · 12px · `--rk-t1` |
| Subtitle | Inter 400 · 10px · `--rk-t3` · includes listing ID |

---

## 20. WhatsApp CTA System

### Pre-filled message format

```
Hola, me interesa: {listing_id} · {model_name} · {size} · {condition}
```

Example: `Hola, me interesa: RK-0042 · Jordan 1 Chicago · US 9 · Like New`

### CTA states by product status

| Status | CTA label | Action |
|--------|-----------|--------|
| Available | `Preguntar por WhatsApp` | Opens WhatsApp with pre-filled message |
| Reserved | `Unirse a la lista de espera` | Opens WhatsApp — reserved message |
| Pre-order | `Reservar mi par` | Opens WhatsApp — pre-order message |
| Sold | CTA hidden | Show "Ver pares similares →" link instead |

### CTA sub-label (below button label)

- Font: DM Mono · 9px · `letter-spacing: 0.07em`
- Color: `--rk-t-bone-dim`
- Content: `{listing_id} · {model_short} · {size} · {condition}`
- Purpose: confirms to user exactly which pair they're inquiring about

### Drawer (optional expanded state)

| Property | Value |
|----------|-------|
| Background | `--rk-ink` |
| Border radius | `--rk-radius-lg` top corners |
| Padding | `20px 22px` |
| Message preview | pre-filled text · DM Mono · 11px · `--rk-t-bone-dim` · editable |
| Confirm CTA | Primary button variant · full-width |
| Animation | slide up from bottom · `--rk-dur-slow` |

---

## 21. Empty States

All empty states are diagnostic — state the cause, provide the next action. Never apologetic.

| Scenario | Message | Action |
|----------|---------|--------|
| No results for filter | `"Sin pares en {filter}."` | `"Cambiar filtros"` chip |
| No results for size | `"Sin pares en {size} por ahora."` | `"Notificarme"` → WhatsApp |
| No results for search | `"Sin resultados para '{query}'."` | `"Ver catálogo completo"` |
| Catalog empty | `"Catálogo en preparación."` | WhatsApp CTA |
| Sold-out size | `"{size} agotada — lista de espera disponible."` | WhatsApp reserved flow |

**Empty state anatomy:**

| Element | Spec |
|---------|------|
| Message | Inter 400 · 13px · `--rk-t2` · centered |
| Action | Secondary button or DM Mono link · `--rk-t1` · underline |
| Container padding | `--rk-sp-9` (56px) vertical |
| No illustration | text + action only — no decorative SVGs |

---

## 22. Loading States

| Component | Loading treatment |
|-----------|-------------------|
| Product card | Skeleton: image area + 3 text lines · `--rk-surface-2` bg · no animation |
| Catalog grid | 6 skeleton cards (2×3 desktop · 4 mobile) |
| Product page | Image skeleton full-bleed + content skeletons below |
| Price | Skeleton inline · `80px × 28px` · `--rk-surface-2` |
| Status pill | Skeleton · `64px × 18px` · `--rk-surface-2` |

**Skeleton rules:**
- Background: `--rk-surface-2`
- Border radius: matches the element it replaces
- No shimmer animation — static skeletons only
- Replaced immediately on data load (no minimum display time)

---

## 23. Responsive Rules

| Breakpoint | Label | Catalog | Filters | Navigation |
|------------|-------|---------|---------|------------|
| `< 480px` | Mobile S | 1 col | Bottom-sheet | Hamburger |
| `480px–767px` | Mobile L | 2 col | Bottom-sheet | Hamburger |
| `768px–959px` | Tablet | 2 col | Inline chips | Full nav |
| `≥ 960px` | Desktop | 3 col + featured | Inline chips | Full nav |

**Universal rules:**

| Rule | Spec |
|------|------|
| Touch target | `44×44px` minimum — all interactive elements |
| Body font | `--rk-fs-body` (13px) — never scale down on mobile |
| Min tap target (CTA) | `52px` height on mobile |
| Hero headline | Max `22px` on mobile |
| WhatsApp CTA | Sticky fixed bottom on product page — always visible |
| Filter state | Persists on browser back-navigation |
| Image format | WebP · lazy load · hero eager |
| Max transition | `200ms` on mobile |
| Safe area | `env(safe-area-inset-bottom)` on sticky elements |
| Zoom | `meta viewport` includes `user-scalable=no` only if justified |

---

## Appendix — File reference

| File | Purpose |
|------|---------|
| `docs/rkicks-design-brief.md` | Strategy, rules, Do/Don't |
| `docs/rkicks-design-system.md` | This file — engineering spec |
| `RKicks Brand Identity.html` | Logo, wordmark, seal SVG reference |
| `RKicks Moodboard v2.html` | Approved visual direction |
| `docs/RKicks Design Brief.html` | Printable brief |

---

*RKicks · Part of R Supply · Design System v1.0 · June 2026*
Card shadow:   var(--rk-shadow-card)
Card padding:  10px 12px (info area)
```

```css
.rk-card {
  background:    var(--rk-surface);
  border:        1px solid var(--rk-border-0);
  border-radius: var(--rk-radius-md);
  box-shadow:    var(--rk-shadow-card);
  overflow:      hidden;
  transition:    border-color var(--rk-dur-base) var(--rk-ease-out);
}

.rk-card:hover {
  border-color: var(--rk-border-1);
}

.rk-card__image {
  width:  100%;
  aspect-ratio: 1 / 0.85; /* default card image ratio */
  object-fit: cover;
  display: block;
}

.rk-card__body {
  padding: 10px 12px;
}
```

**Sold state:**
```css
.rk-card[data-status="sold"] {
  opacity: 0.55;
  pointer-events: none; /* or link to archive page */
}
```

---

## 9. Product Card Anatomy

```
┌─────────────────────────────┐
│                       [dot] │  ← flaw dot: 8px circle, top-right
│                             │
│         PHOTO               │  ← 60% of card height, full-bleed
│                             │
├─────────────────────────────┤
│ BRAND          (DM Mono 8px)│  ← var(--rk-t3), tracking 0.13em
│ Model Name  (Inter 700 14px)│  ← var(--rk-t1), tracking −0.02em
│                             │
│ SIZE ·      [COND]  ●●○○   │  ← mono 9px · chip · flaw bar
│                             │
│ $1,400       ● Disponible  │  ← Inter 700 20px / status pill
└─────────────────────────────┘
```

```css
.rk-card__eyebrow {
  font-family:     var(--rk-font-mono);
  font-size:       var(--rk-fs-eyebrow);   /* 9px */
  letter-spacing:  0.13em;
  text-transform:  uppercase;
  color:           var(--rk-t3);
  margin-bottom:   var(--rk-sp-1);
}

.rk-card__name {
  font-family:    var(--rk-font-sans);
  font-weight:    700;
  font-size:      var(--rk-fs-h4);         /* 14px */
  letter-spacing: var(--rk-ls-heading);
  color:          var(--rk-t1);
  margin-bottom:  var(--rk-sp-2);
}

.rk-card__price {
  font-family:    var(--rk-font-sans);
  font-weight:    700;
  font-size:      var(--rk-fs-price-card); /* 20px */
  letter-spacing: var(--rk-ls-heading);
  color:          var(--rk-t1);
}

.rk-card__size {
  font-family:    var(--rk-font-mono);
  font-size:      9px;
  letter-spacing: var(--rk-ls-mono);
  color:          var(--rk-t2);
}

/* Flaw dot — positioned absolute in image area */
.rk-card__flaw-dot {
  position:      absolute;
  top:           7px;
  right:         8px;
  width:         8px;
  height:        8px;
  border-radius: 50%;
  border:        1.5px solid var(--rk-surface);
}

/* Flaw bar — 4 segments */
.rk-flaw-bar {
  display: flex;
  gap: 3px;
  align-items: center;
}
.rk-flaw-bar__seg {
  width:  12px;
  height: 3px;
  border-radius: 2px;
  opacity: 0.4; /* inactive */
}
.rk-flaw-bar__seg.active {
  opacity: 1;
}
```

---

## 10. Badge Anatomy — Status Pill

```
[ ● DISPONIBLE ]   ← 5px dot + label
```

```css
.rk-pill {
  display:         inline-flex;
  align-items:     center;
  gap:             var(--rk-sp-1);
  padding:         2px 7px;
  border-radius:   var(--rk-radius-pill);
  font-family:     var(--rk-font-mono);
  font-size:       9px;
  letter-spacing:  0.07em;
  text-transform:  uppercase;
  flex-shrink:     0;
}

.rk-pill__dot {
  width:         5px;
  height:        5px;
  border-radius: 50%;
  flex-shrink:   0;
}

/* Variants */
.rk-pill--available {
  background: var(--rk-available-bg);
  color:      var(--rk-available);
}
.rk-pill--available .rk-pill__dot { background: var(--rk-available); }

.rk-pill--reserved {
  background: var(--rk-reserved-bg);
  color:      var(--rk-reserved);
}
.rk-pill--reserved .rk-pill__dot { background: var(--rk-reserved); }

.rk-pill--sold {
  background: var(--rk-sold-bg);
  color:      var(--rk-sold);
}
.rk-pill--sold .rk-pill__dot { background: var(--rk-sold); }
```

### Condition chip
```css
.rk-chip {
  display:        inline-block;
  padding:        2px 7px;
  border:         1px solid var(--rk-border-1);
  border-radius:  var(--rk-radius-xs);
  font-family:    var(--rk-font-mono);
  font-size:      9px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color:          var(--rk-t3);
  flex-shrink:    0;
}
```

---

## 11. RCG Badge Anatomy

Three variants. All use DM Mono. All share the double-border stamp aesthetic.

### A — Stamp (primary, product pages)
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  outer border 0.5px subtle
│ ┌───────────────────────────────┐ │  inner border 0.7px ink
│ │  REAL CONDITION GUARANTEE     │ │
│ │  ─────────────────────────── │ │
│ │  RKICKS · VERIFICADO · MX     │ │
│ └───────────────────────────────┘ │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

```css
.rk-rcg-stamp {
  position:   relative;
  padding:    10px 14px;
  border:     0.7px solid var(--rk-t1);
  box-shadow: 0 0 0 3px var(--rk-canvas), 0 0 0 3.8px var(--rk-border-0);
}

.rk-rcg-stamp__title {
  font-family:    var(--rk-font-mono);
  font-size:      9.5px;
  font-weight:    500;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  color:          var(--rk-t1);
  text-align:     center;
}

.rk-rcg-stamp__rule {
  height:     0.5px;
  background: var(--rk-t1);
  margin:     6px 0;
}

.rk-rcg-stamp__sub {
  font-family:    var(--rk-font-mono);
  font-size:      8px;
  letter-spacing: 0.13em;
  color:          var(--rk-t3);
  text-align:     center;
  text-transform: uppercase;
}
```

### B — Emblem (small, icon, embroidery)
Square format. `RCG` large center, `REAL COND.` small top, bordered square.  
Minimum rendered size: **32px**. Below 32px use icon only.

### C — Inline Pill (cards, tables)
```
[ ● REAL CONDITION GARANTIZADO ]
```
Same structure as status pill but with fixed border:
```css
.rk-rcg-pill {
  /* extends .rk-chip */
  border: 1px solid var(--rk-t1);
  color:  var(--rk-t1);
  font-size: 9px;
  letter-spacing: 0.15em;
}
```

---

## 12. Button System

### Primary — WhatsApp CTA
```css
.rk-btn-primary {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  width:           100%;
  padding:         14px 20px;
  background:      var(--rk-ink);
  color:           var(--rk-t-bone);
  border:          none;
  border-radius:   var(--rk-radius-md);
  font-family:     var(--rk-font-sans);
  font-weight:     700;
  font-size:       13px;
  letter-spacing:  -0.01em;
  cursor:          pointer;
  transition:      opacity var(--rk-dur-fast) var(--rk-ease-out);
}

.rk-btn-primary:hover  { opacity: 0.88; }
.rk-btn-primary:active { opacity: 0.75; }

/* Sticky variant (mobile product page) */
.rk-btn-primary--sticky {
  position:      fixed;
  bottom:        0;
  left:          0;
  right:         0;
  border-radius: 0;
  min-height:    52px;
  z-index:       100;
  padding-bottom: calc(14px + env(safe-area-inset-bottom));
}
```

### Secondary — ghost / outline
```css
.rk-btn-secondary {
  display:         inline-flex;
  align-items:     center;
  gap:             var(--rk-sp-2);
  padding:         8px 16px;
  background:      transparent;
  color:           var(--rk-t1);
  border:          1px solid var(--rk-border-1);
  border-radius:   var(--rk-radius-md);
  font-family:     var(--rk-font-sans);
  font-weight:     600;
  font-size:       12px;
  cursor:          pointer;
  transition:      border-color var(--rk-dur-fast) var(--rk-ease-out);
}

.rk-btn-secondary:hover { border-color: var(--rk-border-2); }
```

### Filter chip (toggle)
```css
.rk-filter-chip {
  display:         inline-flex;
  align-items:     center;
  padding:         4px 11px;
  border:          1px solid var(--rk-border-0);
  border-radius:   var(--rk-radius-pill);
  background:      var(--rk-surface);
  font-family:     var(--rk-font-mono);
  font-size:       9px;
  letter-spacing:  0.07em;
  color:           var(--rk-t2);
  cursor:          pointer;
  transition:      all var(--rk-dur-fast) var(--rk-ease-out);
  white-space:     nowrap;
  user-select:     none;
}

.rk-filter-chip[aria-pressed="true"],
.rk-filter-chip.active {
  background:    var(--rk-available-bg);
  border-color:  var(--rk-available);
  color:         var(--rk-available);
}
```

---

## Appendix — File Reference

| File | Purpose |
|------|---------|
| `docs/rkicks-design-brief.md` | Strategy, rules, Do/Don't — product and design teams |
| `docs/rkicks-design-system.md` | This file — CSS tokens and component specs — engineering |
| `RKicks Brand Identity.html` | Logo, wordmark, seal, RCG badge SVG — visual reference |
| `RKicks Moodboard v2.html` | Approved visual direction — implementation reference |
| `docs/RKicks Design Brief.html` | Printable brief — stakeholder presentations |

---

*RKicks · Part of R Supply · Design System v1.0 · June 2026*
