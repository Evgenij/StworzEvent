# STRUCTURE
_Last updated: 2026-03-31_

## Summary
This is a Next.js 15 App Router project using `src/` layout with full internationalization via `next-intl`. All routes live under `src/app/[locale]/`, separating public-facing pages (the `(main)` route group) from the authenticated dashboard (`profile/`), admin panel (`admin/`), and auth flows (`auth/`). Business logic is spread across `src/actions/` (server actions), `src/features/` (co-located feature modules), `src/components/` (shared and domain-specific UI), and `src/lib/` (infrastructure utilities).

---

## Directory Tree

```
stworzevent/                     # Project root
├── src/
│   ├── app/                     # Next.js App Router — pages + API routes
│   │   ├── [locale]/            # All pages scoped by locale (en/pl)
│   │   │   ├── layout.tsx       # Root layout: fonts, providers, i18n, analytics
│   │   │   ├── (main)/          # Route group — public website (header + footer)
│   │   │   │   ├── layout.tsx   # Injects HeaderWebsite + FooterWebsite
│   │   │   │   ├── page.tsx     # Homepage
│   │   │   │   └── events/
│   │   │   │       ├── page.tsx           # Event catalog
│   │   │   │       └── [slug]/
│   │   │   │           ├── page.tsx       # Public event detail page
│   │   │   │           └── order/         # Ticket purchase flow
│   │   │   ├── auth/            # Auth pages (sign-in, sign-up, reset, verify, invite)
│   │   │   │   └── layout.tsx   # Minimal auth layout
│   │   │   ├── profile/         # Authenticated dashboard (requires session)
│   │   │   │   ├── layout.tsx   # Sidebar + site header; redirects to sign-in if no session
│   │   │   │   ├── dashboard/   # Role-based dashboard views
│   │   │   │   ├── events/
│   │   │   │   │   ├── new/     # Create event wizard (step 1)
│   │   │   │   │   └── [id]/edit/        # Edit event wizard
│   │   │   │   │       ├── page.tsx      # Step 1: basic details
│   │   │   │   │       ├── additional/   # Step 2: agenda, sections, map, FAQ
│   │   │   │   │       └── tickets/      # Step 3: ticket management
│   │   │   │   ├── notifications/
│   │   │   │   └── settings/
│   │   │   ├── admin/           # Admin-only area
│   │   │   ├── privacy/         # Static content pages
│   │   │   ├── data-deletion/
│   │   │   ├── ui/              # Component showcase / sandbox page
│   │   │   └── [...not-found]/  # Catch-all 404 page
│   │   └── api/                 # REST API routes
│   │       ├── apiRoutes.ts     # Centralized API route constants
│   │       ├── fetcher.ts       # Client-side apiFetcher utility
│   │       ├── auth/[...all]/   # better-auth catch-all handler
│   │       ├── events/          # GET /events, GET|PATCH /events/[id]
│   │       ├── invites/         # GET /invites
│   │       ├── nominatim/       # Geocoding proxy (forward + reverse)
│   │       ├── organizations/   # GET|PATCH /organizations/[id]
│   │       └── uploadthing/     # File upload webhook + core config
│   │
│   ├── actions/                 # Next.js Server Actions (callable from Client Components)
│   │   ├── send-email.action.ts
│   │   ├── use-session.ts       # Session helper shared by actions
│   │   ├── auth/                # sign-in, sign-up, validate-email, accept-invitation
│   │   ├── events/              # create, update, get-for-edit, get-additional, get-categories
│   │   │   ├── agenda/          # upsert / delete / get agenda items
│   │   │   ├── faq/             # upsert / delete / get FAQ items
│   │   │   ├── map/             # get event map data
│   │   │   └── sections/        # create / update / delete / reorder / get sections
│   │   ├── invites/
│   │   ├── orders/
│   │   ├── organizations/
│   │   ├── reservations/        # create / cancel / get-active reservation
│   │   └── tickets/             # upsert / delete / get tickets + availability
│   │
│   ├── components/              # UI components organized by domain + origin
│   │   ├── dashboard/events/    # Organizer-facing event editing UI
│   │   │   ├── agenda/          # Agenda editor cards
│   │   │   ├── faq/             # FAQ editor cards
│   │   │   ├── location/        # Address / city comboboxes, location picker
│   │   │   ├── map/             # Map editor (Leaflet-based)
│   │   │   ├── sections/        # Section editor: text, gallery, video, links
│   │   │   ├── wizard/          # Multi-step wizard shell, progress bar, step components
│   │   │   ├── create-event-form.tsx
│   │   │   ├── create-event-context.tsx
│   │   │   ├── new-event-page.tsx
│   │   │   └── event-cover-upload.tsx
│   │   ├── events/              # Attendee-facing event UI
│   │   │   ├── catalog/         # Event listing card
│   │   │   ├── page/            # Public event page: hero, meta, agenda, sections, map, sidebar
│   │   │   │   ├── agenda/
│   │   │   │   ├── map/
│   │   │   │   └── sections/    # Renderers: text, image, video, links
│   │   │   └── tickets/         # Ticket purchase drawer + multi-step flow
│   │   │       └── steps/       # tickets → participants → confirmation
│   │   ├── layout/              # Website layout chrome
│   │   │   ├── header/          # HeaderWebsite, nav links, auth buttons, mobile nav
│   │   │   └── footer/          # FooterWebsite
│   │   ├── shadcn/              # shadcn/ui primitives (customized, committed to repo)
│   │   │   └── ui/              # accordion, button, dialog, drawer, input, select, …
│   │   └── shared/              # Cross-domain reusable components
│   │       ├── forms/           # update-user-form, verification-email-form
│   │       ├── typography/      # Blockquote, Typography
│   │       ├── rich-text-editor.tsx
│   │       ├── rich-text-renderer.tsx
│   │       ├── date-picker.tsx
│   │       └── breadcrumbs.tsx
│   │
│   ├── features/                # Self-contained feature modules (co-located components + logic)
│   │   ├── auth/
│   │   │   ├── actions/         # sign-out (client-callable)
│   │   │   └── components/forms/ # sign-in, sign-up, forget-password, reset-password, magic-link
│   │   ├── events/
│   │   │   └── components/      # event.tsx, events-list.tsx, status-badge.tsx
│   │   ├── layout/
│   │   │   └── components/      # AppSidebar, SiteHeader, NavMain, NavUser, NavProjects
│   │   └── routing/
│   │       └── components/      # return-btn.tsx
│   │
│   ├── lib/                     # Infrastructure singletons and pure utilities
│   │   ├── auth.ts              # better-auth server config
│   │   ├── auth-client.ts       # better-auth browser client
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── safe-action.ts       # safeAction() wrapper — wraps async fns in ActionResult
│   │   ├── action-utils.ts      # Shared action helpers
│   │   ├── api-response.ts      # Standardized API response builder
│   │   ├── permissions.ts       # Authorization checks
│   │   ├── verify-ownership.ts  # Resource ownership guard
│   │   ├── uploadthing.ts       # UploadThing client config
│   │   ├── nodemailer.ts        # Email transport
│   │   ├── nominatim.ts         # Nominatim geocoding client
│   │   ├── geocode.ts           # Geocode helpers
│   │   ├── hashPassword.ts
│   │   ├── utils.ts             # cn() + general utilities
│   │   └── slugify/             # generate-unique-slug.ts, slugify.ts
│   │
│   ├── schemas/                 # Zod validation schemas (shared between client + server)
│   │   ├── create-event.schema.ts
│   │   ├── agenda-item.schema.ts
│   │   ├── section.schema.ts
│   │   ├── faq-item.schema.ts
│   │   ├── event-tickets.schema.ts
│   │   └── order.schema.ts
│   │
│   ├── types/                   # TypeScript types and interfaces
│   │   ├── DTOs/user.dto.ts
│   │   ├── action-result.ts     # ActionResult<T> discriminated union
│   │   ├── enums.ts
│   │   ├── error-code.ts        # ErrorCode enum
│   │   ├── event-preview.ts
│   │   ├── user.ts
│   │   ├── ticket.ts
│   │   ├── flat-participant.ts
│   │   ├── nominatim.ts
│   │   └── api-pesponse.ts      # [typo in filename] API response type
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-user.ts
│   │   ├── use-address-search.ts
│   │   ├── use-city-search.ts
│   │   ├── use-countdown.ts
│   │   ├── use-mobile.ts
│   │   └── use-scroll.ts
│   │
│   ├── helpers/                 # Pure transformation / formatting functions
│   │   ├── date-formatter.ts
│   │   ├── format-date.ts
│   │   ├── event.ts
│   │   └── mail-templates.ts
│   │
│   ├── consts/                  # Application-wide constants
│   │   ├── routes.ts            # All route path constants + builder functions
│   │   └── query-keys.ts        # React Query cache key constants
│   │
│   ├── error/                   # Error classes
│   │   ├── api-error.ts         # ApiError (domain errors)
│   │   └── handleError.ts
│   │
│   ├── providers/
│   │   └── query-provider.tsx   # React Query provider wrapper
│   │
│   ├── i18n/
│   │   ├── routing.ts           # next-intl routing config (locales: en, pl; default: pl)
│   │   └── request.ts           # Per-request locale resolution
│   │
│   ├── assets/icons/            # SVG icon assets (facebook.svg, google.svg)
│   ├── mocks.ts                 # Static mock data for development
│   └── proxy.ts                 # Proxy utility
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # Database seeder entry point
│   ├── seeders/events/          # Event-specific seed data (event-sections.ts)
│   └── migrations/              # Auto-generated Prisma migration files
│
├── messages/
│   ├── en.json                  # English translations
│   └── pl.json                  # Polish translations (default locale)
│
├── public/
│   ├── images/                  # Static images (backgrounds, mail assets)
│   ├── leaflet/                 # Leaflet map assets (served statically)
│   └── logos/                   # Brand logos
│
├── .planning/codebase/          # GSD planning documents
├── .agents/skills/              # Agent skill definitions
├── components.json              # shadcn/ui config
├── next.config.mjs
├── prisma.config.ts
├── tsconfig.json                # Path aliases: @/* → src/*, #/* → src/app/[locale]/*
└── package.json
```

---

## Module Boundaries

### Public website (`src/app/[locale]/(main)/`)
Pages accessible to unauthenticated users. Uses `HeaderWebsite` + `FooterWebsite` layout chrome from `src/components/layout/`. Event detail and order pages consume components from `src/components/events/`.

### Authenticated dashboard (`src/app/[locale]/profile/`)
Requires a valid session (enforced in `src/app/[locale]/profile/layout.tsx` with a redirect to `SIGNIN_ROUTE`). Uses sidebar+header shell from `src/features/layout/`. Event editing is a multi-step wizard in `src/components/dashboard/events/wizard/`.

### Server Actions (`src/actions/`)
Server-only async functions that interact with the database via Prisma. All wrapped with `safeAction()` from `src/lib/safe-action.ts`, returning `ActionResult<T>`. Grouped by domain: `auth/`, `events/` (with sub-domains: `agenda/`, `faq/`, `map/`, `sections/`), `tickets/`, `reservations/`, `orders/`, `organizations/`, `invites/`.

### REST API routes (`src/app/api/`)
Thin Next.js Route Handlers. Primary consumers are React Query hooks and client-side fetching via `apiFetcher` in `src/app/api/fetcher.ts`. Route constants centralized in `src/app/api/apiRoutes.ts`.

### Features (`src/features/`)
Self-contained vertical slices. Each feature owns its components and, where needed, its own actions. Features export via `index.ts` barrel files. Current features: `auth`, `events`, `layout`, `routing`.

### Shared UI (`src/components/shadcn/`, `src/components/shared/`)
`src/components/shadcn/ui/` — shadcn primitives committed to the repo. `src/components/shared/` — cross-domain app-level components (rich text editor, date pickers, breadcrumbs, typography).

### Infrastructure (`src/lib/`)
Singletons and integration clients. Import from here to reach Prisma (`prisma.ts`), better-auth (`auth.ts`, `auth-client.ts`), UploadThing (`uploadthing.ts`), Nodemailer (`nodemailer.ts`), and Nominatim geocoding (`nominatim.ts`, `geocode.ts`).

### Validation schemas (`src/schemas/`)
Zod schemas used both for form validation on the client and for server-side action input validation. Do not import from `src/actions/` into schemas — the dependency flows one way.

---

## Key Files

| File | Role |
|------|------|
| `src/app/[locale]/layout.tsx` | Root layout: providers (QueryProvider, NextIntlClientProvider), fonts, Vercel Analytics |
| `src/app/[locale]/(main)/layout.tsx` | Public layout: injects `HeaderWebsite` and `FooterWebsite` |
| `src/app/[locale]/profile/layout.tsx` | Dashboard layout: session guard, sidebar, site header |
| `src/app/api/auth/[...all]/route.ts` | better-auth catch-all handler |
| `src/lib/auth.ts` | better-auth server configuration |
| `src/lib/auth-client.ts` | better-auth browser client (used in client components) |
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/lib/safe-action.ts` | `safeAction()` — error boundary wrapper for all server actions |
| `src/lib/permissions.ts` | Authorization logic |
| `src/lib/verify-ownership.ts` | Resource ownership guard used in actions |
| `src/consts/routes.ts` | All route path strings and builder functions |
| `src/app/api/apiRoutes.ts` | All REST API path constants |
| `src/app/api/fetcher.ts` | `apiFetcher<T>()` — typed client-side HTTP utility |
| `src/i18n/routing.ts` | next-intl locale config (locales: `en`, `pl`; default: `pl`) |
| `src/types/action-result.ts` | `ActionResult<T>` discriminated union used across all actions |
| `src/types/error-code.ts` | `ErrorCode` enum — canonical error identifiers |
| `src/schemas/create-event.schema.ts` | Zod schema for event creation form |
| `src/components/dashboard/events/wizard/edit-event-shell.tsx` | Wizard container for event editing steps |
| `src/components/dashboard/events/create-event-context.tsx` | React context for create-event wizard state |
| `prisma/schema.prisma` | Database schema — source of truth for all models |
| `tsconfig.json` | Path aliases: `@/*` → `src/*`, `#/*` → `src/app/[locale]/*` |
| `components.json` | shadcn/ui configuration (component registry settings) |

---

## Where to Add New Code

**New public page:**
- Page file: `src/app/[locale]/(main)/[route]/page.tsx`
- Route constant: `src/consts/routes.ts`

**New dashboard page:**
- Page file: `src/app/[locale]/profile/[route]/page.tsx`
- Route constant: `src/consts/routes.ts`

**New server action:**
- File: `src/actions/[domain]/[verb]-[resource].action.ts`
- Wrap with `safeAction()` from `src/lib/safe-action.ts`
- Return type: `ActionResult<T>` from `src/types/action-result.ts`

**New REST API route:**
- File: `src/app/api/[resource]/route.ts`
- Register path in: `src/app/api/apiRoutes.ts`

**New form schema:**
- File: `src/schemas/[resource].schema.ts`
- Use Zod; import into both the form component and the server action

**New shadcn primitive:**
- File: `src/components/shadcn/ui/[component].tsx`
- Follow existing shadcn patterns (forwardRef, CVA variants)

**New shared component:**
- File: `src/components/shared/[component].tsx`
- Export from `src/components/shared/index.ts` if widely used

**New domain-specific component (organizer):**
- File: `src/components/dashboard/events/[feature]/[component].tsx`

**New domain-specific component (attendee-facing):**
- File: `src/components/events/page/[feature]/[component].tsx`

**New custom hook:**
- File: `src/hooks/use-[name].ts`

**New type:**
- File: `src/types/[name].ts`

**New feature module:**
- Directory: `src/features/[name]/`
- Expose via `src/features/[name]/index.ts` barrel

---

## Gaps / Unknowns

- `src/components/shadcn/example.tsx` and `src/components/shadcn/preview.tsx` appear to be scaffolding leftovers with no known consumers — purpose unclear.
- `src/mocks.ts` and `src/proxy.ts` exist at `src/` root level outside any domain directory — their current usage is not obvious from structure alone.
- `src/app/[locale]/ui/page.tsx` is a UI sandbox route; it is unclear whether it is gated or accessible in production.
- `src/types/api-pesponse.ts` contains a typo in the filename (`pesponse` vs `response`) — may cause confusion when searching or importing.
- The `src/features/` directory and `src/components/` directory partially duplicate each other (e.g. event components exist in both `src/features/events/components/` and `src/components/events/`) — the distinction between the two directories is not enforced by a clear rule.
- No middleware file (`middleware.ts`) was found at the `src/` or root level — locale and auth route protection strategy via middleware is unknown.
