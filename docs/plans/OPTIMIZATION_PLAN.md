# Website Optimization Plan

## Current State Summary

The site is built on the **al-folio** Jekyll theme with solid foundations: PurgeCSS, WebP
image generation, lazy loading, deferred scripts for feature-specific libraries, and
SRI-hashed CDN resources. However, several areas have significant room for improvement.

---

## Optimization Opportunities

### 1. Critical Rendering Path (High Impact)

| Issue                                       | Detail                                                                                 | Est. Impact                            |
| ------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------- |
| **Synchronous jQuery + Bootstrap + MDB JS** | ~270 KB of JS loaded without `defer` in `scripts.liquid`, blocking FCP and main thread | FCP improvement ~1-2s on slow networks |
| **Large CSS payload**                       | Bootstrap (159 KB) + MDB (271 KB) loaded render-blocking in `head.liquid`              | TTFB-to-render delay                   |
| **Profile picture as LCP candidate**        | `prof_pic.png` is 2685×2685 but uses `loading="lazy"`, delaying LCP                    | LCP improvement ~1-2s                  |

### 2. Asset Optimization (Medium-High Impact)

| Issue                         | Detail                                                                  | Est. Impact                  |
| ----------------------------- | ----------------------------------------------------------------------- | ---------------------------- |
| **Duplicate icon frameworks** | Both Font Awesome (~300 KB woff2) AND Tabler icons loaded               | ~100-150 KB savings          |
| **No AVIF image format**      | Only WebP generated; AVIF offers 15-20% better compression              | Smaller image payloads       |
| **Search system overhead**    | ninja-keys loads ~200 KB lit-html framework on every page               | TTI improvement              |
| **theme.js bloat**            | 23 KB includes embedded Plotly/Vega theme objects most pages don't need | ~15 KB savings               |
| **Source maps may ship**      | `.js.map` files for Bootstrap/MDB present in assets                     | ~1 MB if accidentally served |

### 3. SEO & Structured Data (Medium Impact)

| Issue                           | Detail                                                        | Est. Impact                     |
| ------------------------------- | ------------------------------------------------------------- | ------------------------------- |
| **OpenGraph disabled**          | `og_image` and Twitter card metadata commented out / disabled | Social sharing previews missing |
| **Schema.org LD+JSON disabled** | Person/BlogPosting structured data coded but not enabled      | Rich search results missing     |
| **No Google/Bing verification** | `google_site_verification` and `bing_site_verification` empty | Not verified in search consoles |

### 4. Accessibility (Medium Impact)

| Issue                        | Detail                                                         | Est. Impact            |
| ---------------------------- | -------------------------------------------------------------- | ---------------------- |
| **Axe workflow manual-only** | Accessibility testing requires manual trigger, not in CI       | Regressions undetected |
| **Image dimensions missing** | Lazy-loaded images without explicit `width`/`height` cause CLS | CLS score degradation  |
| **Font preloading absent**   | No `<link rel="preload">` for critical Google Fonts            | FOUT duration          |

### 5. Build & CI/CD (Low-Medium Impact)

| Issue                       | Detail                                                       | Est. Impact        |
| --------------------------- | ------------------------------------------------------------ | ------------------ |
| **No caching in CI**        | Ruby gems and npm packages reinstalled on each build         | Build time         |
| **PurgeCSS safelist**       | May be overly broad, keeping unused styles                   | CSS size           |
| **No HTTP caching headers** | Relies on GitHub Pages defaults; no explicit `Cache-Control` | Repeat visit speed |

---

## Development Plan

### Phase 1: Critical Performance Fixes

#### 1.1 — Defer render-blocking JavaScript

- **Files**: `_includes/scripts.liquid`
- Add `defer` to jQuery, Bootstrap bundle, and MDB script tags
- Verify `no_defer.js` still works with deferred Bootstrap (may need `DOMContentLoaded` wrapper)
- **Test**: All interactive features (dropdowns, modals, search, theme toggle) still work

#### 1.2 — Fix LCP for hero image

- **Files**: `_includes/head.liquid`, `_layouts/about.liquid`, relevant image includes
- Set `loading="eager"` and add `fetchpriority="high"` on profile picture
- Add explicit `width` and `height` attributes to prevent CLS
- Add `<link rel="preload" as="image">` for the profile picture

#### 1.3 — Optimize profile picture source

- Convert `prof_pic.png` (2685×2685) to a max 1200px JPEG/WebP
- Ensure responsive `srcset` serves appropriately sized variants

### Phase 2: Asset Size Reduction

#### 2.1 — Consolidate icon frameworks

- Audit which Font Awesome and Tabler icons are actually used across templates
- Remove the less-used framework or subset both to only needed glyphs
- **Files**: `_sass/_base.scss`, `_includes/header.liquid`, `_includes/footer.liquid`, `_includes/social.liquid`

#### 2.2 — Add AVIF to image pipeline

- **Files**: `_config.yml` (imagemagick section)
- Add AVIF output format alongside WebP
- Update `<picture>` elements in templates to include AVIF `<source>` with WebP fallback

#### 2.3 — Lazy-load search infrastructure

- Defer ninja-keys module loading until user triggers search (e.g., click or `Ctrl+K`)
- **Files**: `_includes/scripts.liquid`, `assets/js/search/`

#### 2.4 — Split theme.js

- Extract Plotly/Vega theme objects into separate files loaded only on pages with charts
- **Files**: `assets/js/theme.js`

#### 2.5 — Exclude source maps from production

- Add `*.map` to Jekyll's `exclude:` list in `_config.yml`
- Verify they're not served in production build output

### Phase 3: SEO & Social Sharing

#### 3.1 — Enable OpenGraph and Twitter Cards

- **Files**: `_config.yml`, `_includes/metadata.liquid` or equivalent
- Set `og_image` to profile picture or site banner
- Enable Twitter card metadata
- **Test**: Validate with social media debuggers (Facebook, Twitter, LinkedIn)

#### 3.2 — Enable Schema.org structured data

- **Files**: `_config.yml` (`jsonld: true`)
- Verify Person schema renders correctly on about page
- Verify BlogPosting schema on blog posts
- **Test**: Validate with Google Rich Results validator

#### 3.3 — Add search engine verification

- Register site with Google Search Console and Bing Webmaster Tools
- Add verification meta tags to `_config.yml`

### Phase 4: Accessibility & CLS

#### 4.1 — Add image dimensions to templates

- **Files**: `_includes/figure.liquid`, `_layouts/about.liquid`, `_layouts/bib.liquid`
- Add `width` and `height` attributes to all `<img>` tags to reserve layout space
- Prevents CLS when images load

#### 4.2 — Preload critical fonts

- **Files**: `_includes/head.liquid`
- Add `<link rel="preload" as="font" crossorigin>` for Space Grotesk and Space Mono woff2
- Reduces Flash of Unstyled Text (FOUT)

#### 4.3 — Automate accessibility testing in CI

- **Files**: `.github/workflows/axe.yml` or new workflow
- Change trigger from `workflow_dispatch` to run on PRs to `main`
- Fail the build on critical accessibility violations

### Phase 5: Build & Caching

#### 5.1 — Add dependency caching to CI

- **Files**: `.github/workflows/deploy.yml`
- Cache Ruby gems (`vendor/bundle`) and npm packages (`node_modules`) between builds
- Use `actions/cache` with hash of `Gemfile.lock` / `package-lock.json`

#### 5.2 — Audit PurgeCSS safelist

- **Files**: `purgecss.config.js`
- Review safelist patterns against actual DOM output
- Remove unnecessary safelisted classes to shrink CSS further

#### 5.3 — Add resource hints

- **Files**: `_includes/head.liquid`
- Add `<link rel="dns-prefetch">` and `<link rel="preconnect">` for `cdn.jsdelivr.net`, `fonts.googleapis.com`, `fonts.gstatic.com`
- Reduces DNS/TLS latency for CDN resources

---

## Implementation Priority Matrix

| Priority | Item                    | Risk                     | Effort  |
| -------- | ----------------------- | ------------------------ | ------- |
| **P0**   | 1.1 Defer JS            | Low (test thoroughly)    | Small   |
| **P0**   | 1.2 Fix LCP             | Low                      | Small   |
| **P0**   | 1.3 Optimize prof_pic   | Low                      | Small   |
| **P1**   | 2.5 Exclude source maps | None                     | Trivial |
| **P1**   | 3.1 Enable OpenGraph    | None                     | Small   |
| **P1**   | 3.2 Enable LD+JSON      | None                     | Small   |
| **P1**   | 5.3 Resource hints      | None                     | Small   |
| **P2**   | 2.1 Consolidate icons   | Medium (visual breakage) | Medium  |
| **P2**   | 2.2 AVIF images         | Low                      | Small   |
| **P2**   | 4.1 Image dimensions    | Low                      | Medium  |
| **P2**   | 4.2 Preload fonts       | None                     | Small   |
| **P2**   | 5.1 CI caching          | None                     | Small   |
| **P3**   | 2.3 Lazy search         | Medium (UX change)       | Medium  |
| **P3**   | 2.4 Split theme.js      | Low                      | Medium  |
| **P3**   | 4.3 Auto a11y CI        | Low                      | Small   |
| **P3**   | 5.2 PurgeCSS audit      | Low                      | Medium  |
