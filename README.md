# Phönix / Nova Verta Website Concepts

This repository contains two static website directions for comparison.

## Which is which?

### `multi-page/`

The traditional website structure with separate pages:

- `multi-page/index.html` — homepage
- `multi-page/verkauf.html` — sales and new installations
- `multi-page/montage.html` — installation and relocation
- `multi-page/service.html` — maintenance, repairs, parts, and filters

### `one-page/`

The focused long-form landing page:

- `one-page/index.html` — all major content on one scrollable page

## Shared files

- `img/` contains the original brand logos and supplied photography.
- Each version has its own `css/site.css` and `js/site.js` so either folder can be deployed independently while using the shared image library.

## Preview locally

From the repository root, run:

```sh
python3 -m http.server 8099
```

Then open:

- `http://localhost:8099/multi-page/`
- `http://localhost:8099/one-page/`

The site uses only HTML, CSS, and vanilla JavaScript.
