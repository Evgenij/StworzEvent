"use client";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/shadcn/ui/sidebar";
import { Badge } from "@/shadcn/ui/badge";
import { TablerIcon } from "@tabler/icons-react";
import { Link } from "@/i18n/routing";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: TablerIcon;
		isActive?: boolean;
		badge?: string;
	}[];
}) {
	return (
		<SidebarMenu>
			{items.map((item) => (
				<SidebarMenuItem key={item.title}>
					<SidebarMenuButton asChild isActive={item.isActive}>
						<Link href={item.url}>
							<item.icon />
							<span>{item.title}</span>
							{item.badge && (
								<Badge className="bg-red-600 text-white">
									{item.badge}
								</Badge>
							)}
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
}
