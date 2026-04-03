"use client";

import MobileMenuWrapper from "./mobile-menu-wrapper";
import MobileMenuItem from "./mobile-menu-item";
import { useMobileMenuStore } from "@/stores/mobile-menu.store";
import { usePathname } from "@/i18n/routing";
import { IconHome, IconSearch, IconTicket } from "@tabler/icons-react";
import { MAIN_PAGE_EVENTS_ROUTE, MAIN_PAGE_ROUTE } from "@/consts/routes";
import { IconTicketAdd } from "@/assets/icons";
import MobileMenuNav from "./mobile-menu-nav";

const MobileMenu = () => {
	const { openTicketDrawer } = useMobileMenuStore();
	const pathname = usePathname();
	const isEventPage = /\/events\/.+/.test(pathname);

	const items = [
		{
			href: MAIN_PAGE_EVENTS_ROUTE,
			icon: IconSearch,
			label: "Wydarzenia",
		},
		{ href: MAIN_PAGE_ROUTE, icon: IconHome, label: "Home" },
	];

	return (
		<MobileMenuWrapper>
			<MobileMenuNav>
				<MobileMenuItem
					href={MAIN_PAGE_EVENTS_ROUTE}
					icon={IconSearch}
					label="Wydarzenia"
				/>
				<MobileMenuItem
					href={MAIN_PAGE_ROUTE}
					icon={IconHome}
					label="Home"
				/>
				{isEventPage && (
					<MobileMenuItem
						icon={IconTicketAdd}
						label="Bilety"
						onClick={openTicketDrawer}
					/>
				)}
			</MobileMenuNav>
		</MobileMenuWrapper>
	);
};

export default MobileMenu;
