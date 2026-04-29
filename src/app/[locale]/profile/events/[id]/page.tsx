import { Button } from "@/components/ui/button";
import { EVENT_EDIT_ROUTE } from "@/config/routes";
import { getEventAction } from "@/features/events/actions/get-event.action";
import { DateTimeFormatter } from "@/helpers/date";
import { Link } from "@/i18n/routing";
import { Typography } from "@/shared/components";
import { BackButton } from "@/shared/components/back-button";
import {
	IconCalendarEvent,
	IconEdit,
	IconMapPin,
	IconShare,
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

	console.log(event);

	if (!event) {
		return notFound();
	}

	return (
		<div className="event-page">
			<div className="header-wrapper overflow-hidden relative px-6 pb-5 pt-25 bg-black text-white rounded-2xl">
				<div
					className="opacity-5"
					style={{
						position: "absolute",
						top: -1,
						right: 0,
						bottom: 0,
						left: -1,
						zIndex: 0,
						backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
						backgroundSize: "80px 80px",
					}}
				></div>
				<div className="absolute opacity-80 -top-2/3 left-0 bg-primary w-1/2 h-full blur-[180px] rounded-full"></div>
				<div className="absolute opacity-50 -bottom-2/3 right-20 bg-purple-400 w-1/3 h-full blur-[150px] rounded-full"></div>
				<BackButton
					variant="transparent"
					className="absolute top-6 left-6"
				/>
				<header className="relative z-10 flex justify-between items-end">
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
			</div>
		</div>
	);
};

export default OrganizerEventPage;
