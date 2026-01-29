---
render_with_liquid: false
---

# Dual Persona Portfolio Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the al-folio portfolio into a dual-identity site with Professional Mode (default) and Personal Mode (Easter egg triggered by clicking profile photo 3 times).

**Architecture:** CSS-driven theme switching using `data-persona` attribute on `<html>`, similar to existing `data-theme` for dark/light mode. Personal mode content conditionally rendered via Liquid. JavaScript handles Easter egg interaction and localStorage persistence.

**Tech Stack:** Jekyll/Liquid, SCSS, Vanilla JavaScript, Google Fonts (Space Grotesk, Space Mono), Self-hosted Satoshi font

---

## Task 1: Add New Typography Fonts

**Files:**

- Modify: `_config.yml:426-428` (Google Fonts URL)
- Create: `assets/fonts/Satoshi-Variable.woff2` (download from Fontshare)
- Create: `_sass/_typography.scss`
- Modify: `assets/css/main.scss:9-24` (add import)

**Step 1: Update Google Fonts URL in config**

In `_config.yml`, find the `google_fonts` section (~line 426) and replace:

```yaml
google_fonts:
  url:
    fonts: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Space+Mono:wght@400;700&display=swap"
```

**Step 2: Download Satoshi font**

Run:

```bash
mkdir -p assets/fonts
curl -L "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" -o assets/css/satoshi.css
```

Note: For production, download the woff2 files directly from Fontshare and self-host.

**Step 3: Create typography SCSS file**

Create `_sass/_typography.scss`:

```scss
/*******************************************************************************
 * Typography - Space Grotesk + Satoshi + Space Mono
 ******************************************************************************/

// Font stacks
$font-family-heading:
  "Space Grotesk",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
$font-family-body:
  "Satoshi",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
$font-family-mono: "Space Mono", "SF Mono", Consolas, monospace;

// Apply typography
html {
  font-family: $font-family-body;
}

h1,
h2,
h3,
h4,
h5,
h6,
.navbar-brand,
.nav-link {
  font-family: $font-family-heading;
}

code,
pre,
kbd,
samp,
.post-meta,
.post-tags,
.more-info {
  font-family: $font-family-mono;
}

// Typography scale
h1 {
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
}

h3 {
  font-size: 1.5rem;
  font-weight: 500;
}

body {
  font-size: 1.1rem;
  line-height: 1.7;
}

// Readable line length
.post-content p,
.post-content li {
  max-width: 65ch;
}
```

**Step 4: Import typography in main.scss**

In `assets/css/main.scss`, add the import after "variables":

```scss
@import "variables", "typography", "themes"; // ... rest of imports
```

**Step 5: Verify fonts load**

Run: `bundle exec jekyll serve --watch --port=8080`

Open browser DevTools → Network → filter "font" → confirm Space Grotesk and Space Mono load.

**Step 6: Commit**

```bash
git add _config.yml _sass/_typography.scss assets/css/main.scss
git commit -m "feat: add Space Grotesk + Satoshi typography system"
```

---

## Task 2: Update Professional Mode Color Variables

**Files:**

- Modify: `_sass/_variables.scss` (color definitions)
- Modify: `_sass/_themes.scss` (CSS custom properties)

**Step 1: Update base color variables**

In `_sass/_variables.scss`, update/add these colors after existing color definitions (~line 8):

```scss
// Professional Mode Colors (Warm Beige + Rust)
$pro-bg-primary: #faf9f7;
$pro-bg-surface: #ffffff;
$pro-text-primary: #2d2d2d;
$pro-text-secondary: #6b6b6b;
$pro-accent: #c75b39;
$pro-accent-hover: #a84a2e;
$pro-divider: rgba(0, 0, 0, 0.08);

// Personal Mode Colors (City-pop Dark)
$personal-bg-primary: #1a1a2e;
$personal-bg-surface: #252542;
$personal-text-primary: #e8e4df;
$personal-text-secondary: #9d99b3;
$personal-gradient-start: #f4a261;
$personal-gradient-mid: #e076a0;
$personal-gradient-end: #9d8cff;
$personal-divider: rgba(255, 255, 255, 0.1);
```

**Step 2: Update light theme CSS custom properties**

In `_sass/_themes.scss`, update the `:root` block to use new professional colors:

```scss
:root {
  color-scheme: light;
  --global-bg-color: #{$pro-bg-primary};
  --global-code-bg-color: #f5f5f5;
  --global-text-color: #{$pro-text-primary};
  --global-text-color-light: #{$pro-text-secondary};
  --global-theme-color: #{$pro-accent};
  --global-hover-color: #{$pro-accent-hover};
  --global-hover-text-color: #{$white-color};
  --global-footer-bg-color: #{$pro-text-primary};
  --global-footer-text-color: #{$pro-bg-primary};
  --global-footer-link-color: #{$white-color};
  --global-distill-app-color: #{$pro-text-secondary};
  --global-divider-color: #{$pro-divider};
  --global-card-bg-color: #{$pro-bg-surface};
  // ... keep other variables
```

**Step 3: Verify color changes**

Refresh browser, confirm:

- Background is warm beige (#FAF9F7)
- Accent color is rust (#c75b39)
- Text is near-black (#2d2d2d)

**Step 4: Commit**

```bash
git add _sass/_variables.scss _sass/_themes.scss
git commit -m "feat: update to warm beige + rust professional palette"
```

---

## Task 3: Add Personal Mode CSS Rules

**Files:**

- Modify: `_sass/_themes.scss` (add persona styles)

**Step 1: Add persona attribute styles**

At the end of `_sass/_themes.scss`, add personal mode styles:

```scss
/*******************************************************************************
 * Personal Mode (Easter Egg)
 ******************************************************************************/

html[data-persona="personal"] {
  --global-bg-color: #{$personal-bg-primary};
  --global-code-bg-color: #1e1e2e;
  --global-text-color: #{$personal-text-primary};
  --global-text-color-light: #{$personal-text-secondary};
  --global-theme-color: #{$personal-gradient-mid};
  --global-hover-color: #{$personal-gradient-end};
  --global-hover-text-color: #{$personal-text-primary};
  --global-footer-bg-color: #{$personal-bg-surface};
  --global-footer-text-color: #{$personal-text-primary};
  --global-footer-link-color: #{$personal-gradient-mid};
  --global-distill-app-color: #{$personal-text-secondary};
  --global-divider-color: #{$personal-divider};
  --global-card-bg-color: #{$personal-bg-surface};

  // Gradient accent for links
  a:not(.nav-link):not(.navbar-brand) {
    background: linear-gradient(90deg, #{$personal-gradient-start}, #{$personal-gradient-mid}, #{$personal-gradient-end});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    &:hover {
      text-shadow: 0 0 20px rgba($personal-gradient-mid, 0.5);
    }
  }

  // Gradient text for headings
  h1,
  h2 {
    background: linear-gradient(90deg, #{$personal-gradient-start}, #{$personal-gradient-mid});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  // Card glow effect
  .card {
    box-shadow: 0 4px 20px rgba($personal-gradient-mid, 0.1);
    border: 1px solid #{$personal-divider};

    &:hover {
      box-shadow: 0 8px 30px rgba($personal-gradient-mid, 0.2);
      border-top: 2px solid #{$personal-gradient-mid};
    }
  }

  // Navbar glow on hover
  .navbar .nav-link:hover {
    text-shadow: 0 0 10px rgba($personal-gradient-end, 0.5);
  }
}

// Smooth transition between personas
html.persona-transition,
html.persona-transition * {
  transition:
    background-color 0.6s ease-in-out,
    color 0.6s ease-in-out,
    border-color 0.6s ease-in-out,
    box-shadow 0.6s ease-in-out !important;
}
```

**Step 2: Test manually**

Open browser DevTools → Elements → find `<html>` → add attribute `data-persona="personal"`

Verify:

- Background turns dark twilight (#1a1a2e)
- Text turns cream (#e8e4df)
- Headings have gradient text
- Cards have glow effect

**Step 3: Commit**

```bash
git add _sass/_themes.scss
git commit -m "feat: add personal mode CSS with city-pop gradients and glow effects"
```

---

## Task 4: Create Profile Photo Easter Egg JavaScript

**Files:**

- Create: `assets/js/persona.js`
- Modify: `_includes/head.liquid` (add script)

**Step 1: Create persona toggle script**

Create `assets/js/persona.js`:

```javascript
/**
 * Persona Toggle - Easter egg to switch between Professional and Personal modes
 * Trigger: Click profile photo 3 times
 */

(function () {
  const STORAGE_KEY = "persona";
  const STORAGE_TIMESTAMP_KEY = "persona_timestamp";
  const EXPIRY_HOURS = 24;
  const CLICK_THRESHOLD = 3;
  const CLICK_TIMEOUT = 2000; // Reset click count after 2s of inactivity

  let clickCount = 0;
  let clickTimer = null;

  // Check if persona has expired (24 hours)
  function isPersonaExpired() {
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    if (!timestamp) return true;
    const hoursSince = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60);
    return hoursSince > EXPIRY_HOURS;
  }

  // Get current persona setting
  function getPersona() {
    // URL param override for sharing formal links
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("professional")) {
      return "professional";
    }

    // Check expiry
    if (isPersonaExpired()) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
      return "professional";
    }

    return localStorage.getItem(STORAGE_KEY) || "professional";
  }

  // Set persona with timestamp
  function setPersona(persona) {
    localStorage.setItem(STORAGE_KEY, persona);
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    applyPersona(persona);
  }

  // Apply persona to DOM
  function applyPersona(persona) {
    const html = document.documentElement;

    // Add transition class
    html.classList.add("persona-transition");

    // Set persona attribute
    html.setAttribute("data-persona", persona);

    // Show toast notification
    showToast(persona === "personal" ? "Welcome to the other side" : "Back to business");

    // Remove transition class after animation
    setTimeout(() => {
      html.classList.remove("persona-transition");
    }, 600);

    // Toggle personal-only content visibility
    document.querySelectorAll(".personal-only").forEach((el) => {
      el.style.display = persona === "personal" ? "" : "none";
    });
  }

  // Show toast notification
  function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector(".persona-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "persona-toast";
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--global-card-bg-color);
      color: var(--global-text-color);
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
      font-family: "Space Mono", monospace;
      font-size: 0.875rem;
    `;

    document.body.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    // Fade out and remove
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // Add visual hint to profile photo
  function addGlowHint(photo, intensity) {
    const colors = ["#f4a261", "#e076a0", "#9d8cff"];
    const color = colors[Math.min(intensity - 1, 2)];
    const blur = 5 + intensity * 5;
    photo.style.boxShadow = `0 0 ${blur}px ${color}`;
    photo.style.transition = "box-shadow 0.3s ease";
  }

  // Reset photo glow
  function resetGlow(photo) {
    photo.style.boxShadow = "";
  }

  // Handle profile photo click
  function handlePhotoClick(event) {
    const photo = event.currentTarget;

    // Clear previous timer
    if (clickTimer) clearTimeout(clickTimer);

    clickCount++;

    // Add glow hint
    addGlowHint(photo, clickCount);

    if (clickCount >= CLICK_THRESHOLD) {
      // Toggle persona
      const currentPersona = getPersona();
      const newPersona = currentPersona === "professional" ? "personal" : "professional";
      setPersona(newPersona);

      // Reset
      clickCount = 0;
      resetGlow(photo);
    } else {
      // Reset after timeout
      clickTimer = setTimeout(() => {
        clickCount = 0;
        resetGlow(photo);
      }, CLICK_TIMEOUT);
    }
  }

  // Initialize on DOM ready
  function init() {
    // Apply saved persona immediately (before DOM ready to prevent flash)
    const persona = getPersona();
    document.documentElement.setAttribute("data-persona", persona);

    document.addEventListener("DOMContentLoaded", () => {
      // Find profile photo
      const profilePhoto = document.querySelector(".profile img");
      if (profilePhoto) {
        profilePhoto.style.cursor = "pointer";
        profilePhoto.addEventListener("click", handlePhotoClick);
      }

      // Apply persona (for content visibility)
      applyPersona(persona);
    });
  }

  init();
})();
```

**Step 2: Add script to head.liquid**

In `_includes/head.liquid`, after the theme.js script (~line 73), add:

```liquid
<!-- Persona Toggle (Easter Egg) -->
<script src="{{ '/assets/js/persona.js' | relative_url | bust_file_cache }}"></script>
```

**Step 3: Test Easter egg**

1. Refresh browser
2. Click profile photo once → subtle glow appears
3. Click again → stronger glow
4. Click third time → mode switches to Personal
5. Refresh page → Personal mode persists
6. Add `?professional` to URL → forces Professional mode

**Step 4: Commit**

```bash
git add assets/js/persona.js _includes/head.liquid
git commit -m "feat: add Easter egg persona toggle (click profile 3x)"
```

---

## Task 5: Create Personal Mode Data File

**Files:**

- Create: `_data/personal.yml`

**Step 1: Create personal data file**

Create `_data/personal.yml`:

```yaml
# Personal Mode Content
# This data is displayed only when Personal Mode is active

heroes:
  - name: Invoker
    id: invoker
    role: Main
    image: https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/invoker.png

  - name: Rubick
    id: rubick
    role: Support
    image: https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/rubick.png

  - name: Puck
    id: puck
    role: Mid
    image: https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/puck.png

  - name: Earth Spirit
    id: earth_spirit
    role: Roamer
    image: https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/earth_spirit.png

currently:
  playing: "Dota 2"
  rank: "Ancient III"
  reading: "The Alignment Problem"
  watching: "Frieren"
```

**Step 2: Commit**

```bash
git add _data/personal.yml
git commit -m "feat: add personal mode data (Dota heroes, currently)"
```

---

## Task 6: Create Hero Pool Component

**Files:**

- Create: `_includes/hero-pool.liquid`
- Create: `_sass/_components.scss`
- Modify: `assets/css/main.scss` (add import)

**Step 1: Create hero pool liquid component**

Create `_includes/hero-pool.liquid`:

```liquid
{% if site.data.personal.heroes %}
  <div class="hero-pool personal-only" style="display: none;">
    <h3 class="hero-pool-title">Hero Pool</h3>
    <div class="hero-pool-grid">
      {% for hero in site.data.personal.heroes %}
        <div class="hero-card" title="{{ hero.name }} - {{ hero.role }}">
          <img
            src="{{ hero.image }}"
            alt="{{ hero.name }}"
            class="hero-portrait"
            loading="lazy"
          >
          <span class="hero-name">{{ hero.name }}</span>
          {% if hero.role == 'Main' %}
            <span class="hero-main-badge">Main</span>
          {% endif %}
        </div>
      {% endfor %}
    </div>
  </div>
{% endif %}
```

**Step 2: Create components SCSS file**

Create `_sass/_components.scss`:

```scss
/*******************************************************************************
 * Personal Mode Components
 ******************************************************************************/

// Hero Pool
.hero-pool {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--global-card-bg-color);
  border-radius: 12px;
  border: 1px solid var(--global-divider-color);
}

.hero-pool-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-family: $font-family-mono;
}

.hero-pool-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: var(--global-bg-color);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: default;
  position: relative;

  &:hover {
    transform: translateY(-4px);
  }
}

html[data-persona="personal"] .hero-card:hover {
  box-shadow: 0 8px 20px rgba($personal-gradient-mid, 0.3);
}

.hero-portrait {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--global-divider-color);
}

html[data-persona="personal"] .hero-portrait {
  border-color: transparent;
  background:
    linear-gradient(var(--global-card-bg-color), var(--global-card-bg-color)) padding-box,
    linear-gradient(135deg, $personal-gradient-start, $personal-gradient-mid, $personal-gradient-end) border-box;
  border: 2px solid transparent;
}

.hero-name {
  font-size: 0.75rem;
  font-family: $font-family-mono;
  color: var(--global-text-color-light);
}

.hero-main-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.625rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: $font-family-mono;
  background: $personal-gradient-start;
  color: #1a1a2e;
}

// Currently Widget
.currently-widget {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background: var(--global-card-bg-color);
  border-radius: 8px;
  border-left: 3px solid var(--global-theme-color);
  font-family: $font-family-mono;
  font-size: 0.875rem;
}

.currently-item {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;

  .label {
    color: var(--global-text-color-light);
    min-width: 80px;
  }

  .value {
    color: var(--global-text-color);
  }
}

html[data-persona="personal"] .currently-widget {
  border-left-color: $personal-gradient-mid;
}
```

**Step 3: Import components in main.scss**

In `assets/css/main.scss`, add the import:

```scss
@import "variables", "typography", "themes", "components", "layout"; // ... rest
```

**Step 4: Commit**

```bash
git add _includes/hero-pool.liquid _sass/_components.scss assets/css/main.scss
git commit -m "feat: add hero pool component for personal mode"
```

---

## Task 7: Create Currently Widget Component

**Files:**

- Create: `_includes/currently.liquid`

**Step 1: Create currently widget**

Create `_includes/currently.liquid`:

```liquid
{% if site.data.personal.currently %}
  <div class="currently-widget personal-only" style="display: none;">
    <div class="currently-title">Currently</div>
    {% if site.data.personal.currently.playing %}
      <div class="currently-item">
        <span class="label">Playing:</span>
        <span class="value">
          {{- site.data.personal.currently.playing -}}
          {%- if site.data.personal.currently.rank %} ({{ site.data.personal.currently.rank }}){% endif -%}
        </span>
      </div>
    {% endif %}
    {% if site.data.personal.currently.reading %}
      <div class="currently-item">
        <span class="label">Reading:</span>
        <span class="value">{{ site.data.personal.currently.reading }}</span>
      </div>
    {% endif %}
    {% if site.data.personal.currently.watching %}
      <div class="currently-item">
        <span class="label">Watching:</span>
        <span class="value">{{ site.data.personal.currently.watching }}</span>
      </div>
    {% endif %}
  </div>
{% endif %}
```

**Step 2: Commit**

```bash
git add _includes/currently.liquid
git commit -m "feat: add currently widget for personal mode"
```

---

## Task 8: Integrate Personal Components into About Layout

**Files:**

- Modify: `_layouts/about.liquid`

**Step 1: Add personal components to about layout**

In `_layouts/about.liquid`, after the profile section (around line 38, after the `</div>` that closes the profile):

```liquid
    {% if page.profile %}
      <div class="profile float-{% if page.profile.align == 'left' %}left{% else %}right{% endif %}">
        <!-- ... existing profile code ... -->
      </div>

      <!-- Personal Mode Components -->
      {% include currently.liquid %}
    {% endif %}

    <div class="clearfix">{{ content }}</div>

    <!-- Hero Pool (after main content, before news) -->
    {% include hero-pool.liquid %}

    <!-- News -->
    {% if page.announcements and page.announcements.enabled %}
```

**Step 2: Test integration**

1. Refresh browser
2. Activate personal mode (click profile 3x)
3. Verify Hero Pool appears below bio
4. Verify Currently widget appears near profile

**Step 3: Commit**

```bash
git add _layouts/about.liquid
git commit -m "feat: integrate personal mode components into about layout"
```

---

## Task 9: Add Profile Photo Animated Border for Personal Mode

**Files:**

- Modify: `_sass/_base.scss` (profile styles)

**Step 1: Add animated gradient border**

In `_sass/_base.scss`, find the `.profile` section (~line 195) and add personal mode styles:

```scss
// Profile photo animated border for Personal Mode
html[data-persona="personal"] {
  .profile {
    img {
      border: 3px solid transparent;
      background:
        linear-gradient(var(--global-card-bg-color), var(--global-card-bg-color)) padding-box,
        linear-gradient(135deg, $personal-gradient-start, $personal-gradient-mid, $personal-gradient-end, $personal-gradient-start) border-box;
      background-size:
        100% 100%,
        300% 300%;
      animation: gradient-rotate 4s ease infinite;
    }
  }
}

@keyframes gradient-rotate {
  0%,
  100% {
    background-position:
      0% 0%,
      0% 50%;
  }
  50% {
    background-position:
      0% 0%,
      100% 50%;
  }
}
```

**Step 2: Test animation**

1. Activate personal mode
2. Verify profile photo has animated gradient border

**Step 3: Commit**

```bash
git add _sass/_base.scss
git commit -m "feat: add animated gradient border to profile photo in personal mode"
```

---

## Task 10: Polish and Accessibility Review

**Files:**

- Modify: `_sass/_themes.scss` (ensure contrast)
- Modify: `assets/js/persona.js` (keyboard support)

**Step 1: Verify color contrast in personal mode**

Check contrast ratios:

- Text (#e8e4df) on background (#1a1a2e): ~11:1 ✓
- Secondary text (#9d99b3) on background (#1a1a2e): ~6:1 ✓

**Step 2: Add keyboard support to profile photo**

In `assets/js/persona.js`, update the init function to add keyboard support:

```javascript
// In the DOMContentLoaded callback, after finding profilePhoto:
if (profilePhoto) {
  profilePhoto.style.cursor = "pointer";
  profilePhoto.setAttribute("tabindex", "0");
  profilePhoto.setAttribute("role", "button");
  profilePhoto.setAttribute("aria-label", "Click 3 times to toggle persona mode");
  profilePhoto.addEventListener("click", handlePhotoClick);
  profilePhoto.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePhotoClick(e);
    }
  });
}
```

**Step 3: Test accessibility**

1. Tab to profile photo
2. Press Enter 3 times → should toggle persona
3. Verify focus states visible in both modes

**Step 4: Commit**

```bash
git add _sass/_themes.scss assets/js/persona.js
git commit -m "feat: polish accessibility for persona toggle"
```

---

## Task 11: Update Personal Data with Your Actual Heroes

**Files:**

- Modify: `_data/personal.yml`

**Step 1: Update with real data**

Edit `_data/personal.yml` with your actual Dota heroes and current interests. The structure is already correct, just update the values.

**Step 2: Commit**

```bash
git add _data/personal.yml
git commit -m "chore: update personal mode data with actual content"
```

---

## Summary Checklist

- [ ] Task 1: Typography fonts (Space Grotesk, Satoshi, Space Mono)
- [ ] Task 2: Professional mode colors (warm beige + rust)
- [ ] Task 3: Personal mode CSS (city-pop dark + gradients)
- [ ] Task 4: Easter egg JavaScript (3-click toggle)
- [ ] Task 5: Personal data file (heroes, currently)
- [ ] Task 6: Hero Pool component
- [ ] Task 7: Currently widget component
- [ ] Task 8: About layout integration
- [ ] Task 9: Animated profile border
- [ ] Task 10: Accessibility polish
- [ ] Task 11: Real personal data

---

## Testing Checklist

After all tasks complete:

1. **Professional Mode (default)**

   - [ ] Warm beige background (#FAF9F7)
   - [ ] Rust accent color (#c75b39)
   - [ ] Space Grotesk headings
   - [ ] No personal content visible

2. **Easter Egg Trigger**

   - [ ] Click profile 1x → subtle glow
   - [ ] Click profile 2x → stronger glow
   - [ ] Click profile 3x → mode switches
   - [ ] Toast notification appears

3. **Personal Mode**

   - [ ] Dark twilight background (#1a1a2e)
   - [ ] Gradient text on headings
   - [ ] Card glow effects
   - [ ] Hero Pool section visible
   - [ ] Currently widget visible
   - [ ] Animated profile border

4. **Persistence**

   - [ ] Refresh maintains mode
   - [ ] ?professional param forces professional
   - [ ] Mode expires after 24 hours

5. **Accessibility**
   - [ ] Keyboard navigation works
   - [ ] Color contrast passes WCAG AA
   - [ ] Focus states visible
