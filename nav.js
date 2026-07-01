// ── Theme toggle ──────────────────────────────────────────────
const THEME_KEY = 'portfolio-theme';
const COLOR_KEY = 'portfolio-hl';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀' : '☾';
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const pref  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || pref);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// Mobile nav
function toggleMobileNav() {
  const links = document.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}

// Active link
function setActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ── Highlight colour picker ────────────────────────────────────
const PALETTES = [
  { name: 'Yellow',   hex: '#ffe566' }, // default
  { name: 'Pink',     hex: '#ffb3c6' },
  { name: 'Mint',     hex: '#b5ead7' },
  { name: 'Lavender', hex: '#c9b8e8' },
  { name: 'Peach',    hex: '#ffcba4' },
  { name: 'Sky',      hex: '#aee2ff' },
];

function applyColor(hex) {
  document.documentElement.style.setProperty('--hl', hex);
  localStorage.setItem(COLOR_KEY, hex);
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.hex === hex);
  });
}

function buildColorPicker() {
  const picker = document.getElementById('color-picker');
  if (!picker) return;

  const label = document.createElement('div');
  label.id = 'color-picker-label';
  label.textContent = 'Highlight';

  const swatches = document.createElement('div');
  swatches.id = 'color-swatches';

  PALETTES.forEach(({ name, hex }) => {
    const btn = document.createElement('button');
    btn.className = 'swatch';
    btn.dataset.hex = hex;
    btn.style.background = hex;
    btn.title = name;
    btn.setAttribute('aria-label', name + ' highlight');
    btn.addEventListener('click', () => applyColor(hex));
    swatches.appendChild(btn);
  });

  picker.appendChild(label);
  picker.appendChild(swatches);

  // Restore saved or default
  const saved = localStorage.getItem(COLOR_KEY) || PALETTES[0].hex;
  applyColor(saved);
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setActiveLink();
  buildColorPicker();

  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);

  const mobileToggle = document.getElementById('mobileToggle');
  if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileNav);
});
