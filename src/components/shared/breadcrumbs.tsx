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

const isDynamicSegment = (segment: string) =>
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
		segment,
	) || // UUID
	/^[a-z0-9]{25,}$/.test(segment); // cuid

const Breadcrumbs = ({ className }: { className?: string }) => {
	const pathname = usePathname();
	const t = useTranslations("PageTitles");

	// убираем локаль, profile, dashboard, и динамические сегменты
	const segments = pathname.split("/").filter(Boolean).slice(1);
	const filteredSegments = segments.filter(
		(segment) =>
			segment !== "dashboard" &&
			segment !== "profile" &&
			!isDynamicSegment(segment),
	);

	const getTitle = (segment: string, prevSegment?: string) => {
		try {
			if (prevSegment && t.has(`${prevSegment}.${segment}` as any)) {
				return t(`${prevSegment}.${segment}` as any);
			}
		} catch {}

		try {
			const key = `${segment}.title` as any;
			if (t.has(key)) return t(key);
			if (t.has(segment as any)) return t(segment as any);
			return segment;
		} catch {
			return segment;
		}
	};

	// href строим по оригинальным сегментам (с UUID), но показываем отфильтрованные
	const buildHref = (filteredIndex: number) => {
		const filteredSeg = filteredSegments[filteredIndex];
		const originalIndex = segments.indexOf(filteredSeg);
		return "/" + segments.slice(0, originalIndex + 1).join("/");
	};

	return (
		<Breadcrumb className={className}>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/profile/dashboard">{t("dashboard")}</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{filteredSegments.map((segment, index) => {
					const isLast = index === filteredSegments.length - 1;
					const prevSegment = filteredSegments[index - 1];
					const href = buildHref(index);

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
