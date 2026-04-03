# Coding Conventions

_Last updated: 2026-03-31_

## Summary

This is a Next.js 16 / React 19 application written entirely in TypeScript with strict mode enabled. Code follows a function-component-first pattern with named exports for shared components and default exports for pages/layouts. Tailwind CSS v4 is used throughout for styling, composed via `cn()` (clsx + tailwind-merge).

---

## Naming Patterns

**Files:**

- Components: `kebab-case.tsx` — e.g., `create-event-form.tsx`, `section-type-picker.tsx`
- Server actions: `kebab-case.action.ts` — e.g., `create-event.action.ts`, `get-event-for-edit.action.ts`
- Schemas: `kebab-case.schema.ts` — e.g., `create-event.schema.ts`, `section.schema.ts`
- Hooks: `use-kebab-case.ts` — e.g., `use-user.ts`, `use-mobile.ts`
- Types/DTOs: `kebab-case.ts` — e.g., `action-result.ts`, `error-code.ts`
- Utility libs: `kebab-case.ts` — e.g., `safe-action.ts`, `verify-ownership.ts`
- Constants: `kebab-case.ts` — e.g., `query-keys.ts`, `routes.ts`

**Functions and variables:**

- Functions: `camelCase` — e.g., `createEventAction`, `getEventForEdit`, `handleAddSection`
- React components: `PascalCase` — e.g., `CreateEventForm`, `SectionsEditor`, `EventWizardProgress`
- Constants objects: `SCREAMING_SNAKE_CASE` — e.g., `QUERY_KEYS`, `STEPS`, `DEFAULT_CONTENT`
- Exported route constants: `SCREAMING_SNAKE_CASE` — e.g., `SIGNIN_ROUTE`, `EVENT_EDIT_ROUTE`

**Types and enums:**

- Interfaces/types: `PascalCase` — e.g., `ActionResult<T>`, `EventPreview`, `EventForEdit`
- Enums: `PascalCase` with `SCREAMING_SNAKE_CASE` values — e.g., `ErrorCode.UNAUTHORIZED`, `TypeMail.AUTH`
- Prop types defined inline as `type Props = { ... }` directly above the component

---

## Component Patterns

**Named exports** for all non-page components:

```typescript
// src/components/dashboard/events/sections/sections-editor.tsx
export function SectionsEditor({ eventId, initialSections }: Props) { ... }
```

**Default exports** for Next.js pages and layouts:

```typescript
// src/app/[locale]/(main)/layout.tsx
const MainLayout = async ({ children, params }: MainLayoutProps) => { ... };
export default MainLayout;
```

**"use client" / "use server" directives** always appear as the first line of the file when needed:

```typescript
"use client"; // client components
"use server"; // server actions
```

**Prop typing** uses a local `type Props` declaration directly above the component:

```typescript
type Props = {
  eventId: string;
  initialSections: EventSection[];
};

export function SectionsEditor({ eventId, initialSections }: Props) { ... }
```

**Server components** (pages, layouts) are `async` functions that `await params` and call `auth.api.getSession` directly via `headers()`.

---

## Form Pattern

Forms use `react-hook-form` with `zodResolver`. All form fields use `Controller` with the custom `Field` / `FieldError` components from `src/components/shadcn/ui/field.tsx`. The `data-invalid` attribute bridges RHF validation state to CSS:

```typescript
const form = useForm<CreateEventInput>({
  resolver: zodResolver(createEventSchema(tErrors)),
  defaultValues: { ... },
  mode: "onChange",
  reValidateMode: "onBlur",
});

<Controller
  name="title"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <Label>{t("title_field")}</Label>
      <InputGroupInput {...field} aria-invalid={fieldState.invalid} />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

---

## Schema Pattern

Zod schemas accept a translation function `t: (key: string) => string` to support i18n error messages. Two variants are typically exported — one for server (using `(key) => key` identity), one for client (using `useTranslations`):

```typescript
// src/schemas/section.schema.ts
export const sectionVideoSchema = (t: (key: string) => string) =>
	z.object({
		type: z.literal(SectionType.VIDEO),
		content: z.object({ url: z.url(t("invalidUrl")) }),
	});

// Server-side: (key) => key passthrough
export const sectionSchema = z.discriminatedUnion("type", [
	sectionVideoSchema((key) => key),
]);

// Types always inferred from the schema
export type SectionVideoInput = z.infer<ReturnType<typeof sectionVideoSchema>>;
```

---

## Server Action Pattern

All mutations go through `safeAction` wrapper from `src/lib/safe-action.ts`. Actions return `ActionResult<T>` (discriminated union with `success: true | false`). Errors are thrown as `ApiError` with an `ErrorCode` enum value:

```typescript
// src/actions/events/create-event.action.ts
"use server";

export const createEventAction = safeAction(async (input: CreateEventInput) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);
	// ... business logic
	return { eventId: event.id };
});
```

Callers always check `result.success` before accessing `result.data`:

```typescript
const result = await createEventAction(data);
if (!result.success) {
	toast.error(t("errors.default"));
	return;
}
router.push(`/.../${result.data.eventId}/edit/additional`);
```

Non-mutating server fetches (read actions) do NOT use `safeAction` — they are plain `async` functions that throw `ApiError` directly:

```typescript
// src/actions/events/get-event-for-edit.action.ts
"use server";
export async function getEventForEdit(eventId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);
  ...
}
export type EventForEdit = Awaited<ReturnType<typeof getEventForEdit>>;
```

---

## API Route Handler Pattern

Next.js Route Handlers use `withApiHandler` wrapper from `src/lib/api-response.ts` and return `successResponse()`:

```typescript
// src/app/api/events/[id]/route.ts
export const GET = withApiHandler(async (req: Request) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED);
	return successResponse(events);
});
```

---

## Styling Conventions

**Utility:** `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) is used everywhere for conditional classes:

```typescript
import { cn } from "@/lib/utils";
className={cn("base-class", isActive && "active-class", className)}
```

**CVA (class-variance-authority)** is used for multi-variant UI primitives (Button, Field):

```typescript
const buttonVariants = cva("base...", { variants: { variant: {...}, size: {...} } });
```

**Tailwind classes** are written inline without abstraction. No CSS modules or global class names outside `src/app/globals.css`.

**Icons** always come from `@tabler/icons-react` with explicit `size-*` class:

```typescript
<IconLoader className="size-4 animate-spin" />
```

---

## Data Fetching Pattern

**Client-side queries** use TanStack Query v5 (`useQuery`) with string-keyed `queryKey` arrays from `src/consts/query-keys.ts`. Server actions are used as `queryFn`:

```typescript
const { data, isLoading } = useQuery({
	queryKey: [QUERY_KEYS.ORGANIZATIONS.MY_ORG],
	queryFn: () => getMyOrganizations(),
	staleTime: 1000 * 60 * 5,
});
```

**Server components** query Prisma directly (no SWR/React Query):

```typescript
const event = await prisma.event.findUnique({ where: { slug }, include: { ... } });
if (!event) notFound();
```

**QueryProvider** is configured with `staleTime: 60 * 1000` default and `retry: 1` at `src/providers/query-provider.tsx`.

---

## Internationalisation

`next-intl` v4 with locales `["en", "pl"]`, default `"pl"`. Always use the locale-aware `Link`, `redirect`, `useRouter`, `usePathname` from `src/i18n/routing.ts`, not from `next/navigation` or `next/link`:

```typescript
import { Link, redirect, useRouter } from "@/i18n/routing";
```

Translation keys are accessed via `useTranslations("Namespace")` in client components and passed as `t` to Zod schemas for i18n error messages.

---

## Path Aliases

Two aliases defined in `tsconfig.json`:

- `@/*` → `./src/*` (primary alias for all source imports)
- `#/*` → `./src/app/[locale]/*` (locale app directory, rarely used)

All imports use `@/` prefix. No relative imports between feature directories.

---

## Import Organization

1. React / Next.js framework imports
2. Third-party library imports
3. Internal `@/schemas/*`, `@/actions/*`, `@/lib/*`
4. Internal `@/components/*`, `@/features/*`
5. Internal `@/consts/*`, `@/types/*`, `@/hooks/*`
6. Relative imports (sibling files in same directory)

No explicit sorting enforced by ESLint — convention observed from reading files.

---

## Comments

- Inline comments in Russian or Polish (the team is Polish/Russian bilingual)
- `TODO` comments are present for unimplemented features — not enforced as errors
- Commented-out code blocks (JSX, dead imports) are left in source with `// comment` style
- No JSDoc/TSDoc used on functions or components

---

## Ownership / Auth Guards

Reusable ownership guards live in `src/lib/verify-ownership.ts`:

- `verifyEventOwnership(eventId, userId)`
- `verifySectionOwnership(sectionId, userId)`
- `verifyAgendaItemOwnership(itemId, userId)`
- `verifyFaqItemOwnership(itemId, userId)`

Each throws `ApiError(ErrorCode.FORBIDDEN, 403)` if ownership check fails.

---

## Gaps / Unknowns

- No `.prettierrc` or Prettier config detected — formatter may not be enforced; some files show inconsistent trailing commas.
- ESLint config (`eslint.config.js`) only covers `src/**/*.{js,jsx}` — TypeScript files are not linted by it.
- No Husky or lint-staged hooks detected — code quality gates may not run on commit.
- Mixed language in comments (Russian/Polish) without a documented policy.
- `typescript.ignoreBuildErrors: true` in `next.config.mjs` means TypeScript errors do not fail the build.
