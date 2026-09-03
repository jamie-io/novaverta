# NovaVerta Static Website Redesign

## Goal

Create two modern, comparable static website directions for Phönix / Nova Verta Deutschland using the supplied brand assets and business copy.

## Direction

Both directions share a dark navy, steel blue, ice, and signal-orange visual system. Typography is editorial and technical: a high-contrast display face for headings, a readable sans-serif for body copy, and small uppercase labels for engineering-style metadata. The supplied Phönix and Nova Verta marks stay prominent, while the real paint-booth imagery supplies credibility.

## Version A: multi-page refresh

Keep `index.html`, `verkauf.html`, `montage.html`, and `service.html` as separate pages. Use one shared header/nav/footer pattern, a homepage with a cinematic image hero and service cards, and detail pages with clear section navigation, image-backed feature panels, and a contact CTA.

## Version B: one-page comparison

Add `one-page.html` as a complete long-form landing page. It contains anchored sections for overview, sales, installation, service, capabilities, and contact, allowing the user to compare a more focused conversion path with the multi-page version.

## Constraints

- Static HTML, CSS, and vanilla JavaScript only.
- No Bootstrap, Swiper, Wayback Machine scripts, CDN assets, or framework dependencies.
- Use only local assets already in `img/`.
- Preserve the existing company facts and service copy.
- Responsive at mobile, tablet, and desktop widths.
- Include keyboard-accessible navigation, visible focus states, alt text, and reduced-motion support.

## Verification

Use a dependency-free Node smoke test to confirm required pages/assets exist, internal links resolve, and no archived/external runtime dependencies remain. Manually inspect the pages in a local browser at desktop and mobile sizes.
