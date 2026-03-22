import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import {
	ADMIN_DASHBOARD_ROUTE,
	AUTH_VERIFY_ROUTE,
	DASHBOARD_ROUTE,
	SIGNIN_ROUTE,
} from "./consts/routes";

// export default createMiddleware(routing);
const intlMiddleware = createMiddleware(routing);
const protectedRoutes = [DASHBOARD_ROUTE, ADMIN_DASHBOARD_ROUTE];

//--------------------------
export async function proxy(req: NextRequest) {
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
	const isProtectedRoute = protectedRoutes.some(
		(route) =>
			pathWithoutLocale === route ||
			pathWithoutLocale.startsWith(`${route}/`),
	);
	const isVerifyRoute = pathWithoutLocale.startsWith(AUTH_VERIFY_ROUTE);

	const pathname = nextUrl.pathname;
	const segments = pathname.split("/");

	const currentLocale = routing.locales.includes(segments[1] as any)
		? segments[1]
		: routing.defaultLocale;
	//console.log("middleware locale:", currentLocale);

	// 2. Если залогинен и пытается зайти на /auth/... (включая /pl/auth/...)
	if (isLoggedIn && isAuthRoute) {
		// Редиректим на профиль с сохранением текущей локали
		const locale = nextUrl.pathname.split("/")[1] || routing.defaultLocale;
		return NextResponse.redirect(
			new URL(`/${locale}${DASHBOARD_ROUTE}`, req.url),
		);
	}

	///3. Если НЕ залогинен и пытается зайти на защищенный роут
	// if (!isLoggedIn && isProtectedRoute) {
	// 	const locale = nextUrl.pathname.split("/")[1] || routing.defaultLocale;
	// 	return NextResponse.redirect(
	// 		new URL(`/${locale}${SIGNIN_ROUTE}`, req.url),
	// 	);
	// }

	// if (isLoggedIn && isAuthRoute && !isVerifyRoute) {
	// 	const locale = nextUrl.pathname.split("/")[1] || routing.defaultLocale;
	// 	return NextResponse.redirect(
	// 		new URL(`/${locale}${DASHBOARD_ROUTE}`, req.url),
	// 	);
	// }

	// return res;
	return intlMiddleware(req);
}

export const config = {
	// Расширяем matcher, чтобы он ловил всё, что нам нужно
	matcher: ["/", "/(pl|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};

// export async function proxy(req: NextRequest) {
// 	const { nextUrl } = req;

// 	// Проверяем cookie
// 	const sessionCookie = getSessionCookie(req);
// 	const hasSession = Boolean(sessionCookie); // Только если реально есть cookie

// 	const segments = nextUrl.pathname.split("/");
// 	const currentLocale = routing.locales.includes(segments[1] as any)
// 		? segments[1]
// 		: routing.defaultLocale;

// 	const pathWithoutLocale =
// 		nextUrl.pathname.replace(
// 			new RegExp(`^/(${routing.locales.join("|")})`),
// 			"",
// 		) || "/";

// 	const isAuthRoute = pathWithoutLocale.startsWith("/auth");
// 	const isVerifyRoute = pathWithoutLocale.startsWith(AUTH_VERIFY_ROUTE);
// 	const isProtectedRoute = protectedRoutes.some(
// 		(route) =>
// 			pathWithoutLocale === route ||
// 			pathWithoutLocale.startsWith(`${route}/`),
// 	);

// 	const redirectTo = (path: string) =>
// 		NextResponse.redirect(new URL(`/${currentLocale}${path}`, req.url));

// 	// Редирект на дашборд только если точно есть сессия 1
// 	if (hasSession && isAuthRoute && !isVerifyRoute) {
// 		return redirectTo(DASHBOARD_ROUTE);
// 	}

// 	// Редирект на вход если путь защищён и точно нет сессии
// 	if (!hasSession && isProtectedRoute) {
// 		return redirectTo(SIGNIN_ROUTE);
// 	}

// 	// Главная страница / оставляем как есть
// 	return intlMiddleware(req);
// }

// Настройка matcher для всех нужных маршрутов
// export const config = {
// 	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
// };
