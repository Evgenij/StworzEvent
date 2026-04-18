import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Poppins } from "next/font/google";
import "../globals.css";
import "@/app/base.scss";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/shadcn/ui/sonner";
import MobileMenu from "@/components/layout/menu/mobile-menu";
import { APP_CONFIG } from "@/config/app";

const fontPoppins = Poppins({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: {
		default: APP_CONFIG.name,
		template: `%s | ${APP_CONFIG.name}`,
	},
	description: APP_CONFIG.description,
	icons: {
		apple: "/apple-touch-icon.png",
		icon: [
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
		],
	},
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	// Получаем сообщения для текущего языка
	const messages = await getMessages();

	return (
		<html lang={locale} className={`${fontPoppins.variable}`}>
			<body className="antialiased min-h-screen flex flex-col relative">
				<QueryProvider>
					<NextIntlClientProvider messages={messages}>
						<Toaster />
						{children}
					</NextIntlClientProvider>
				</QueryProvider>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
