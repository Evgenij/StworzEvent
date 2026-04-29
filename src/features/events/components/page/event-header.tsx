import { Badge } from "@/components/ui/badge";
import { Typography } from "@/shared/components";
import { EventCategory } from "@prisma/client";
import React from "react";
import EventMetaSection from "./event-meta";

type EventHeaderSectionProps = {
	title: string;
	categories: EventCategory[];
	locale: string;
	dates: { startsAt: Date; endsAt: Date | null };
	location: string | null;
	address: string | null;
};

const EventHeaderSection = ({
	title,
	categories,
	locale,
	dates,
	location,
	address,
}: EventHeaderSectionProps) => {
	return (
		<header className="flex flex-col items-start justify-center gap-3">
			{categories.map((item, index) => (
				<React.Fragment key={item.slug}>
					<Badge key={item.slug}>{item.name}</Badge>
					{index < categories.length - 1 && " / "}
				</React.Fragment>
			))}
			<Typography
				variant="h1"
				className="text-left mb-2 lg:mb-6 line-clamp-2"
			>
				{title}
			</Typography>
			<EventMetaSection
				startsAt={dates.startsAt}
				endsAt={dates.endsAt}
				location={location}
				address={address}
				locale={locale}
			/>
		</header>
	);
};

export default EventHeaderSection;
