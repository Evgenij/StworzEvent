# CONCERNS

_Last updated: 2026-03-31_

## Summary

StworzEvent is a Next.js 15 event management platform in active development with several incomplete features and notable technical debt. The ticket/reservation/order flow has race condition risks due to non-atomic availability checks, and payment processing is entirely absent despite the order model supporting paid statuses. A significant number of `console.log` debug statements are scattered across server actions and page components, indicating code that has not been production-hardened.

---

## Technical Debt

**Debug `console.log` statements left in production code:**

- Issue: Scattered across server actions and pages with sensitive data being logged (full session objects, form data, reservation details)
- Files:
    - `src/actions/events/create-event.action.ts:22` — logs full form input
    - `src/actions/events/update-event.action.ts:37` — logs full session object
    - `src/actions/reservations/create-reservation.action.ts:25` — logs full session as JSON
    - `src/actions/orders/create-order.action.ts:119-127` — logs order IDs mid-transaction
    - `src/app/[locale]/(main)/events/page.tsx:41` — logs all events to server console
    - `src/app/[locale]/(main)/events/[slug]/order/page.tsx:56` — logs reservation to server console
    - `src/app/[locale]/profile/events/page.tsx:31` — logs user role
    - `src/features/auth/components/get-session-btn.tsx:15` — logs session client-side
    - `src/app/[locale]/admin/dashboard/page.tsx:40` — logs invite URLs containing secret tokens
    - `src/components/dashboard/events/create-event-form.tsx:162-163` — logs eventId and form data
- Impact: Information leakage in server logs; token/session data exposure
- Fix approach: Remove all debug logs; replace with structured logging where needed

**Inconsistent error throwing in server actions:**

- Issue: Some actions use `throw new ApiError(...)` (caught by `safeAction`), others throw raw `throw new Error(...)` which bypasses the `safeAction` error-mapping pipeline and returns an untyped INTERNAL_ERROR
- Files:
    - `src/actions/orders/create-order.action.ts:45,60` — raw `throw new Error`
    - `src/actions/reservations/create-reservation.action.ts:33,63` — raw `throw new Error`
    - `src/actions/organizations/get-my-organizations.action.ts:10` — raw `throw new Error("Unauthorized")` (not wrapped by `safeAction` at all)
- Impact: Error codes not propagated to UI; raw error messages may leak in some paths
- Fix approach: Use `ApiError` with `ErrorCode` enum consistently; wrap all actions in `safeAction`

**Unused dead code:**

- Issue: `src/actions/invites/get-invites.action.ts` is marked `//TODO: Unused` at line 1 but still exists. `src/app/api/invites/route.ts` contains an unreachable dead export `GET1` that is never called. Admin dashboard still shows raw invite URLs in `console.log`
- Files: `src/actions/invites/get-invites.action.ts`, `src/app/api/invites/route.ts`
- Fix approach: Delete unused action; remove `GET1` function from invites route

**`testMessage: "!!!"` left in session object:**

- Issue: `src/lib/auth.ts:234` — `testMessage: "!!!"` is serialized into every session via `customSession` plugin and sent to every authenticated client
- Impact: Unnecessary payload in every session response; signals incomplete cleanup
- Fix approach: Remove the `testMessage` field

**`@ts-ignore` suppressing type errors:**

- Issue: `src/components/shared/locale-switcher.tsx:27` uses `// @ts-ignore` to suppress routing type errors
- Fix approach: Fix the underlying type mismatch with a proper type cast or fix the type definition

**Nominatim proxy passes all query params without filtering:**

- Issue: `src/app/api/nominatim/route.ts:7` — all incoming search params are forwarded directly to the external Nominatim API without any sanitization or allowlist
- Impact: Potentially allows callers to override API behavior (e.g., remove country restrictions, change format)
- Fix approach: Allowlist only the `q` parameter; set all other params server-side

---

## Security Concerns

**Email verification not enforced:**

- Risk: `src/lib/auth.ts:65` shows `//requireEmailVerification: true` is commented out. Users can sign in with an unverified email address
- Files: `src/lib/auth.ts`
- Current mitigation: Email is sent on signup, but verification is not gated
- Recommendations: Enable `requireEmailVerification: true`; add UI redirect flow for unverified users

**Admin layout renders content before role check:**

- Risk: `src/app/[locale]/admin/layout.tsx:37-42` — the layout redirects unauthenticated users but renders `<p className="text-red-600">Access denied!</p>` for authenticated non-admins rather than redirecting or returning 403. Admin panel HTML is still sent to the browser
- Files: `src/app/[locale]/admin/layout.tsx`
- Recommendations: Redirect non-ADMIN users to a safe page (e.g., dashboard) instead of rendering the admin shell with an error message

**Secret invite tokens logged to console:**

- Risk: `src/app/[locale]/admin/dashboard/page.tsx:40` — the full invite URL (containing the invite token) is logged with `console.log` on the server. Also in `src/app/[locale]/profile/dashboard/components/admin-dashboard.tsx:36`
- Files: `src/app/[locale]/admin/dashboard/page.tsx`, `src/app/[locale]/profile/dashboard/components/admin-dashboard.tsx`
- Recommendations: Remove console.log of token-containing URLs

**Auth hook middleware condition is always truthy:**

- Risk: `src/lib/auth.ts:121` — `"/api/auth/sign-in/magic-link"` is a standalone string expression (not a comparison), so the `if` condition is always `true`, causing the `name` normalization to run on ALL auth requests, not only the intended paths
- Files: `src/lib/auth.ts:118-135`
- Impact: May unintentionally mutate `name` on requests where it should not be altered
- Fix approach: Use `||` for `===` comparisons: `ctx.path === "/sign-up/email" || ctx.path === "/api/auth/sign-in/magic-link"`

**Unsanitized dynamic `orderBy` in events API:**

- Risk: `src/app/api/events/route.ts:14,39` — the `sort` query parameter is passed directly as a Prisma `orderBy` key without validation against an allowlist
- Files: `src/app/api/events/route.ts`
- Recommendations: Validate `sort` against an explicit list of allowed column names

---

## Performance Risks

**N+1 queries for ticket availability on event page:**

- Problem: `src/app/[locale]/(main)/events/[slug]/page.tsx:81-88` — `Promise.all` fires one `getAvailableQuantity` call per ticket. Each call issues 3 separate Prisma queries (findUnique + 2× aggregate). For an event with 10 ticket types, this is 30 database round-trips
- Files: `src/app/[locale]/(main)/events/[slug]/page.tsx`, `src/actions/tickets/get-available-quantity.action.ts`
- Fix approach: Batch availability calculation in a single aggregated query

**Entire events table fetched without pagination for catalog:**

- Problem: `src/app/[locale]/(main)/events/page.tsx:6` — `prisma.event.findMany(...)` fetches all events with all tickets and order items. Filtering is done in JavaScript (`availableEvents = events.filter(...)`). This will not scale
- Files: `src/app/[locale]/(main)/events/page.tsx`
- Fix approach: Push filtering to the database query with `where` clauses; add pagination (`take`/`skip`)

**Reservation availability check is non-atomic:**

- Problem: `src/actions/reservations/create-reservation.action.ts` checks availability in a loop (sequential per ticket), then creates the reservation separately. Between the check and create, another request can consume the last available ticket (TOCTOU race condition)
- Files: `src/actions/reservations/create-reservation.action.ts`
- Fix approach: Wrap the check-and-create inside a Prisma `$transaction` with a database-level lock or use a conditional `updateMany` approach

**Reorder sections issues N individual UPDATE queries:**

- Problem: `src/actions/events/sections/reorder-sections.action.ts:24-31` — creates one Prisma UPDATE per section in a transaction array. For 20 sections this is 20 separate statements
- Files: `src/actions/events/sections/reorder-sections.action.ts`
- Fix approach: Use `$executeRaw` with a bulk UPDATE or use `Promise.all` outside the transaction for non-critical reordering

---

## Incomplete Features / TODOs

**Payment processing entirely absent:**

- What's missing: The `Order` model supports `PENDING`/`CONFIRMED`/`PAID` statuses but there is no payment gateway integration. Paid orders are created with `OrderStatus.PENDING` and never transition to `PAID`. No Stripe, PayU, or Przelewy24 integration exists
- Files: `src/actions/orders/create-order.action.ts:89`
- Blocks: Revenue collection; production launch for paid events

**Homepage hero section is a placeholder:**

- What's missing: `src/app/[locale]/(main)/page.tsx:22` — the main page immediately redirects to the events catalog. The `<section className="hero-section">HeroSection</section>` placeholder is unreachable dead code
- Files: `src/app/[locale]/(main)/page.tsx`

**Notifications page is a stub:**

- What's missing: `src/app/[locale]/profile/notifications/page.tsx` returns only `<div>NotificationsPage</div>`
- Files: `src/app/[locale]/profile/notifications/page.tsx`

**Settings page is a stub:**

- What's missing: `src/app/[locale]/profile/settings/page.tsx` returns only `<div>SettingsPage</div>`
- Files: `src/app/[locale]/profile/settings/page.tsx`

**Bookmark/save event button is disabled:**

- What's missing: `src/app/[locale]/(main)/events/[slug]/page.tsx:137-139` — "Zapisz" (Save) button has `disabled` prop; no favorites/bookmarks feature exists
- Files: `src/app/[locale]/(main)/events/[slug]/page.tsx`

**OAuth error callback page missing:**

- What's missing: `src/features/auth/components/sign-in-oauth-btn.tsx:30` — `errorCallbackURL` is commented out with `//TODO create page with error of auth`
- Files: `src/features/auth/components/sign-in-oauth-btn.tsx`

**Company/organizer profile page missing:**

- What's missing: `src/components/events/page/sidebar/event-sidebar.tsx:69` — `{/* TODO add link to company page */}` comment; organization name/logo are displayed but no link to an organizer profile page exists
- Files: `src/components/events/page/sidebar/event-sidebar.tsx`

**Invitation error handling is raw:**

- What's missing: `src/app/[locale]/auth/signup/invite/page.tsx:11` — shows raw `<div> Brak tokenu zaproszenia</div>` when token is missing; no i18n translation, no styled error component
- Files: `src/app/[locale]/auth/signup/invite/page.tsx`

**Verification email form uses wrong translation namespace:**

- What's missing: `src/components/shared/forms/verification-email-form.tsx:19` — `useTranslations("SignInForm")` is used with a `// TODO !!!` comment, indicating wrong namespace
- Files: `src/components/shared/forms/verification-email-form.tsx`

**`/ui` route is a live component showcase:**

- What's missing / Risk: `src/app/[locale]/ui/page.tsx` renders `<CoverExample />` from `src/components/shadcn/preview.tsx` (1538 lines) and is accessible publicly without auth. This is a dev-only showcase
- Files: `src/app/[locale]/ui/page.tsx`, `src/components/shadcn/preview.tsx`
- Fix approach: Add auth guard or remove route before production

**Participant events dashboard is a placeholder:**

- What's missing: `src/app/[locale]/profile/events/page.tsx:34` — the USER role branch returns `<div>participant dashboard</div>` while only the ORGANIZER branch has a real component
- Files: `src/app/[locale]/profile/events/page.tsx`

---

## Architectural Smells

**Dual location for "actions" code:**

- Issue: Business logic actions exist in both `src/actions/` (e.g., `src/actions/events/create-event.action.ts`) and `src/features/auth/actions/` (e.g., `src/features/auth/actions/sign-out.ts`). No clear rule governs which location to use
- Impact: Discoverability and maintainability suffer

**Mixed REST API routes and Server Actions for the same domain:**

- Issue: Events are accessed via REST API in `src/app/api/events/route.ts` (used by the dashboard with `useSWR`) and via Server Actions in `src/actions/events/` (used by forms). There is no consistent boundary on when to use each approach
- Files: `src/app/api/events/route.ts`, `src/actions/events/`

**`create-event-form.tsx` handles both create and edit in one 643-line component:**

- Issue: `src/components/dashboard/events/create-event-form.tsx` uses a conditional `if (eventId)` to switch between create and update paths. This component is 643 lines and handles form state, data fetching (`useQuery`), schema validation, and routing
- Files: `src/components/dashboard/events/create-event-form.tsx`
- Fix approach: Split into `CreateEventForm` and `EditEventForm` components sharing a common `EventFormFields` base

**Section `content` field typed as `any`:**

- Issue: `src/components/dashboard/events/sections/section-card.tsx:44` — `content: any`. The actual content shape is a discriminated union by section type but this is not enforced at the component level. The public-facing `src/components/events/page/event-sections.tsx:21` also uses `content: any[]`
- Fix approach: Use the typed `SectionContent` union already defined in `src/components/events/page/event-sections.tsx` consistently in both editor and viewer components

**Inconsistent use of `safeAction` wrapper:**

- Issue: Some actions bypass `safeAction` entirely (e.g., `src/actions/organizations/get-my-organizations.action.ts`, `src/actions/orders/create-order.action.ts`, `src/actions/reservations/create-reservation.action.ts`), throwing raw errors that bubble up as unhandled exceptions in the calling component
- Fix approach: Wrap all mutating server actions in `safeAction`; use `ActionResult<T>` return type consistently

---

## Priority Recommendations

1. **Fix the auth hook always-truthy condition** (`src/lib/auth.ts:121`) — security bug affecting all auth requests
2. **Remove token/session console.logs** — data leakage risk in production logs
3. **Enable email verification enforcement** — currently bypassable
4. **Fix the availability race condition** in `src/actions/reservations/create-reservation.action.ts` — can result in oversold tickets
5. **Add payment gateway integration** — the platform cannot collect revenue without it
6. **Add pagination to the events catalog** (`src/app/[locale]/(main)/events/page.tsx`) — will fail at scale
7. **Fix address storage** — separate `street`/`streetNumber` columns to avoid fragile string splitting
8. **Gate or remove `/ui` route** before production — currently publicly accessible
9. **Remove `testMessage: "!!!"` from session** (`src/lib/auth.ts:234`)
10. **Complete stub pages**: notifications, settings, participant dashboard

---

## Gaps / Unknowns

- **Rate limiting**: No evidence of rate limiting on auth endpoints, reservation creation, or order submission was found. It is unclear if Vercel or an upstream proxy provides this.
- **Email delivery reliability**: `src/actions/send-email.action.ts` uses Resend. There is no retry logic visible; a failed email silently logs an error. No bounce/delivery tracking is apparent.
- **CSRF protection**: Better Auth likely handles this internally, but no explicit CSRF token verification was observed in the custom API routes (`src/app/api/`).
- **Test coverage**: Zero test files were found anywhere in the repository. No jest/vitest config exists. The codebase is entirely untested.
- **Prisma migration for sections type**: The migration `prisma/migrations/20260330061630_add_type_of_section/` is present but uncommitted as an untracked directory — it may not be applied to production yet.
- **Multi-organization support**: The data model supports users belonging to multiple organizations, but `src/actions/organizations/get-my-organizations.action.ts` fetches all memberships and the create-event form shows all organizations. It is unclear how a user with multiple organizations picks the active one.
