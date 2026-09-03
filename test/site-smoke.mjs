import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pages = ['index.html', 'verkauf.html', 'montage.html', 'service.html', 'one-page.html'];
const requiredFiles = ['css/site.css', 'js/site.js', 'img/logo.png', 'img/logo_novaverta_.png'];

for (const file of [...pages, ...requiredFiles]) {
  assert.ok(existsSync(resolve(root, file)), `missing required file: ${file}`);
}

const html = pages.map((page) => readFileSync(resolve(root, page), 'utf8')).join('\n');
const css = readFileSync(resolve(root, 'css/site.css'), 'utf8');
assert.doesNotMatch(html, /web\.archive\.org|cdnjs|ajax\.googleapis|bootstrap\.min|swiper/i, 'archived or CDN dependencies remain');
assert.match(html, /css\/site\.css/, 'shared stylesheet is not linked');
assert.match(html, /js\/site\.js/, 'shared script is not linked');
assert.match(css, /@media \(max-width: 520px\)[\s\S]*?\.proof-list\s*\{[^}]*grid-template-columns:\s*1fr;/, 'proof list needs a one-column mobile layout');
assert.match(readFileSync(resolve(root, 'one-page.html'), 'utf8'), /class="site-nav one-page-nav"/, 'one-page navigation needs the shared mobile menu class');

for (const target of pages) {
  assert.match(html, new RegExp(`(?:href|data-page)=["'](?:\.\/)?${target.replace('.', '\\.')}`), `missing navigation target: ${target}`);
}

console.log(`PASS: ${pages.length} pages and shared static assets are wired locally`);
