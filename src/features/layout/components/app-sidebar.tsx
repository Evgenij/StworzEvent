"use client";

import * as React from "react";
import {
	LifeBuoy,
	Send,
	Command,
	Folder,
	Share,
	Trash2,
	MoreHorizontal,
} from "lucide-react";
import { IconCalendar, IconHome2, IconPlus } from "@tabler/icons-react";
import { UserRole } from "@prisma/client";
import { UserType } from "@/types/user";
import { Link } from "@/i18n/routing";
import { DASHBOARD_ROUTE, EVENTS_ROUTE } from "@/consts/routes";
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
} from "@/components/shadcn/ui/sidebar";
import { getNavConfig } from "./nav-config"; // конфиг который я показывал
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcn/ui/tooltip";

const navSecondary = [
	{ title: "Support", url: "#", icon: LifeBuoy },
	{ title: "Feedback", url: "#", icon: Send },
];

export default function AppSidebar({
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & { user: UserType }) {
	const role = user.role ?? UserRole.USER;
	const t = useTranslations(`Sidebar.${role.toLowerCase()}`);
	const navConfig = getNavConfig(role, t);
	const isMobile = useIsMobile();

	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<Command className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										Acme Inc
									</span>
									<span className="truncate text-xs">
										Enterprise
									</span>
								</div>
							</a>
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
