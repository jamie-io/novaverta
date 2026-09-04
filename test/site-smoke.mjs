import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pages = [
  'multi-page/index.html',
  'multi-page/verkauf.html',
  'multi-page/montage.html',
  'multi-page/service.html',
  'one-page/index.html',
];
const requiredFiles = [
  'multi-page/css/site.css',
  'multi-page/js/site.js',
  'one-page/css/site.css',
  'one-page/js/site.js',
  'img/logo.png',
  'img/logo_novaverta_.png',
  'img/alles-fuer-den-profi.png',
];

for (const file of [...pages, ...requiredFiles]) {
  assert.ok(existsSync(resolve(root, file)), `missing required file: ${file}`);
}

const html = pages.map((page) => readFileSync(resolve(root, page), 'utf8')).join('\n');
const css = readFileSync(resolve(root, 'multi-page/css/site.css'), 'utf8');
const onePageCss = readFileSync(resolve(root, 'one-page/css/site.css'), 'utf8');
assert.doesNotMatch(html, /web\.archive\.org|cdnjs|ajax\.googleapis|bootstrap\.min|swiper/i, 'archived or CDN dependencies remain');
assert.match(html, /css\/site\.css/, 'shared stylesheet is not linked');
assert.match(html, /js\/site\.js/, 'shared script is not linked');
assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.proof-list\s*\{[^}]*grid-template-columns:\s*1fr;/, 'proof list needs a one-column mobile layout');
assert.match(readFileSync(resolve(root, 'one-page/index.html'), 'utf8'), /class="site-nav one-page-nav"/, 'one-page navigation needs the shared mobile menu class');
assert.match(html, /class="quality-mark"/, 'the supplied Profi mark should be visible in both variants');
assert.match(css, /--brand-blue:\s*#006eb3/i, 'reference palette is missing Phönix blue');
assert.match(css, /--brand-indigo:\s*#2c367b/i, 'reference palette is missing Phönix indigo');
assert.match(css, /\.blue-rule\s*\{/, 'reference horizontal blue rule is missing');
assert.match(css, /\.more-link\s*\{/, 'reference circular CTA language is missing');
assert.doesNotMatch(html, /inspection-beam/, 'unrelated inspection-beam concept remains');
assert.match(css, /prefers-reduced-motion/, 'reduced motion support is missing');
assert.equal(onePageCss, css, 'one-page and multi-page visual systems must stay in sync');

for (const page of pages) {
  const source = readFileSync(resolve(root, page), 'utf8');
  const links = [...source.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const link of links) {
    if (/^(?:#|mailto:|tel:|https?:)/.test(link)) continue;
    assert.ok(existsSync(resolve(root, page, '..', link)), `broken local reference in ${page}: ${link}`);
  }
}

console.log(`PASS: ${pages.length} pages and shared static assets are wired locally`);
