# Nexforge — website

A single-page site in two languages (EN `/`, VI `/vi`) for a discreet Ho Chi Minh City
merchant bank. Built to the `nexforge-website-spec.md` brief and the
`NEXFORGE Brand Guidelines v1.3` design system, with the high-end craft of the reference
site (tuckersfarm.com) translated into Nexforge's restrained register.

## Quick look

Open **`preview.html`** in any browser — it is a fully self-contained build (compiled CSS
and JS inlined) and needs no server or build step. Use it to review the design and to
demo EN/VI.

## Project structure

```
nexforge-website/
├── preview.html            ← self-contained review build (generated; open this first)
├── package.json
├── tailwind.config.js      ← brand design tokens (colour named by role, type scale)
├── scripts/
│   └── build-preview.mjs   ← inlines dist CSS + app.js into preview.html
├── src/
│   ├── index.html          ← EN page (source of truth)
│   ├── vi/
│   │   └── index.html      ← VI page (transcreation, static per spec)
│   ├── css/
│   │   └── main.css        ← Tailwind entry + brand @layer (base/components/utilities)
│   ├── js/
│   │   └── app.js          ← smooth scroll · load fade · reveals · nav · bios · i18n
│   └── assets/
│       ├── fonts/          ← drop subsetted Archivo + Newsreader woff2 here to self-host
│       ├── img/            ← portraits (WebP, srcset) replace the SVG placeholders
│       └── favicon/
│           └── favicon.svg
└── dist/                   ← compiled output (css/main.css)
```

## Build

```bash
npm install
npm run build      # compile Tailwind -> dist/css/main.css, then rebuild preview.html
npm run watch      # recompile CSS on change during development
```

`npm run build` runs Tailwind (`tailwind.config.js`) then `scripts/build-preview.mjs`.
For production, serve `src/` (with `dist/css/main.css`) as static files, or copy into
`dist/`. No client-side routing, no runtime CDN.

## Design system (from Brand Guidelines v1.3)

**Colour** — named by role, not appearance:

| Token | Hex | Role |
|---|---|---|
| `forge` | `#2E2116` | Forge Umber — the voice; all body copy & structure |
| `terra` | `#6B4F35` | Terra Umber — secondary text |
| `ochre` | `#D9A526` | Kiln Ochre — the accent, used almost nowhere |
| `paper` | `#F4EFE6` | Paper — the ground |
| `card`  | `#FCFAF5` | Paper-lift — cards/tables only |
| `bark` `clay` `sand` `linen` | `#4A3A2B` `#8A7660` `#B3A28B` `#D5C9B6` | earth neutrals — heads, labels, rules, hairlines |

**Type** — Archivo (house grotesque, headings 600 / body 400) + Newsreader (editorial
serif, the single sustained passage). Scale and tracking map the guidelines' print scale
to screen. Vietnamese diacritics tested including `Vũ Thành Lê` and `₫`.

**Motion** — one fade-in on load; short, once-only reveals as sections enter; weighted
momentum scroll (Lenis). Everything collapses to nothing under `prefers-reduced-motion`.

## Before launch — client to supply

- Portraits: real colour photos of Vũ Thành Lê and Kelly Wong are in `src/assets/img/` (`le.webp`, `kelly.webp`), cropped 4:5. For strict brand consistency the guidelines suggest B&W / restrained duotone and one photographer; kept in colour here per client request. Swap in final same-photographer shots when available.
- Registered entity name, enterprise registration number, registered address (footer placeholders).
- Professional Vietnamese transcreation review of `src/vi/index.html` (current copy is a strong first pass, not a substitute for a native business writer).
- Self-host fonts: subset Archivo + Newsreader with the Vietnamese range, drop into `src/assets/fonts/`, and uncomment the `@font-face` block in `src/css/main.css` (then remove the Google Fonts `<link>`).
- Domain `nexforge.vn`, mailbox `hello@nexforge.vn`, force HTTPS, add an OG image + favicon.
