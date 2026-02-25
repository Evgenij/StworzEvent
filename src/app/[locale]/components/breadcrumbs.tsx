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
} from "@/shadcn/ui/breadcrumb";
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
										{t(segment)}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={href}>{t(segment)}</Link>
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
