# Technology Stack

_Last updated: 2026-03-31_

## Summary

StworzEvent.pl is a Next.js 16 event management platform built with TypeScript, using Prisma 7 over PostgreSQL for persistence and Tailwind CSS v4 for styling. The UI layer is heavily composed from Radix UI primitives wrapped in shadcn/ui components, with rich-text editing powered by Tiptap. Authentication is handled by better-auth, and file uploads by UploadThing.

---

## Languages

**Primary:**
- TypeScript ^5.9.3 — all application source under `src/`, strict mode enabled
- TSX — React component files throughout `src/components/` and `src/app/`

**Secondary:**
- SCSS — `src/app/base.scss` (supplemental to Tailwind)
- JSON — message files `messages/en.json`, `messages/pl.json`

---

## Runtime

**Environment:**
- Node.js (version not pinned; no `.nvmrc` or `.node-version` file detected)
- ESM (`"type": "module"` in `package.json`)

**Package Manager:**
- npm (lockfile: `package-lock.json` present)
- pnpm workspace file (`pnpm-workspace.yaml`) also present — workspace configured but primary installs use npm

---

## Frameworks

**Core:**
- Next.js ^16.1.6 — App Router, RSC, Turbopack for dev (`next dev --turbopack`)
- React ^19.2.4 — UI rendering
- React DOM ^19.2.4

**Internationalisation:**
- next-intl ^4.8.3 — locale routing (`en`, `pl`; default `pl`), server/client message loading
  - Config: `src/i18n/routing.ts`, `src/i18n/request.ts`
  - Messages: `messages/en.json`, `messages/pl.json`
  - Plugin wraps Next config in `next.config.mjs`

**Styling:**
- Tailwind CSS ^4.2.1 — utility-first CSS; PostCSS pipeline via `postcss.config.mjs`
- tailwind-merge ^3.5.0 — conditional class merging
- tailwindcss-animate ^1.0.7 — animation utilities
- tw-animate-css 1.4.0 — additional animation preset
- @tailwindcss/typography ^0.5.19 — prose styling for rich-text output
- @tailwindcss/postcss ^4.2.1 — PostCSS integration
- autoprefixer ^10.4.27
- SASS ^1.97.3 — supplemental SCSS (`src/app/base.scss`)
- Font: Poppins loaded via `next/font/google` in `src/app/[locale]/layout.tsx`

**Component Library:**
- shadcn/ui (`shadcn latest`) — "new-york" style, base color "neutral", CSS variables, icon library lucide
  - Config: `components.json`
  - Components located at `src/components/shadcn/ui/`
- Radix UI — full suite of headless primitives pinned per-package (accordion, alert-dialog, aspect-ratio, avatar, checkbox, collapsible, context-menu, dialog, dropdown-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, slot, switch, tabs, toast, toggle, toggle-group, tooltip)
- @base-ui/react latest — additional Base UI components
- lucide-react ^0.575.0 — icon set
- @tabler/icons-react latest — secondary icon set
- class-variance-authority ^0.7.1 — variant-based component styling
- clsx ^2.1.1 — conditional classNames

**Rich Text:**
- @tiptap/react ^2.27.2 + @tiptap/starter-kit ^2.27.2 — WYSIWYG editor
- Extensions: highlight, image, link, placeholder, subscript, superscript, text-align, typography, underline (all ^2.27.2)
- Editor component: `src/components/shared/rich-text-editor.tsx`
- Renderer component: `src/components/shared/rich-text-renderer.tsx`

**Data Fetching / State:**
- @tanstack/react-query ^5.90.21 — server state, caching (staleTime 60s, retry 1)
  - Provider: `src/providers/query-provider.tsx`
  - Devtools: @tanstack/react-query-devtools ^5.91.3
- SWR ^2.4.1 — alternative data fetching (used in some hooks)
- axios ^1.13.6 — HTTP client (used alongside fetch)

**Forms & Validation:**
- react-hook-form ^7.71.2 (devDependency, used as library)
- @hookform/resolvers ^5.2.2 — Zod resolver
- zod ^4.3.6 — schema validation
  - Schemas in `src/schemas/`

**Maps:**
- leaflet ^1.9.4 + react-leaflet ^5.0.0 — interactive maps
- @types/leaflet ^1.9.21

**Other UI Libraries:**
- @hello-pangea/dnd ^18.0.1 — drag-and-drop (agenda/section reordering)
- embla-carousel-react latest — carousel
- react-day-picker latest — date picker
- react-imask ^7.6.1 — input masking
- react-resizable-panels latest — resizable panel layouts
- recharts latest — charts
- sonner ^2.0.7 — toast notifications
- vaul latest — drawer component
- cmdk latest — command palette
- input-otp latest — OTP input
- yet-another-react-lightbox ^3.29.1 — image lightbox
- date-fns 4.1.0 — date utilities
- use-debounce ^10.1.0 — debounce hook
- uuid ^13.0.0 — UUID generation

**Authentication:**
- better-auth ^1.5.0 — auth framework
  - Server config: `src/lib/auth.ts`
  - Client: `src/lib/auth-client.ts`
  - Plugins: nextCookies, admin, magicLink, customSession, inferAdditionalFields
  - Social providers: Google OAuth, Facebook OAuth
  - Email/password with argon2 hashing
- @node-rs/argon2 ^2.0.2 — password hashing (native, listed in `serverExternalPackages`)

**ORM / Database:**
- prisma ^7.5.0 (dev) + @prisma/client ^7.5.0 — ORM
  - Schema: `prisma/schema.prisma`
  - Adapter: @prisma/adapter-pg ^7.4.2 (native pg driver via `PrismaPg`)
  - Client singleton: `src/lib/prisma.ts`
  - Migrations: `prisma/migrations/`
  - Seeder: `prisma/seed.ts` (run via `tsx`)
  - ERD generator: prisma-erd-generator ^2.4.2

**Email:**
- nodemailer ^8.0.1 — SMTP email sending
  - Transporter: `src/lib/nodemailer.ts`

**File Uploads:**
- uploadthing ^7.7.4 + @uploadthing/react ^7.3.3 — file upload service
  - Router: `src/app/api/uploadthing/core.ts`
  - Client helpers: `src/lib/uploadthing.ts`

**Analytics / Monitoring:**
- @vercel/analytics ^1.6.1 — page analytics
- @vercel/speed-insights ^1.3.1 — performance monitoring

---

## Build & Dev Tools

- tsx ^4.21.0 — TypeScript execution (used for Prisma seed)
- ts-node ^10.9.2 — alternate TS execution
- dotenv ^17.3.1 — env loading for Prisma config
- eslint-config-next ^16.1.6 — ESLint for Next.js
- eslint-plugin-unused-imports ^4.4.1 — unused import linting
- ESLint config: `eslint.config.js`
- postcss ^8.5 — PostCSS
- TypeScript config: `tsconfig.json`
  - Path aliases: `@/*` → `./src/*`, `#/*` → `./src/app/[locale]/*`
  - Strict mode, ES6 target, bundler module resolution

---

## Scripts

| Script | Command |
|--------|---------|
| `dev` | `prisma generate && next dev --turbopack` |
| `build` | `prisma generate && next build` |
| `start` | `next start` |
| `seed` | `prisma db seed` |
| `reset` | `npx prisma migrate reset` |
| `lint` | `eslint .` |
| `genarate` | `prisma generate` (note: typo in key) |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js config with next-intl plugin, CORS headers, image config |
| `tsconfig.json` | TypeScript compiler config |
| `postcss.config.mjs` | PostCSS / Tailwind pipeline |
| `components.json` | shadcn/ui configuration |
| `prisma/schema.prisma` | Prisma database schema |
| `prisma.config.ts` | Prisma config with DATABASE_URL |
| `eslint.config.js` | ESLint rules |
| `pnpm-workspace.yaml` | pnpm workspace definition |

---

## Gaps / Unknowns

- Node.js version is not pinned (no `.nvmrc`, `.node-version`, or `engines` field in `package.json`)
- PostgreSQL version not specified anywhere in config
- No test framework detected (no jest, vitest, playwright, or cypress in dependencies)
- `pnpm-workspace.yaml` exists alongside `package-lock.json` — likely a leftover; actual package manager in use is npm
- `overrides.effect: "3.18.4"` pins a transitive dependency of better-auth; the reason is not documented
- `next.config.mjs` has `typescript.ignoreBuildErrors: true` which silently suppresses TS errors at build time
