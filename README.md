# Phönix Industriedienstleistungen GmbH — Website

Static website for **Phönix Industriedienstleistungen GmbH**, Bitterfeld-Wolfen —
Generalimporteur for NOVA VERTA paint booths and drying systems in Germany.

Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no runtime
dependencies. Copy the repository onto any web host and it works.

## Two versions to choose from

| | Where | Look |
| --- | --- | --- |
| **A — modern** | repository root (`/`) | Dark industrial. Full-bleed photography, large type, blue accent sampled from the logos. A clear break from the old site. |
| **B — klassisch** | `klassisch/` | Close to the original novaverta-deutschland.de: blue navbar, grey page with white boxes, uppercase navy headings, image slider, `MEHR` squares. Leads with who the company is, what it does and where to find it. |

Both share `img/`, both carry the same content and contact details, and both are
independently deployable. Whichever wins, promote it by moving its files to the
root — version B's asset paths then need `../img/` changed to `img/`.

Version B's footer links across to version A so the two can be compared. **Remove
that "Moderne Variante ansehen" link before going live.**

### Where version B differs in substance

The client asked that visitors immediately see that the business is active, what
it does, and where to find it. So version B additionally has:

- a phone number in the header, in the navbar, and in a blue band on every page;
- a "Herzlich willkommen" section stating plainly that the company is operating
  and reachable;
- a four-card **So erreichen Sie uns** block on the homepage — address, phone,
  opening hours, named contact — instead of only in the footer;
- opening-hours fields (currently placeholders, see below).

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Homepage — services, applications, reasons to choose the company |
| `verkauf.html` | Sales: new systems, modernisation, ergonomics, used equipment |
| `montage.html` | Installation: new builds, accessories, relocations, other makes |
| `service.html` | Maintenance, repair, spare parts, filter service, operator duties |
| `kontakt.html` | Contact details and enquiry form |
| `impressum.html` | Imprint (§ 5 DDG) |
| `datenschutz.html` | Privacy policy (GDPR) |

`klassisch/` holds the same seven pages with its own `css/site.css` and
`js/site.js`. Images are shared from `img/` in both versions.

## Preview locally

```sh
python3 -m http.server 8099
# then open http://localhost:8099/
```

Opening `index.html` directly via `file://` also works.

## Verify

```sh
node test/site-smoke.mjs
```

Checks **both versions** (14 pages): every page exists, every internal link and
anchor resolves relative to its own directory, every asset is present and is a
real image, every `<img>` has `alt` plus intrinsic dimensions, every form control
has a label, and no external script, font or CDN reference has crept back in.

## Before this goes live

These items need the client's input — they are marked in the pages with a
highlighted `[placeholder]`:

1. **`impressum.html`** — register court and HRB number are missing. A GmbH must
   state both under § 5 DDG.
2. **`datenschutz.html`** — name and address of the hosting provider, the log
   file retention period, and the publication date.
2b. **Opening hours** — version B shows `Mo – Do` and `Freitag` as placeholders
   on the homepage and contact page. Fill them in or delete the card; "where to
   find him" was the client's own priority, so leaving it blank undercuts it.
3. **Contact form** — `kontakt.html` posts to `mailto:` so it works on plain
   static hosting without a backend and without sending anything to a third
   party. It opens the visitor's mail client, which is reliable but unpolished.
   To get a normal form instead, point `<form action="…">` at a form endpoint or
   a small PHP script on the host, and update section 5 of the privacy policy to
   describe where the data goes.
4. **Logo** — the supplied `img/logo.png` is 292 × 101 px with an opaque white
   background. The light knock-outs used on the dark layout (`img/logo-light.png`,
   `img/logo-mark-light.png`, `img/novaverta-light.png`) were derived from it, but
   a vector original (SVG or EPS) would render noticeably better, especially on
   high-DPI screens.
5. **Photography** — see the note below.

## Notes on the assets

- `img/slide/*.jpg` are 2000 × 500 banner crops recovered from the old site. The
  layout uses them as full-width panorama bands, which is their natural shape;
  they are not suitable for tall hero images.
- `img/verkauf.jpg`, `img/montage.jpg` and `img/service.jpg` are 740 × 367. They
  are used at that aspect ratio so nothing is cropped or upscaled.
- `img/neuanlagen.jpg` is **not an image** — it is a saved Wayback Machine error
  page with a `.jpg` extension. It is unused and can be deleted.
- Higher-resolution photography would be the single biggest visual improvement.

## Design decisions worth knowing

- **Version B is reconstructed from the original's own stylesheet.** The archived
  `css/styles.css` (Wayback capture of 21 Jan 2022, still in git history at
  commit `ff10243`) supplied the real palette — `#006eb3` blue, `#2c367b` navy,
  `#f4f4f4` grey — plus the uppercase wide-tracked headings, the 6px blue rules,
  the 130px `MEHR` squares and the 10°-rotated `quad` accents that echo the
  slashes in the Phönix wordmark. It was rebuilt without Bootstrap, Swiper or
  jQuery; the slider is about 60 lines of vanilla JavaScript.
- **PT Sans** was the original typeface. It is not bundled here — adding the OFL
  `woff2` files to `klassisch/css/` and an `@font-face` rule would reproduce the
  original text colour exactly. Until then the stack falls back to Trebuchet MS
  and the system UI face. Do not load it from Google Fonts (see below).
- **No Google Fonts, no CDN.** Embedding Google Fonts loads the visitor's IP
  address to a third party, which German courts have treated as a GDPR breach
  (LG München I, 3 O 17493/20). The site uses the operating system's own UI font
  for headings and body, and a monospace face for the small technical labels, so
  nothing leaves the host.
- **Colours come from the logos.** The blue accent is sampled from the Phönix
  bars and the Nova Verta diamond rather than invented.
- **JavaScript is enhancement only.** With scripts disabled, every page still
  renders completely; only the sticky-header state, the mobile menu and the
  scroll reveals are lost. The mobile menu falls back to nothing, so keep the
  primary navigation reachable — it is repeated in the footer.
- **Accessibility.** Skip link, visible focus rings, labelled form controls,
  `aria-current` on the active nav item, and full `prefers-reduced-motion`
  support (all animation and reveal transitions are disabled).
