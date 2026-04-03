import { FooterWebsite } from "@/components/layout/footer";
import { HeaderWebsite } from "@/components/layout/header";
import { MobileMenu } from "@/components/layout/menu";
import { auth } from "@/lib/auth";
import { UserType } from "@/types/user";
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
			<main className="container relative flex items-center justify-center max-w-7xl mx-auto flex-1 px-0 sm:px-6 py-0 md:py-4">
				{children}
			</main>
			<MobileMenu />
			<FooterWebsite locale={locale} />
		</>
	);
};

export default MainLayout;
