"use client";

import { Button } from "@/components/shadcn/ui/button";
import { Separator } from "@/components/shadcn/ui/separator";
import { Typography } from "@/components/shared";
import { Link } from "@/i18n/routing";
import { Event, Organization, Prisma, Ticket } from "@prisma/client";
import { IconBasket, IconExternalLink, IconTicket } from "@tabler/icons-react";
import React, { useState } from "react";
import EventMetaItem from "../event-meta-item";
import { DateFormatter } from "@/helpers/date-formatter";
import { EventDateRange } from "../event-date-range";
import { TicketsDrawer } from "../../tickets/tickets-drawer";
import { TicketWithAvailability } from "@/types/ticket";

type EventSidebarProps = {
	organization: Prisma.OrganizationGetPayload<{
		include: {
			_count: {
				select: { events: true };
			};
		};
	}>;
};

const EventSidebar = ({
	event,
	organization,
	tickets,
	locale,
	dates,
	location,
	address,
}: EventSidebarProps & {
	event: Event;
	tickets: TicketWithAvailability[];
	locale: string;
	dates: { startsAt: Date; endsAt: Date | null };
	location: string | null;
	address: string | null;
}) => {
	const [drawerOpen, setDrawerOpen] = useState(false);

	let price = 0;
	if (tickets.length) {
		const cheapestTicket = tickets.reduce(
			(min, ticket) => (ticket.price < min.price ? ticket : min),
			tickets[0],
		);
		price = cheapestTicket.price / 100;
	}

	return (
		<aside className="sticky top-20 rounded-xl overflow-hidden border border-sidebar">
			<header className="bg-sidebar flex items-start justify-between px-4 py-3 text-foreground ">
				<div className="company-info flex items-center gap-3">
					<img
						src={
							organization.logo ||
							"/logos/company_logo_default.svg"
						}
						alt={organization.name}
						className="size-12 rounded-full"
					/>
					<div className="company-data flex flex-col">
						<Typography variant="h4" className="text-base!">
							{organization.name}
						</Typography>
						{/* TODO add link to company page */}
						{organization._count?.events && (
							<span className="text-muted-foreground text-sm">
								{organization._count?.events} wydarzeń
							</span>
						)}
					</div>
				</div>
				<Link
					href={organization.website || ""}
					target="_blank"
					rel="noopener noreferrer"
				>
					<IconExternalLink size={20} />
				</Link>
			</header>
			<main className="flex flex-col gap-4 p-4">
				<EventDateRange
					startsAt={dates.startsAt}
					endsAt={dates.endsAt}
					locale={locale}
				/>
				{/* <EventMetaItem
					label={{
						title: DateFormatter.month(dates.startsAt, locale),
						value: DateFormatter.day(dates.startsAt).toString(),
					}}
					header={
						DateFormatter.weekday(dates.startsAt, locale) +
						", " +
						DateFormatter.date(dates.startsAt, locale)
					}
					subheader={
						DateFormatter.time(dates.startsAt, locale) +
						(dates.endsAt
							? " - " + DateFormatter.time(dates.endsAt, locale)
							: "")
					}
				/> */}
				<Separator />
				<EventMetaItem
					label={{
						title: location ? "miasto" : "rodzaj",
						value: location ? location : "online",
					}}
					header={location ? location : "Online wydarzenie"}
					subheader={address ? address : "link dostępny po zapisaniu"}
				/>
				<Separator />
				<div className="price flex flex-col gap-1">
					<Typography variant="p" className="font-medium">
						Bilety juz od:
					</Typography>
					<div className="price-wrapper flex items-center gap-2">
						<Typography variant="h2" className="text-primary">
							{price} zl
						</Typography>
						<Typography
							variant="h4"
							className="text-muted-foreground opacity-50"
						>
							/os
						</Typography>
					</div>
				</div>
				<Button
					size={"lg"}
					className="w-full"
					onClick={() => setDrawerOpen(true)}
				>
					<IconBasket className="size-5" />
					Buy Ticket
				</Button>
			</main>

			<TicketsDrawer
				locale={locale}
				eventSlug={event.slug}
				eventId={event.id}
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				tickets={tickets}
				eventTitle={event.title}
				eventDate={dates.startsAt}
				eventLocation={{
					city: location,
					address: address,
				}}
			/>
		</aside>
	);
};

export default EventSidebar;
