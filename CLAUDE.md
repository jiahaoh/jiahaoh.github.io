# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal academic portfolio and blog built on the **al-folio** Jekyll theme. It's deployed to GitHub Pages at https://jiahaoh.github.io.

## Development Commands

### Local Development (Docker - Recommended)
```bash
docker-compose up
```
Site available at http://localhost:8080 with live reload on port 35729.

### Local Development (Native Ruby)
```bash
bundle install
bundle exec jekyll serve --watch --port=8080 --livereload
```

### Production Build
```bash
JEKYLL_ENV=production bundle exec jekyll build
```

### Code Formatting
```bash
npx prettier . --write                    # Format all files
npx prettier . --check                    # Check formatting (used in CI)
```

### Manual Deployment
```bash
bin/deploy                                # Deploy to gh-pages branch
```

## Architecture

### Content Structure
- **`_pages/`** - Static pages (about, cv, publications, projects, blog, etc.)
- **`_posts/`** - Blog posts with frontmatter (title, date, tags, categories, description)
- **`_projects/`** - Portfolio projects (importance, category, images)
- **`_bibliography/papers.bib`** - Publications in BibTeX format (auto-rendered with citation badges)

### Configuration
- **`_config.yml`** - Main site configuration (633 lines). Key sections:
  - Site metadata and author info
  - Jekyll Scholar settings for bibliography
  - Third-party library CDN links
  - Feature toggles (search, dark mode, comments, etc.)
- **`_data/socials.yml`** - Social media links (email, GitHub, LinkedIn, Google Scholar)
- **`_data/cv.yml`** - CV data (fallback if `assets/json/resume.json` not present)
- **`_sass/_themes.scss`** - Theme colors (primary: `--global-theme-color`)

### Custom Plugins (`_plugins/`)
- `google-scholar-citations.rb` - Fetches citation counts
- `inspirehep-citations.rb` - Physics citation metrics
- `external-posts.rb` - Integrates external blog posts (Medium, etc.)
- `cache-bust.rb` - Asset cache busting

### Layout System (`_layouts/`)
- `about.liquid` - Homepage/profile
- `post.liquid` - Blog posts with comments and related posts
- `bib.liquid` - Publication display with badges (Altmetric, Dimensions)
- `distill.liquid` - Distill.pub-style articles

## Key Features

- **Publications**: BibTeX-based with auto-generated citation metrics. Edit `_bibliography/papers.bib`.
- **Jupyter Notebooks**: Native support via `jekyll-jupyter-notebook`. Place notebooks in `assets/jupyter/`.
- **Math Typesetting**: MathJax enabled. Use `$$...$$` for display math, `$...$` for inline.
- **Diagrams**: Mermaid.js support in posts.
- **Dark Mode**: Auto-detects system preference, manual toggle in navbar.
- **Search**: Client-side full-text search across posts, pages, and publications.

## CI/CD

GitHub Actions workflows in `.github/workflows/`:
- **`deploy.yml`** - Builds and deploys to gh-pages on push to main
- **`prettier.yml`** - Code formatting checks on PRs
- **`broken-links.yml`** - Link validation with Lychee
- **`axe.yml`** - Accessibility testing (manual trigger)

## Important Notes

- Ruby version: 3.3.5 (specified in CI)
- The site uses aggressive CSS purging in production (purgecss)
- Responsive images auto-generated at 480, 800, 1400px widths
- Comments via Giscus (GitHub Discussions)
