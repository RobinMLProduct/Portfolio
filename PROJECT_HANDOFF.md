# Robin Moenne Loccoz — Portfolio Site · Project Handoff

## Context
This is a fully built 5-page static HTML portfolio website for Robin Moenne Loccoz, Senior Product Manager / PO and PMP-certified Project Manager based in Switzerland. The site was built with Claude Code (Anthropic's CLI tool). This file is a handoff so another Claude instance can continue the project.

All files are stored locally at:
`/Users/613502/Library/CloudStorage/OneDrive-Cognizant/Documents/Portfolio Site/`

---

## File Structure

```
Portfolio Site/
├── index.html          ← Landing page
├── experience.html     ← Career timeline
├── education.html      ← Certifications, degree, languages, hobbies
├── testimonials.html   ← Client/colleague quotes + award
├── contact.html        ← Contact details + profile summary
├── style.css           ← Full design system
└── nav.js              ← Shared JS: theme toggle, mobile nav, colour picker
```

No framework, no build tool, no dependencies beyond Google Fonts (Inter). Pure HTML/CSS/JS.

---

## Design System

- **Font:** Inter (Google Fonts)
- **Style:** Minimal, clean, black and white with a single accent — the highlight colour
- **Dark mode:** Toggle (☾/☀) in nav, persisted in `localStorage` as `portfolio-theme`, applied via `data-theme="dark"` on `<html>`
- **Highlight colour:** Marker-pen effect via `.hl` CSS class using `background: var(--hl)`. Default: warm yellow `#ffe566`. Visitor picks from 6 pastel swatches fixed at bottom-right of every page. Persisted in `localStorage` as `portfolio-hl`
- **All colours are CSS custom properties** in `:root` and `[data-theme="dark"]` — restyling the whole site means changing ~10 variables at the top of `style.css`

### CSS Variables (light mode defaults)
```css
--bg: #ffffff;
--bg-alt: #f5f5f5;
--fg: #0a0a0a;
--fg-muted: #555555;
--border: #e0e0e0;
--card-bg: #ffffff;
--hl: #ffe566;        /* highlight colour — changes when visitor picks a swatch */
--hl-dark: #0a0a0a;  /* text colour on top of highlight */
```

### Key CSS Classes
| Class | Purpose |
|---|---|
| `.hl` | Marker-pen highlight on inline text |
| `.tag` | Pill/badge (skills, technologies) |
| `.btn .btn-primary` | Black filled button |
| `.btn .btn-secondary` | Ghost/outline button |
| `.section-label` | Small uppercase label with highlight left-border |
| `.timeline-item` | Two-column experience row |
| `.edu-card` | Certification/education card |
| `.testimony` | Individual quote block |
| `.overview-card` | Clickable card on landing page |
| `.stat-card` | Number + label stat in hero |

---

## nav.js — What It Does

Single shared script at the bottom of every page:
1. **Theme toggle** — reads/writes `portfolio-theme` in localStorage
2. **Mobile nav** — hamburger toggles `.open` on `.nav-links`
3. **Active link** — adds `.active` class to current page nav link
4. **Colour picker** — builds 6-swatch panel, reads/writes `portfolio-hl` in localStorage

Colour palette (editable in the `PALETTES` array in nav.js):
- Yellow `#ffe566` (default), Pink `#ffb3c6`, Mint `#b5ead7`, Lavender `#c9b8e8`, Peach `#ffcba4`, Sky `#aee2ff`

---

## Robin's Personal Details (in the site)

- **Email:** robin.moenneloccoz@cognizant.com
- **Phone:** +41 76 681 0360
- **LinkedIn:** linkedin.com/in/moenneloccoz
- **Location:** Switzerland (open to global opportunities)
- **Languages:** English C1/C2, French (native), German C1

---

## Experience (newest first, all in experience.html)

1. **Avolta (ex-Dufry)** — Global Digital Product Manager, Digital Loyalty — May 2024–Oct 2025
   - Club Avolta rebranding, loyalty mobile app (React Native), Magento websites, 5 Scrum teams (SAFe), reporting to Global Senior Director
2. **BMW Group** — Product Owner / Team Lead / Deputy Programme Manager, Big Data for Connected Vehicles — Feb 2021–Nov 2023
   - 40+ data engineers (Germany/India), AWS, programme turnaround from negative margin to double-digit profitability
3. **Vaillant Group** — Proxy PO / Scrum Master / Agile Coach, Data Entry Tool China — Oct 2020–Jan 2021
   - Chinese data compliance, rapid delivery, international remote team
4. **Lufthansa Group / SWISS** — Project Leader / PO, Lufthansa Group App — Jan 2017–May 2020
   - Cross-airline mobile apps (Android/iOS), SWISS app launch March 2020
5. **Lloyds Banking Group** — Product Owner, Mobile Banking for Businesses — Jul 2013–Dec 2014
   - Lloyds Bank + Bank of Scotland first mobile app — #1 Finance App on App Store
6. **Ricardo.ch** — PO, Buyer Experience (Responsive Redesign)
7. **Siroop.ch** — E-commerce PO, Buyer's Journey (Coop/Swisscom marketplace launch)
8. **Orange Group** — Senior International Product Manager, Mobile (8+ countries)

---

## Education & Certifications (in education.html)

- PMP — Project Management Professional (PMI, April 2026)
- Cognizant Program Manager Development (October 2025)
- Google Cloud Digital Leader (October 2023)
- AWS Cloud Practitioner (August 2022)
- SAFe Practitioner — Scaled Agile Framework (2020)
- Master's Degree — Integration of Communication Products and Services, Université de Marne-la-Vallée, Paris (2003–2004)

Hobbies: Endurance running · cycling · literature · skateboarding

---

## Testimonials (in testimonials.html)

**Avolta ×3:** Anthony Chierruzi (Global Director Digital), Paula Alvarez (Global Digital Commerce Manager), A. (Senior Programme Manager)

**BMW ×4:** Bernd Streppel (Lead, Vehicle Related Data), Daniel Neumeier (Data Engineer), Koray Kocak (Lead Big Data Engineer), Jonas Ertel (Lead Big Data Engineer)

**Vaillant ×1:** Thorsten Krieger (Head of Group IT)

**SWISS/Lufthansa ×1:** Stefanie Schweikart (Chief PO / Team Lead SWISS Mobile Applications)

**Award:** Cognizant — Best People Manager Award 2021

---

## What Has NOT Been Built Yet

1. **GitHub repository** — files are local only, not yet pushed
2. **Netlify deployment** — no live URL yet
3. **Domain name** — not purchased (recommended: `rml.pm` as primary — `.pm` = Product Manager, initials + job title; `robinpm.com` as fallback; `.ch` not recommended as it limits international positioning)
4. **AI chat agent** — discussed but not built. Plan:
   - Netlify serverless function at `netlify/functions/chat.js`
   - Calls Anthropic Claude API (Haiku 4.5 model — cheapest, sufficient for CV Q&A)
   - System prompt grounds the agent in Robin's background with guardrails
   - Cost controls: $5/month hard cap in Anthropic Console, `max_tokens: 400`, client-side 10 messages/session limit, server-side IP rate limiting
   - API key stored as Netlify environment variable (never in code)
5. **Analytics** — not installed (recommended: Plausible for GDPR-clean Swiss context, or Google Analytics 4 free)
6. **Agent monitoring** — not set up (recommended: Langfuse free tier for conversation tracing + Anthropic Console for cost)

---

## Decisions Already Made

- **No CMS** — files are simple enough to edit directly or via Claude
- **No Docker, no Flowise, no LangChain** — overkill for a portfolio chat widget
- **Hosting stack:** GitHub (source) → Netlify (auto-deploy on push, free tier, serverless functions)
- **Domain registrar:** Namecheap or Cloudflare Registrar (cheaper than GoDaddy, no dark patterns)
- **Agent system prompt** lives in the Netlify function server-side — visitors never see it
- **Claude personal account** (free) is separate from the Anthropic API — the agent needs an API key from console.anthropic.com, not a claude.ai subscription upgrade

---

## Recommended Next Steps (in order)

1. Create free GitHub account → upload the 6 files to a new public or private repo
2. Connect GitHub repo to Netlify (free) → site deploys automatically on every save
3. Buy domain on Namecheap → point DNS to Netlify (A record + CNAME, ~5 minutes)
4. Create Anthropic API account at console.anthropic.com → get API key → set $5 monthly spend cap
5. Create `netlify/functions/chat.js` + chat widget HTML → push to GitHub → auto-deploys
6. Add analytics script tag (Plausible or GA4) to all 5 HTML pages
7. Add Langfuse logging to the Netlify function

---

## How to Edit the Site

- **Update experience:** edit `.timeline-item` blocks in `experience.html`
- **Add certification:** add `.edu-card` block in `education.html`
- **Change highlight colour palette:** edit `PALETTES` array in `nav.js`
- **Change default highlight colour:** change `--hl: #ffe566` in `:root` in `style.css`
- **Restyle the whole site:** change CSS variables in `:root` and `[data-theme="dark"]` at top of `style.css`
- **Add a new page:** copy structure from any existing page, update `<title>`, add a `<li>` to the nav in all 5 pages

---

*Built with Claude Code (Anthropic CLI) · July 2026*
