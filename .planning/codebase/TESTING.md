# Testing Patterns
_Last updated: 2026-03-31_

## Summary
This codebase has **no automated tests**. There are no test files (`*.test.*`, `*.spec.*`), no test runner configuration (Jest, Vitest, Playwright, Cypress), and no testing packages in `package.json` or `package-lock.json`. All quality assurance is manual, supplemented by TypeScript strict-mode compilation and ESLint.

---

## Test Framework

**Runner:** None installed.

**Assertion Library:** None installed.

**Test packages present in `package.json`:** None.

**Run Commands:**
```bash
# No test commands defined in package.json scripts
# Available scripts:
npm run dev       # Start dev server (prisma generate + next dev --turbopack)
npm run build     # Build (prisma generate + next build)
npm run lint      # ESLint (covers src/**/*.{js,jsx} only — NOT .ts/.tsx)
npm run seed      # Seed database
npm run reset     # Prisma migrate reset
```

---

## Test File Organization

**Location:** No test files exist anywhere in `src/` or the project root.

**Pattern search results:**
- `find . -name "*.test.*"` → 0 results (excluding node_modules)
- `find . -name "*.spec.*"` → 0 results (excluding node_modules)
- No `__tests__` directories found

---

## Static Analysis (What Exists Instead of Tests)

### TypeScript
- Strict mode enabled (`"strict": true` in `tsconfig.json`)
- Target: ES6, module resolution: bundler
- **Build errors are suppressed:** `typescript.ignoreBuildErrors: true` in `next.config.mjs` — TypeScript errors do NOT fail CI/CD builds

### ESLint
- Config: `eslint.config.js`
- **Critical gap:** Only covers `src/**/*.{js,jsx}` — TypeScript files (`.ts`, `.tsx`) are excluded from linting
- Active rules:
  - `unused-imports/no-unused-imports`: error
  - `unused-imports/no-unused-vars`: warn
- Run: `npm run lint`

### Runtime Validation
Zod schemas provide runtime input validation on both client and server:
- `src/schemas/create-event.schema.ts` — validates event creation input
- `src/schemas/section.schema.ts` — discriminated union validation per section type
- `src/schemas/agenda-item.schema.ts` — agenda item validation
- `src/schemas/faq-item.schema.ts` — FAQ item validation

---

## Manual Testing Surface

The codebase relies entirely on manual testing. Key flows that would benefit from automated tests:

**Authentication flow** (`src/features/auth/`):
- Sign in with email/password
- Sign in with magic link
- OAuth (Google, Facebook)
- Sign up, email verification, password reset, invite-based signup

**Event creation wizard** (`src/components/dashboard/events/wizard/`):
- 3-step wizard: basic info → additional (sections/agenda/FAQ/map) → tickets
- `safeAction` wrapping means all mutations return `ActionResult<T>` — testable without UI

**Server actions** (`src/actions/`):
- `createEventAction` — `src/actions/events/create-event.action.ts`
- `getEventForEdit` — `src/actions/events/get-event-for-edit.action.ts`
- `reorderSectionsAction` — `src/actions/events/sections/reorder-sections.action.ts`
- Order creation — `src/actions/orders/create-order.action.ts`

**Ownership guards** (`src/lib/verify-ownership.ts`):
- `verifyEventOwnership`, `verifySectionOwnership`, `verifyAgendaItemOwnership`, `verifyFaqItemOwnership`

---

## Observed Error Handling (Partial Test Coverage via Toasts)

The pattern for surface-level feedback is Sonner toasts:
```typescript
// On action failure — all callers follow this pattern
const result = await createEventAction(data);
if (!result.success) {
  toast.error(t("errors.default"));
  return;
}
```

`ApiError` class (`src/error/api-error.ts`) carries `ErrorCode` + `statusCode` + optional field errors. `safeAction` (`src/lib/safe-action.ts`) catches all errors and maps them to `ActionResult<T>`. This makes the action layer unit-testable if a test runner were added.

---

## Gaps / Unknowns

- **Zero test coverage** — no unit, integration, or E2E tests of any kind.
- ESLint does not cover TypeScript files — the most common file type in the codebase.
- `typescript.ignoreBuildErrors: true` means type errors are silently swallowed in production builds.
- No CI/CD pipeline config detected (no `.github/workflows`, no `vercel.json` CI hooks).
- The `safeAction` wrapper and `ActionResult<T>` type are well-structured for unit testing — tests could be added without refactoring business logic.
- TanStack Query and Zod are both easily mockable/testable if Vitest were introduced.
- Recommended first step: add Vitest + `@testing-library/react` and target `src/lib/` utilities (`safe-action.ts`, `verify-ownership.ts`, `utils.ts`) as highest-value starting points.
