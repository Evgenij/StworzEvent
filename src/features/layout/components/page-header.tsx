"use client";

import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React from "react";
import { Typography } from "../../../components/shared/typography/typography";

const PageHeader = () => {
	const pathname = usePathname();
	const segment = pathname.split("/").pop(); // последний сегмент маршрута
	const t = useTranslations("PageTitles");

	return (
		<Typography className="text-left" variant="h2">
			{t(segment ?? "default")}
		</Typography>
	);
};

export default PageHeader;
