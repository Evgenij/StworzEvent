// components/breadcrumbs.tsx
"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/shadcn/ui/breadcrumb";
import { Link } from "@/i18n/routing";
import React from "react";

const Breadcrumbs = () => {
	const pathname = usePathname();
	const t = useTranslations("PageTitles");

	// убираем локаль из пути: /en/profile/dashboard -> ["profile", "dashboard"]
	const segments = pathname.split("/").filter(Boolean).slice(1);
	const filteredSegments = segments.filter(
		(segment) => segment !== "dashboard" && segment !== "profile",
	);

	const getTitle = (segment: string, prevSegment?: string) => {
		try {
			// пробуем "events.new" как вложенный ключ
			if (prevSegment) {
				const nested = t.rich(`${prevSegment}.${segment}` as any);
				if (nested) return nested as string;
			}
		} catch {}

		try {
			// пробуем просто "events.title" или "events" как строку
			const key = `${segment}.title` as any;
			if (t.has(key)) return t(key);
			return t(segment as any);
		} catch {
			return segment;
		}
	};

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/profile/dashboard">{t("dashboard")}</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{filteredSegments.map((segment, index) => {
					const isLast = index === filteredSegments.length - 1;
					const prevSegment = filteredSegments[index - 1]; // ← предыдущий сегмент
					const href =
						"/" +
						segments
							.slice(0, segments.indexOf(segment) + 1)
							.join("/");

					return (
						<React.Fragment key={segment}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>
										{getTitle(segment, prevSegment)}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={href}>
											{getTitle(segment, prevSegment)}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default Breadcrumbs;
