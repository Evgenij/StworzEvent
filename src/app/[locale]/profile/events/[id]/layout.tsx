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
import { EventProvider } from "@/features/events/context/event-context";

const OrganizerEventPage = async ({
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
		<EventProvider event={event}>
			<section className="event-data-page flex flex-col gap-4">
				<HeaderWrapper>
					<div className="flex justify-between">
						<BackButton variant="transparent" />
						<div className="event-actions flex gap-2 lg:hidden">
							<Button variant="transparent" size="sm" asChild>
								<Link href={EVENT_ORDERS_ROUTE(id)}>
									<IconReceipt className="size-4" />
									<span className="hidden lg:block">
										Zamowienia
									</span>
								</Link>
							</Button>
							<Button variant="transparent" size="sm" asChild>
								<Link href={EVENT_EDIT_ROUTE(id)}>
									<IconShare2 className="size-4" />
									<span className="hidden lg:block">
										Udostepnij
									</span>
								</Link>
							</Button>
							<Button variant="transparent" size="sm" asChild>
								<Link href={EVENT_EDIT_ROUTE(id)}>
									<IconEdit className="size-4" />
									<span className="hidden lg:block">
										Edytuj
									</span>
								</Link>
							</Button>
						</div>
					</div>

					<header className="z-10 flex gap-4 justify-between items-end mt-16">
						<div className="title-event flex flex-col gap-2">
							<div className="badges flex gap-1 items-center">
								{/* <div className="badge flex items-center gap-1 bg-green-500/20 w-fit text-sm text-green-300 px-3 pl-2 py-1 rounded-full backdrop-blur-[2px]">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                </span>
                Sprzedaz otwarta
              </div> */}
								<EventStatusBadge status={event.status} />
								<EventCategoryBadge>
									{event.category.name}
								</EventCategoryBadge>
								{/* <div className="badge flex items-center gap-1 bg-white/10 w-fit text-sm text-white px-3  py-1 rounded-full backdrop-blur-[2px]">
                {event.category.name}
              </div> */}
							</div>
							<Typography
								variant="h2"
								className="text-start line-clamp-2"
							>
								{event.title}
							</Typography>
							<div className="items flex gap-5 opacity-70 flex-wrap gap-y-2 mt-2">
								<div className="item flex items-center gap-1 text-sm">
									<IconCalendarEvent className="size-4" />
									<span className="capitalize">
										{DateTimeFormatter.weekday(
											event.startsAt,
											"pl",
										)}
									</span>
									{", "}
									{DateTimeFormatter.date(
										event.startsAt,
										"pl",
									)}{" "}
									{DateTimeFormatter.year(
										event.startsAt,
										"pl",
									)}
									{" - "}
									{DateTimeFormatter.time(
										event.startsAt,
										"pl",
									)}
								</div>
								<div className="item flex items-center gap-1 text-sm">
									<IconMapPin className="size-4" />
									{event.location}
									{", "}
									{event.street} {event.streetNumber}
								</div>
								{/* <div className="item flex items-center gap-1 text-sm">
                <IconUsers className="size-4" />
                12/34 biletow
              </div> */}
								<div className="item flex items-center gap-1 text-sm">
									<IconTicket className="size-4" />
									{event.minPrice
										? `od ${formatCurrencyPLN(event.minPrice)}`
										: "Bezpłatny"}
								</div>
							</div>
						</div>
						<div className="event-actions hidden lg:flex  xl:flex-row flex-col items-end gap-2">
							<Button variant="transparent" size="sm" asChild>
								<Link href={EVENT_ORDERS_ROUTE(id)}>
									<IconReceipt className="size-4" />
									<span className="hidden lg:block">
										Zamowienia
									</span>
								</Link>
							</Button>
							<Button variant="transparent" size="sm" asChild>
								<Link href={EVENT_EDIT_ROUTE(id)}>
									<IconShare2 className="size-4" />
									<span className="hidden lg:block">
										Udostepnij
									</span>
								</Link>
							</Button>
							<Button variant="transparent" size="sm" asChild>
								<Link href={EVENT_EDIT_ROUTE(id)}>
									<IconEdit className="size-4" />
									<span className="hidden lg:block">
										Edytuj
									</span>
								</Link>
							</Button>
						</div>
					</header>
				</HeaderWrapper>
				<EventDataTabs eventId={id} />
				{children}
			</section>
		</EventProvider>
	);
};

export default OrganizerEventPage;
