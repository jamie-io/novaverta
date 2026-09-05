#!/usr/bin/env node
/* Dependency-free structural check of the static site.
   Run from the repository root:  node test/site-smoke.mjs          */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const NAMES = [
  'index.html', 'verkauf.html', 'montage.html',
  'service.html', 'kontakt.html', 'impressum.html', 'datenschutz.html',
];

/* Version A lives at the root, version B ("klassisch") in its own folder and
   shares the image library via ../img/. */
const VERSIONS = ['', 'klassisch'];
const PAGES = VERSIONS.flatMap((dir) => NAMES.map((n) => (dir ? `${dir}/${n}` : n)));

const failures = [];
const fail = (page, msg) => failures.push(`${page}: ${msg}`);

const attrs = (html, tag, attr) => {
  const re = new RegExp(`<${tag}\\b[^>]*?\\b${attr}="([^"]*)"`, 'gi');
  return [...html.matchAll(re)].map((m) => m[1]);
};

/* Every page must exist before anything else is worth checking. */
for (const page of PAGES) {
  if (!existsSync(join(root, page))) fail(page, 'page is missing');
}
if (failures.length) {
  console.error('FAIL\n' + failures.map((f) => '  - ' + f).join('\n'));
  process.exit(1);
}

for (const page of PAGES) {
  const html = readFileSync(join(root, page), 'utf8');

  /* --- document basics --- */
  if (!/<html lang="de">/.test(html)) fail(page, 'missing lang="de"');
  if (!/<meta name="viewport"/.test(html)) fail(page, 'missing viewport meta');
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) {
    fail(page, 'missing or too-short meta description');
  }

  const titles = [...html.matchAll(/<title>([^<]+)<\/title>/g)];
  if (titles.length !== 1) fail(page, `expected 1 <title>, found ${titles.length}`);

  const h1s = [...html.matchAll(/<h1[\s>]/g)];
  if (h1s.length !== 1) fail(page, `expected exactly 1 <h1>, found ${h1s.length}`);

  /* --- accessibility --- */
  const imgTags = html.match(/<img\b[^>]*>/g) ?? [];
  for (const tag of imgTags) {
    if (!/\balt="/.test(tag)) fail(page, `<img> without alt: ${tag.slice(0, 80)}`);
    if (!/\bwidth="/.test(tag) || !/\bheight="/.test(tag)) {
      fail(page, `<img> without width/height (causes layout shift): ${tag.slice(0, 80)}`);
    }
  }
  if (!/class="skip-link"/.test(html)) fail(page, 'missing skip link');
  if (!/id="main"/.test(html)) fail(page, 'missing #main landmark');

  for (const input of html.match(/<(input|textarea|select)\b[^>]*>/g) ?? []) {
    const id = input.match(/\bid="([^"]+)"/);
    const type = input.match(/\btype="([^"]+)"/)?.[1];
    if (type === 'checkbox') continue;           // wrapped in its own <label>
    if (!id) fail(page, `form control without id: ${input.slice(0, 60)}`);
    else if (!html.includes(`for="${id[1]}"`)) fail(page, `no <label for="${id[1]}">`);
  }

  /* --- no external runtime dependencies --- */
  for (const src of [...attrs(html, 'script', 'src'), ...attrs(html, 'link', 'href'),
                     ...attrs(html, 'img', 'src')]) {
    if (/^(https?:)?\/\//.test(src)) fail(page, `external asset reference: ${src}`);
  }
  for (const dead of ['web.archive.org', 'bootstrap', 'jquery', 'swiper', 'fonts.googleapis']) {
    if (html.toLowerCase().includes(dead)) fail(page, `leftover dependency: ${dead}`);
  }

  /* --- links resolve --- */
  const base = dirname(join(root, page));
  for (const href of attrs(html, 'a', 'href')) {
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;

    const [path, hash] = href.split('#');
    const resolved = path ? normalize(join(base, path)) : null;
    if (resolved && !existsSync(resolved)) fail(page, `broken link target: ${href}`);
    if (hash) {
      if (resolved && !existsSync(resolved)) continue;
      const targetHtml = resolved ? readFileSync(resolved, 'utf8') : html;
      if (!targetHtml.includes(`id="${hash}"`)) fail(page, `dangling anchor: ${href}`);
    }
  }

  /* --- local assets exist --- */
  for (const src of [...attrs(html, 'img', 'src'), ...attrs(html, 'script', 'src'),
                     ...attrs(html, 'link', 'href')]) {
    if (/^(https?:)?\/\//.test(src)) continue;
    if (!existsSync(normalize(join(base, src)))) fail(page, `missing asset: ${src}`);
  }
}

/* --- shared assets --- */
for (const asset of ['css/site.css', 'js/site.js', 'klassisch/css/site.css',
                     'klassisch/js/site.js', 'img/logo.png', 'img/logo_novaverta_.png']) {
  if (!existsSync(join(root, asset))) fail('site', `missing shared asset: ${asset}`);
}

/* --- images referenced anywhere must be real images, not saved error pages --- */
for (const page of PAGES) {
  const html = readFileSync(join(root, page), 'utf8');
  const base = dirname(join(root, page));
  for (const src of attrs(html, 'img', 'src')) {
    const file = normalize(join(base, src));
    if (!existsSync(file)) continue;
    const head = readFileSync(file).subarray(0, 4);
    const isPng = head[0] === 0x89 && head[1] === 0x50;
    const isJpg = head[0] === 0xff && head[1] === 0xd8;
    if (!isPng && !isJpg) fail(page, `${src} is not a real PNG/JPEG`);
  }
}

if (failures.length) {
  console.error(`FAIL — ${failures.length} problem(s):\n` +
    failures.map((f) => '  - ' + f).join('\n'));
  process.exit(1);
}

console.log(`PASS — ${PAGES.length} pages across ${VERSIONS.length} versions, `
  + 'no broken links, assets, or external dependencies.');
