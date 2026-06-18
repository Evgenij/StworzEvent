"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/shared/components";
import { Link } from "@/i18n/routing";
import { Event, Prisma } from "@prisma/client";
import {
	IconBasket,
	IconClipboardCheck,
	IconExternalLink,
} from "@tabler/icons-react";
import EventMetaItem from "../event-meta-item";
import { EventDateRange } from "../event-date-range";
import { TicketsDrawer } from "../../tickets/tickets-drawer";
import { useMobileMenuStore } from "@/stores/mobile-menu.store";
import { TicketWithAvailability } from "@/features/events/types/ticket";

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
	const { ticketDrawerOpen, openTicketDrawer, closeTicketDrawer } =
		useMobileMenuStore();

	let price = 0;
	if (tickets.length) {
		const cheapestTicket = tickets.reduce(
			(min, ticket) => (ticket.price < min.price ? ticket : min),
			tickets[0],
		);
		price = cheapestTicket.price / 100;
	}

	return (
		<aside className="hidden sm:block sm:fixed bottom-0 left-0 h-fit lg:sticky lg:shadow-2xl shadow-black/10 bg-white lg:top-22 w-full rounded-2xl rounded-bl-none rounded-br-none lg:rounded-xl overflow-hidden lg:border border-border border-t shadow-[0_-10px_16px_-5px_rgb(0,0,0,0.05)]">
			<header className="hidden bg-sidebar border-b border-border lg:flex items-start justify-between px-4 py-3 text-foreground">
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
			<main className="flex flex-row items-start justify-between lg:justify-start lg:flex-col gap-4 px-5 lg:px-4 p-4">
				<div className="flex flex-col gap-3 h-full w-full justify-between lg:contents">
					<Typography variant="h4" className="lg:hidden line-clamp-2">
						{event.title}
					</Typography>
					<div className="flex gap-6 lg:contents">
						<EventDateRange
							startsAt={dates.startsAt}
							endsAt={dates.endsAt}
							locale={locale}
						/>
						<Separator className="hidden lg:block" />
						<EventMetaItem
							label={{
								title: location ? "miasto" : "rodzaj",
								value: location ? location : "online",
							}}
							header={location ? location : "Online wydarzenie"}
							subheader={
								address ? address : "link dostępny po zapisaniu"
							}
						/>
					</div>
					<Separator className="hidden lg:block" />
				</div>
				<Separator orientation="vertical" className="lg:hidden" />
				<div className="flex flex-col justify-end lg:justify-start gap-2 lg:w-full">
					<div className="price flex flex-col">
						<Typography
							variant="p"
							className="font-medium text-right lg:text-left"
						>
							{price > 0 ? "Bilety juz od:" : "Wejscie"}
						</Typography>
						<div className="price-wrapper flex justify-end lg:justify-start items-baseline gap-2">
							{price > 0 ? (
								<>
									<Typography
										variant="h2"
										className="text-primary"
									>
										{price} zl
									</Typography>
									<Typography
										variant="h4"
										className="text-muted-foreground opacity-50"
									>
										/os
									</Typography>
								</>
							) : (
								<Typography
									variant="h2"
									className="text-primary"
								>
									Bezplatne
								</Typography>
							)}
						</div>
					</div>
					<Button
						size={"lg"}
						className="w-fit lg:w-full"
						onClick={openTicketDrawer}
					>
						{price > 0 ? (
							<>
								<IconBasket className="size-5" /> Kup
								bilety{" "}
							</>
						) : (
							<>
								<IconClipboardCheck className="size-5" />
								Zapisz się
							</>
						)}
					</Button>
				</div>
			</main>

			<TicketsDrawer
				locale={locale}
				eventSlug={event.slug}
				eventId={event.id}
				open={ticketDrawerOpen}
				onClose={closeTicketDrawer}
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
