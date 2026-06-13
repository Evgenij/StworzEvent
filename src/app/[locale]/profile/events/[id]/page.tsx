import { Button } from "@/components/ui/button";
import { EVENT_EDIT_ROUTE, EVENT_ORDERS_ROUTE } from "@/config/routes";
import { HeaderWrapper } from "@/features/layout";
import { getEventAction } from "@/features/events/actions/get-event.action";
import { DateTimeFormatter } from "@/helpers/date";
import { Link } from "@/i18n/routing";
import { Typography } from "@/shared/components";
import { BackButton } from "@/shared/components/back-button";
import {
	IconCalendarEvent,
	IconEdit,
	IconMapPin,
	IconReceipt,
	IconShare2,
} from "@tabler/icons-react";
import { notFound } from "next/navigation";
import React from "react";

const OrganizerEventPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	if (!id) {
		return null;
	}

	const event = await getEventAction(id);

	if (!event) {
		return notFound();
	}

	return (
		<div className="event-page">
			<HeaderWrapper>
				<BackButton variant="transparent" />
				<header className="z-10 flex justify-between items-end mt-16">
					<div className="title-event flex flex-col gap-2">
						<div className="badges flex gap-1">
							<div className="badge flex items-center gap-1 bg-green-500/20 w-fit text-sm text-green-300 px-3 pl-2 py-1 rounded-full backdrop-blur-[2px]">
								<span className="relative flex size-3">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
									<span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
								</span>
								Sprzedaz otwarta
							</div>
							<div className="badge flex items-center gap-1 bg-white/10 w-fit text-sm text-white px-3  py-1 rounded-full backdrop-blur-[2px]">
								{event.category.name}
							</div>
						</div>
						<Typography
							variant="h1"
							className="text-start line-clamp-2"
						>
							{event.title}
						</Typography>
						<div className="items flex gap-5 opacity-70 flex-wrap gap-y-2 mt-3">
							<div className="item flex items-center gap-1 text-sm">
								<IconCalendarEvent className="size-4" />
								{DateTimeFormatter.weekday(
									event.startsAt,
									"pl",
								)}
								{", "}
								{DateTimeFormatter.date(
									event.startsAt,
									"pl",
								)}{" "}
								{DateTimeFormatter.year(event.startsAt, "pl")}
								{" - "}
								{DateTimeFormatter.time(event.startsAt, "pl")}
							</div>
							<div className="item flex items-center gap-1 text-sm">
								<IconMapPin className="size-4" />
								{event.location}
								{", "}
								{event.street} {event.streetNumber}
							</div>
							<div className="item flex items-center gap-1 text-sm">
								<IconMapPin className="size-4" />
								{event.location}
								{", "}
								{event.street} {event.streetNumber}
							</div>
							<div className="item flex items-center gap-1 text-sm">
								<IconMapPin className="size-4" />
								{event.location}
								{", "}
								{event.street} {event.streetNumber}
							</div>
						</div>
					</div>
					<div className="event-actions flex gap-2">
						<Button variant="transparent" size="sm" asChild>
							<Link href={EVENT_ORDERS_ROUTE(id)}>
								<IconReceipt className="size-4" />
								Zamowienia
							</Link>
						</Button>
						<Button variant="transparent" size="sm" asChild>
							<Link href={EVENT_EDIT_ROUTE(id)}>
								<IconShare2 className="size-4" />
								Udostepnij
							</Link>
						</Button>
						<Button variant="transparent" size="sm" asChild>
							<Link href={EVENT_EDIT_ROUTE(id)}>
								<IconEdit className="size-4" />
								Edytuj
							</Link>
						</Button>
					</div>
				</header>
			</HeaderWrapper>
		</div>
	);
};

export default OrganizerEventPage;
