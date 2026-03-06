import { Badge } from "@/components/shadcn/ui/badge";
import { Typography } from "@/components/shared";
import { EventCategory } from "@prisma/client";
import React from "react";
import EventMetaSection from "./event-meta";

type EventHeaderSectionProps = {
	title: string;
	categories: EventCategory[];
	locale: string;
};

const EventHeaderSection = ({
	title,
	categories,
	locale,
}: EventHeaderSectionProps) => {
	return (
		<header className="flex flex-col items-start justify-center gap-3">
			{categories.map((item, index) => (
				<React.Fragment key={item.slug}>
					<Badge key={item.slug}>{item.name}</Badge>
					{index < categories.length - 1 && " / "}
				</React.Fragment>
			))}
			<Typography variant="h1" className="text-left mb-6">
				{title}
			</Typography>
			<EventMetaSection
				startsAt={new Date()}
				endsAt={new Date()}
				location="Warsaw"
				address="ul. Floriańska 5"
				locale="pl-PL"
			/>
		</header>
	);
};

export default EventHeaderSection;
