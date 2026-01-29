# Website Update Notes

## Changes Made (2026-01-28)

### Dual Persona Portfolio Feature

Added an Easter egg that toggles between Professional and Personal modes by clicking the profile photo 3 times.

#### Design Documents

- `docs/plans/2026-01-28-dual-persona-design.md` - Design spec
- `docs/plans/2026-01-28-dual-persona-implementation.md` - Implementation plan

#### Files Added

- `_sass/_typography.scss` - New typography system (Space Grotesk + Satoshi + Space Mono)
- `_sass/_components.scss` - Hero Pool and Currently widget styles
- `assets/js/persona.js` - Easter egg toggle logic with localStorage persistence
- `_includes/hero-pool.liquid` - Dota hero showcase component
- `_includes/currently.liquid` - Currently playing/reading/watching widget
- `_data/personal.yml` - Personal mode content data (Dota heroes, interests)

#### Files Modified

- `_config.yml` - Updated Google Fonts URL (Space Grotesk, Space Mono)
- `_sass/_variables.scss` - Added Professional Mode colors (warm beige #FAF9F7, rust #c75b39) and Personal Mode colors (city-pop dark palette)
- `_sass/_themes.scss` - Added `[data-persona="personal"]` styles with gradients and glow effects
- `_sass/_base.scss` - Added animated gradient border for profile photo, accessibility improvements (focus states, reduced motion, touch targets)
- `assets/css/main.scss` - Added imports for typography and components
- `_includes/head.liquid` - Added persona.js script
- `_layouts/about.liquid` - Integrated hero-pool and currently widgets
- `purgecss.config.js` - Added safelist to preserve persona-related CSS in production

#### Features

**Professional Mode (Default)**

- Warm beige background (#FAF9F7)
- Rust accent color (#c75b39)
- Space Grotesk headings, Satoshi body text
- Clean, academic aesthetic

**Personal Mode (Easter Egg)**

- Trigger: Click profile photo 3 times
- City-pop dark theme (#1a1a2e background)
- Gradient accents (peach → pink → lavender)
- Hero Pool section with Dota heroes (Windranger, QoP, Slardar, Mars, Dawnbreaker)
- Currently widget showing playing/reading/watching
- Animated gradient border on profile photo
- Toast notifications on mode switch

**Technical Details**

- 24-hour localStorage persistence
- `?professional` URL param forces professional mode
- Keyboard accessible (Tab + Enter on profile photo)
- Smooth 0.6s transition between modes

---

## Changes Made (2025-01-27)

### Files Added

- `assets/img/prof_pic.png` - Profile photo (copied from `dev/Jiahao_2(square).png`)
- `assets/pdf/CV.pdf` - CV PDF (copied from `dev/Jiahao Huang CV (2025-2).pdf`)

### Files Modified

#### `_pages/about.md`

- Updated subtitle to "Ph.D. Candidate in Chemical Biology @ MIT"
- Changed profile image from `prof_pic.jpg` to `prof_pic.png`
- Updated contact info: MIT address, email
- Enabled social icons (`social: true`)
- Replaced placeholder bio with actual research description:
  - Current position at MIT with Prof. Xiao Wang
  - Research focus areas (AI for Science, spatial transcriptomics, etc.)
  - Previous role at Broad Institute
  - Key projects: Starfinder, RIBOmap, STARmap PLUS
  - Additional interests in LLMs and agentic systems

#### `_data/cv.yml`

- Replaced Einstein placeholder with actual CV data:
  - General info: name, email, location, languages
  - Education: MIT (Ph.D.), Georgetown (M.S.), Purdue (B.S.)
  - Research interests: AI for Science, Computational Biology
  - Professional experience: MIT Research Assistant, Broad Institute
  - Skills: Programming languages and tools/frameworks

#### `_bibliography/papers.bib`

- Replaced Einstein placeholder publications with actual publications:
  1. Ren, Zeng, Huang et al. (2025) - Nature Protocols - Starfinder
  2. Zeng, Huang et al. (2023) - Science - RIBOmap
  3. Zeng, Huang et al. (2023) - Nature Neuroscience - STARmap PLUS (AD)
  4. He et al. (2021) - Nature Communications - ClusterMap
  5. Shi et al. (2023) - Nature - Mouse CNS atlas
  6. Tang et al. (2024) - Nature Methods - Search and match
  7. Ren et al. (2023) - Nature Methods - Subcellular RNA kinetics
- Marked 4 papers as `selected={true}` for homepage display
- Added co-first author annotations where applicable

### Source Files Used

- `dev/Jiahao Huang CV (2025-2).pdf` - Source of all CV/publication data
- `dev/Jiahao_2(square).png` - Profile photo

#### `_projects/`

- Removed all 9 dummy projects
- Created `1_placeholder.md` - Placeholder project page

#### `_posts/` (Blog)

- Removed all 33 dummy blog posts
- Created `2025-01-27-welcome.md` - Self-introduction post covering research focus and blog plans

#### `_pages/cv.md`

- Changed `cv_pdf` from `example_pdf.pdf` to `CV.pdf`
- Updated description to reflect actual research focus

### Files Not Modified (already correct)

- `_data/socials.yml` - Already had correct email, GitHub, LinkedIn, Google Scholar
- `_config.yml` - Already had correct name and basic settings
