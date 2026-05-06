# Endurance Sport Travel — Elegant Redesign PRD

## Original Problem Statement
> I have built a site at https://www.endurancesporttravel.com/. I would like to change the design to have it feel more elegant. I also want to make sure that people understand that we are not offering discount travel packages.

## Architecture
- **Frontend**: React 19 (CRA + craco) + Tailwind + framer-motion + Lenis smooth scroll
- **Backend**: FastAPI (existing scaffolding, not used for the redesign — static marketing site)
- **Design System**: Cormorant Garamond (serif display) + Manrope (sans body); Pale Sand (#F7F5F0) + Deep Pine (#2C3E35) + Charcoal (#111111) + Gold (#B08D57) accent

## User Personas
- Serious endurance athletes (marathoners, Ironman triathletes, cyclists) — affluent professionals, 35–60, time-poor, standards-driven. Not shopping for discounts — shopping for a trusted concierge.

## Core Requirements (Static)
1. Feel **elegant, editorial, and premium** — clearly NOT a discount travel site.
2. Clearly communicate anti-discount positioning.
3. Preserve existing content pillars: Run Travel, Triathlon Travel, Cycling Travel, Featured Destinations, Heritage since 1996, "Division of Outdoor Travel Adventures."
4. Responsive, modern, animation-rich but restrained.

## What's Been Implemented (Jan 2026 — v1)
- **Sticky glass navigation** with backdrop blur, serif logotype (Endurance Sport Travel), anchor links, pill Start-Planning CTA
- **Editorial hero**: huge Cormorant serif headline "Race travel, *curated* around the athlete." + split layout + 16:9 Kona hero image + Deep Pine stats pillar ("29 years · 46 countries"). Parallax scroll on hero image.
- **Marquee** of iconic races (Boston, Kona, Berlin, Nice, Paris-Roubaix, NYC, London, Giro, Chicago, 70.3 Worlds, Tokyo, Leadville)
- **Philosophy section** front-and-center: *"This is not a discount travel site. We do not sell packages, race-day bundles, or stock itineraries. We compose bespoke race journeys — by hand, one athlete at a time."* Plus three pillars: Curated / Training-first / Concierge.
- **Services (Run / Triathlon / Cycling)** — alternating asymmetric rows with large imagery and editorial copy
- **Featured Destinations** — Kona + Nice featured tiles (tetris grid) + ranked destination list (Boston, Berlin, St. George, NYC, Nice, Kona) with hover animation
- **Why ESTravel** — Deep Pine section with subtle grain texture, stats (1996, 3,400+, 46, 100% Bespoke)
- **Testimonials** — three editorial quote blocks
- **Start Planning form** — name/email/race; success confirmation; copy reinforces "We do not sell discount packages"
- **Footer** — division attribution, contact, "Bespoke · Never Discounted" tagline, discreet "By Referral" link (with lock icon)
- **By Referral Vault** (Jan 2026 — v2) — `/referral` route with passphrase gate (current passphrase: `finishline`, stored client-side). Editorial lock page with "A quiet record of athletes we have served" + passphrase card + Request-an-Introduction fallback. Behind the gate: Directory with 16 redacted-initial entries (podiums, PRs, 6-Star finishes), filter pills (All/Marathon/Triathlon/Cycling), and a "If you've seen enough, we should talk" CTA back to home planning. SessionStorage persists unlock.
- **Motion**: Lenis smooth scroll, framer-motion fade-up staggered reveals, parallax hero image, marquee, hover underline, image zoom
- **Routing**: React Router with `/` (Home) and `/referral` (Vault)

## Deferred / Backlog (P1–P2)
- P1: Real backend form endpoint (currently local-only success state)
- P1: CMS/destination detail pages (Boston, Kona, Berlin deep-dive pages)
- P1: Multi-page routing (About, Journal, Contact)
- P2: Athlete journal / editorial blog
- P2: Newsletter integration (Resend / Mailchimp)
- P2: Testimonial carousel with real client photos
- P2: "Plan by Calendar" filter view

## Next Action Items
- User review of new design direction
- Provide real testimonials and athlete photos
- Decide whether to port to production (WordPress / Webflow / custom host)
- Connect form submissions to email/CRM
