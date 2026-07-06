// ── Theme toggle ──────────────────────────────────────────────
const THEME_KEY = 'portfolio-theme';
const COLOR_KEY = 'portfolio-hl';

const THEME_CYCLE = ['light', 'dark', 'ascii'];
const THEME_ICONS = { light: '☾', dark: '▓', ascii: '☀' };
const THEME_TITLES = { light: 'Dark mode', dark: 'ASCII mode', ascii: 'Light mode' };

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = THEME_ICONS[theme] || '☾';
    btn.title = THEME_TITLES[theme] || '';
  }
  if (theme === 'ascii') buildAsciiPhoto();
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const pref  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || pref);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const idx = THEME_CYCLE.indexOf(current);
  const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// ── ASCII photo converter ──────────────────────────────────────
const ASCII_CHARS = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' '];

function imageToAscii(img, cols) {
  const canvas = document.createElement('canvas');
  const charAspect = 2.2; // chars are taller than wide
  const rows = Math.round((cols * img.naturalHeight) / img.naturalWidth / charAspect);
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, cols, rows);
  const data = ctx.getImageData(0, 0, cols, rows).data;
  let result = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const brightness = (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114) / 255;
      result += ASCII_CHARS[Math.floor(brightness * (ASCII_CHARS.length - 1))];
    }
    result += '\n';
  }
  return result;
}

function buildAsciiPhoto() {
  const existing = document.querySelector('.ascii-photo');
  if (existing && existing.textContent.trim()) return; // already built

  const realImg = document.querySelector('.hero-photo');
  if (!realImg) return;

  const placeholder = existing || document.createElement('pre');
  placeholder.className = 'ascii-photo';
  placeholder.textContent = 'Loading...\n(converting photo)';

  if (!existing) {
    // insert after the real photo container
    const container = realImg.closest('.hero-photo-wrap') || realImg.parentElement;
    container.insertAdjacentElement('afterend', placeholder);
  }

  const doConvert = () => {
    placeholder.textContent = imageToAscii(realImg, 68);
  };

  if (realImg.complete && realImg.naturalWidth > 0) {
    doConvert();
  } else {
    realImg.addEventListener('load', doConvert, { once: true });
  }
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
