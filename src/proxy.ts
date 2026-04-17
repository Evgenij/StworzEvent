import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import {
	DASHBOARD_ROUTE,
	SIGNIN_ROUTE,
} from "./consts/routes";

const intlMiddleware = createMiddleware(routing);

/**
 * Path PREFIXES (without locale) that require an authenticated session.
 * Covers all sub-routes automatically (e.g. /profile/events, /profile/settings, …).
 */
const PROTECTED_PREFIXES = ["/profile", "/admin"];

//--------------------------
export async function proxy(req: NextRequest) {
	const { nextUrl } = req;
	const sessionCookie = getSessionCookie(req, { cookiePrefix: "se-auth-v1" });
	const isLoggedIn = !!sessionCookie;

	// Strip locale prefix to get the "clean" path for route matching
	const pathWithoutLocale =
		nextUrl.pathname.replace(
			new RegExp(`^/(${routing.locales.join("|")})`),
			"",
		) || "/";

	const isAuthRoute = pathWithoutLocale.startsWith("/auth");
	const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
		pathWithoutLocale.startsWith(prefix),
	);

	const segments = nextUrl.pathname.split("/");
	const currentLocale = routing.locales.includes(segments[1] as any)
		? segments[1]
		: routing.defaultLocale;

	// 1. Logged-in user trying to access /auth/* → redirect to dashboard
	if (isLoggedIn && isAuthRoute) {
		return NextResponse.redirect(
			new URL(`/${currentLocale}${DASHBOARD_ROUTE}`, req.url),
		);
	}

	// 2. Guest trying to access a protected route → redirect to sign-in
	if (!isLoggedIn && isProtectedRoute) {
		return NextResponse.redirect(
			new URL(`/${currentLocale}${SIGNIN_ROUTE}`, req.url),
		);
	}

	return intlMiddleware(req);
}

export const config = {
	// Расширяем matcher, чтобы он ловил всё, что нам нужно
	matcher: ["/", "/(pl|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
