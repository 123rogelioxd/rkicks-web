# RKicks — Design Brief v1.0
**Performance Luxury Edition · Bone Dominant Direction · Approved**  
Version 1.0 · June 2026 · R Supply Ecosystem · Confidential

---

## 01 — Brand Positioning

**One-line:** "Curado por gente que sabe."

RKicks is a curated premium sneaker boutique operating in Mexico, part of the R Supply ecosystem. We do not compete on volume. We compete on curation, authenticity, radical transparency, and the quality of the human relationship behind every sale.

### What we compete on
- **Curation** — every pair is selected, not listed. Inventory is edited, not exhaustive.
- **Authenticity** — every pair is verified before listing. No exceptions.
- **Transparency** — every flaw is photographed and disclosed. No surprises.
- **Presentation** — editorial photography and precise data make the product desirable.
- **The human relationship** — the sale completes on WhatsApp with a real person.

### What we are not
- A marketplace or reseller platform (StockX, GOAT, Mercado Libre)
- A volume-first catalog with thousands of undifferentiated listings
- A hype-driven, drop-hysteria, or countdown-timer experience
- A corporate storefront — the personal relationship is a feature, not a limitation

### Target audience
18–35 years old, Mexico. Interested in sneakers, fashion, fragrances, fitness, and lifestyle. Buys Nike, Jordan, New Balance, Adidas, Puma. Values originality, quality over quantity, and status without looking flashy.

---

## 02 — Brand Principles

| # | Principle | Description |
|---|-----------|-------------|
| 01 | **Curatorial** | We are a gallery, not a warehouse. Every item earns its place. |
| 02 | **Transparent** | Flaws are shown up front. Honesty is a feature and a competitive moat. |
| 03 | **Quietly Confident** | Status without shouting. No timers, urgency tactics, or hype language. |
| 04 | **Editorial** | Sneakers are fashion objects worth photographing well. |
| 05 | **Personal** | The WhatsApp conversation is the checkout. Real people close every sale. |

---

## 03 — Visual Direction

**Approved direction:** Bone Dominant — Performance Luxury Edition

Warm bone (`#F0EAE0`) is the dominant canvas. Deep ink (`#0D0B08`) provides maximum contrast and authority. The page opens in a full-bleed ink hero zone, then cuts hard to bone — no gradient, no transition.

**Visual references:** A Ma Maniére, KITH, Fear of God, Porsche configurator, Apple product pages.

### The dual zone system
- **Ink zone** — navigation and hero. Deep ink background, bone typography, one Cormorant italic headline.
- **Bone zone** — all commerce content. Warm bone canvas, ink type, product listings, filters, trust sections.
- **Hard cut** — the transition between zones is an abrupt edge. No gradient or fade. The contrast IS the design statement.

---

## 04 — Color System

| Token | Value | Usage |
|-------|-------|-------|
| Canvas | `#F0EAE0` | Page background — dominant surface. Never replaced with white or gray. |
| Surface | `#FDFAF5` | Cards, panels, product tiles on bone canvas. |
| Surface 2 | `#E8E2D7` | Section dividers, callout backgrounds. |
| Ink | `#0D0B08` | Hero zone background, CTAs, product names, prices. Maximum contrast. |
| Text 2 | `#2C2620` | Body copy, secondary info. Notably darker than typical gray — intentional. |
| Text 3 | `#7A736C` | Metadata, captions, eyebrow labels, placeholder text. |
| Available | `#0A6B42` | Status indicator only. Never used as a background fill. |
| Reserved | `#8A5A08` | Status indicator only. Never used as a background fill. |
| RDecants Gold | `#C9A961` | Complete The Fit sections only. Never in RKicks-only UI. |
| **Violet `#7C5CFF`** | **BLOCKED** | R Supply OS only. Never appears anywhere in the RKicks storefront. |

---

## 05 — Typography

### Font families
| Family | Weights | Role |
|--------|---------|------|
| Cormorant Garamond Italic | 400, 600 | Brand moments only — hero headline, product subtitle |
| Inter | 400, 500, 600, 700, 800 | Product names, prices, body, CTAs, navigation |
| DM Mono | 400, 500 | Eyebrows, sizes, listing IDs, condition codes, specs |

### Usage rules
- **Cormorant italic** — used once per major section. Never in buttons, prices, specs, or navigation.
- **Price display** — Inter 800, 36–42px, tracking `−0.04em`. Always the second most prominent element on a product page.
- **Product names** — Inter 700, 18–24px, tracking `−0.02em`. Official model name, never sentence case.
- **DM Mono** — all structured data: eyebrows, sizes, listing IDs, condition codes, filter chips. Tracking `0.12–0.18em` for eyebrows.
- **Minimum body size** — 12px Inter 400. Never below 11px for any live copy.

---

## 06 — Layout Rules

| Rule | Specification |
|------|---------------|
| Max content width | 1280px, centered |
| Page padding (mobile) | 16px horizontal |
| Page padding (tablet) | 32px horizontal |
| Page padding (desktop) | 64–80px horizontal |
| Catalog grid (desktop) | 3 columns + 1 featured card |
| Catalog grid (tablet) | 2 columns |
| Catalog grid (mobile) | 1 column stacked cards |
| Card border radius | 8–10px maximum |
| Section gap | 48px between major sections |
| Card gap | 10–12px in grids |
| Borders | `1px solid rgba(13,11,8,0.09–0.16)` — hierarchy via opacity |
| Gradients | Not permitted. Zone transitions use a hard cut. |
| Blur effects | Only on modal overlays and mobile bottom-sheet filters. |

---

## 07 — Component Rules

### Product Card
- Image area: **60% of card height**, full-bleed (no padding around photo)
- Brand eyebrow: DM Mono 8px, tracking `0.12em`, uppercase, Text 3 color
- Model name: Inter 700, 13–14px, tracking `−0.02em`
- Price: Inter 700, 15–22px, tracking `−0.02em` — **never in mono, never small**
- Flaw dot: 8px circle, top-right of image. Green (none), warm gray (minor), amber (visible). Always visible on grid cards.
- Status pill: DM Mono 9px, colored dot + label

### Featured Card (Catalog)
- One per catalog page, above the grid
- Horizontal: image left (200px wide), info right
- Price at 26px+, larger than standard cards

### Navigation
- Background: ink (`#0D0B08`) — part of the hero zone
- Logo: horizontal wordmark (R | KICKS). Never stacked in nav.
- Maximum 3 nav items: Catálogo · Real Condition · Nosotros
- Nav links: Inter 400, 11–12px, bone at 45% opacity

### WhatsApp CTA
- Background: ink. Text: bone. Font: Inter 700, 13px.
- Full-width on product pages. Always sticky on mobile.
- Pre-fills message: `"Hola, me interesa: RK-0042 · Jordan 1 Chicago · US 9 · Like New"`
- **Never a ghost button. Never secondary styling. It is the primary action.**

### Filter Chips
- Pill shape, border-radius 999px. Surface background, subtle border.
- Active: status color bg and border.
- DM Mono 9px, tracking `0.07em`. Never Inter for filter chips.
- Mobile: horizontal scroll rail, no wrapping.

---

## 08 — Homepage Structure

```
┌─────────────────────────────────────────────┐
│ INK   · Navigation — Wordmark + 3 links     │
│ INK   · Hero — full-bleed image + headline  │
├─────────────────────────────────────────────┤
│ BONE  · Available Now — section header      │
│ BONE  · Product rows — 3 in-stock pairs     │
│ GOLD  · Complete The Fit — RDecants bridge  │
│ INK   · WhatsApp CTA — full-width           │
│ BONE  · Footer — R Supply · EN/ES           │
└─────────────────────────────────────────────┘
```

**Rules:**
- Hero image must be real product photography — never stock or manufacturer renders
- The Cormorant italic headline appears once, in the hero zone only
- Product rows show real-time availability — Reserved and Sold states must be visible
- Available inventory must appear above the fold on mobile

---

## 09 — Catalog Structure

```
┌─────────────────────────────────────────────┐
│ BONE  · Header — count + search + sort       │
│ BONE  · Filter chips — brand/size/cond/etc  │
│ BONE  · Featured card — 1 editorial pair    │
│ BONE  · Product grid — 3-col / 2-col / 1    │
│ BONE  · Empty state → WhatsApp              │
└─────────────────────────────────────────────┘
```

**Filter priority:** Size → Availability → Brand → Condition → Flaw level → Price → Box

**Sort options:** Más reciente (default) · Precio menor/mayor · Condición: mejor primero

**Sold items:** Remain visible at 55% opacity. Social proof that inventory moves.

---

## 10 — Product Page Structure

```
┌─────────────────────────────────────────────┐
│ INK   · Full-bleed hero image               │
├─────────────────────────────────────────────┤
│ BONE  · Brand eyebrow + model name          │
│ BONE  · Price (large) + status + sizes      │
│ BONE  · Real Condition Guarantee — expanded │
│ BONE  · Authenticity verification           │
│ GOLD  · Complete The Fit                    │
│ INK   · WhatsApp CTA — sticky               │
│ BONE  · More in this size / brand           │
└─────────────────────────────────────────────┘
```

**Rules:**
- Hero must be dark-background product photography
- Real Condition section is **expanded by default** — never collapsed on load
- WhatsApp CTA is sticky on mobile — always visible
- Listing ID appears in the CTA pre-filled message and product meta

---

## 11 — Real Condition Guarantee

> "What you see is what arrives. Real photos, every flaw disclosed, condition graded honestly — or your money back."

### Condition grades
| Grade | Definition |
|-------|------------|
| New | Unworn, original packaging, deadstock |
| Like New | Worn once or twice, no visible flaws |
| Excellent | Lightly worn, minor imperfections disclosed |
| Good | Visibly worn, fully wearable, priced accordingly |
| Fair | Heavy use or notable flaws, full disclosure required |

### Flaw levels
| Level | Definition | Indicator |
|-------|------------|-----------|
| None | No visible flaws under normal inspection | Green · ●○○○ |
| Minor | Small flaw, visible on close inspection only | Warm gray · ●●○○ |
| Visible | Flaw visible at normal viewing distance | Amber · ●●●○ |
| Heavy | Significant wear or damage | Amber-red · ●●●● |

### Flaw map requirements
- Each flaw: numbered pin on shoe diagram + written description + minimum 1 close-up photo
- Section expanded by default on product page
- Plain language: *"Rozadura menor en la puntera izquierda. Visible de cerca, no afecta el uso."*

### Badge system
- **RCG Stamp** — product page Real Condition section header
- **RCG Pill** — bottom of catalog product cards
- **Authenticity Seal** — circular stamp, product page and packaging interior

---

## 12 — Complete The Fit

The ecosystem bridge between RKicks and RDecants. A sneaker paired with a specific fragrance, with a one-line stylist rationale. This is a **styling service**, not a cross-sell widget.

### Approved pairings
| Sneaker | Fragrance | Rationale |
|---------|-----------|-----------|
| Nike Panda Dunk Low | Bleu de Chanel EDT | Clean, fresh, everyday |
| Adidas Campus OG | Le Beau EDT | Minimal, versatile, unisex |
| Nike Air Force 1 White | YSL Y EDP | Classic, clean, confident |
| New Balance 550 | Dior Homme EDT | Effortless, refined, heritage |
| Air Jordan 1 Chicago | Dior Sauvage EDP | Bold, iconic, commanding |

### Visual treatment rules
- Use **RDecants gold (`#C9A961`)** as accent — the only place gold appears in the RKicks UI
- Background: ink zone with gold text and dot. Never on bone background.
- Format: *[Sneaker] → [Fragrance]* in Cormorant italic gold
- One-sentence rationale in Inter 400, bone at 60% opacity
- WhatsApp inquiry can include the fragrance pairing — one conversation, two brands

---

## 13 — Mobile Rules

Mobile is the product. The sale begins on mobile and ends in WhatsApp.

### Layout
- Single column below 480px
- Filter chips: horizontal scroll rail, no wrapping. Size and Availability first.
- Cards: horizontal (image 72px wide, info fills remaining width)
- Ink hero at full viewport width. Headline max 22px on mobile.

### Touch
- **Minimum touch target: 44×44px** — applies to filters, nav, badges, CTA
- Filters: bottom-sheet panel (elevated + blur). Never a sidebar on mobile.
- Image gallery: swipe gesture, tap to open lightbox.

### WhatsApp
- Sticky on product page — fixed to bottom, always visible
- Bottom navigation: max 3 items (Catálogo · Favoritos · Nosotros)
- CTA button min height on mobile: 52px

### Performance
- Images: WebP + lazy loading. Hero image loads eagerly (above fold).
- Transitions: 200ms max on mobile
- Filter/sort state persists across back-navigation

---

## 14 — Do & Don't

### Typography
| ✓ Do | ✗ Don't |
|------|---------|
| Inter 800 for prices at 36–42px | Use DM Mono for prices |
| DM Mono for eyebrows, sizes, codes | Use Cormorant italic for navigation or prices |
| Cormorant italic once per section | Go below 12px for live body copy |
| Text 2 at `#2C2620` (darker than typical) | Use Inter for filter chips |

### Color
| ✓ Do | ✗ Don't |
|------|---------|
| `#F0EAE0` as dominant canvas | Use white `#FFFFFF` as page canvas |
| `#0D0B08` for CTAs and hero zone | Use violet `#7C5CFF` anywhere in storefront |
| Gold only in Complete The Fit sections | Use gold in any non-RDecants context |
| Status colors for indicators only | Use status colors as section backgrounds |

### Layout
| ✓ Do | ✗ Don't |
|------|---------|
| Hard cut between ink and bone zones | Use gradient transitions between zones |
| Card border-radius 8–10px max | Apply blur to in-flow content cards |
| Max 3 top-level nav items | Use decorative gradients anywhere |
| Featured horizontal card above catalog grid | Use more than 3 navigation items |

### Product & Trust
| ✓ Do | ✗ Don't |
|------|---------|
| Show flaw dot on every catalog card | Hide flaws until product page |
| Expand Real Condition section by default | Collapse Real Condition on initial load |
| RCG pill on every product card | Use "Authentic" as plain text label |
| Real product photos, honest lighting | Use stock or manufacturer renders |

### CTAs & Commerce
| ✓ Do | ✗ Don't |
|------|---------|
| Full-width ink CTA for WhatsApp | Style WhatsApp as ghost or secondary button |
| Pre-fill WhatsApp with ID, model, size, condition | Open WhatsApp without context |
| Keep WhatsApp sticky on mobile product pages | Remove sold items from catalog immediately |
| Show Reserved and Sold states | Use urgency tactics or countdown timers |

---

*RKicks · Part of R Supply · Design Brief v1.0 · June 2026 · Confidential*
