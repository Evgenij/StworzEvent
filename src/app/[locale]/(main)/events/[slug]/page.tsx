import { getAvailableQuantity } from "@/actions/tickets/get-available-quantity.action";
import {
	EventDescriptionSection,
	EventHeaderSection,
	EventHeroSection,
} from "@/components/events/page";
import EventAgendaSection from "@/components/events/page/agenda/event-agenda";
import EventFAQSection from "@/components/events/page/event-faq";
import EventSectionsSection from "@/components/events/page/event-sections";
import { EventMapSection } from "@/components/events/page/map/event-map-wrapper";
import { EventSidebar } from "@/components/events/page/sidebar";
import Breadcrumb, {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/shadcn/ui/breadcrumb";
import { Button } from "@/components/shadcn/ui/button";
import { Separator } from "@/components/shadcn/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcn/ui/tooltip";
import { EventImagePlaceholder } from "@/components/shared/event-image-placeholder";
import { ShareButton } from "@/components/shared/share-button";
import { MAIN_PAGE_EVENTS_ROUTE } from "@/consts/routes";
import { Link } from "@/i18n/routing";
import prisma from "@/lib/prisma";
import { truncate } from "@/lib/utils";
import { TicketWithAvailability } from "@/types/ticket";
import { IconBookmark } from "@tabler/icons-react";
import { notFound } from "next/navigation";

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

	const fullAddress = [event.street, event.streetNumber]
		.filter(Boolean)
		.join(" ") || null;

	let ticketsWithAvailability: TicketWithAvailability[] = [];
	if (event.tickets?.length) {
		ticketsWithAvailability = await Promise.all(
			event.tickets.map(async (ticket) => ({
				...ticket,
				available: await getAvailableQuantity(ticket.id),
			})),
		);
	} else {
		ticketsWithAvailability = [];
	}

	return (
		<div className="max-w-6xl mx-auto flex flex-col gap-5">
			<div className="w-full flex justify-between items-center px-5">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href={MAIN_PAGE_EVENTS_ROUTE}>
									Katalog
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{categories.length > 0 && (
							<>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
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
						<BreadcrumbSeparator />
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
			{event.coverImage ? (
				<EventHeroSection
					image={event.coverImage ?? "/placeholder.jpg"}
				/>
			) : (
				<EventImagePlaceholder />
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
							address={fullAddress}
							lat={event.lat ?? 50.0647}
							lng={event.lng ?? 19.945}
						/>
					</div>
				</div>
				<Separator orientation="vertical" />
				<div className="tickets-section min-h-full w-xs shrink-0">
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
