import {
	EventDescriptionSection,
	EventHeaderSection,
	EventHeroSection,
} from "@/features/events/components/page";
import EventAgendaSection from "@/features/events/components/page/agenda/event-agenda";
import EventFAQSection from "@/features/events/components/page/event-faq";
import EventSectionsSection from "@/features/events/components/page/event-sections";
import { EventMapSection } from "@/features/events/components/page/map/event-map-wrapper";
import { EventSidebar } from "@/features/events/components/page/sidebar";
import Breadcrumb, {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { MAIN_PAGE_EVENTS_ROUTE } from "@/config/routes";
import { Link } from "@/i18n/routing";
import prisma from "@/lib/prisma";
import { truncate } from "@/lib/utils";
import { IconBookmark } from "@tabler/icons-react";
import { notFound } from "next/navigation";
import { getBatchAvailability } from "@/features/tickets/actions/get-batch-availability.action";
import { TicketWithAvailability } from "@/features/events/types/ticket";
import { ShareButton } from "@/shared/components/share-button";

const EventPage = async ({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}) => {
	const { slug, locale } = await params;

	const event = await prisma.event.findUnique({
		where: { slug },
		include: {
			categories: {
				include: {
					category: true, // достаём саму категорию из join-таблицы
				},
			},
			organization: {
				include: {
					_count: {
						select: { events: true },
					},
				},
			},
			tickets: true,
			eventSections: {
				orderBy: { order: "asc" },
			},
			eventFaqs: {
				orderBy: { order: "asc" },
			},
			eventAgendaItems: {
				orderBy: { startsAt: "asc" },
			},
		},
	});

	if (!event) {
		notFound();
	} else {
		// console.log(event);
	}

	const categories = event?.categories?.map((item) => item.category) || [];

	const fullAddress =
		[event.street, event.streetNumber].filter(Boolean).join(" ") || null;

	let ticketsWithAvailability: TicketWithAvailability[] = [];
	if (event.tickets?.length) {
		const availability = await getBatchAvailability(event.tickets);
		ticketsWithAvailability = event.tickets.map((ticket) => ({
			...ticket,
			available: availability.get(ticket.id) ?? null,
		}));
	}

	return (
		<div className="event-page w-6xl mx-auto flex flex-col gap-5">
			<div className="w-full flex justify-between items-center px-5">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden sm:block">
							<BreadcrumbLink asChild>
								<Link href={MAIN_PAGE_EVENTS_ROUTE}>
									Katalog
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{categories.length > 0 && (
							<>
								<BreadcrumbSeparator className="hidden sm:block" />
								<BreadcrumbItem className="hidden sm:block">
									<BreadcrumbLink asChild>
										<Link href={MAIN_PAGE_EVENTS_ROUTE}>
											{categories
												.filter(
													(item) =>
														item.parentId === null,
												)
												.map((item) => item.name)
												.join(" / ")}
										</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
							</>
						)}
						<BreadcrumbSeparator className="hidden sm:block" />

						<BreadcrumbItem>
							<Tooltip>
								<TooltipTrigger asChild>
									<BreadcrumbPage>
										{truncate(event.title, 10)}
									</BreadcrumbPage>
								</TooltipTrigger>
								<TooltipContent>
									<p>{event.title}</p>
								</TooltipContent>
							</Tooltip>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<div className="buttons flex gap-2">
					<Button variant={"outline"} size={"sm"} disabled>
						<IconBookmark className="size-4" /> Zapisz
					</Button>
					<ShareButton title={event.title} />
				</div>
			</div>

			{event.coverImage && (
				<EventHeroSection
					image={event.coverImage ?? "/placeholder.jpg"}
				/>
			)}

			<div className="flex w-full gap-6 px-5">
				<div className="main-content flex-1 min-w-0 ">
					<div className="event-data flex flex-col gap-8">
						<EventHeaderSection
							title={event.title}
							categories={categories}
							locale={locale}
							dates={{
								startsAt: event.startsAt,
								endsAt: event.endsAt,
							}}
							location={event.location}
							address={fullAddress}
						/>
						{event.description &&
							Object.keys(event.description as object).length >
								0 && (
								<EventDescriptionSection
									description={event.description}
								/>
							)}
						{event.eventAgendaItems.length > 0 && (
							<EventAgendaSection
								items={event.eventAgendaItems}
								locale={locale}
							/>
						)}

						<EventSectionsSection sections={event.eventSections} />
						{event.eventFaqs.length > 0 && (
							<EventFAQSection faqs={event.eventFaqs} />
						)}
						<EventMapSection
							location={event.location}
							street={event.street}
							streetNumber={event.streetNumber}
							lat={event.lat ?? 50.0647}
							lng={event.lng ?? 19.945}
						/>
					</div>
				</div>
				<Separator orientation="vertical" className="hidden lg:block" />
				<div className="tickets-section contents lg:block min-h-full w-fit lg:w-xs shrink-0">
					<EventSidebar
						event={event}
						tickets={ticketsWithAvailability}
						organization={event.organization}
						locale={locale}
						dates={{
							startsAt: event.startsAt,
							endsAt: event.endsAt,
						}}
						location={event.location}
						address={fullAddress}
					/>
				</div>
			</div>
		</div>
	);
};

export default EventPage;
