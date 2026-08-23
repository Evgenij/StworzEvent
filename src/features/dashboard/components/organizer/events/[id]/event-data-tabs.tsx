"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	EVENT_DATA_ROUTE,
	EVENT_PARTICIPANTS_ROUTE,
	ORGANIZATION_DATA_ROUTE,
	ORGANIZATION_PAYMENT_METHODS_ROUTE,
} from "@/config/routes";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
	IconApi,
	IconBuilding,
	IconCode,
	IconCreditCard,
	IconUsers,
} from "@tabler/icons-react";

type NavigationLink = {
	href: string;
	name: string;
	icon: React.ElementType;
	active: boolean;
};

const EventDataTabs = ({
	className,
	eventId,
}: {
	className?: string;
	eventId: string;
}) => {
	const router = useRouter();
	const pathname = usePathname();

	const links: NavigationLink[] = [
		{
			href: EVENT_DATA_ROUTE(eventId),
			name: "Dane wydarzenia",
			icon: IconBuilding,
			active: true,
		},
		{
			href: EVENT_PARTICIPANTS_ROUTE(eventId),
			name: "Uczestnicy",
			icon: IconCreditCard,
			active: true,
		},
		{
			href: "/organizations/team",
			name: "Ustawienia",
			icon: IconUsers,
			active: false,
		},
	];

	const activeLink = links.find((l) => pathname.endsWith(l.href)) ?? links[1];

	return (
		<Tabs
			value={activeLink.name}
			className={cn("event-data-tabs", className)}
			orientation="vertical"
		>
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

export default EventDataTabs;
