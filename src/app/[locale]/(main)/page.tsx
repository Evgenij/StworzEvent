import { MAIN_PAGE_EVENTS_ROUTE } from "@/helpers/routes";
import { redirect } from "@/i18n/routing";
import React from "react";

const MainPage = async ({
	params,
}: {
	params: Promise<{ locale: string }>;
}) => {
	const { locale } = await params;

	redirect({
		href: MAIN_PAGE_EVENTS_ROUTE,
		locale,
	});

	return (
		<>
			<section className="hero-section">HeroSection</section>
		</>
	);
};

export default MainPage;
