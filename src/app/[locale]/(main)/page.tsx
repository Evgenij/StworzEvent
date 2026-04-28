import { MAIN_PAGE_EVENTS_ROUTE } from "@/config/routes";
import { redirect } from "next/navigation";

import React from "react";

const MainPage = async ({
	params,
}: {
	params: Promise<{ locale: string }>;
}) => {
	const { locale } = await params;

	// redirect({
	// 	href: `${MAIN_PAGE_EVENTS_ROUTE}`,
	// 	locale,
	// });

	redirect(`/${locale}${MAIN_PAGE_EVENTS_ROUTE}`);

	return (
		<>
			<section className="hero-section">HeroSection</section>
		</>
	);
};

export default MainPage;
