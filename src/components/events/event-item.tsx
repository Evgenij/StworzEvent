"use client";

import { Link } from "@/i18n/routing";
import { Event } from "@prisma/client";
import { EventImagePlaceholder } from "../shared/event-image-placeholder";
import { Typography } from "../shared";
import { DateFormatter } from "@/helpers/date-formatter";
import { IconMapPin } from "@tabler/icons-react";
import { EVENT_PAGE_ROUTE } from "@/consts/routes";
import { cn, formatPlnFromGrosze } from "@/lib/utils";
import { Badge } from "../shadcn/ui/badge";
import { CategoryOption } from "@/actions/events/get-categories.action";

export type EventItemData = Pick<
	Event,
	"coverImage" | "title" | "startsAt" | "location" | "address"
> & {
	slug?: string; // опционально — нужен только для ссылки
};

const EventItem = ({
	event,
	minPrice,
	category,
	isPreview = false,
}: {
	event: EventItemData;
	minPrice: number | null;
	category?: CategoryOption | null;
	isPreview?: boolean;
}) => {
	// console.log("EventItem", event);

	const content = (
		<div
			className={cn(
				"flex h-full rounded-2xl flex-col items-start justify-center gap-3 border border-transparent hover:border-border hover:shadow-2xl/5 p-2",
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
								{DateFormatter.weekday(event.startsAt, "pl")}
								{", "}
								{DateFormatter.date(event.startsAt, "pl")}
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
							{event.address ? `, ${event.address}` : ""}
						</p>
					) : (
						<p className="text-sm w-full text-muted-foreground">
							Localizacja nie została podana
						</p>
					)}
				</main>
				<footer className="pt-2 mt-auto flex items-baseline gap-1 border-t border-border w-full">
					{minPrice ? (
						<>
							<span className="text-muted-foreground">od</span>
							<p className="font-bold text-primary text-lg">
								{formatPlnFromGrosze(minPrice)}
							</p>
						</>
					) : isPreview ? (
						<p className="font-regular text-muted-foreground text-sm">
							bilety nie ustawione
						</p>
					) : (
						<p className="font-bold text-primary text-lg">
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
			href={`${EVENT_PAGE_ROUTE}${event.slug}`}
			className="no-underline block group"
		>
			{content}
		</Link>
	);
};

export default EventItem;
