# Website Update Notes

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
