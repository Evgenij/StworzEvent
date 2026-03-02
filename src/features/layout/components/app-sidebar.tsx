"use client";

import * as React from "react";
import {
	BookOpen,
	Bot,
	Command,
	Frame,
	LifeBuoy,
	Map,
	PieChart,
	Send,
	Settings2,
	SquareTerminal,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/shadcn/ui/sidebar";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { UserType } from "@/types/user";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/use-user";
import { IconLoader } from "@tabler/icons-react";
import { DASHBOARD_ROUTE, EVENTS_ROUTE } from "@/helpers/routes";
import { Link } from "@/i18n/routing";

function SidebarFallback() {
	return (
		<Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
			<SidebarContent className="flex items-center h-full">
				<IconLoader className="animate-spin" />
				<p>Loading</p>
			</SidebarContent>
		</Sidebar>
	);
}

export default function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar> & {
	user: UserType;
}) {
	const { user, isLoading, session } = useUser();

	console.log("user", user);

	// Пока нет юзера — безопасный fallback для роли
	const role = user?.role?.toLowerCase() ?? "user";
	const t = useTranslations(`Sidebar.${role}`);

	if (isLoading || (session && !user)) return <SidebarFallback />;
	if (!user) return <SidebarFallback />;

	const data = {
		navMain: [
			{
				title: t("groups.main"),
				url: "#",
				icon: SquareTerminal,
				isActive: true,
				items: [
					{
						title: t("pages.dashboard"),
						url: DASHBOARD_ROUTE,
						isActive: true,
					},
					{
						title: t("pages.events"),
						url: EVENTS_ROUTE,
					},
				],
			},
		],
		navSecondary: [
			{
				title: "Support",
				url: "#",
				icon: LifeBuoy,
			},
			{
				title: "Feedback",
				url: "#",
				icon: Send,
			},
		],
		projects: [
			{
				name: "Design Engineering",
				url: "#",
				icon: Frame,
			},
			{
				name: "Sales & Marketing",
				url: "#",
				icon: PieChart,
			},
			{
				name: "Travel",
				url: "#",
				icon: Map,
			},
		],
	};

	return (
		<React.Suspense fallback={<SidebarFallback />}>
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
					{data.navMain.map((item) => (
						<SidebarGroup key={item.title}>
							<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{item.items.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild
												// isActive={item.isActive}
											>
												<Link href={item.url}>
													{item.title}
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					))}
					<NavProjects projects={data.projects} t={t} />
					<NavMain items={data.navMain} t={t} />

					<NavSecondary
						items={data.navSecondary}
						className="mt-auto"
					/>
				</SidebarContent>
				<SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
			</Sidebar>
		</React.Suspense>
	);
}
