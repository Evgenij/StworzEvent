"use client";

import { Typography } from "@/components/shared";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";

// UUID или cuid — пропускаем как динамический сегмент
const isDynamicSegment = (segment: string) =>
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
		segment,
	) || // UUID
	/^[a-z0-9]{20,}$/.test(segment); // cuid

const PageHeader = () => {
	const pathname = usePathname();
	const t = useTranslations("PageTitles");

	// Фильтруем динамические сегменты
	const segments = pathname
		.split("/")
		.filter(Boolean)
		.filter((s) => !isDynamicSegment(s));

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
