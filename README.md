# RKicks Web — Frontend Prototype

Premium sneaker boutique. Part of the R Supply ecosystem.

## Stack

| Tool | Version | Role |
|------|---------|------|
| Next.js | 15.5.19 | Framework — App Router, SSG |
| React | 18.3.1 | UI runtime |
| TypeScript | 5.9.3 | Type safety |
| CSS Modules + CSS custom properties | — | Styling — no Tailwind, no UI libraries |

## Architecture

- **Routing:** Next.js App Router — file-based, maps 1:1 to `/`, `/catalogo`, `/producto/:slug`, `/real-condition`
- **Data:** Static JSON in `data/` — drop-in replacement for R Supply OS API (field names aligned per engineering handoff §16)
- **Styling:** All design decisions live in `src/styles/tokens.css` as `--rk-*` CSS custom properties. Component styles are CSS Modules that consume those tokens.
- **Images:** WebP expected at `/public/images/products/`. Component-level fallback while real photos are pending.

## Design system

All visual decisions are derived from these three documents (do not override):

- `docs/rkicks-design-brief.md` — brand strategy, rules, Do/Don't
- `docs/rkicks-design-system.md` — CSS tokens, component specs
- `docs/rkicks-engineering-handoff.md` — routes, component hierarchy, data shape, WhatsApp flow

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run type-check # tsc --noEmit
npm run build      # production build
```

## Pages

| Route | Page |
|-------|------|
| `/` | Homepage — ink hero + bone inventory |
| `/catalogo` | Catalog — search, filters, product grid |
| `/producto/:slug` | Product page — gallery, condition, WhatsApp CTA |
| `/real-condition` | Real Condition Guarantee explainer |
| `/nosotros` | About |

## Product images

Place WebP product photos in `/public/images/products/` following the naming convention in `data/sneakers.json` (e.g. `rk0001-editorial.webp`, `rk0001-condition.webp`). Components display a styled placeholder until real images are added.

## WhatsApp

Update `WHATSAPP_NUMBER` in `src/utils/whatsapp.ts` with the actual E.164 number (e.g. `5215512345678`).
