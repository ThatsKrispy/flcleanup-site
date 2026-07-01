# FL Cleanup — Changelog

## 2026-07-01 — Contact form: 100% Cloudflare-native email (no third party) (ThatsKrispy)

- Replaced the Resend-based Pages Function with a fully Cloudflare-native email
  Worker (`worker/`). Cloudflare's built-in `send_email` binding delivers the
  lead notification through Cloudflare's own mail infrastructure — no external
  service, no API key. Sending to a verified Email Routing destination is free
  on any plan. Removed `functions/api/contact.js`.
- The Worker validates, honeypot-guards, and emails each lead (Reply-To set to
  the customer). Deployed via `wrangler deploy`; a Worker route at
  `flcleanup.com/api/contact*` lets the existing form post same-origin with no
  front-end change. Worker source is hidden from the public site via `_redirects`.
  ACTION REQUIRED (one-time, all free): (1) enable Email Routing on flcleanup.com,
  (2) add + verify your real inbox as a Destination address, (3) put that address
  in `worker/wrangler.toml` (both `send_email` and `LEAD_TO`), (4) `npx wrangler
  login` then `npx wrangler deploy` from `worker/`, (5) uncomment the route.

## 2026-07-01 — Mobile overflow fix + working contact form (ThatsKrispy)

- Fixed mobile horizontal overflow ("page pulled wider"). Several sections used
  inline two-column grids with fixed-pixel columns (e.g. `1fr 400px`, `1fr 380px`,
  `1fr auto`) across the homepage, contact, services, odor, and post-construction
  pages. Inline styles can't be overridden by the class-based media queries, so
  those columns never collapsed and forced the layout past the viewport. Added a
  single `[style*="grid-template-columns"]{...!important}` rule (≤768px) that
  collapses every inline grid to one column on mobile, plus `overflow-x:clip` on
  `body`, wrapping for full-width button labels, and trimmed the contact form's
  card padding on small screens.
- Wired the contact form to a real destination. It previously had an empty
  `data-endpoint` and went nowhere. Added a self-hosted Cloudflare Pages Function
  (`functions/api/contact.js`) that validates, blocks spam via a honeypot, and
  emails each lead to contact@flcleanup.com — no third-party form dashboard. The
  form now posts to `/api/contact`; "Send a Message" CTAs jump to the form anchor.
  (Superseded same day — the Resend Pages Function was replaced by a native
  Cloudflare email Worker; see the entry above.)


## 2026-06-30 — More real team/company photos throughout (ThatsKrispy)

- Rolled the real FL Cleanup team photos (sourced from the live site, optimized to
  WebP) across more pages via a reusable captioned photo band:
  homepage (dispatch team — "you reach James and his team directly"),
  contact (full crew — "when you call you reach our real Florida crew"),
  services (crew with restoration equipment), and post-construction (crew on the
  job site). All lazy-loaded with descriptive alt text.


## 2026-06-30 — Free Inspection CTAs to online booking widget (ThatsKrispy)

- Repointed all "Free Inspection / Request Appointment / Schedule" CTAs site-wide
  (38 buttons across 9 pages) from the contact-form anchor to the real online
  booking widget (links.blueprintpathway.com/...), opening in a new tab. The
  contact page and its form remain reachable via the Contact nav.


## 2026-06-30 — Odor Stripe checkout + real team & customer photos (ThatsKrispy)

- The live site's odor page uses a Stripe checkout for purchase; our rebuilt page
  only had call/contact buttons. Wired the real Stripe link
  (buy.stripe.com/...) into the odor page's "Purchase & Schedule — $997" CTAs.
- Showcased the real team: added the FL Cleanup crew photo (in front of the
  branded truck) to the homepage "Not a franchise. Your neighbors." section, and
  replaced the three review letter-avatars with the actual customer photos
  (Kevin, Alexa, Carlos). All optimized to WebP and lazy-loaded.


## 2026-06-30 — Mobile: fix bottom overflow / page expansion (ThatsKrispy)

- Footer legal links were a non-wrapping flex row; with the added "Cookie
  Settings" link they overflowed the screen on phones and caused horizontal
  scroll ("page expansion"). Added flex-wrap so they wrap cleanly.
- Added `overflow-x:clip` on <html> as a global guard against horizontal scroll
  (clip preserves the sticky header, unlike overflow:hidden).
- Constrained the floating "Call" bar to max viewport width so it can't overflow
  on narrow phones, and reserved footer bottom padding on mobile so the fixed CTA
  no longer covers the footer's bottom content.


## 2026-06-30 — Auto-updating footer year (ThatsKrispy)

- Footer copyright year now updates automatically via JS (`#footer-year`), with a
  static 2026 fallback in the HTML for crawlers and no-JS visitors.


## 2026-06-30 — Footer year + agency credit (ThatsKrispy)

- Updated footer copyright to © 2026 and added a "Site by ThatsKrispy" credit
  (linking to thatskrispy.com) across all pages.


## 2026-06-30 — Legal pages, consent management & ADA widget hardening (ThatsKrispy)

- Created dedicated **Privacy Policy, Cookie Policy, and Terms of Service** pages
  (/privacy-policy/, /cookie-policy/, /terms-of-service/) and repointed every
  footer, consent-banner, and form legal link to them site-wide. Removed the
  inline legal sections from the Contact page and added the three pages to the
  sitemap. The old /contact/#privacy-style anchors are gone.
- **Consent management:** accept/decline handlers are now always attached, and a
  new "Cookie Settings" control (in the footer and on the policy pages) reopens
  the banner so visitors can change their choice at any time. Analytics (GTM)
  still load only after consent.
- **ADA widget fixes:**
  - "High Contrast" was broken — the `.high-contrast` class had no CSS. Added a
    real high-contrast theme (true-black background, white text/borders,
    underlined links, button outlines).
  - Larger Text, High Contrast, and Extra Spacing now **persist across pages and
    reloads** (localStorage) and re-apply on load.
  - Toggles now update `aria-pressed` correctly (the widget itself is now
    accessible).


## 2026-06-30 — Fix stretched footer logo (ThatsKrispy)

- The logo PNG is square (1080×1080) but was declared at ~2.9:1 (width 140 ×
  height 48) and the footer rule lacked `width:auto`, so the footer logo rendered
  horizontally crushed. Added `width:auto` to the footer logo and corrected the
  width/height attributes to 1:1 site-wide (header and footer).


## 2026-06-30 — Folded service areas into Services, removed standalone page (ThatsKrispy)

- Removed the standalone /florida-service-area/ page — the interactive map and
  long county/city lists felt off and added little. 301-redirected the URL to
  /services/ and repointed the "Service Areas" nav and footer links to a new
  /services/#service-area anchor.
- Added a minimal "Serving all of Florida" coverage section to the Services page:
  six region chips and a statewide call CTA. No map, no county lists.
- Moved the LocalBusiness areaServed schema onto the Services page so the local
  SEO signal is kept without a dedicated page.
- Removed the now-unused map/region CSS from the stylesheet; updated the sitemap.


## 2026-06-30 — Service-areas rebuild + homepage imagery (ThatsKrispy)

Built on top of the emoji-removal / brand-flare pass — kept the white-line SVG
icon style; no colorful emoji introduced.

Service areas (/florida-service-area/):
- Rebuilt from a thin county list into a high-value local-SEO + conversion page.
- Custom, on-brand interactive SVG map of Florida with six color-coded,
  clickable and keyboard-accessible region pins that jump to each region's
  section, plus a matching region link list for mobile and accessibility.
- New sections: "statewide but local" response cards, enriched per-region copy
  with internal links to service pages, an "If disaster strikes — what to do
  right now" emergency guide, and a service-area FAQ.
- SEO: stronger title/description, one H1 with H2/H3 structure, internal
  interlinking, LocalBusiness areaServed schema (counties + state), FAQPage schema.
- Honest copy only — no fabricated guarantees; response messaging avoids
  specific time promises.

Homepage:
- Replaced the two remaining icon placeholders in the services grid with real
  photos — Odor Treatment now shows whole-home CIO₂ fogging; Large Loss shows
  commercial decontamination (new WebP, lazy-loaded).


## 2026-06-29 — Unused asset cleanup (ThatsKrispy)

- Removed the entire `wp-content/uploads/elementor/` folder (leftover Elementor
  CSS + ~64 local Google Font files that no page loads — fonts come from Google's
  CDN) and all orphaned WordPress image sizes/screenshots. 142 files removed.
- `wp-content/uploads` shrank from ~29 MB to ~2.6 MB. Only the 10 images the live
  pages actually reference remain.

## 2026-06-29 — Dark-theme cleanup pass (ThatsKrispy)

Context: the site was migrated to the "Dark Shield" dark theme. The stylesheet
and homepage were rebuilt for dark, but the inner pages kept leftover light-mode
inline styles and referenced CSS classes that no longer existed. This pass fixes
the resulting visibility/contrast bugs and tightens performance, SEO, and the
contact form — without changing the design direction, content, or structure.

### Fixed — broken / invisible elements
- **Missing CSS classes restored.** `.trust-bar` (the colored brand rail under
  the hero on every page) and `.btn-white` / `.btn-line-white` (the primary CTA
  buttons on the dark gradient strips) were referenced in markup but never
  defined, so the rail was invisible and those CTAs rendered unstyled. Added
  rules in `assets/css/main.css`.
- **White-on-white text eliminated.** Contact page form card and the location /
  email / hours info cards were still `background:#fff` with near-white (`--paper`)
  headings — effectively invisible. Converted to dark panels.
- **Gray-on-gray text eliminated.** Services "CIO₂ Odor Treatment" promo box, the
  CIO page "What CIO₂ Treats" chips, and the post-construction "Who this is for"
  box used `background:var(--mist)` with `--mist` text. Converted to dark panels
  with readable text.
- **Blog cards** were white with near-white titles — converted to dark panels.
- **Invisible / low-contrast buttons.** Services Commercial CTA was white-on-white;
  the Mold / Fire / Storm CTAs and the numbered step circles used white text on
  light orange/green/cyan fills. Switched to dark text on bright fills to match
  the design system's button rules (blue fills keep white text).

### Added
- **Contact form success & error states.** Client-side validation with inline
  field errors (name, phone, email format) and a success/error status message
  (`assets/js/main.js`). The form reads an optional `data-endpoint` attribute so a
  delivery service can be connected without code changes. **Action needed:** set a
  form endpoint (Formspree / Web3Forms / Cloudflare) so submissions reach the inbox.
- **`og:image` + Twitter card** meta tags on every page for proper link previews.

### Performance
- Converted the two largest in-use images to compressed WebP with SEO-friendly
  names: owner photo 1.15 MB → 61 KB, water-damage photo 1.13 MB → 460 KB.

### Privacy / consent
- Removed the `<noscript>` Google Tag Manager iframe that loaded before consent.
  GTM now loads only after the visitor accepts cookies (JS path was already gated).

### Misc
- Updated `theme-color` from the old light brand blue (`#085AA4`) to the dark UI
  background (`#070B10`) across all pages.

### Flagged (not changed — needs your input)
- **Form delivery endpoint** must be connected (see above).
- **Unused assets:** the repo carries leftover Elementor CSS and ~64 local Google
  Font `.woff2` files that aren't referenced (fonts load from Google's CDN). Safe
  to delete for a lighter repo — left in place pending confirmation.
- **Blog "Read more"** links all point to `/contact/`; there are no individual
  post pages yet.
