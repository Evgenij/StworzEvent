import { Button } from "@/components/ui/button";
import { EVENT_EDIT_ROUTE, EVENT_ORDERS_ROUTE } from "@/config/routes";
import { HeaderWrapper } from "@/features/layout";
import { getEventAction } from "@/features/events/actions/get-event.action";
import { DateTimeFormatter } from "@/helpers/date";
import { Link } from "@/i18n/routing";
import { Typography } from "@/shared/components";
import { BackButton } from "@/shared/components/back-button";
import {
	IconApi,
	IconCalendarEvent,
	IconCode,
	IconEdit,
	IconMapPin,
	IconReceipt,
	IconShare2,
	IconTicket,
	IconUsers,
} from "@tabler/icons-react";
import { notFound } from "next/navigation";
import EventStatusBadge from "@/shared/components/badges/event-status-badge";
import EventCategoryBadge from "@/shared/components/badges/event-category-badge";
import { formatCurrencyPLN } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventDataTabs from "@/features/dashboard/components/organizer/events/[id]/event-data-tabs";

const OrganizerEventDataPage = async ({
	params,
	children,
}: {
	params: Promise<{ id: string }>;
	children: React.ReactNode;
}) => {
	const { id } = await params;

	if (!id) {
		return null;
	}

	const event = await getEventAction(id);

	console.log(event);

	if (!event) {
		return notFound();
	}

	return (
		<section className="event-data-page flex flex-col gap-4">
			event-participants
		</section>
	);
};

export default OrganizerEventDataPage;
