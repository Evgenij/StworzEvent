import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
	// Не применять middleware к API, статике и картинкам
	matcher: ["/", "/(pl|en)/:path*"],
};
