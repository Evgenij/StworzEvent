"use client";

import { useState } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { IconBuildings, IconPlus } from "@tabler/icons-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/shadcn/ui/sidebar";
import { Link } from "@/i18n/routing";
import { NEW_EVENT_ROUTE, NEW_ORGANIZATION_ROUTE } from "@/consts/routes";

type OrgInfo = {
	id: string;
	name: string;
	logo: string | null;
	slug: string;
};

export function CompanySwitcher({
	organizations,
}: {
	organizations: OrgInfo[];
}) {
	const { isMobile } = useSidebar();
	const [active, setActive] = useState<OrgInfo | null>(
		organizations[0] ?? null,
	);

	if (!active) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" asChild>
						<Link href={NEW_EVENT_ROUTE}>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg border-2 border-dashed border-sidebar-border">
								<IconPlus className="size-4 text-muted-foreground" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									Utwórz wydarzenie
								</span>
								<span className="truncate text-xs text-muted-foreground">
									Zostań organizatorem
								</span>
							</div>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-black text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<IconBuildings className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{active.name}
								</span>
								<span className="truncate text-xs">
									Plan - Free
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							Firmy
						</DropdownMenuLabel>
						{organizations.map((org, index) => (
							<DropdownMenuItem
								key={org.id}
								onClick={() => setActive(org)}
								className="gap-2 p-2"
							>
								<div className="flex size-6 items-center justify-center rounded-md border">
									<IconBuildings className="size-3.5 shrink-0" />
								</div>
								{org.name}
								<DropdownMenuShortcut>
									⌘{index + 1}
								</DropdownMenuShortcut>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild className="gap-2 p-2">
							<Link href={NEW_ORGANIZATION_ROUTE}>
								<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
									<Plus className="size-4" />
								</div>
								<div className="font-medium text-muted-foreground">
									Dodaj firmę
								</div>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
