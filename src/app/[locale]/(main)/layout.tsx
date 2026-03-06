import { FooterWebsite } from "@/components/layout/footer";
import { HeaderWebsite } from "@/components/layout/header";

type MainLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

const MainLayout = async ({ children, params }: MainLayoutProps) => {
	const { locale } = await params;
	return (
		<>
			<HeaderWebsite locale={locale} />
			<main className="container mx-auto flex-1 px-6 py-4">
				{children}
			</main>
			<FooterWebsite locale={locale} />
		</>
	);
};

export default MainLayout;
