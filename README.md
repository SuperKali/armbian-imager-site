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

A single-page, responsive website built with **Next.js 16**, **Tailwind CSS v4**, and **Framer Motion**. It showcases Armbian Imager's features, walks users through the flashing process, provides platform downloads (fetched live from GitHub Releases), and highlights community testimonials.

### Sections

| Section | Description |
|---------|-------------|
| **Hero** | Headline, subtitle, and primary CTA |
| **Features** | Six feature cards (300+ boards, verification, 18 languages, caching, auto-updates, cross-platform) |
| **How It Works** | Five-step visual walkthrough |
| **Downloads** | Platform downloads pulled live from the latest GitHub Release |
| **Testimonials** | Community and press quotes |
| **Community** | Links to forums, GitHub, IRC, and contribution CTA |

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
├── app/                  # Next.js App Router (layout, page, metadata, OG image)
├── sections/             # Page sections (hero, features, downloads, etc.)
├── components/           # Shared UI components (button, card, motion wrappers)
├── content/              # All copy & structured data — no hardcoded strings
├── lib/                  # Utilities and animation variants
├── providers/            # React context providers (theme, active section)
├── public/assets/        # Static images and logos
├── server.js             # Custom standalone server for cPanel/Docker
├── next.config.ts        # Next.js configuration (standalone output)
├── postcss.config.mjs    # PostCSS / Tailwind
└── components.json       # shadcn/ui configuration
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
| `content/downloads.ts` | GitHub Release API URL |
| `content/community.ts` | Community links and contribute callout |
| `content/footer.ts` | Footer link columns, license, copyright |

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
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run deploy:prepare` | Build + assemble standalone directory |

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, TypeScript, standalone output
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-first configuration
- [shadcn/ui](https://ui.shadcn.com) — Accessible component primitives
- [Framer Motion](https://motion.dev) — Viewport-triggered animations
- [next-themes](https://github.com/pacocoursey/next-themes) — Dark / light mode
- [Lucide](https://lucide.dev) — Icon library

## License

GPL-2.0 — see [LICENSE](LICENSE) for details.
