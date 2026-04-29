"use client";

import * as React from "react";
import { LifeBuoy, Send } from "lucide-react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { UserRole } from "@prisma/client";
import { UserType } from "@/features/user/types/user";
import { Link } from "@/i18n/routing";
import { MAIN_PAGE_EVENTS_ROUTE } from "@/config/routes";
import { NavUser } from "./nav-user";
import { NavSecondary } from "./nav-secondary";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenuAction,
} from "@/components/ui/sidebar";
import { getNavConfig } from "./nav-config"; // конфиг который я показывал
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { CompanySwitcher } from "./company-switcher";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useMyOrganizations } from "@/features/organizations/hooks/use-my-organizations";

const navSecondary = [
	{ title: "Support", url: "#", icon: LifeBuoy },
	{ title: "Feedback", url: "#", icon: Send },
];

export default function AppSidebar({
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	user: UserType;
}) {
	const role = user.role ?? UserRole.USER;
	const t = useTranslations(`Sidebar.${role.toLowerCase()}`);
	const navConfig = getNavConfig(role, t);
	const isMobile = useIsMobile();
	const { data: organizations = [] } = useMyOrganizations();

	return (
		<Sidebar
			// className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"

			variant="inset"
			{...props}
		>
			<SidebarHeader>
				<CompanySwitcher organizations={organizations} />
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href={MAIN_PAGE_EVENTS_ROUTE}>
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg border-2 border-border ">
									<IconSearch className="size-4 text-muted-foreground" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										Szukaj wydarzeń
									</span>
									<span className="truncate text-xs text-muted-foreground">
										Znajdź cos dla siebie
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{navConfig.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupLabel>{group.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<Link href={item.url}>
												{item.icon && <item.icon />}
												{item.title}
											</Link>
										</SidebarMenuButton>
										{item.actionButton && (
											<SidebarMenuAction
												showOnHover
												className="ml-auto"
												asChild
											>
												<Link
													href={
														item.actionButton.href
													}
												>
													<Tooltip>
														<TooltipTrigger asChild>
															<IconPlus className="size-4" />
														</TooltipTrigger>
														<TooltipContent>
															<p>
																{
																	item
																		.actionButton
																		.label
																}
															</p>
														</TooltipContent>
													</Tooltip>
												</Link>

												{/* {item.actionButton} */}
											</SidebarMenuAction>
										)}
										{item.menu && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<SidebarMenuAction
														showOnHover
														className=""
													>
														<IconPlus className="size-4" />
													</SidebarMenuAction>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													className="w-48"
													side={
														isMobile
															? "bottom"
															: "right"
													}
													align={
														isMobile
															? "end"
															: "start"
													}
												>
													{item.menu.items.map(
														(menuItem, index) => (
															<DropdownMenuItem
																key={index}
															>
																<menuItem.icon className="text-muted-foreground" />
																<span>
																	{
																		menuItem.title
																	}
																</span>
															</DropdownMenuItem>
														),
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										)}
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}

				<NavSecondary items={navSecondary} className="mt-auto" />
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
