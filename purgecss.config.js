module.exports = {
  content: ["_site/**/*.html", "_site/**/*.js"],
  css: ["_site/assets/css/*.css"],
  output: "_site/assets/css/",
  skippedContentGlobs: ["_site/assets/**/*.html"],
  safelist: {
    standard: [
      // Persona toggle system
      "persona-transition",
      "persona-toast",
      "personal-only",
      // Hero pool component
      "hero-pool",
      "hero-pool-title",
      "hero-pool-grid",
      "hero-card",
      "hero-portrait",
      "hero-name",
      "hero-main-badge",
      // Currently widget
      "currently-widget",
      "currently-title",
      "currently-item",
    ],
    deep: [
      // Protect all data-persona attribute selectors
      /data-persona/,
      // Protect gradient-related animations
      /gradient-rotate/,
    ],
    greedy: [
      // Protect any class starting with persona- or hero- or currently-
      /^persona-/,
      /^hero-/,
      /^currently-/,
    ],
  },
};
