# NovaVerta Static Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two polished static website variants for Phönix / Nova Verta Deutschland: a refreshed multi-page site and a one-page landing-page alternative.

**Architecture:** All pages share `css/site.css` and `js/site.js`. The existing four page names remain the multi-page version; `one-page.html` is the comparison variant. Content is authored directly in semantic HTML and uses only supplied local images.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js smoke-test script.

**Spec:** `docs/superpowers/specs/2026-09-03-novaverta-redesign-design.md`

## Global Constraints

- Static HTML, CSS, and vanilla JavaScript only.
- No Bootstrap, Swiper, Wayback Machine scripts, CDN assets, or framework dependencies.
- Use only local assets already in `img/`.
- Preserve existing company facts and service copy.
- Responsive at mobile, tablet, and desktop widths.
- Include keyboard-accessible navigation, visible focus states, alt text, and reduced-motion support.

### Task 1: Add the smoke test first

**Files:**
- Create: `test/site-smoke.mjs`

- [x] Write assertions for required pages, shared assets, local-only runtime references, internal navigation targets, and the one-page variant.
- [x] Run `node test/site-smoke.mjs` and confirm it fails because the new shared files and one-page variant do not yet exist.

### Task 2: Build the shared visual system and interactions

**Files:**
- Create: `css/site.css`
- Create: `js/site.js`

- [x] Implement the shared palette, type scale, layout primitives, navigation, buttons, cards, hero, content sections, footer, responsive breakpoints, focus states, and reduced-motion rules.
- [x] Add a vanilla mobile-menu toggle and scroll-reveal enhancement that does not block content when JavaScript is disabled.

### Task 3: Rebuild the multi-page site

**Files:**
- Modify: `index.html`
- Modify: `verkauf.html`
- Modify: `montage.html`
- Modify: `service.html`

- [x] Replace archived markup and dependencies with semantic local HTML using shared navigation and footer.
- [x] Make the homepage the strongest visual entry point with the hero image, service cards, proof strip, and contact CTA.
- [x] Rework sales, installation, and service pages into scannable content sections while preserving their German copy and business facts.

### Task 4: Build the one-page comparison variant

**Files:**
- Create: `one-page.html`

- [x] Add a complete anchored landing page with a compact hero, capability overview, sales, installation, service, proof, and contact sections.
- [x] Link all major calls to action to the contact details and multi-page version where useful.

### Task 5: Run verification and inspect responsive output

**Files:**
- Modify: `test/site-smoke.mjs` only if verification discovers a real contract gap.

- [x] Run `node test/site-smoke.mjs`.
- [x] Run a local static server and inspect all five pages at desktop and mobile widths.
- [x] Run `git diff --check` when Git metadata is available; otherwise inspect changed files for whitespace and broken paths.
