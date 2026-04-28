"use client";

import { Link } from "@/i18n/routing";
import { Event } from "@prisma/client";
import { EventImagePlaceholder } from "../shared/event-image-placeholder";
import { Typography } from "../shared";
import { DateTimeFormatter } from "@/helpers/date-formatter";
import { IconMapPin } from "@tabler/icons-react";
import { cn, formatCurrencyPln } from "@/lib/utils";
import { Badge } from "../shadcn/ui/badge";
import { CategoryOption } from "@/actions/events/get-categories.action";
import { MAIN_PAGE_EVENT_ROUTE } from "@/consts/routes";

export type EventItemData = Pick<
	Event,
	"coverImage" | "title" | "startsAt" | "location" | "street" | "streetNumber"
> & {
	slug?: string; // опционально — нужен только для ссылки
};

const EventItem = ({
	event,
	minPrice,
	category,
	isPreview = false,
	href,
}: {
	event: EventItemData;
	minPrice: number | null;
	category?: CategoryOption | null;
	isPreview?: boolean;
	href?: string;
}) => {
	// console.log("EventItem", event);

	const content = (
		<div
			className={cn(
				"event-item-content flex h-full rounded-2xl flex-col items-start justify-center gap-3 border border-transparent hover:border-border hover:shadow-2xl/5 p-2",
				{
					"border-border shadow-2xl/5": isPreview,
				},
			)}
		>
			<div className="relative w-full">
				{event.coverImage ? (
					<img
						src={event.coverImage}
						alt={event.title}
						className="w-full object-cover rounded-lg aspect-video"
					/>
				) : (
					<EventImagePlaceholder />
				)}
				{category && (
					<Badge
						variant={"secondary"}
						className="absolute bottom-2 left-2"
					>
						{category.name}
					</Badge>
				)}
			</div>

			<div className="flex flex-col flex-1 px-2 gap-3 w-full">
				<header className="flex flex-col gap-1">
					<Typography
						variant="h4"
						className="text-base w-full line-clamp-2 group-hover:underline"
					>
						{event.title}
					</Typography>

					<p className="text-sm w-full text-muted-foreground">
						{event.startsAt ? (
							<span className="capitalize">
								{DateTimeFormatter.weekday(
									event.startsAt,
									"pl",
								)}
								{", "}
								{DateTimeFormatter.date(event.startsAt, "pl")}
							</span>
						) : (
							"Data nie została podana"
						)}
					</p>
				</header>

				<main className="flex items-start gap-1">
					<IconMapPin className="size-5" />
					{event.location ? (
						<p className="text-sm w-full">
							{event.location}
							{event.street
								? `, ${[event.street, event.streetNumber].filter(Boolean).join(" ")}`
								: ""}
						</p>
					) : (
						<p className="text-sm w-full text-muted-foreground">
							Localizacja nie została podana
						</p>
					)}
				</main>
				<footer className="pt-2 mt-auto flex items-baseline gap-1 border-t border-border w-full">
					{minPrice !== null && minPrice > 0 ? (
						<>
							<span className="text-muted-foreground text-sm">
								od
							</span>
							<p className="font-semibold text-primary text-base">
								{formatCurrencyPln(minPrice)}
							</p>
						</>
					) : minPrice === 0 ? (
						<p className="font-semibold text-primary text-base">
							Bezpłatne
						</p>
					) : isPreview ? (
						<p className="font-regular text-muted-foreground text-sm">
							bilety nie ustawione
						</p>
					) : (
						<p className="font-semibold text-primary text-base">
							Bezpłatne
						</p>
					)}
				</footer>
			</div>
		</div>
	);

	if (isPreview || !event.slug) {
		return content;
	}

	return (
		<Link
			href={href ?? `${MAIN_PAGE_EVENT_ROUTE(event.slug)}`}
			className="event-item no-underline block group h-full"
		>
			{content}
		</Link>
	);
};

export default EventItem;
