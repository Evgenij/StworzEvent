"use client";

import * as React from "react";

import { NavFavorites } from "./nav-favorites";
import { NavSecondary } from "./dashboard/nav-secondary";
import { NavAdditional } from "./nav-additional";
import { NavWorkspaces } from "./nav-workspaces";
import { TeamSwitcher } from "./team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
} from "@/shadcn/ui/sidebar";
import {
	IconBook,
	IconBrandAppgallery,
	IconCalendarEvent,
	IconCommand,
	IconHome,
	IconLifebuoy,
	IconLoader,
	IconRobot,
	IconSend,
	IconSettings,
	IconSettings2,
	IconSmartHome,
	IconTerminal,
	IconWaveSine,
} from "@tabler/icons-react";
import { NavMain } from "./dashboard/nav-main";
import {
	DASHBOARD_ROUTE,
	EVENTS_ROUTE,
	NOTIFICATIONS_ROUTE,
	SETTINGS_ROUTE,
} from "@/helpers/routes";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/use-user";
import { User, UserRole } from "@prisma/client";

type SidebarUser = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	image?: string | null;
};

function SidebarFallback() {
	return (
		<Sidebar className="border-r-0">
			<SidebarContent className="flex items-center h-full">
				<IconLoader className="animate-spin" />
				<p>Loading</p>
			</SidebarContent>
		</Sidebar>
	);
}

function SidebarInner({
	role,
	...props
}: React.ComponentProps<typeof Sidebar> & { role: string }) {
	const t = useTranslations(`SidebarLeft.${role.toLowerCase()}`);

	const data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg",
		},
		teams: [
			{
				name: "Acme Inc",
				logo: IconBrandAppgallery,
				plan: "Enterprise",
			},
			{
				name: "Acme Corp.",
				logo: IconWaveSine,
				plan: "Startup",
			},
			{
				name: "Evil Corp.",
				logo: IconCommand,
				plan: "Free",
			},
		],
		navMain: [
			// {
			// 	title: "Search",
			// 	url: "#",
			// 	icon: Search,
			// },
			// {
			// 	title: "Ask AI",
			// 	url: "#",
			// 	icon: Sparkles,
			// },
			{
				title: t("dashboard"),
				url: DASHBOARD_ROUTE,
				icon: IconSmartHome,
				isActive: true,
			},
			{
				title: t("events"),
				url: EVENTS_ROUTE,
				icon: IconCalendarEvent,
			},
			{
				title: t("settings"),
				url: SETTINGS_ROUTE,
				icon: IconSettings2,
			},
			// {
			// 	title: t("notifications"),
			// 	url: NOTIFICATIONS_ROUTE,
			// 	icon: Inbox,
			// 	badge: "10",
			// },
		],
		navSecondary: [
			{
				title: "Playground",
				url: "#",
				icon: IconTerminal,
				isActive: true,
				items: [
					{
						title: "History",
						url: "#",
					},
					{
						title: "Starred",
						url: "#",
					},
					{
						title: "Settings",
						url: "#",
					},
				],
			},
			{
				title: "Models",
				url: "#",
				icon: IconRobot,
				items: [
					{
						title: "Genesis",
						url: "#",
					},
					{
						title: "Explorer",
						url: "#",
					},
					{
						title: "Quantum",
						url: "#",
					},
				],
			},
			{
				title: "Documentation",
				url: "#",
				icon: IconBook,
				items: [
					{
						title: "Introduction",
						url: "#",
					},
					{
						title: "Get Started",
						url: "#",
					},
					{
						title: "Tutorials",
						url: "#",
					},
					{
						title: "Changelog",
						url: "#",
					},
				],
			},
			{
				title: "Settings",
				url: "#",
				icon: IconSettings2,
				items: [
					{
						title: "General",
						url: "#",
					},
					{
						title: "Team",
						url: "#",
					},
					{
						title: "Billing",
						url: "#",
					},
					{
						title: "Limits",
						url: "#",
					},
				],
			},
		],
		navAdditional: [
			{
				title: "Support",
				url: "#",
				icon: IconLifebuoy,
				active: false,
			},
			{
				title: "Feedback",
				url: "#",
				icon: IconSend,
				active: false,
			},
		],
	};

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">
										Build Your Application
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>
										Data Fetching
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<div className="bg-muted/50 aspect-video rounded-xl" />
						<div className="bg-muted/50 aspect-video rounded-xl" />
						<div className="bg-muted/50 aspect-video rounded-xl" />
					</div>
					<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

export function SidebarLeft({
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & { user: SidebarUser }) {
	// const { user, isLoading } = useUser();

	if (!user?.role) {
		return <SidebarFallback />;
	}

	return <SidebarInner role={user.role} {...props} />;
}

// export function SidebarLeft({
// 	...props
// }: React.ComponentProps<typeof Sidebar>) {
// 	const { user, isOrganizer, isLoading } = useUser();

// 	console.log(user);

// 	const t = useTranslations(
// 		`SidebarLeft.${String(user?.role).toLowerCase()}`,
// 	);

// 	if (isLoading) {
// 		return <SidebarFallback />;
// 	}

// 	// This is sample data.
// 	const data = {
// 		user: {
// 			name: "shadcn",
// 			email: "m@example.com",
// 			avatar: "/avatars/shadcn.jpg",
// 		},
// 		teams: [
// 			{
// 				name: "Acme Inc",
// 				logo: GalleryVerticalEnd,
// 				plan: "Enterprise",
// 			},
// 			{
// 				name: "Acme Corp.",
// 				logo: AudioWaveform,
// 				plan: "Startup",
// 			},
// 			{
// 				name: "Evil Corp.",
// 				logo: Command,
// 				plan: "Free",
// 			},
// 		],
// 		navMain: [
// 			// {
// 			// 	title: "Search",
// 			// 	url: "#",
// 			// 	icon: Search,
// 			// },
// 			// {
// 			// 	title: "Ask AI",
// 			// 	url: "#",
// 			// 	icon: Sparkles,
// 			// },
// 			{
// 				title: t("dashboard"),
// 				url: DASHBOARD_ROUTE,
// 				icon: Home,
// 				isActive: true,
// 			},
// 			{
// 				title: t("notifications"),
// 				url: "#",
// 				icon: Inbox,
// 				badge: "10",
// 			},
// 		],
// 		navSecondary: [
// 			{
// 				title: "Playground",
// 				url: "#",
// 				icon: SquareTerminal,
// 				isActive: true,
// 				items: [
// 					{
// 						title: "History",
// 						url: "#",
// 					},
// 					{
// 						title: "Starred",
// 						url: "#",
// 					},
// 					{
// 						title: "Settings",
// 						url: "#",
// 					},
// 				],
// 			},
// 			{
// 				title: "Models",
// 				url: "#",
// 				icon: Bot,
// 				items: [
// 					{
// 						title: "Genesis",
// 						url: "#",
// 					},
// 					{
// 						title: "Explorer",
// 						url: "#",
// 					},
// 					{
// 						title: "Quantum",
// 						url: "#",
// 					},
// 				],
// 			},
// 			{
// 				title: "Documentation",
// 				url: "#",
// 				icon: BookOpen,
// 				items: [
// 					{
// 						title: "Introduction",
// 						url: "#",
// 					},
// 					{
// 						title: "Get Started",
// 						url: "#",
// 					},
// 					{
// 						title: "Tutorials",
// 						url: "#",
// 					},
// 					{
// 						title: "Changelog",
// 						url: "#",
// 					},
// 				],
// 			},
// 			{
// 				title: "Settings",
// 				url: "#",
// 				icon: Settings2,
// 				items: [
// 					{
// 						title: "General",
// 						url: "#",
// 					},
// 					{
// 						title: "Team",
// 						url: "#",
// 					},
// 					{
// 						title: "Billing",
// 						url: "#",
// 					},
// 					{
// 						title: "Limits",
// 						url: "#",
// 					},
// 				],
// 			},
// 		],
// 		navAdditional: [
// 			{
// 				title: "Support",
// 				url: "#",
// 				icon: IconLifebuoy,
// 				active: false,
// 			},
// 			{
// 				title: "Feedback",
// 				url: "#",
// 				icon: IconSend,
// 				active: false,
// 			},
// 		],
// 	};

// 	return (
// 		<>
// 			<React.Suspense fallback={<SidebarFallback />}>
// 				<Sidebar className="border-r-0" {...props}>
// 					<SidebarHeader>
// 						<TeamSwitcher teams={data.teams} />
// 						<NavMain items={data.navMain} />
// 					</SidebarHeader>
// 					<SidebarContent>
// 						<NavSecondary items={data.navSecondary} />
// 						{/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
// 					</SidebarContent>
// 					<SidebarFooter className="p-0">
// 						<NavAdditional
// 							items={data.navAdditional}
// 							className="mt-auto"
// 						/>
// 					</SidebarFooter>
// 				</Sidebar>
// 			</React.Suspense>
// 		</>
// 	);
// }
