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

- **Inter** (body) and **JetBrains Mono** (spec labels) are self-hosted.
- **Archivo** (wide headline face) loads from Google Fonts. If it can't load, a self-hosted stand-in (Inter Display Black) is used. Review screenshots in `docs/review/milestone-1/` show the **stand-in**, because Google Fonts was unreachable from the build environment. Archivo is wider, so headlines will look broader in a normal browser.

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

### Tests run for this milestone (headless Chrome)

Desktop 1440×900, phone 390×844 and reduced-motion renders; tile selection and deselection; only one panel visible at a time; gas panel contains no call or request links; mobile menu opens and closes with Escape; phone panel scrolls into view after selection; keyboard Tab order and Enter selection; no horizontal scrolling; tap targets ≥ 44 px; no JavaScript errors; all panels visible with JavaScript disabled.
