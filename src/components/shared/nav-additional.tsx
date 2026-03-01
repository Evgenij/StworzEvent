import * as React from "react";
import { type LucideIcon } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/shadcn/ui/sidebar";
import { Button } from "@/components/shadcn/ui/button";

export function NavAdditional({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		active: boolean;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	return (
		<SidebarGroup {...props} className="mt-auto p-0">
			<SidebarSeparator className="mx-0" />
			<SidebarGroupContent className="p-2">
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<Button
								variant="ghost"
								className="w-full justify-start"
								disabled={!item.active}
							>
								<item.icon />
								{item.title}
							</Button>
							{/* <SidebarMenuButton asChild isActive={item.active}>
								<a href={item.url}>
									<item.icon />
									<span></span>
								</a>
							</SidebarMenuButton> */}
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
