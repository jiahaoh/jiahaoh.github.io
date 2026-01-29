/**
 * Persona Toggle - Easter egg to switch between Professional and Personal modes
 * Trigger: Click profile photo 3 times
 */

(function () {
  const STORAGE_KEY = "persona";
  const STORAGE_TIMESTAMP_KEY = "persona_timestamp";
  const EXPIRY_HOURS = 24;
  const CLICK_THRESHOLD = 3;
  const CLICK_TIMEOUT = 2000;

  let clickCount = 0;
  let clickTimer = null;

  function isPersonaExpired() {
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    if (!timestamp) return true;
    const hoursSince = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60);
    return hoursSince > EXPIRY_HOURS;
  }

  function getPersona() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("professional")) {
      return "professional";
    }
    if (isPersonaExpired()) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
      return "professional";
    }
    return localStorage.getItem(STORAGE_KEY) || "professional";
  }

  function setPersona(persona) {
    localStorage.setItem(STORAGE_KEY, persona);
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    applyPersona(persona);
  }

  function applyPersona(persona) {
    const html = document.documentElement;
    html.classList.add("persona-transition");
    html.setAttribute("data-persona", persona);

    showToast(
      persona === "personal" ? "Welcome to the other side" : "Back to business"
    );

    setTimeout(() => {
      html.classList.remove("persona-transition");
    }, 600);

    document.querySelectorAll(".personal-only").forEach((el) => {
      el.style.display = persona === "personal" ? "" : "none";
    });
  }

  function showToast(message) {
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
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  function addGlowHint(photo, intensity) {
    const colors = ["#f4a261", "#e076a0", "#9d8cff"];
    const color = colors[Math.min(intensity - 1, 2)];
    const blur = 5 + intensity * 5;
    photo.style.boxShadow = `0 0 ${blur}px ${color}`;
    photo.style.transition = "box-shadow 0.3s ease";
  }

  function resetGlow(photo) {
    photo.style.boxShadow = "";
  }

  function handlePhotoClick(event) {
    const photo = event.currentTarget;
    if (clickTimer) clearTimeout(clickTimer);
    clickCount++;
    addGlowHint(photo, clickCount);

    if (clickCount >= CLICK_THRESHOLD) {
      const currentPersona = getPersona();
      const newPersona =
        currentPersona === "professional" ? "personal" : "professional";
      setPersona(newPersona);
      clickCount = 0;
      resetGlow(photo);
    } else {
      clickTimer = setTimeout(() => {
        clickCount = 0;
        resetGlow(photo);
      }, CLICK_TIMEOUT);
    }
  }

  function init() {
    const persona = getPersona();
    document.documentElement.setAttribute("data-persona", persona);

    document.addEventListener("DOMContentLoaded", () => {
      const profilePhoto = document.querySelector(".profile img");
      if (profilePhoto) {
        profilePhoto.style.cursor = "pointer";
        profilePhoto.addEventListener("click", handlePhotoClick);
      }
      applyPersona(persona);
    });
  }

  init();
})();
