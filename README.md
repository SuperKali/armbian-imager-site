<p align="center">
  <a href="https://imager.armbian.com">
    <img src="public/assets/armbian-logo.png" alt="Armbian Imager" height="80" />
  </a>
</p>

<h3 align="center">Armbian Imager — Website</h3>

<p align="center">
  The official marketing website for <a href="https://github.com/armbian/imager">Armbian Imager</a>, the open-source tool that flashes Armbian OS to single-board computers.
  <br />
  <a href="https://imager.armbian.com"><strong>Visit the live site &rarr;</strong></a>
</p>

---

## Overview

A single-page, responsive website built with **Next.js 16**, **Tailwind CSS v4**, and **Framer Motion**. It showcases Armbian Imager's features, walks users through the flashing process, provides platform downloads (fetched live from GitHub Releases), and highlights community testimonials. Includes a live interactive mockup of the Armbian Imager app and real-time service status monitoring.

### Sections

| Section | Description |
|---------|-------------|
| **Navbar** | Sticky navigation with scroll-aware active section highlighting and dark/light toggle |
| **Hero** | Headline, CTAs, live GitHub stars counter, and animated app mockup (desktop) |
| **Features** | Six feature cards with hover effects (300+ boards, verification, 18 languages, caching, auto-updates, cross-platform) |
| **How It Works** | Five-step visual walkthrough with scroll-triggered animations |
| **Downloads** | Platform-specific downloads fetched live from the latest GitHub Release with loading skeletons |
| **Testimonials** | Community and press quotes from YouTubers, journalists, and developers |
| **Community** | Forum, GitHub, IRC links and contribution CTA |
| **Footer** | Social links (GitHub, Forum, Discord), project links, service status indicator |

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── layout.tsx            # Root layout, metadata, JSON-LD structured data
│   ├── page.tsx              # Main landing page
│   ├── not-found.tsx         # Custom 404 page
│   ├── globals.css           # Tailwind CSS v4 imports and custom styles
│   ├── robots.ts             # robots.txt generation
│   └── sitemap.ts            # sitemap.xml generation
├── sections/                 # Page sections (hero, features, downloads, etc.)
├── components/
│   ├── app-mockup/           # Interactive Armbian Imager mockup (9 modules)
│   │   ├── index.tsx         # Main orchestration (state, effects, layout)
│   │   ├── types.ts          # Shared TypeScript types
│   │   ├── constants.ts      # CDN URLs, colors, badges, flash stages
│   │   ├── theme.ts          # Dark/light theme context
│   │   ├── data.ts           # API data processing and selection logic
│   │   ├── home-cards.tsx    # Step pills and selection cards
│   │   ├── modals.tsx        # Manufacturer/board/OS/storage/confirm modals
│   │   ├── flash-views.tsx   # Flash progress, completion views
│   │   └── image-components.tsx  # Board and vendor image components
│   ├── icons/                # Custom SVG icons (Discord)
│   ├── ui/                   # shadcn/ui primitives (button, skeleton)
│   ├── ambient-glow.tsx      # Reusable ambient background glow effect
│   ├── hover-card.tsx        # Polymorphic hover card (div or anchor)
│   ├── motion-wrapper.tsx    # Scroll-triggered animation wrapper
│   ├── scroll-link.tsx       # Smooth scroll navigation link
│   ├── section-heading.tsx   # Consistent section title component
│   ├── section-observer.tsx  # Intersection Observer for active section
│   ├── service-status.tsx    # Live service status indicator
│   └── theme-toggle.tsx      # Dark/light mode toggle
├── content/                  # All copy and data — no hardcoded strings
├── lib/                      # Utilities and animation variants
├── providers/                # React context providers (theme, active section)
├── public/assets/            # Static images and logos
├── server.js                 # Custom standalone server for cPanel/Docker
├── next.config.ts            # Next.js configuration (standalone output)
├── postcss.config.mjs        # PostCSS / Tailwind
└── components.json           # shadcn/ui configuration
```

## Editing Content

All text and data lives in `content/`. Edit the relevant file — no component changes needed.

| File | Controls |
|------|----------|
| `content/site.ts` | Page title, meta description, canonical URL |
| `content/navigation.ts` | Navbar links |
| `content/hero.ts` | Hero title, subtitle, CTA buttons |
| `content/features.ts` | Feature cards (6 items) |
| `content/steps.ts` | "How It Works" steps (5 items) |
| `content/downloads.ts` | Platform definitions, GitHub Release API URL, asset mapping |
| `content/testimonials.ts` | Community and press quotes |
| `content/community.ts` | Community links and contribution ways |
| `content/footer.ts` | Footer link columns, social links, license, copyright |
| `content/types.ts` | Shared TypeScript interfaces for all content |

## App Mockup

The interactive mockup in the hero section (`components/app-mockup/`) is a fully animated recreation of the Armbian Imager desktop app. It:

- Fetches real board and OS data from the Armbian API
- Auto-advances through the full workflow (select manufacturer → board → OS → storage → flash → done)
- Cycles through different boards on each loop
- Respects `prefers-reduced-motion` (hidden when enabled)
- Only renders on `lg:` screens (hidden on mobile/tablet)

## Building for Production

```bash
npm run build
```

Produces a standalone output in `.next/standalone/`.

### Standalone Deployment (cPanel / VPS / Docker)

```bash
npm run deploy:prepare
```

This builds the project and copies all required assets into `.next/standalone/`. Upload that directory to your server and start it with:

```bash
NODE_ENV=production node server.js
```

#### cPanel Setup

1. **Setup Node.js App** in cPanel
2. Set **Node.js version** to 18+, **mode** to Production, **startup file** to `server.js`
3. Set `NODE_ENV=production`
4. Start the application

> Make sure `.next/static/` and `public/` are inside the standalone directory. The `deploy:prepare` script handles this automatically.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run deploy:prepare` | Build + assemble standalone directory |

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, TypeScript, Turbopack, standalone output
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-first configuration
- [shadcn/ui](https://ui.shadcn.com) — Accessible component primitives
- [Framer Motion](https://motion.dev) — Viewport-triggered and layout animations
- [next-themes](https://github.com/pacocoursey/next-themes) — Dark / light mode
- [Lucide](https://lucide.dev) — Icon library
- [Vercel Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights) — Performance monitoring

## License

GPL-2.0 — see [LICENSE](LICENSE) for details.
