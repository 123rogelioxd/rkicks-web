# RKicks — Engineering Handoff
**Frontend Implementation Reference · v1.0 · June 2026**  
Design system: `docs/rkicks-design-system.md` · Brief: `docs/rkicks-design-brief.md`

---

## 1. Project Structure

```
rkicks/
├── public/
│   └── images/           # product photos (WebP), logo SVG
├── src/
│   ├── assets/
│   │   └── fonts/        # Inter, Cormorant Garamond, DM Mono (self-hosted or GFonts)
│   ├── styles/
│   │   ├── tokens.css    # all --rk-* CSS custom properties (from design system)
│   │   ├── base.css      # reset, body, zone classes
│   │   └── components/   # one file per component
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Nav.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ZoneInk.jsx / ZoneBone.jsx
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductCardFeatured.jsx
│   │   │   ├── ProductGallery.jsx
│   │   │   └── ProductMeta.jsx
│   │   ├── catalog/
│   │   │   ├── CatalogGrid.jsx
│   │   │   ├── FilterRail.jsx
│   │   │   ├── FilterSheet.jsx   # mobile bottom-sheet
│   │   │   ├── FilterChip.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   └── SortSelect.jsx
│   │   ├── rcg/
│   │   │   ├── RCGStamp.jsx
│   │   │   ├── RCGPill.jsx
│   │   │   ├── RCGEmblem.jsx
│   │   │   ├── ConditionTable.jsx
│   │   │   ├── FlawMap.jsx
│   │   │   └── AuthenticityBlock.jsx
│   │   ├── ecosystem/
│   │   │   └── CompleteTheFit.jsx
│   │   ├── whatsapp/
│   │   │   ├── WhatsAppCTA.jsx
│   │   │   └── WhatsAppDrawer.jsx
│   │   └── ui/
│   │       ├── StatusPill.jsx
│   │       ├── ConditionChip.jsx
│   │       ├── FlawBar.jsx
│   │       ├── FlawDot.jsx
│   │       ├── Eyebrow.jsx
│   │       ├── Skeleton.jsx
│   │       └── EmptyState.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CatalogPage.jsx
│   │   ├── ProductPage.jsx
│   │   └── RealConditionPage.jsx
│   ├── hooks/
│   │   ├── useInventory.js
│   │   ├── useFilters.js
│   │   └── useWhatsApp.js
│   ├── utils/
│   │   ├── whatsapp.js       # message builder
│   │   ├── inventory.js      # status helpers
│   │   └── currency.js       # MXN formatting
│   └── data/
│       └── products.json     # static seed data (pre-API)
```

---

## 2. Routes

| Path | Page | Notes |
|------|------|-------|
| `/` | HomePage | Ink hero + bone inventory |
| `/catalogo` | CatalogPage | Full inventory grid |
| `/catalogo?marca=nike&talla=9` | CatalogPage | Filter params preserved in URL |
| `/producto/:slug` | ProductPage | Slug = `{brand}-{model-kebab}-{size}` e.g. `jordan-1-chicago-us9` |
| `/real-condition` | RealConditionPage | Program explainer |
| `/nosotros` | Static | About / contact |

**URL filter persistence:**  
All active filters and sort state must be reflected in the URL query string. On browser back, state is restored from URL — never reset.

```
/catalogo?marca=nike&talla=9&condicion=like-new&disponible=true&orden=reciente
```

---

## 3. Homepage Sections

Render in this exact order. No reordering.

### 3.1 Nav (ink zone)
- Background: `--rk-ink`
- Height: 48px
- Logo: horizontal wordmark SVG (left)
- Links: `Catálogo` · `Real Condition` · `Nosotros` (right, Inter 400 11px, `--rk-t-bone-dim`)
- Mobile: hamburger replaces links — opens full-screen ink overlay menu

### 3.2 Hero (ink zone)
- Full-viewport-width image container · `aspect-ratio: 16/9` desktop · `4/3` mobile
- Image: real product editorial photo (WebP, eager load)
- Headline overlay: Cormorant Garamond Italic 600 · `28px` desktop · `22px` mobile · `--rk-t-bone`
- Sub-label: DM Mono · 9px · `letter-spacing: 0.18em` · uppercase · `--rk-t-bone-dim`
- Hard cut to bone zone below — no gradient

### 3.3 Available Now (bone zone)
- Section header: eyebrow `"DISPONIBLE AHORA"` + Inter 700 16px heading
- Right-aligned link: `"Ver catálogo →"` DM Mono 9px · `--rk-t1` · border-bottom
- Renders 3 most-recently-added available products as compact horizontal cards
- Live status — if a shown pair becomes Reserved mid-session, pill updates without page reload

### 3.4 Complete The Fit (ink zone inset)
- Background: `--rk-ink` · border-radius `--rk-radius-md`
- Gold accent (`--rk-gold`) for eyebrow dot + pairing text
- One featured pairing only — most recently added or manually curated
- Links to RDecants product page (new tab)
- See §15 for full flow

### 3.5 WhatsApp CTA (ink zone)
- Full-width ink block — not a button, a section
- Inter 700 13px heading · DM Mono 9px sub-label
- On click: opens WhatsApp with generic greeting (no product pre-fill from homepage)
- Generic message: `"Hola, me interesa ver los pares disponibles en RKicks."`

### 3.6 Footer (bone zone)
- Left: stacked wordmark SVG + `"Parte de R Supply"` DM Mono 9px `--rk-t3`
- Right: EN/ES toggle + Instagram/WhatsApp links
- Center: `© 2026 RKicks` · DM Mono 9px
- No mega-menu, no link columns

---

## 4. Catalog Page Sections

### 4.1 Page header
- Eyebrow: `"CATÁLOGO"` DM Mono 9px
- Heading: `"{n} pares disponibles"` Inter 700 16px — count reflects active filters
- Sort select: right-aligned, DM Mono 10px

### 4.2 Search
- Full-width on mobile · 240px fixed right on desktop (inline with sort)
- Filters client-side on `products` array
- Clears with `×` button

### 4.3 Filter rail (desktop) / Filter button (mobile)
- **Desktop:** horizontal chip rail below header, wraps if needed
- **Mobile:** sticky `"Filtrar"` + `"Ordenar"` buttons → bottom-sheet
- Active filter count badge on mobile filter button
- Filter state in URL (see §2)

### 4.4 Featured card
- First card in grid, full-width (`grid-column: 1 / -1`)
- Only renders if `products.filter(available)[0]` exists
- Horizontal layout: image 200px · info panel fills rest

### 4.5 Product grid
- 3-col desktop · 2-col tablet · 1-col mobile (see §8)
- Gap: 12px
- Sold items: rendered at `opacity: 0.55` · `pointer-events: none`
- Infinite scroll or "Cargar más" button — no pagination numbers

### 4.6 Empty state
- Triggered when filtered results = 0
- See §12 for copy and action rules

---

## 5. Product Page Sections

Render in this exact order.

### 5.1 Hero image (ink zone)
- Full-viewport-width · ink background · `aspect-ratio: 4/3` desktop · `1/1` mobile
- Primary product photo (eager load, WebP)
- No UI chrome overlaid on hero — image is clean

### 5.2 Gallery thumbnails
- Below hero · horizontal scroll · 64×64px thumbs · gap 6px
- Active thumb: `border: 1.5px solid --rk-t1`
- Clicking thumb swaps hero image
- Photo type label (DM Mono 8px) overlaid bottom-right of each thumb
- Tap hero → lightbox (see §18 of design system)

### 5.3 Product meta (bone zone)
- Eyebrow: brand + category (DM Mono 9px `--rk-t3`)
- Model name: Inter 700 24px `--rk-t1` `letter-spacing: -0.03em`
- Subtitle: Cormorant Garamond Italic · colorway/year · `--rk-t3`
- Price: Inter 800 42px `--rk-t1` `letter-spacing: -0.04em` + `"MXN"` DM Mono 11px
- Size chips: US / EUR / CM displayed as `<Chip>` group
- Status pill: current inventory state

### 5.4 Real Condition section
- Section eyebrow + `<RCGStamp>` right-aligned
- `<ConditionTable>` — expanded by default, never collapsed on mount
- `<FlawMap>` — if `flaws.length > 0`
- `<AuthenticityBlock>` — always present

### 5.5 Complete The Fit
- Only renders if a pairing exists for this product's slug
- See §15 for behavior

### 5.6 WhatsApp CTA
- Full-width ink button — primary action
- Sticky on mobile (fixed bottom)
- Pre-filled message includes listing ID, model, size, condition
- See §14 for full flow

### 5.7 More in this size / brand
- Heading: `"Más en {size}"` or `"Más de {brand}"`
- Horizontal scroll of up to 4 product cards
- Excludes current product
- Only renders if ≥ 1 related product exists

---

## 6. Real Condition Page

Standalone explainer page at `/real-condition`.

### Sections (in order):
1. **Hero** — ink zone, headline: `"Lo que ves es lo que llega."` Cormorant italic
2. **Program intro** — bone zone, 2–3 short paragraphs, Inter 400 13px
3. **Condition grades table** — all 5 grades with plain-language definitions
4. **Flaw level system** — 4-level visual with flaw bar component
5. **Photo standards** — 3 photo types (Editorial · Condición · Detalle) with placeholder images
6. **The guarantee** — centered callout, `"O te devolvemos tu dinero."` Cormorant italic
7. **WhatsApp CTA** — standard full-width

---

## 7. Mobile Behavior

| Element | Mobile behavior |
|---------|----------------|
| Nav | Hamburger → full-screen ink overlay, bone type, 3 links vertically centered |
| Hero | `aspect-ratio: 4/3` · headline `22px` max |
| Filter | Sticky `"Filtrar"` + `"Ordenar"` buttons → bottom-sheet |
| Filter chips | Horizontal scroll rail in bottom-sheet · no wrap |
| Product cards | 1-col stacked · image 72px wide left · info fills right |
| Gallery | Swipe between images · thumbnails horizontal scroll |
| WhatsApp CTA | Fixed to viewport bottom · `min-height: 52px` · safe-area padding |
| Bottom nav | 3 items: `Catálogo · Favoritos · Nosotros` · `42px` height |
| Modals | Slide up from bottom · `--rk-dur-slow` · `--rk-ease-out` |
| Lightbox | Full-screen · swipe to dismiss |
| Price | 32px (reduced from 42px) on mobile product page |

---

## 8. Responsive Breakpoints

```css
/* Mobile S  — default (no media query) */
/* Mobile L  */  @media (min-width: 480px)  { … }
/* Tablet    */  @media (min-width: 768px)  { … }
/* Desktop   */  @media (min-width: 960px)  { … }
/* Desktop L */  @media (min-width: 1280px) { … }
```

| Token | Breakpoint | Catalog | Page padding |
|-------|-----------|---------|--------------|
| Mobile S | `< 480px` | 1 col | 16px |
| Mobile L | `≥ 480px` | 2 col | 16px |
| Tablet | `≥ 768px` | 2 col | 32px |
| Desktop | `≥ 960px` | 3 col + featured | 72px |
| Desktop L | `≥ 1280px` | 3 col + featured | auto (max-width 1280px) |

---

## 9. Component Hierarchy

```
HomePage
├── Nav
├── ZoneInk
│   ├── HeroImage
│   └── HeroHeadline
├── ZoneBone
│   ├── SectionHeader ("Disponible ahora")
│   └── ProductCard × 3
├── CompleteTheFit
├── WhatsAppCTA (homepage variant)
└── Footer

CatalogPage
├── Nav
└── ZoneBone
    ├── CatalogHeader (count + sort)
    ├── SearchInput
    ├── FilterRail (desktop) | FilterButton (mobile)
    ├── FilterSheet (mobile — portal)
    ├── ProductCardFeatured
    ├── CatalogGrid
    │   └── ProductCard × n
    ├── EmptyState (conditional)
    └── LoadMoreButton | InfiniteScrollTrigger

ProductPage
├── Nav
├── ZoneInk
│   └── ProductGallery (hero + thumbs + lightbox)
├── ZoneBone
│   ├── ProductMeta (eyebrow + name + subtitle + price + sizes + status)
│   ├── RealConditionSection
│   │   ├── RCGStamp
│   │   ├── ConditionTable
│   │   ├── FlawMap (conditional)
│   │   └── AuthenticityBlock
│   ├── CompleteTheFit (conditional)
│   ├── RelatedProducts
│   └── WhatsAppCTA (full-width)
├── WhatsAppCTA (sticky mobile — portal)
├── WhatsAppDrawer (portal, conditional)
└── Footer
```

---

## 10. Product Data Structure

```typescript
interface Product {
  id:          string;          // "RK-0042"
  slug:        string;          // "jordan-1-chicago-us9"
  brand:       string;          // "NIKE"
  category:    string;          // "JORDAN"
  model:       string;          // "Air Jordan 1 Retro High OG"
  subtitle:    string;          // '"Chicago" 2022'
  size: {
    us:        number;          // 9
    eur:       number;          // 43
    cm:        number;          // 27
  };
  price:       number;          // 2800 (MXN, no decimals unless cents)
  status:      ProductStatus;
  condition:   ConditionGrade;
  flawLevel:   FlawLevel;
  flaws:       Flaw[];
  box:         BoxStatus;
  photos:      Photo[];
  pairing?:    string;          // RDecants product slug (optional)
  createdAt:   string;          // ISO 8601
  soldAt?:     string;          // ISO 8601, present when status = "sold"
  notes?:      string;          // internal curator note, not displayed
}

type ProductStatus   = "available" | "reserved" | "sold" | "pre-order";
type ConditionGrade  = "new" | "like-new" | "excellent" | "good" | "fair";
type FlawLevel       = "none" | "minor" | "visible" | "heavy";
type BoxStatus       = "original" | "replacement" | "none";

interface Flaw {
  id:          number;          // pin number on diagram
  location:    string;          // "Toe box izquierdo"
  severity:    FlawLevel;
  description: string;          // plain language
  photos:      string[];        // photo URLs, min 1
}

interface Photo {
  url:         string;          // WebP
  type:        PhotoType;
  alt:         string;
}
type PhotoType = "editorial" | "condition" | "detail" | "lifestyle";
```

---

## 11. Inventory States

| State | Status value | CTA | Card opacity | Grid position |
|-------|-------------|-----|-------------|---------------|
| Available | `available` | `"Preguntar por WhatsApp"` | 100% | Normal |
| Reserved | `reserved` | `"Unirse a la lista de espera"` | 100% | Normal |
| Pre-order | `pre-order` | `"Reservar mi par"` | 100% | Normal |
| Sold | `sold` | Hidden — show `"Ver similares →"` | 55% | Normal, `pointer-events: none` |

**Status pill colors:** see design system §10.

**Real-time update strategy (pre-API):**  
Poll `/api/products?ids={visible_ids}` every 60s while page is active. On status change, update pill and CTA without full page reload.

---

## 12. Empty States

| Trigger | Heading | Body | Action |
|---------|---------|------|--------|
| Filter returns 0 results | `"Sin pares con ese filtro."` | `"Intenta con otra talla o marca."` | `"Limpiar filtros"` chip |
| Size has no inventory | `"Sin pares en {size} por ahora."` | `"Te avisamos cuando lleguen."` | WhatsApp → reserved-size message |
| Search returns 0 | `"Sin resultados para '{query}'."` | — | `"Ver catálogo completo"` link |
| Catalog is empty | `"Catálogo en preparación."` | — | WhatsApp CTA |
| Related products = 0 | Section hidden entirely | — | — |

**Rules:**
- Never show illustrations or icons in empty states
- Text only: Inter 400 13px `--rk-t2` · centered
- Action: secondary button or DM Mono underline link
- Padding: `56px` vertical

---

## 13. Loading States

| Component | Skeleton dimensions | Notes |
|-----------|-------------------|-------|
| Product card (grid) | Image: full card width × 85% height · 3 text bars | Static, no shimmer |
| Product card (featured) | Image 200px × 148px · 4 text bars right | |
| Hero image | Full-width × aspect-ratio | `--rk-surface-2` bg |
| Price | `80px × 36px` inline | |
| Status pill | `72px × 20px` inline | |
| Condition table | 5 rows · each `100% × 36px` | |
| Gallery thumbs | 4 × `64px` squares | |

**Skeleton rules:**
- Background: `--rk-surface-2`
- Border-radius: matches replaced element
- No animation (no shimmer, no pulse)
- Replace immediately when data resolves

---

## 14. WhatsApp Inquiry Flow

### Message builder — `src/utils/whatsapp.js`

```javascript
const WHATSAPP_NUMBER = "529516513018"; // E.164 without +

function buildProductMessage(product) {
  const { id, model, size, condition } = product;
  const sizeStr = `US ${size.us}`;
  const condStr = conditionLabel[condition];      // "Like New", etc.
  return encodeURIComponent(
    `Hola, me interesa: ${id} · ${model} · ${sizeStr} · ${condStr}`
  );
}

function buildReservedMessage(product) {
  return encodeURIComponent(
    `Hola, quiero unirme a la lista de espera: ${product.id} · ${product.model} · US ${product.size.us}`
  );
}

function buildSizeNotifyMessage(size) {
  return encodeURIComponent(
    `Hola, quisiera que me avisen cuando tengan pares en talla US ${size}.`
  );
}

function openWhatsApp(message) {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}
```

### CTA click behavior by page

| Page | Click behavior |
|------|---------------|
| Homepage | `openWhatsApp(genericMessage)` directly |
| Product page (available) | Open `<WhatsAppDrawer>` with pre-filled message preview → confirm → `openWhatsApp` |
| Product page (reserved) | `openWhatsApp(buildReservedMessage(product))` directly |
| Catalog empty state (size) | `openWhatsApp(buildSizeNotifyMessage(size))` directly |

### WhatsApp drawer
- Portal rendered, slides up from bottom
- Shows pre-filled message as editable text
- Confirm CTA: primary button `"Abrir WhatsApp"`
- Cancel: `×` top-right · dismisses with slide-down animation
- Message is editable before sending (user can add details)
- On confirm: `openWhatsApp(editedMessage)`

---

## 15. Complete The Fit Flow

### Pairing data

```typescript
interface Pairing {
  sneakerSlug:    string;        // matches Product.slug
  fragranceName:  string;        // "Bleu de Chanel EDT"
  fragranceSlug:  string;        // RDecants product URL slug
  rationale:      string;        // "Clean, fresh, everyday — como el par."
}
```

Stored in `src/data/pairings.json` (pre-API).

### Render logic

- `<CompleteTheFit>` receives `sneakerSlug` as prop
- Queries `pairings.json` for a match
- If no match found: component renders `null` (hidden entirely)
- If match found: renders gold-accented ink block

### Component behavior

- RDecants link: `target="_blank" rel="noopener"` — opens RDecants product page
- Optional WhatsApp flow: if user taps "Preguntar por ambos", builds combined message:
  ```
  Hola, me interesan: {sneaker_id} · {model} · US {size} + {fragrance_name} de RDecants.
  ```
- The combined WhatsApp message bridges both brands in one conversation

### Rendering contexts

| Page | Behavior |
|------|----------|
| Product page | Full block with pairing + rationale + RDecants link + optional combined WhatsApp |
| Homepage | Compact teaser with one featured pairing — links to product page or RDecants |

---

## 16. Future API Integration Points

All static data is structured to map 1:1 to future R Supply OS API endpoints. Replace data layer without component changes.

| Current (static) | Future endpoint | Notes |
|-----------------|----------------|-------|
| `src/data/products.json` | `GET /api/products` | Filter params map to URL query string |
| `src/data/products.json` (single) | `GET /api/products/:id` | By slug or RK-ID |
| `src/data/pairings.json` | `GET /api/pairings?sneaker={slug}` | |
| Polling for status changes | `WS /api/inventory/updates` | WebSocket for live status |
| WhatsApp number constant | `GET /api/config` | Per-tenant config |
| `products.filter()` | Server-side filtering | Move when catalog > 200 items |
| Manual sort | `GET /api/products?sort=recent&brand=nike` | |

### Data shape compatibility

The `Product` interface in §10 is designed to be a direct subset of the R Supply OS inventory record. Fields align:

| RKicks field | R Supply OS field |
|-------------|------------------|
| `id` | `inventory.sku` |
| `status` | `inventory.availability_status` |
| `condition` | `inventory.condition_grade` |
| `flawLevel` | `inventory.flaw_level` |
| `flaws[]` | `inventory.condition_notes[]` |
| `price` | `inventory.retail_price` |
| `photos[]` | `inventory.media[]` |
| `pairing` | `inventory.ecosystem_links.rdecants_slug` |

### CRM integration point

When a WhatsApp inquiry is opened, emit an analytics event:

```javascript
analytics.track("whatsapp_inquiry_opened", {
  product_id:  product.id,
  model:       product.model,
  size_us:     product.size.us,
  status:      product.status,
  source:      "product_page" | "homepage" | "catalog",
});
```

This event feeds the R Supply OS CRM pipeline for lead tracking.

---

## Appendix — Reference files

| File | Purpose |
|------|---------|
| `docs/rkicks-design-brief.md` | Approved direction, rules, Do/Don't |
| `docs/rkicks-design-system.md` | CSS tokens, component specs |
| `RKicks Brand Identity.html` | Logo, wordmark, seal — visual reference |
| `RKicks Moodboard v2.html` | Approved visual direction |
| `docs/RKicks Design Brief.html` | Printable brief |

---

*RKicks · Part of R Supply · Engineering Handoff v1.0 · June 2026*
