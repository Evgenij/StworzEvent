import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { DASHBOARD_ROUTE, SIGNIN_ROUTE } from "./config/routes";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PREFIXES = ["/profile", "/admin"];

const ALWAYS_ALLOW_PREFIXES = [
	"/_next",
	"/favicon",
	"/images",
	"/apple-touch-icon",
	"/android-chrome",
	"/site.webmanifest",
	"/robots.txt",
	"/sitemap",
];

const COMING_SOON_ALLOWED = ["/pl", "/pl/unlock"];

//--------------------------
export async function proxy(req: NextRequest) {
	const { nextUrl } = req;
	const pathname = nextUrl.pathname;

	// Static and technical routes — always pass through
	const isAlwaysAllowed = ALWAYS_ALLOW_PREFIXES.some((prefix) =>
		pathname.startsWith(prefix),
	);
	if (isAlwaysAllowed) return NextResponse.next();

	// Check bypass cookie for owner access
	const bypassToken = req.cookies.get("bypass_token")?.value;
	const hasValidBypass =
		bypassToken !== undefined && bypassToken === process.env.BYPASS_TOKEN;

	if (!hasValidBypass) {
		// Coming-soon mode: only /pl and /unlock are accessible
		if (COMING_SOON_ALLOWED.includes(pathname)) {
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL("/pl", req.url));
	}

	// Owner bypass active — run normal auth + intl logic
	const sessionCookie = getSessionCookie(req, { cookiePrefix: "se-auth-v1" });
	const isLoggedIn = !!sessionCookie;

	const pathWithoutLocale =
		pathname.replace(
			new RegExp(`^/(${routing.locales.join("|")})`),
			"",
		) || "/";

	const isAuthRoute = pathWithoutLocale.startsWith("/auth");
	const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
		pathWithoutLocale.startsWith(prefix),
	);

	const segments = pathname.split("/");
	const currentLocale = routing.locales.includes(segments[1] as any)
		? segments[1]
		: routing.defaultLocale;

	if (isLoggedIn && isAuthRoute) {
		return NextResponse.redirect(
			new URL(`/${currentLocale}${DASHBOARD_ROUTE}`, req.url),
		);
	}

	if (!isLoggedIn && isProtectedRoute) {
		return NextResponse.redirect(
			new URL(`/${currentLocale}${SIGNIN_ROUTE}`, req.url),
		);
	}

	return intlMiddleware(req);
}

export const config = {
	matcher: ["/", "/(pl|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
