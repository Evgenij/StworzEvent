# Architecture

_Last updated: 2026-03-31_

## Summary

StworzEvent.pl is a Next.js 16 event management SaaS platform built for the Polish market. It follows a layered architecture where Server Actions handle all mutation and data-fetch logic from the browser, REST API routes serve client-side data fetching via React Query, and Prisma connects to a PostgreSQL database. The system supports multi-tenant organizations, a billing/plan layer (Lemon Squeezy integration scaffolded), and a multi-step event creation wizard.

---

## Overall Pattern

**Framework:** Next.js 16 App Router with React 19, using Turbopack in dev.

**Rendering strategy:**
- Public pages (`/[locale]/(main)/...`) are Server Components with direct Prisma queries at the page level.
- Dashboard pages (`/[locale]/profile/...`) are Server Components that pre-fetch data and pass it as props to Client Components.
- Client Components (`"use client"`) handle form state, optimistic UI, drag-and-drop, and wizard step navigation.

**Data access split:**
- **Server Actions** (`src/actions/`) — called from Client Components for mutations and initial data loads that need auth.
- **REST API routes** (`src/app/api/`) — used by React Query for polling/refetching in client components.
- **Direct Prisma** — used inside Server Component pages (e.g., `EventPage` in `src/app/[locale]/(main)/events/[slug]/page.tsx`) for SSR rendering without an HTTP roundtrip.

---

## Layers

**Routing / Pages:**
- Purpose: Define URL structure, server-side auth guards, layout composition.
- Location: `src/app/[locale]/`
- Contains: Server Component pages, layout files, loading skeletons.
- Depends on: Actions, Prisma (direct), i18n routing, auth.
- Used by: Next.js router.

**Actions Layer:**
- Purpose: Server-side business logic invoked from client via `"use server"`.
- Location: `src/actions/`
- Contains: All CRUD operations for events, tickets, agenda, sections, FAQ, orders, reservations, auth flows.
- Pattern: Every action is wrapped by `safeAction()` from `src/lib/safe-action.ts`, which catches `ApiError` and maps it to typed `ActionResult<T>` (`src/types/action-result.ts`).
- Depends on: `src/lib/prisma.ts`, `src/lib/auth.ts`, `src/error/api-error.ts`, Zod schemas.

**REST API Routes:**
- Purpose: HTTP endpoints consumed by React Query on the client.
- Location: `src/app/api/`
- Contains: `GET /api/events`, `GET /api/events/[id]`, `GET /api/organizations/[id]`, `GET /api/invites`, `POST /api/uploadthing`, geocoding proxies.
- Pattern: Every handler uses `withApiHandler()` from `src/lib/api-response.ts` for uniform error/success wrapping.

**Components:**
- Purpose: UI rendering. Split into three zones:
  - `src/components/dashboard/events/` — organizer-facing event editor (wizard, sections, agenda, FAQ, map, tickets).
  - `src/components/events/page/` — public event detail page rendering.
  - `src/components/shadcn/ui/` — shadcn-based primitives.
  - `src/components/shared/` — cross-cutting UI (rich text editor, typography, form fields).
  - `src/components/layout/` — public site header/footer.
  - `src/features/` — feature-scoped bundles: auth forms, sidebar/nav, routing helpers, events list.

**Library / Utilities:**
- Location: `src/lib/`
- Key files:
  - `src/lib/auth.ts` — better-auth configuration (Google/Facebook OAuth, email+password, magic link, admin plugin, custom session).
  - `src/lib/prisma.ts` — singleton Prisma client with `@prisma/adapter-pg`.
  - `src/lib/safe-action.ts` — action wrapper that normalises errors to `ActionResult<T>`.
  - `src/lib/api-response.ts` — `withApiHandler` and `successResponse` for REST routes.
  - `src/lib/permissions.ts` — RBAC via better-auth `createAccessControl` with USER/ORGANIZER/ADMIN roles and event-scoped permissions.
  - `src/lib/auth-client.ts` — client-side better-auth instance.

---

## Authentication & Authorization

**Provider:** `better-auth` (`src/lib/auth.ts`).

**Supported methods:**
- Email + password (argon2 hashing via `@node-rs/argon2`).
- Google OAuth.
- Facebook OAuth.
- Magic link.

**Session:** 30-day sessions with 5-minute cookie cache. Exposed via `auth.api.getSession({ headers })` in every Server Component / Action that needs auth.

**RBAC:**
- Roles: `USER`, `ORGANIZER`, `ADMIN` (enum in Prisma + better-auth).
- Permissions defined in `src/lib/permissions.ts` using `createAccessControl`.
- Admin emails seeded from `ADMIN_EMAILS` env var in `databaseHooks.user.create`.

**Route protection:**
- Profile layout (`src/app/[locale]/profile/layout.tsx`) redirects unauthenticated users to `/auth/signin`.
- Edit event layout (`src/app/[locale]/profile/events/[id]/edit/layout.tsx`) does the same.
- Actions check session at the top and throw `ApiError(ErrorCode.UNAUTHORIZED)` if missing.

---

## Multi-Tenancy (Organization Model)

- Every event belongs to an `Organization`.
- Users join organizations via the `OrganizationMember` join table with a `MemberRole` enum (OWNER, MANAGER, STAFF, ...).
- Actions verify membership before write operations (e.g., `createEventAction` checks `organizationMember.findUnique` before creating the event).
- Organizations have a subscription model (`OrganizationSubscription` → `Plan` → `PlanFeature` → `Feature`) and à-la-carte features (`OrganizationFeature`) mapped to Lemon Squeezy product IDs.

---

## Event Lifecycle

**Creation flow (3-step wizard):**
1. Step 1 — Basic info: `CreateEventForm` → `createEventAction` → returns `eventId`.
2. Step 2 — Additional content: Sections (TEXT/LINKS/IMAGE/VIDEO), Agenda items, FAQ, Map config.
3. Step 3 — Tickets: Upsert ticket types via `upsertTicketsAction`.

**Two wizard entry points:**
- New event: `src/app/[locale]/profile/events/new/page.tsx` — client-side wizard with step state in React component state; all steps on one page.
- Editing existing event: `src/app/[locale]/profile/events/[id]/edit/` — URL-based navigation; each step is a separate sub-page (`page.tsx`, `additional/page.tsx`, `tickets/page.tsx`), sharing a layout that wraps content in `EditEventShell` (which provides `CreateEventProvider` for live preview context).

**Event status enum:** `DRAFT → REVIEW → PUBLISHED → SALES_OPEN → SALES_PAUSED → SALES_CLOSED → LIVE → COMPLETED → CANCELLED → ARCHIVED → BLOCKED → UNPUBLISHED`.

---

## Event Sections Architecture

Sections are polymorphic content blocks on an event page, stored in `event_sections` with a `SectionType` enum (TEXT, LINKS, IMAGE, VIDEO) and a `content: Json` field.

**Dashboard editing:** `SectionsEditor` (`src/components/dashboard/events/sections/sections-editor.tsx`) manages a local list with optimistic updates, using `@hello-pangea/dnd` for drag-and-drop reorder. Mutations go through `createSectionAction`, `updateSectionAction`, `deleteSectionAction`, `reorderSectionsAction`.

**Public rendering:** `EventSectionsSection` (`src/components/events/page/event-sections.tsx`) uses a `sectionComponents` map to dispatch rendering to `EventTextSection`, `EventLinksSection`, `EventImageSection`, `EventVideoSection` based on `section.type`.

---

## Data Flow: Client Mutation (typical Server Action)

```
Client Component
  └─ calls createSectionAction(input)       [Server Action]
       └─ auth.api.getSession()             [verify session]
       └─ Zod schema.parse(input)           [validate]
       └─ prisma.eventSection.create()      [write DB]
       └─ return { success: true, data }    [ActionResult<T>]
  └─ on success: optimistic state update (setSections)
  └─ on failure: toast.error + rollback
```

## Data Flow: Server Component Page (SSR)

```
EventPage (Server Component)
  └─ prisma.event.findUnique({ include: ... })   [direct DB]
  └─ getAvailableQuantity(ticketId)              [action/aggregation]
  └─ render JSX with full event data
```

---

## React Query Usage

React Query (`@tanstack/react-query`, stale time 1 min, 1 retry) is used for client-side data fetching in forms. Example: `CreateEventForm` calls `getMyOrganizations` and `getEventForEdit` via `useQuery`. API routes at `src/app/api/` serve these queries.

Query keys are centralised in `src/consts/query-keys.ts`.

---

## Internationalisation

- `next-intl` with two locales: `pl` (default), `en`.
- All routes are prefixed with `[locale]`: `/pl/...`, `/en/...`.
- Message files: `messages/pl.json`, `messages/en.json`.
- i18n routing utilities exported from `src/i18n/routing.ts` (type-safe `Link`, `redirect`, `useRouter`, `usePathname`).
- Client components use `useTranslations()` hook.

---

## File Upload

- `uploadthing` handles image uploads (event cover).
- Route: `src/app/api/uploadthing/route.ts` + core config in `src/app/api/uploadthing/core.ts`.
- Auth-gated middleware: session required before upload.
- Max file size: 4MB per image.

---

## Geocoding / Map

- Map displayed via `leaflet` + `react-leaflet` with Leaflet assets in `public/leaflet/`.
- Address search: `src/hooks/use-address-search.ts`, `src/hooks/use-city-search.ts` backed by Nominatim proxy routes at `src/app/api/nominatim/` and `src/app/api/nominatim/reverse/`.
- Coordinates stored as `lat`/`lng` Float fields on `Event`.

---

## Error Handling

- `ApiError` class (`src/error/api-error.ts`) carries an `ErrorCode` enum string, HTTP status, and optional field errors map.
- `safeAction` catches `ApiError` and `better-auth APIError`, maps them to `ActionResult<T>` with `success: false`.
- REST routes use `withApiHandler` which calls `errorResponse` for the same `ApiError`.
- Unhandled errors log to `console.error` and return `ErrorCode.INTERNAL_ERROR`.

---

## Gaps / Unknowns

- Payment processing: `Payment` and `Refund` models exist in schema but no payment provider integration (Stripe, Przelewy24) was found in the codebase — appears to be scaffolded only.
- Lemon Squeezy billing: `Plan`, `OrganizationSubscription`, `OrganizationFeature` models reference `lsProductId`/`lsSubscriptionId` fields but no webhook handler or LS SDK usage was found.
- Admin panel: `src/app/[locale]/admin/` directory exists with a `dashboard` sub-route but no page content was inspected.
- `customSession` includes a `testMessage: "!!!"` field — likely debug code not yet cleaned up.
- Email templates: `nodemailer` is used via `src/lib/nodemailer.ts` and `src/actions/send-email.action.ts`, but the template rendering details were not inspected.
- `src/features/routing/components/return-btn.tsx` and some feature-scoped components were not inspected in depth.
