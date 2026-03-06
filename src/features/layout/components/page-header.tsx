"use client";

import { Typography } from "@/components/shared";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React from "react";

const PageHeader = () => {
	const pathname = usePathname();
	const t = useTranslations("PageTitles");

	const segments = pathname.split("/").filter(Boolean);
	const last = segments.at(-1) ?? "default";
	const prev = segments.at(-2);

	const getTitle = () => {
		if (prev && t.has(`${prev}.${last}` as any))
			return t(`${prev}.${last}` as any);
		if (t.has(`${last}.title` as any)) return t(`${last}.title` as any);
		if (t.has(last as any)) return t(last as any);
		return t("default");
	};

	return (
		<Typography className="text-left" variant="h2">
			{getTitle()}
		</Typography>
	);
};

export default PageHeader;
