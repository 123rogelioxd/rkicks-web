# Hero sneaker visual

Drop the homepage hero photo here:

```
public/images/hero/rkicks-hero-jordan.jpg
```

The homepage hero (`src/app/page.tsx`) references this exact path via a CSS
`background-image`. **No image is committed** — the build does not generate or
require one.

## Fallback behavior
If the file is absent, the `.heroImage` element simply renders transparent and
the existing dark gradient hero (`.heroBg`) shows through. Nothing breaks and
the static export still succeeds.

## Recommended asset
- Subject: Air Jordan 1 Retro style, red/white or blue/white colorway
- Framing: large editorial crop, premium boutique feel (not marketplace)
- Background: dark, with soft shadow/contrast so it blends into the ink hero
- Format: `.jpg` (or `.webp`); wide enough for the right ~58% of a 1280px hero
- Orientation: landscape works best on desktop; the mobile layer uses it as a
  full-bleed background behind a dark scrim, so keep the main subject roughly
  centered.

To use a different filename, update the `backgroundImage` URL in
`src/app/page.tsx`.
