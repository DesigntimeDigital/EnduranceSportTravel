# EnduranceSportTravel — Codebase Wiki

## What Is This Project

A premium, editorial-style marketing website for a bespoke endurance race travel concierge service. Targets affluent athletes (35-60) who compete in marathons, triathlons, and cycling events worldwide. Explicitly positions as **not** a discount travel agency.

Live reference: https://www.endurancesporttravel.com/

## Architecture at a Glance

| Layer | Tech | Status |
|-------|------|--------|
| Frontend | React 18 + CRA (CRACO) + Tailwind 3 + shadcn/ui + Framer Motion + Lenis | Active, fully implemented |
| Backend | FastAPI + MongoDB (motor async) | Scaffolding only — frontend does not call it |
| Analytics | PostHog (CDN script in index.html) | Active |
| Dev Platform | Emergent (AI-assisted dev) | Dev-only |

## Directory Layout

```
endurancesporttravel/
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main app: routing + all Home page sections (~1000 lines)
│   │   ├── Referral.jsx      # Password-gated athlete vault (/referral)
│   │   ├── index.js          # React entry point (mounts App)
│   │   ├── index.css         # Global styles + Tailwind directives + custom classes
│   │   ├── App.css           # Additional app styles
│   │   ├── components/ui/    # 38 shadcn/ui components (Radix primitives)
│   │   └── hooks/
│   │       └── use-toast.js  # Toast notification hook
│   ├── public/
│   │   └── index.html        # Google Fonts, PostHog SDK, Emergent SDK
│   ├── plugins/
│   │   └── health-check/     # Webpack health monitoring plugin
│   ├── craco.config.js       # CRA overrides (path aliases, Emergent visual-edits)
│   ├── tailwind.config.js    # Tailwind + shadcn CSS variable colors
│   ├── jsconfig.json         # @/* → src/* alias
│   ├── components.json       # shadcn/ui config (new-york style, CSS vars, lucide)
│   └── package.json
├── backend/
│   ├── server.py             # FastAPI + MongoDB (StatusCheck CRUD only)
│   └── requirements.txt
├── memory/
│   └── PRD.md                # Product Requirements Document
├── design_guidelines.json    # Full design system tokens + agent instructions
└── test_reports/             # Empty pytest report directories
```

## How to Run

```bash
# Frontend dev server
cd frontend && yarn start

# Backend (standalone, not connected to frontend)
cd backend && python server.py
```

Environment variables for backend: `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS` (default `*`).

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home` (App.js) | Single-page scrolling landing with all sections |
| `/referral` | `Referral` (Referral.jsx) | Password-gated athlete vault (passphrase: `finishline`) |

## Pages and Sections

### Home Page (`App.js`)

All sections are function components defined within a single ~1000-line file:

1. **Navigation** (L38-137) — Sticky header, backdrop blur, serif logotype, mobile hamburger menu
2. **Hero** (L140-280) — Editorial headline, asymmetric grid with hero image (parallax), Deep Pine stats pillar
3. **Marquee** (L283-316) — Infinite scroll ticker of iconic races
4. **Philosophy** (L319-393) — Anti-discount positioning + three pillars (Curated, Training-first, Concierge)
5. **Services** (L396-524) — Three alternating rows: Run, Triathlon, Cycling travel
6. **Destinations** (L527-661) — Tetris grid (Kona, Nice featured tiles) + ranked destination list
7. **Why ESTravel** (L664-717) — Dark Deep Pine section with grain overlay, company stats
8. **Testimonials** (L720-783) — Three editorial quote blocks
9. **Start Planning** (L786-880) — Name/email/race form (local-only submission, no backend)
10. **Footer** (L883-959) — Four-column layout, "By Referral" link with lock icon

### Referral Vault (`Referral.jsx`)

- **Gate view** — Password input (passphrase: `finishline`), show/hide toggle, error messaging
- **Directory view** — 16 athlete entries (redacted initials), filter pills (All/Marathon/Triathlon/Cycling), CTA back to planning form
- Unlock persisted via `sessionStorage("est_referral")`

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F7F5F0` (Pale Sand) | Page background |
| Surface | `#FFFFFF` | Cards, tiles |
| Text Primary | `#111111` (Charcoal) | Body text |
| Text Secondary | `#595959` | Muted text |
| Accent | `#2C3E35` (Deep Pine) | Headings, CTAs, dark sections |
| Gold | `#B08D57` | Underlines, highlights |
| Border | `#E5E3DB` | Dividers |

**Typography:** Cormorant Garamond (serif headings) + Manrope (sans-serif body) — loaded from Google Fonts.

**Custom CSS classes:** `.eyebrow`, `.link-underline`, `.hero-img`, `.btn-primary`, `.btn-ghost`, `.rule`, `.grain`, `.marquee-track`, `.v-label`, `.dot`

Full design token spec: `design_guidelines.json`

## Backend API (Scaffolding)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/` | `{"message": "Hello World"}` |
| POST | `/api/status` | Create StatusCheck entry |
| GET | `/api/status` | List all status checks (limit 1000) |

Health check endpoints (when `ENABLE_HEALTH_CHECK=true`): `/health`, `/health/simple`, `/health/ready`, `/health/live`, `/health/errors`, `/health/stats`

**Note:** The frontend does not call any backend endpoints. Form submission is local-only.

## Dependencies — Installed but Unused

`axios`, `recharts`, `embla-carousel-react`, `sonner`, `react-hook-form`, `zod`, `cmdk`, `input-otp`, `vaul`, `next-themes`. These are in `package.json` but not imported in any source file. Consider removing to reduce bundle size before production.

## Key Implementation Notes

- **Single-file app:** All Home page sections live in `App.js` — no component splitting. Refactor into separate files if sections grow or need independent testing.
- **Images:** All from external URLs (Unsplash, Pexels). No local assets.
- **Animations:** Framer Motion (fade-up reveals, staggered entries, parallax hero), Lenis (smooth scroll), CSS (marquee, grain overlay)
- **shadcn/ui:** 38 components installed but few used — design relies on inline Tailwind classes rather than shadcn components
- **Testing:** `data-testid` attributes on interactive elements

## Deferred / Backlog

- **P1:** Real backend form endpoint
- **P1:** CMS / destination detail pages
- **P1:** Multi-page routing (About, Journal, Contact)
- **P2:** Athlete journal / editorial blog
- **P2:** Newsletter integration (Resend / Mailchimp)
- **P2:** Testimonial carousel with real client photos
- **P2:** "Plan by Calendar" filter view
