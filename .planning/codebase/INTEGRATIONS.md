# External Integrations

_Last updated: 2026-03-31_

## Summary

StworzEvent.pl integrates with Google and Facebook OAuth for social login, UploadThing for file storage, a custom SMTP server for transactional email, and OpenStreetMap Nominatim for geocoding and address search. Lemon Squeezy is modelled in the database schema for subscription/billing but no SDK client code was found in the source, indicating it is planned or partially implemented. Vercel Analytics and Speed Insights are active in the root layout.

---

## Authentication & Identity

**Provider: better-auth ^1.5.0**
- Implementation: `src/lib/auth.ts` (server), `src/lib/auth-client.ts` (client)
- Auth route: `src/app/api/auth/[...all]/route.ts` (standard better-auth Next.js handler)

**Google OAuth:**
- Scope: profile + email (standard)
- Env vars required: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Profile mapping: `given_name` → `name`, `family_name` → `surname`

**Facebook OAuth:**
- Env vars required: `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`
- Profile mapping: splits `profile.name` on space

**Email/Password:**
- Password hashing: `@node-rs/argon2` via `src/lib/hashPassword.ts`
- Minimum password length: 6 characters
- Email verification: enabled on sign-up, 1-hour expiry

**Magic Link:**
- Plugin: `magicLinkClient()` / `magicLink()` from better-auth
- Delivery: transactional email via Nodemailer

**Session:**
- Duration: 30 days
- Cookie cache: 5 minutes
- Cookie prefix: `better-auth`
- SameSite: lax, Secure: true

---

## Data Storage

**Database: PostgreSQL**
- ORM: Prisma 7 with `@prisma/adapter-pg` (native driver)
- Connection: `DATABASE_URL` env var
- Client singleton: `src/lib/prisma.ts`
- Schema: `prisma/schema.prisma`
- Key models: User, Session, Account, Verification, Organization, OrganizationMember, Event, EventSection, EventAgendaItem, EventFaq, Ticket, TicketReservation, Order, OrderItem, Participant, Payment, Refund, Plan, Feature, OrganizationSubscription, OrganizationFeature

**File Storage: UploadThing**
- SDK: `uploadthing ^7.7.4`, `@uploadthing/react ^7.3.3`
- API route: `src/app/api/uploadthing/core.ts`, `src/app/api/uploadthing/route.ts`
- Client helpers: `src/lib/uploadthing.ts` (`UploadButton`, `UploadDropzone`, `useUploadThing`)
- Current routers configured: `eventCover` (image, max 4MB, max 1 file)
- Auth: session check via better-auth before upload
- Returned URL: `file.ufsUrl` (UploadThing UFS CDN)
- Env vars required: `UPLOADTHING_SECRET` (implicit, required by UploadThing SDK)

---

## Email (Transactional)

**Provider: Custom SMTP via Nodemailer**
- Library: `nodemailer ^8.0.1`
- Transporter: `src/lib/nodemailer.ts`
- SMTP host: `mail.stworzevent.pl`
- Port: 465 (SSL/TLS)
- Env vars required: `MAIL_NAME`, `MAIL_PASSWORD`
- TLS: `rejectUnauthorized: false` (shared hosting workaround)

**Email Action:**
- `src/actions/send-email.action.ts` — unified server action for sending mail
- Types: `TypeMail.AUTH` (confirmed from `src/types/enums.ts`)
- Templates sent:
  - Email verification on sign-up
  - Password reset link
  - Magic link login

---

## Geocoding & Maps

**OpenStreetMap Nominatim (external API):**
- Purpose: forward geocoding (address → lat/lng), reverse geocoding (lat/lng → address), city search, street search
- Usage in: `src/lib/geocode.ts` (server-side, direct fetch), `src/lib/nominatim.ts` (client-side, proxied)
- Proxy API route: `src/app/api/nominatim/` (proxies requests to avoid CORS / User-Agent issues)
- User-Agent header: `StworzEvent.pl/1.0 (contact@stworzevent.pl)` (required by Nominatim ToS)
- No API key required (free, rate-limited public API)

**Leaflet / React-Leaflet (frontend map rendering):**
- Libraries: `leaflet ^1.9.4`, `react-leaflet ^5.0.0`
- Purpose: display event location on interactive map
- Event model stores: `lat`, `lng`, `location` (city), `address` (street), `showMap` flag

---

## Billing & Subscriptions (Lemon Squeezy)

**Status: Partially implemented — DB schema only, no active SDK client found**
- Schema fields referencing Lemon Squeezy:
  - `Plan.lsProductId`, `Plan.lsVariantMonthly`, `Plan.lsVariantYearly`
  - `Feature.lsProductId`, `Feature.lsVariantId`
  - `OrganizationSubscription.lsSubscriptionId`, `lsCustomerId`, `lsOrderId`
  - `OrganizationFeature.lsOrderId`, `lsOrderItemId`
- No Lemon Squeezy npm package found in `package.json`
- No webhook handler route for Lemon Squeezy events found in `src/app/api/`
- Payment model supports `provider` field (generic string) and `providerPaymentId`

---

## Analytics & Monitoring

**Vercel Analytics:**
- Package: `@vercel/analytics ^1.6.1`
- Component: `<Analytics />` from `@vercel/analytics/next`
- Mounted in: `src/app/[locale]/layout.tsx`

**Vercel Speed Insights:**
- Package: `@vercel/speed-insights ^1.3.1`
- Component: `<SpeedInsights />` from `@vercel/speed-insights/next`
- Mounted in: `src/app/[locale]/layout.tsx`

**Error Tracking:** Not detected (no Sentry, Datadog, or similar)

**Logging:** `console.error` / `console.log` only — no structured logging library

---

## Deployment Platform

**Vercel:**
- Inferred from: `@vercel/analytics`, `@vercel/speed-insights`, `VERCEL_URL` / `VERCEL_BRANCH_URL` env var references in `src/lib/auth.ts`
- `next start` script confirms standard Vercel-compatible deployment
- Images: `unoptimized: true` in `next.config.mjs` (disables Next.js Image Optimization; UploadThing CDN used instead)

---

## CI/CD

- No CI configuration files detected (no `.github/workflows/`, `.gitlab-ci.yml`, etc.)
- Assumed: Vercel's automatic Git integration deploys on push

---

## Required Environment Variables

| Variable | Purpose | Where used |
|----------|---------|------------|
| `DATABASE_URL` | PostgreSQL connection string | `prisma.config.ts`, `src/lib/prisma.ts` |
| `BETTER_AUTH_URL` | App base URL for auth | `src/lib/auth.ts` |
| `BETTER_AUTH_SECRET` | Auth secret key | `src/lib/auth.ts` |
| `GOOGLE_CLIENT_ID` | Google OAuth | `src/lib/auth.ts` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | `src/lib/auth.ts` |
| `FACEBOOK_CLIENT_ID` | Facebook OAuth | `src/lib/auth.ts` |
| `FACEBOOK_CLIENT_SECRET` | Facebook OAuth | `src/lib/auth.ts` |
| `MAIL_NAME` | SMTP username | `src/lib/nodemailer.ts` |
| `MAIL_PASSWORD` | SMTP password | `src/lib/nodemailer.ts` |
| `ADMIN_EMAILS` | Semicolon-separated admin emails | `src/lib/auth.ts` |
| `UPLOADTHING_SECRET` | UploadThing API key | Implicit (UploadThing SDK) |
| `VERCEL_URL` | Vercel deployment URL | `src/lib/auth.ts` (trusted origins) |
| `VERCEL_BRANCH_URL` | Vercel preview branch URL | `src/lib/auth.ts` (trusted origins) |

---

## Internal API Routes

| Route | Handler | Purpose |
|-------|---------|---------|
| `/api/auth/[...all]` | better-auth | All auth endpoints |
| `/api/uploadthing` | UploadThing | File upload handling |
| `/api/nominatim` | Custom proxy | Forward geocoding proxy to OSM |
| `/api/nominatim/reverse` | Custom proxy | Reverse geocoding proxy to OSM |
| `/api/events` | Custom | Event listing/creation |
| `/api/invites` | Custom | Invitation management |
| `/api/organizations` | Custom | Organization management |

All API routes have CORS headers set in `next.config.mjs`: `Access-Control-Allow-Origin: *` for all `/api/:path*` routes.

---

## Gaps / Unknowns

- Lemon Squeezy integration: schema is fully prepared but no SDK, webhook handler, or checkout flow exists in source code
- No payment gateway integration found for ticket purchases (Payment model exists with `provider` field but no concrete payment provider client code)
- No error tracking / APM service (Sentry etc.) configured
- `UPLOADTHING_SECRET` env var not explicitly referenced in found source but is required by the UploadThing SDK at runtime
- No outgoing webhook configuration found
- Email template rendering approach unclear — `sendEmailAction` data shape is visible but the HTML template file was not located during exploration
