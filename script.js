// script.js

// -----------------------------
// Helpers
// -----------------------------
const $ = (sel) => document.querySelector(sel);

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const icon = $("#themeToggle .icon");
  if (icon) icon.textContent = theme === "dark" ? "☀" : "☾";
}

function getPreferredTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;

  // fallback to OS preference
  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

// -----------------------------
// Init: year in footer
// -----------------------------
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// -----------------------------
// Theme toggle
// -----------------------------
const themeBtn = $("#themeToggle");
if (themeBtn) {
  setTheme(getPreferredTheme());

  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

// -----------------------------
// Mobile menu toggle
// -----------------------------
const menuBtn = $("#menuToggle");
const mobileMenu = $("#mobileMenu");

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.hidden = true;
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
}

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.hidden = false;
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
}

if (menuBtn && mobileMenu) {
  menuBtn.setAttribute("aria-expanded", "false");

  menuBtn.addEventListener("click", () => {
    const isHidden = mobileMenu.hidden;
    if (isHidden) openMobileMenu();
    else closeMobileMenu();
  });

  // Close menu when a link is clicked
  mobileMenu.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.tagName === "A") closeMobileMenu();
  });

  // Close menu on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });

  // Close menu when resizing to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMobileMenu();
  });
}

// -----------------------------
// Optional: highlight active nav section (small + clean)
// -----------------------------
const sections = ["about", "publications", "experience", "projects", "awards", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navLinks = Array.from(document.querySelectorAll(".nav-links a"));

if (sections.length && navLinks.length && "IntersectionObserver" in window) {
  const linkByHash = new Map(navLinks.map((a) => [a.getAttribute("href"), a]));

  const obs = new IntersectionObserver(
    (entries) => {
      // pick the most visible entry
      const visible = entries
        .filter((x) => x.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

      if (!visible) return;

      navLinks.forEach((a) => a.classList.remove("active"));
      const hit = linkByHash.get("#" + visible.target.id);
      if (hit) hit.classList.add("active");
    },
    { root: null, threshold: [0.25, 0.4, 0.55] }
  );

  sections.forEach((s) => obs.observe(s));
}
