import { Button } from "@/components/ui/button";
import { MAIN_PAGE_ROUTE } from "@/config/routes";
import { Link } from "@/i18n/routing";
import { IconChevronLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations("Metadata.auth");

	return {
		title: t("title"),
		description: t("description"),
		keywords: [
			"logowanie",
			"rejestracja",
			"StworzEvent",
			"wydarzenia",
			"eventy",
		],
		openGraph: {
			title: t("title"),
			description: t("description"),
			url: "https://stworzEvent.pl/auth",
			siteName: "StworzEvent.pl",
			locale: locale === "pl" ? "pl_PL" : "en_US",
			type: "website",
		},
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main
			className="min-h-screen flex bg"
			style={{
				backgroundImage: "url(/images/bg/sign-in-bg.webp)",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<section className="hidden md:w-3/5 min-h-screen md:flex p-10 justify-center items-center ">
				<Image
					src="/logos/logo_white.svg"
					alt="logo_white"
					width={457}
					height={103}
				/>
			</section>
			<aside className="w-full md:w-2/5 md:min-w-112.5 min-h-screen flex flex-col gap-9 justify-center items-center p-6 bg-background">
				<section className="max-w-87.5 w-full flex flex-col gap-5">
					{children}
				</section>
				<Button variant={"outline"} asChild>
					<Link href={MAIN_PAGE_ROUTE}>
						<IconChevronLeft className="size-5" />
						Wróć
					</Link>
				</Button>
			</aside>
		</main>
	);
}
