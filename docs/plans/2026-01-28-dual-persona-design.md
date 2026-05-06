# Dual Persona Portfolio Design

> A design plan for transforming jiahaoh.info into a distinctive academic portfolio with a hidden Easter egg mode.

> Status: superseded as of 2026-05-06. The dual-persona Easter egg direction was
> removed when the site moved to the plain-text, blog-first redesign in commit
> `3a21ee6` (`Redesign site around blog`). Treat this as historical design
> context only, not an active implementation target, unless Jiahao explicitly
> asks to revive it.

## Concept: "Dual Identity Portfolio"

The site has two modes, discoverable via an Easter egg (clicking profile photo 3 times):

- **Professional Mode (Default)**: Scholarly, minimal, trustworthy academic portfolio
- **Personal Mode (Easter Egg)**: City-pop inspired, cozy dark gaming den with Dota elements

---

## Color Systems

### Professional Mode Palette

| Token              | Value     | Usage                      |
| ------------------ | --------- | -------------------------- |
| `--bg-primary`     | `#FAF9F7` | Warm beige background      |
| `--bg-surface`     | `#FFFFFF` | Cards, elevated surfaces   |
| `--text-primary`   | `#2d2d2d` | Headings, body text        |
| `--text-secondary` | `#6b6b6b` | Meta, captions             |
| `--accent`         | `#c75b39` | Links, buttons, highlights |
| `--accent-hover`   | `#a84a2e` | Hover states               |

### Personal Mode Palette

| Token              | Value     | Usage                      |
| ------------------ | --------- | -------------------------- |
| `--bg-primary`     | `#1a1a2e` | Deep twilight background   |
| `--bg-surface`     | `#252542` | Cards, elevated surfaces   |
| `--text-primary`   | `#e8e4df` | Headings, body text        |
| `--text-secondary` | `#9d99b3` | Meta, captions             |
| `--gradient-start` | `#f4a261` | Peach - gradient accent    |
| `--gradient-mid`   | `#e076a0` | Pink - gradient accent     |
| `--gradient-end`   | `#9d8cff` | Lavender - gradient accent |

---

## Typography

Full refresh using geometric, retro-modern fonts:

| Role     | Font          | Weights       | Usage                 |
| -------- | ------------- | ------------- | --------------------- |
| Headings | Space Grotesk | 500, 600, 700 | H1-H6, nav items      |
| Body     | Satoshi       | 400, 500      | Paragraphs, UI text   |
| Mono     | Space Mono    | 400           | Code, metadata, dates |

### Typography Scale

```
H1: 2.5rem, weight 600, letter-spacing -0.02em
H2: 2rem, weight 600
H3: 1.5rem, weight 500
Body: 1.1rem, line-height 1.7, max-width 65ch
Meta: 0.875rem, monospace, secondary color
```

### Google Fonts Import

```css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Space+Mono:wght@400&display=swap");
```

Note: Satoshi requires self-hosting from [Fontshare](https://www.fontshare.com/fonts/satoshi) or using a fallback.

---

## Easter Egg Interaction

### Trigger Mechanism

1. User clicks profile photo → subtle glow pulse
2. Second click → stronger glow
3. Third click → transformation triggers

### Transition

- Duration: 0.6s ease-in-out crossfade
- Colors shift, background darkens
- Toast notification: "Welcome to the other side" (dismisses after 2s)
- Return click: "Back to business"

### Persistence

- Mode saved to `localStorage`
- Auto-resets to Professional after 24 hours
- URL param `?professional` forces professional mode (for formal sharing)

---

## Layout & Components

### Shared Structure

Both modes use the same al-folio layout structure. Differences are purely visual.

### Navbar

| Mode         | Background      | Active Item    | Hover         |
| ------------ | --------------- | -------------- | ------------- |
| Professional | Beige `#FAF9F7` | Rust underline | Subtle darken |
| Personal     | Dark `#1a1a2e`  | Gradient text  | City-pop glow |

### Profile Section

| Mode         | Photo Border             | Subtitle                 | Extra                  |
| ------------ | ------------------------ | ------------------------ | ---------------------- |
| Professional | Rust ring on hover       | "Ph.D. Candidate @ MIT"  | Clean, minimal         |
| Personal     | Animated gradient border | "Dota2ForLife" prominent | Steam status indicator |

### Cards (Publications, Projects, Blog)

| Mode         | Background      | Shadow      | Hover               |
| ------------ | --------------- | ----------- | ------------------- |
| Professional | White `#FFFFFF` | Subtle gray | Rust accent border  |
| Personal     | Dark `#252542`  | Soft glow   | Gradient border-top |

### Code Blocks

| Mode         | Background              | Syntax Accent              |
| ------------ | ----------------------- | -------------------------- |
| Professional | Light gray `#f5f5f5`    | Rust highlights            |
| Personal     | Dark terminal `#1e1e2e` | City-pop gradient keywords |

---

## Personal Mode Exclusive Content

### Hero Pool Section

Displays 3-5 favorite Dota heroes below the bio.

```
┌─────────────────────────────────────────┐
│  Hero Pool                              │
├─────────────────────────────────────────┤
│  [Invoker]  [Rubick]  [Puck]  [ES]      │
│   ⭐ Main                               │
└─────────────────────────────────────────┘
```

- Circular hero portraits from Dota 2 CDN
- Hover reveals hero name + optional stats

### Currently Widget

Shows current interests/activities.

```yaml
currently:
  playing: "Dota 2 (Ancient III)"
  reading: "The Alignment Problem"
  watching: "Frieren"
```

---

## File Structure

```
_sass/
├── _variables.scss      # Color variables + persona tokens
├── _themes.scss         # [data-persona] scoped styles
├── _typography.scss     # Space Grotesk + Satoshi setup
├── _components.scss     # Hero Pool, Currently widget
└── _transitions.scss    # Mode switch animations

assets/js/
└── persona-toggle.js    # Easter egg logic, localStorage

_includes/
├── hero-pool.liquid     # Hero showcase component
└── currently.liquid     # Now playing/reading widget

_data/
└── personal.yml         # Dota heroes, current interests
```

---

## Implementation Phases

### Phase 1: Foundation

- Add Space Grotesk, Satoshi, Space Mono fonts
- Update color variables to warm beige + rust
- Adjust components to new color scheme

### Phase 2: Personal Mode Styling

- Add `[data-persona="personal"]` CSS rules
- Dark colors, gradient accents, glow effects
- Code block theming

### Phase 3: Easter Egg Interaction

- Create `persona-toggle.js` with click counter
- Visual hints on profile photo
- Smooth transition animation
- localStorage persistence

### Phase 4: Personal Mode Content

- Create `_data/personal.yml`
- Build `hero-pool.liquid` component
- Build `currently.liquid` widget
- Conditional rendering in about layout

### Phase 5: Polish

- Transition timing refinement
- Optional sound effect toggle
- Dark/light mode compatibility within each persona
- Mobile responsiveness
- Accessibility review

---

## Summary Table

| Element         | Professional Mode       | Personal Mode             |
| --------------- | ----------------------- | ------------------------- |
| Background      | `#FAF9F7` warm beige    | `#1a1a2e` twilight        |
| Accent          | `#c75b39` rust          | Gradient (peach→lavender) |
| Typography      | Space Grotesk + Satoshi | Same + gradient headers   |
| Trigger         | Default                 | Click profile 3x          |
| Special content | —                       | Hero Pool, Currently      |
| Vibe            | Scholarly, minimal      | City-pop, cozy gaming den |
