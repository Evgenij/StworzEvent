// nav-config.ts — убираем useTranslations отсюда
import {
	DASHBOARD_ROUTE,
	EVENTS_ROUTE,
	MAIN_PAGE_ROUTE,
	NEW_EVENT_ROUTE,
	ORGANIZATIONS_ROUTE,
	SETTINGS_ROUTE,
	TICKETS_ROUTE,
} from "@/config/routes";
import {
	IconSmartHome,
	IconCalendarEvent,
	IconListDetails,
	IconSettings,
	IconBuildings,
	IconUsers,
	IconChartBar,
	IconBell,
	IconTicket,
} from "@tabler/icons-react";
import { UserRole } from "@prisma/client";

type NavItem = {
	title: string;
	url: string;
	icon: React.ElementType;
	active: boolean;
	actionButton?: {
		label: string;
		href: string;
	};
	menu?: {
		triggerIcon: React.ElementType;
		items: {
			title: string;
			triggerIcon: React.ElementType;
			url: string;
			icon: React.ElementType;
		}[];
	};
};

type NavGroup = {
	title: string;
	items: NavItem[];
};

export const getNavConfig = (
	role: UserRole,
	t: (key: string) => string,
): NavGroup[] => {
	const configs: Record<UserRole, NavGroup[]> = {
		[UserRole.ADMIN]: [
			{
				title: t("groups.main"),
				items: [
					{
						title: t("pages.dashboard"),
						url: DASHBOARD_ROUTE,
						icon: IconSmartHome,
						active: true,
					},
					{
						title: t("pages.events"),
						url: EVENTS_ROUTE,
						icon: IconCalendarEvent,
						active: true,
					},
				],
			},
		],

		[UserRole.ORGANIZER]: [
			{
				title: t("groups.platform"),
				items: [
					{
						title: t("pages.dashboard"),
						url: DASHBOARD_ROUTE,
						icon: IconSmartHome,
						active: true,
					},
					{
						title: t("pages.events"),
						url: EVENTS_ROUTE,
						icon: IconCalendarEvent,
						active: true,
						actionButton: {
							label: t("actionButton"),
							href: NEW_EVENT_ROUTE,
						},
						// menu: {
						// 	triggerIcon: IconPlus,
						// 	items: [
						// 		{
						// 			title: t("submenu.events.createEvent"),
						// 			triggerIcon: IconPlus,
						// 			url: "/events/create",
						// 			icon: IconPlus,
						// 		},
						// 	],
						// },
					},
					// {
					// 	title: t("pages.catalog"),
					// 	url: MAIN_PAGE_ROUTE,
					// 	icon: IconListDetails,
					// 	active: true,
					// },
					{
						title: t("pages.participants"),
						url: "",
						icon: IconUsers,
						active: false,
					},
					{
						title: t("pages.statistics"),
						url: "",
						icon: IconChartBar,
						active: false,
					},
					{
						title: t("pages.notifications"),
						url: "",
						icon: IconBell,
						active: false,
					},
				],
			},
			{
				title: t("groups.participant"),
				items: [
					{
						title: t("pages.tickets"),
						url: TICKETS_ROUTE,
						icon: IconTicket,
						active: true,
					},
				],
			},
			{
				title: t("groups.account"),
				items: [
					{
						title: t("pages.organizations"),
						url: ORGANIZATIONS_ROUTE,
						icon: IconBuildings,
						active: true,
					},
					{
						title: t("pages.settings"),
						url: SETTINGS_ROUTE,
						icon: IconSettings,
						active: true,
					},
					// {
					// 	title: t("pages.events"),
					// 	url: EVENTS_ROUTE,
					// 	icon: IconCalendarEvent,
					// 	actionButton: {
					// 		label: t("actionButton"),
					// 		href: NEW_EVENT_ROUTE,
					// 	},
					// },
				],
			},
		],

		[UserRole.USER]: [
			{
				title: t("groups.platform"),
				items: [
					{
						title: t("pages.tickets"),
						url: TICKETS_ROUTE,
						icon: IconTicket,
						active: true,
					},
				],
			},
			{
				title: t("groups.account"),
				items: [
					{
						title: t("pages.settings"),
						url: MAIN_PAGE_ROUTE,
						icon: IconSettings,
						active: true,
					},
				],
			},
		],
	};

	return configs[role] ?? configs[UserRole.USER];
};
