"use client";

import {
	ORGANIZATION_DATA_ROUTE,
	ORGANIZATION_PLAN_ROUTE,
} from "@/config/routes";
import { useOrganization } from "@/features/organizations/context/organization-context";
import { cn } from "@/lib/utils";
import {
	IconBell,
	IconBuilding,
	IconCrown,
	IconNotification,
	IconPlug,
	IconShield,
	IconUser,
	IconUsers,
} from "@tabler/icons-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";

type NavigationLink = {
	href: string;
	name: string;
	icon: React.ElementType;
	active: boolean;
};

const OrganizationPageNavigation = ({ className }: { className?: string }) => {
	const { id } = useOrganization();
	const router = useRouter();
	const pathname = usePathname();

	const links: NavigationLink[] = [
		{
			href: ORGANIZATION_DATA_ROUTE(id),
			name: "Dane organizacji",
			icon: IconBuilding,
			active: true,
		},
		{
			href: "/organizations/team",
			name: "Zespoł",
			icon: IconUsers,
			active: false,
		},
		{
			href: ORGANIZATION_PLAN_ROUTE(id),
			name: "Plan",
			icon: IconCrown,
			active: true,
		},
		// {
		// 	href: ORGANIZATION_PLAN_ROUTE(id),
		// 	name: "Powiadomienia",
		// 	icon: IconBell,
		// 	active: false,
		// },
		// {
		// 	href: ORGANIZATION_PLAN_ROUTE(id),
		// 	name: "Bezpieczeństwo",
		// 	icon: IconShield,
		// 	active: false,
		// },
		// {
		// 	href: ORGANIZATION_PLAN_ROUTE(id),
		// 	name: "Integracje",
		// 	icon: IconPlug,
		// 	active: false,
		// },
	];

	const activeLink = links.find((l) => pathname.endsWith(l.href)) ?? links[1];

	return (
		<Tabs value={activeLink.name} className="navigation">
			<TabsList>
				{links.map((link) => {
					const Icon = link.icon;
					return (
						<TabsTrigger
							key={link.name}
							value={link.name}
							disabled={!link.active}
							onClick={() => router.push(link.href)}
						>
							<Icon className="size-4" />
							{link.name}
						</TabsTrigger>
					);
				})}
			</TabsList>
		</Tabs>
	);
};

export default OrganizationPageNavigation;
