import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "@/app/base.scss";
import { APP_CONFIG } from "@/config/app";

const fontPoppins = Poppins({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
	title: APP_CONFIG.name,
	description:
		"Platforma do tworzenia i zarządzania wydarzeniami – już wkrótce!",
	icons: {
		apple: "/apple-touch-icon.png",
		icon: [
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pl" className={fontPoppins.variable}>
			<body className="antialiased h-screen flex flex-col">
				{children}
			</body>
		</html>
	);
}
