import {
	EventDescriptionSection,
	EventHeaderSection,
	EventHeroSection,
} from "@/components/events/page";
import EventFAQSection from "@/components/events/page/event-faq";
import EventSectionsSection from "@/components/events/page/event-sections";
import { EventMapSection } from "@/components/events/page/map/event-map-wrapper";
import Breadcrumb, {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/shadcn/ui/breadcrumb";
import { Separator } from "@/components/shadcn/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcn/ui/tooltip";
import { Typography } from "@/components/shared";
import { MAIN_PAGE_EVENTS_ROUTE } from "@/helpers/routes";
import prisma from "@/lib/prisma";
import { truncate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

const EventPage = async ({
	params,
}: {
	params: Promise<{ id: string; locale: string }>;
}) => {
	const { id, locale } = await params;

	const event = await prisma.event.findUnique({
		where: { id },
		include: {
			categories: {
				include: {
					category: true, // достаём саму категорию из join-таблицы
				},
			},
			organization: true,
			tickets: true,
			eventSections: {
				orderBy: { order: "asc" },
			},
			eventFaqs: {
				orderBy: { order: "asc" },
			},
		},
	});

	if (!event) {
		notFound();
	} else {
		console.log(event);
	}

	const categories = event?.categories?.map((item) => item.category) || [];

	return (
		<div className="max-w-6xl mx-auto flex flex-col gap-5">
			<div className="w-full px-5">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									href={MAIN_PAGE_EVENTS_ROUTE}
									locale={locale}
								>
									Katalog
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									href={MAIN_PAGE_EVENTS_ROUTE}
									locale={locale}
								>
									{categories
										.filter(
											(item) => item.parentId === null,
										)
										.map((item) => item.name)
										.join(" / ")}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
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
			</div>
			<EventHeroSection image={event.coverImage ?? "/placeholder.jpg"} />
			<div className="flex w-full gap-6 px-5">
				<div className="main-content flex-1 min-w-0 ">
					<div className="event-data flex flex-col gap-6">
						<EventHeaderSection
							title={event.title}
							categories={categories}
							locale={locale}
						/>
						<EventDescriptionSection
							description={event.description}
						/>

						<EventSectionsSection sections={event.eventSections} />
						{event.eventFaqs.length > 0 && (
							<EventFAQSection faqs={event.eventFaqs} />
						)}
						<EventMapSection
							location={event.location}
							address={event.address}
							lat={event.lat ?? 50.0647}
							lng={event.lng ?? 19.945}
						/>
					</div>

					{/* <pre>{JSON.stringify(event, null, 2)}</pre> */}
				</div>
				<Separator orientation="vertical" />
				<div className="tickets-section min-h-full w-xs shrink-0">
					<div className="sticky top-20">
						<Typography
							variant="h2"
							className="text-2xl font-bold text-gray-900"
						>
							Tickets
						</Typography>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventPage;
