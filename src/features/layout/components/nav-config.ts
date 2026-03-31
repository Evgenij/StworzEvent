// nav-config.ts — убираем useTranslations отсюда
import {
	DASHBOARD_ROUTE,
	EVENTS_ROUTE,
	MAIN_PAGE_ROUTE,
	NEW_EVENT_ROUTE,
} from "@/consts/routes";
import {
	IconSmartHome,
	IconCalendarEvent,
	IconTicket,
	IconCalendar,
	IconPlus,
	IconTemplate,
	IconListDetails,
} from "@tabler/icons-react";
import { UserRole } from "@prisma/client";

type NavItem = {
	title: string;
	url: string;
	icon: React.ElementType;
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
					},
					{
						title: t("pages.events"),
						url: EVENTS_ROUTE,
						icon: IconCalendarEvent,
					},
				],
			},
		],

		[UserRole.ORGANIZER]: [
			{
				title: t("groups.main"),
				items: [
					{
						title: t("pages.dashboard"),
						url: DASHBOARD_ROUTE,
						icon: IconSmartHome,
					},
					{
						title: t("pages.events"),
						url: EVENTS_ROUTE,
						icon: IconCalendarEvent,
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
				],
			},
		],

		[UserRole.USER]: [
			{
				title: t("groups.platform"),
				items: [
					{
						title: t("pages.dashboard"),
						url: DASHBOARD_ROUTE,
						icon: IconSmartHome,
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
			{
				title: t("groups.main"),
				items: [
					{
						title: t("pages.catalog"),
						url: MAIN_PAGE_ROUTE,
						icon: IconListDetails,
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
	};

	return configs[role] ?? configs[UserRole.USER];
};
