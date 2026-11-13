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
| `assets/js/main.js` | Menu, problem finder and gas safety mode (no libraries) |
| `assets/js/quote.js` | Request-a-visit journey: steps, validation, review, demo submit |
| `assets/css/services.css` | Services spec sheet and shared section headings |
| `assets/css/quote.css` | Request journey: progress, fields, option cards, errors, review |
| `assets/fonts/` | Self-hosted Inter and JetBrains Mono (SIL Open Font License; licence files included) |
| `docs/review/milestone-1/`, `milestone-2/` | Screenshots used for design review |

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

## Milestone 2 — services and request journey

### Gas safety mode (safety fix)

Choosing **I smell gas** switches the whole page into safety mode (`html.is-safety`):

- Every plumbing sales action is marked `data-sales` and hidden: header Emergency call, hero call button, finder call/request buttons, services Request buttons, nav "Request a visit", the phone action bar and the whole request form.
- Safety controls (`data-safety-only`) appear instead: amber "Gas safety steps" in the header (desktop) and phone action bar, and a paused-form notice in the request section.
- The gas guidance stays on screen. The only way out is a deliberate choice: "I chose this by mistake", "Exit", or picking a different problem.
- Gas is never passed to the request form, and the form has a "Smell gas?" link that switches safety mode on.

### Services — "Scope of work"

A ruled spec sheet (reference code, service, common signs, Request) instead of cards. Six service lines; no prices, licences, guarantees, response times or reviews. Each Request button opens the form with that problem filled in.

### Request a visit — 4 steps

1. **Problem and urgency** (required). Pre-filled from the problem finder or services, with a notice saying where it came from. Choosing "Urgent" shows advice to shut off the water and call.
2. **Description** (optional, 600 characters, live counter).
3. **Contact**: name (required), preferred method (call / text / email), phone and email. The method decides which is required; anything filled in is format-checked. A button fills fictional test details.
4. **Review** with Edit links back to each step, then **Submit demo request** → confirmation.

Accessibility: each step has a focused heading; errors appear inline (linked with `aria-describedby`, `aria-invalid`) and in a summary at the top that receives focus and links to each field. Errors update live once a step has been attempted. Radio options are real radio buttons (arrow keys work). Inputs use 16 px text so phones don't zoom. The phone action bar hides while typing.

### Demo mode — what a real client needs before launch

The form **sends and stores nothing**: no network request, cookie or browser storage, and answers are cleared on submit (verified in testing). Without JavaScript the form is hidden, so data can never end up in a URL.

Before a real client goes live, someone must:

1. Agree with the client where requests go (email inbox, CRM, or both) and get written approval.
2. Replace `onSubmit()` in `assets/js/quote.js` with that integration, sending over HTTPS.
3. Add a privacy notice explaining what is collected and why, and how long it's kept.
4. Add spam protection.
5. Send test requests end to end and confirm the client receives them before launch.
6. Remove the demo notices and the "fill with test details" button.

### Milestone 2 tests (headless Chrome, 1440 px desktop, 1024 px laptop, 390 px phone)

- Safety: 10 sales actions visible normally, 0 in safety mode; no phone links visible; safety controls shown; gas steps visible; exit restores everything and returns focus to the gas tile; form's "Smell gas?" link enters safety mode; phone action bar and menu show only safety items.
- Carry-over: finder selection and finder/service Request buttons pre-fill the problem and show the source notice.
- Validation: empty required fields, invalid phone and invalid email produce the right inline and summary messages; summary links focus the field; errors clear live; method changes Required/Optional labels.
- Navigation: Continue/Back/Edit move between steps with focus on the step heading; review shows all answers; submit shows confirmation, clears every field; restart returns to step 1.
- Privacy: 0 network requests during the journey; no cookies or local/session storage; URL unchanged.
- Keyboard-only journey (Tab, Space, arrow keys, Enter) with visible focus rings.
- Reduced motion: step animation off; with motion allowed it runs once.
- No horizontal scrolling at 961–1440 px or on phones; no JavaScript console errors; typography audit (6 widths) still clean; no-JS shows a message instead of the form.
