// ── Theme toggle ──────────────────────────────────────────────
const THEME_KEY = 'portfolio-theme';
const COLOR_KEY = 'portfolio-hl';
const ASCII_KEY = 'portfolio-ascii';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀' : '☾';
  if (theme === 'ascii') buildAsciiPhoto();
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const pref  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const base  = (saved === 'dark') ? 'dark' : pref;
  const ascii = localStorage.getItem(ASCII_KEY) === 'true';
  applyTheme(ascii ? 'ascii' : base);
}

function safeBase() {
  const saved = localStorage.getItem(THEME_KEY);
  return (saved === 'dark') ? 'dark' : 'light';
}

function toggleTheme() {
  // If currently in ASCII, exit ASCII and restore saved light/dark
  const current = document.documentElement.getAttribute('data-theme');
  if (current === 'ascii') {
    localStorage.setItem(ASCII_KEY, 'false');
    applyTheme(safeBase());
    updateAsciiBtn(false);
    return;
  }
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

function toggleAscii() {
  const current = document.documentElement.getAttribute('data-theme');
  if (current === 'ascii') {
    localStorage.setItem(ASCII_KEY, 'false');
    applyTheme(safeBase());
    updateAsciiBtn(false);
  } else {
    localStorage.setItem(ASCII_KEY, 'true');
    applyTheme('ascii');
    updateAsciiBtn(true);
  }
}

function updateAsciiBtn(active) {
  const btn = document.getElementById('ascii-toggle');
  if (btn) btn.classList.toggle('active', active);
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
  // Picking a colour always exits ASCII mode first
  if (document.documentElement.getAttribute('data-theme') === 'ascii') {
    localStorage.setItem(ASCII_KEY, 'false');
    applyTheme(safeBase());
    updateAsciiBtn(false);
  }
  document.documentElement.style.setProperty('--hl', hex);
  localStorage.setItem(COLOR_KEY, hex);
  document.querySelectorAll('#color-swatches .swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.hex === hex);
  });
}

function buildColorPicker() {
  const picker = document.getElementById('color-picker');
  if (!picker) return;

  // Label
  const label = document.createElement('div');
  label.id = 'color-picker-label';
  label.textContent = 'Highlight';

  // Swatches row
  const row = document.createElement('div');
  row.id = 'color-swatches';

  // Colour swatches
  PALETTES.forEach(({ name, hex }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch';
    btn.dataset.hex = hex;
    btn.style.background = hex;
    btn.title = name;
    btn.setAttribute('aria-label', name);
    btn.addEventListener('click', () => applyColor(hex));
    row.appendChild(btn);
  });

  // Visual separator
  const sep = document.createElement('span');
  sep.className = 'picker-sep';
  row.appendChild(sep);

  // ASCII toggle button
  const asciiBtn = document.createElement('button');
  asciiBtn.type = 'button';
  asciiBtn.id = 'ascii-toggle';
  asciiBtn.className = 'ascii-btn';
  asciiBtn.textContent = '>_';
  asciiBtn.title = 'ASCII mode';
  asciiBtn.setAttribute('aria-label', 'Toggle ASCII mode');
  asciiBtn.addEventListener('click', toggleAscii);
  row.appendChild(asciiBtn);

  picker.appendChild(label);
  picker.appendChild(row);

  // Restore saved colour without triggering ASCII exit
  const savedHex = localStorage.getItem(COLOR_KEY) || PALETTES[0].hex;
  document.documentElement.style.setProperty('--hl', savedHex);
  document.querySelectorAll('#color-swatches .swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.hex === savedHex);
  });

  // Restore ASCII button active state
  if (localStorage.getItem(ASCII_KEY) === 'true') updateAsciiBtn(true);
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
