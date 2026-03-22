import { FooterWebsite } from "@/components/layout/footer";
import { HeaderWebsite } from "@/components/layout/header";
import { auth } from "@/lib/auth";
import { UserType } from "@/types/user";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { headers } from "next/headers";

type MainLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

const MainLayout = async ({ children, params }: MainLayoutProps) => {
	const { locale } = await params;

	const session = await auth.api.getSession({ headers: await headers() });

	return (
		<>
			<HeaderWebsite locale={locale} user={session?.user as UserType} />
			<main className="container mx-auto flex-1 px-6 py-4">
				{children}
			</main>
			<FooterWebsite locale={locale} />
		</>
	);
};

export default MainLayout;
