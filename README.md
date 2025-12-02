# 👗 Modas Bety — Official Website

_A modern, responsive Landing Page for a haute couture atelier in Trujillo, Peru._

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat-square&logo=astro&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/Status-Live-success?style=flat-square)
![License](https://img.shields.io/badge/License-Private-red?style=flat-square)

<!-- ==================== DEMO SECTION ==================== -->

## 🔗 Live Site

[Modas Bety](https://modasbety.vercel.app/)🌸

<!-- ==================== FEATURES SECTION ==================== -->

## Features

- **Mobile-First Design** — Responsive layout prioritized for mobile devices, ensuring seamless adaptation to tablets and desktops.
- **Custom UX/UI** — Fully bespoke interface design reflecting the brand's haute couture identity, moving away from generic templates.
- **Performance-First Architecture** — Implements "Facade Pattern" for Google Maps to prevent iframe blocking, and optimized image loading strategies (`createImageBitmap` for canvas).
- **Interactive Gallery** —
  - Responsive Grid with "Load More" functionality to manage DOM size.
  - Native `<dialog>` Lightbox with **touch swipe gestures** and keyboard navigation support.
- **Custom Animations** —
  - Canvas API implementation for falling Sakura petals (optimized with `requestAnimationFrame` and `ResizeObserver`).
  - Infinite carousel powered by **Swiper.js** with hardware acceleration and touch support.
- **SEO Optimized** — Full JSON-LD Structured Data for LocalBusiness, Open Graph tags, and semantic HTML5.
- **Accessibility (a11y)** — WCAG 2.1 compliant, including `prefers-reduced-motion` support for animations.
- **Business Integrations** — WhatsApp API integration for direct quotes and dynamic copy-to-clipboard functionality.

<!-- ==================== TECH STACK SECTION ==================== -->

## Tech Stack

- **Astro 5** — Static site generator (SSG) for zero-JavaScript default frontend architecture.
- **Tailwind CSS 4** — Utility-first CSS framework using the new Vite integration.
- **JavaScript (ES6+)** — Vanilla JS used for client-side interactivity, DOM manipulation, and Canvas logic.
- **TypeScript** — Used for data modeling (`siteData.ts`) and component props to ensure type safety during build time.
- **Swiper.js** — Modern touch slider for the services carousel.
- **Astro Icon** — Optimized SVG icon system.
- **Canvas API** — Native HTML5 Canvas for high-performance background animations.
- **Vercel** — CI/CD pipeline and edge network deployment.

<!-- ==================== PROJECT STRUCTURE SECTION ==================== -->

## Project Structure

```text
modasbety/
├── public/
│   ├── images/             # Static assets and manifest
│   └── site.webmanifest    # PWA Manifest
├── src/
│   ├── assets/             # Optimized images (processed by Astro)
│   ├── components/         # Reusable Astro components
│   │   ├── layout/         # Header, Footer, Canvas
│   │   ├── sections/       # Landing page sections (Hero, Gallery, Contact)
│   │   └── ui/             # Atomic UI elements (Buttons, SocialNav)
│   ├── data/               # Single source of truth for Site & Contact Info
│   ├── layouts/            # Base layout with SEO & Metadata
│   ├── pages/              # Route definitions
│   ├── scripts/            # Client-side vanilla JS (Animations, Utils)
│   └── styles/             # Global Tailwind CSS configuration
├── astro.config.mjs        # Astro configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

<!-- ==================== GETTING STARTED SECTION ==================== -->

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/jAlejandroGM/modasbety-landingpage.git
cd modasbety-landingpage
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Build

Generate a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

<!-- ==================== LICENSE SECTION ==================== -->

## License

This project is private and was developed exclusively for Modas Bety.  
Redistribution, modification, or commercial use is not permitted without prior authorization from the author.

<!-- ==================== AUTHOR SECTION ==================== -->

## Author

Designed and developed with ☕ by **Alejandro Guzmán** [@alguzdev](https://alguzdev.vercel.app/)

---

_This is a real-world client project developed as part of a professional web development portfolio._
