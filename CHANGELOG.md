# FL Cleanup — Changelog

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
