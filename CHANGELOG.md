# FL Cleanup — Changelog

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
