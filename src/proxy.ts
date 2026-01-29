import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { PROFILE_ROUTE, SIGNIN_ROUTE } from "./helpers/routes";

// export default createMiddleware(routing);
const intlMiddleware = createMiddleware(routing);
const protectedRoutes = [PROFILE_ROUTE];

export async function proxy(req: NextRequest) {
	// const { nextUrl } = req;
	// const sessionCookie = getSessionCookie(req);

	const { nextUrl } = req;
	const sessionCookie = getSessionCookie(req);
	const isLoggedIn = !!sessionCookie;

	// 1. Получаем путь БЕЗ локали (например, из "/pl/auth/signin" получаем "/auth/signin")
	// Это самый надежный способ проверки роутов в next-intl
	const pathWithoutLocale =
		nextUrl.pathname.replace(
			new RegExp(`^/(${routing.locales.join("|")})`),
			"",
		) || "/";

	const isAuthRoute = pathWithoutLocale.startsWith("/auth");
	const isProtectedRoute = pathWithoutLocale.startsWith(PROFILE_ROUTE);

	const pathname = nextUrl.pathname;
	const segments = pathname.split("/");
	const currentLocale = routing.locales.includes(segments[1] as any)
		? segments[1]
		: routing.defaultLocale;

	//console.log("middleware locale:", currentLocale);

	const pathnameWithoutLocale =
		pathname.replace(new RegExp(`^/(${routing.locales.join("|")})`), "") ||
		"/";

	// const isProtectedRoute = protectedRoutes.some(
	// 	(route) => pathnameWithoutLocale === route,
	// );
	// const isAuthRoute = nextUrl.pathname.startsWith("/auth");

	// // Логика перенаправления
	// if (isOnProtectedRoute && !isLoggedIn) {
	// 	const url = nextUrl.clone();
	// 	// Важно: перенаправляем с учетом локали
	// 	url.pathname = `/${currentLocale}${SIGNIN_ROUTE}`;
	// 	return NextResponse.redirect(url);
	// }

	// if (isLoggedIn && isOnAuthRoute) {
	// 	const url = nextUrl.clone();
	// 	url.pathname = `/${currentLocale}${PROFILE_ROUTE}`;
	// 	return NextResponse.redirect(url);
	// }

	// 2. Если залогинен и пытается зайти на /auth/... (включая /pl/auth/...)
	if (isLoggedIn && isAuthRoute) {
		// Редиректим на профиль с сохранением текущей локали
		const locale = nextUrl.pathname.split("/")[1] || routing.defaultLocale;
		return NextResponse.redirect(
			new URL(`/${locale}${PROFILE_ROUTE}`, req.url),
		);
	}

	// 3. Если НЕ залогинен и пытается зайти на защищенный роут
	if (!isLoggedIn && isProtectedRoute) {
		const locale = nextUrl.pathname.split("/")[1] || routing.defaultLocale;
		return NextResponse.redirect(
			new URL(`/${locale}${SIGNIN_ROUTE}`, req.url),
		);
	}

	// return res;
	return intlMiddleware(req);
}

// export const config = {
// 	// Не применять middleware к API, статике и картинкам
// 	matcher: [
// 		"/",
// 		"/(pl|en)/:path*",
// 		"/profile",
// 		"/auth/:path*",
// 		//"/((?!api|_next/static|_next/image|favicon.ico).*)",
// 	],
// };

export const config = {
	// Расширяем matcher, чтобы он ловил всё, что нам нужно
	matcher: ["/", "/(pl|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
