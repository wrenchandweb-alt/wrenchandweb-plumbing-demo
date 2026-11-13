# Development notes

## Milestone 1 — navigation, hero, problem finder

Built: premium responsive navigation (desktop links, mobile full-screen menu, phone action bar), the hero, and the interactive problem finder. Nothing else yet: other navigation items are marked **Soon** and do not link anywhere.

### Files

| Path | Purpose |
|---|---|
| `index.html` | Page markup: demo notice, navigation, hero, problem finder |
| `assets/css/base.css` | Design tokens (colours, type, spacing), fonts, buttons, accessibility helpers |
| `assets/css/nav.css` | Header, mobile menu, phone action bar |
| `assets/css/hero.css` | Hero layout, technical drawing, entrance motion |
| `assets/css/finder.css` | Problem finder tiles, guidance panels, safety panel |
| `assets/js/main.js` | Menu behaviour and problem finder (no libraries, ~4 KB) |
| `assets/fonts/` | Self-hosted Inter and JetBrains Mono (SIL Open Font License; licence files included) |
| `docs/review/milestone-1/` | Screenshots used for design review |

### Technology note (deviation from the approved plan)

The approved stack is **Astro**. Package downloads were blocked in the build environment, so Astro could not be installed. Milestone 1 is written as plain HTML, CSS and JavaScript — the same kind of output Astro produces — so it can move into an Astro project without redesign once package installs are possible.

### Fonts

All fonts are self-hosted in `assets/fonts/`; the page makes no requests to Google Fonts or any other third party.

- **Archivo Expanded** (headlines, logo) — weights 800 and 900, taken from the official Archivo source repository (github.com/Omnibus-Type/Archivo) and trimmed to Latin characters. Licence: `LICENSE-Archivo-OFL.txt`.
- **Inter** (body text) — 400, 500, 600.
- **JetBrains Mono** (spec labels) — 400.

All three are under the SIL Open Font License 1.1, which allows use, bundling and redistribution on websites, including commercial ones; the licence file must stay with the fonts.

### Typography rules

- No visible text below 12 px at any screen width (the "C/V" logo monogram is the only exception).
- Text contrast meets WCAG AA (4.5:1, or 3:1 for large text), including the greyed-out "Soon" navigation items.
- The hero headline scales with the screen and was measured to fit from 360 px phones to 1440 px desktops.
- Drawing labels are hidden on small phones, where they would render below 8 px; the drawing stays as a visual.

### Demo and honesty rules applied

- Orange demo bar at the top of every page; "Demo" in the logo lockup; `noindex` so search engines skip it.
- Phone number (713) 555-0142 is in the range reserved for fictional use and is labelled as not connected.
- No reviews, licences, guarantees, response times or awards are claimed.
- "Request a visit" buttons are visibly disabled until the request form is built.
- **Gas smell** shows safety instructions only (leave, call 911 or the gas company from outside). It has no sales buttons.

### Accessibility and motion

- Skip link, visible keyboard focus, buttons with `aria-pressed`, labelled regions, live region for guidance.
- All animation stops when the visitor's device requests reduced motion.
- Works without JavaScript: all guidance panels are shown in order.

### How to view the page

1. On GitHub, open the repository and choose **Code → Download ZIP**.
2. Unzip it (on a Chromebook: open the ZIP in the Files app and copy the folder out).
3. Double-click `index.html` to open it in Chrome.

### Refinement pass (after design review)

- Archivo bundled locally; Google Fonts request removed.
- Small labels raised to 12 px minimum; disabled navigation contrast raised from 3.7:1 to AA.
- Hero drawing moved beside the intro text so it never sits under the headline; empty space cropped; pipe ends fade out; labels enlarged. Motion unchanged (one light pulse and the gauge needle, on load only).
- Small laptops (961–1199 px): navigation shows only live links so it stays on one row.
- Logo name kept on one line on phones.

### Tests run for this milestone (headless Chrome)

Desktop 1440×900, phone 390×844 and reduced-motion renders; tile selection and deselection; only one panel visible at a time; gas panel contains no call or request links; mobile menu opens and closes with Escape; phone panel scrolls into view after selection; keyboard Tab order and Enter selection; no horizontal scrolling; tap targets ≥ 44 px; no JavaScript errors; all panels visible with JavaScript disabled. Typography audit at 1440, 1280, 1024, 768, 390 and 360 px: Archivo loaded, headline fits, no text under 12 px, no contrast failures, no failed network requests.
