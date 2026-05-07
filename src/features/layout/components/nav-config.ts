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
	IconHeart,
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
	switch (role) {
		case UserRole.ADMIN:
			return [
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
			];

		case UserRole.ORGANIZER:
			return [
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
						},
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
					],
				},
			];

		default:
			return [
				{
					title: t("groups.platform"),
					items: [
						{
							title: t("pages.tickets"),
							url: DASHBOARD_ROUTE,
							icon: IconTicket,
							active: true,
						},
						{
							title: t("pages.favoritres"),
							url: TICKETS_ROUTE,
							icon: IconHeart,
							active: true,
						},
					],
				},
				{
					title: t("groups.account"),
					items: [
						{
							title: t("pages.settings"),
							url: SETTINGS_ROUTE,
							icon: IconSettings,
							active: true,
						},
					],
				},
			];
	}
};
