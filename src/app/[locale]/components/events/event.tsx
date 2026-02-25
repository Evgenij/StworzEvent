import { formatDate } from "@/helpers/format-date";
import { Badge } from "@/shadcn/ui/badge";
import { Event } from "@prisma/client";
import React from "react";
import StatusBadge from "./status-badge";

const EventItem = ({ event }: { event: Event }) => {
	return (
		<div className="border rounded-2xl px-4 p-3 flex flex-col justify-between gap-3">
			<header className="flex justify-between items-center">
				<div className="text-md font-semibold">{event.title}</div>
				<div className="text-sm text-gray-500">
					<StatusBadge status={event.status} />
				</div>
			</header>

			<main className="text-sm text-gray-500">dghdf</main>
			<footer className="text-sm text-gray-500">
				{formatDate(event.startsAt)}
			</footer>
		</div>
	);
};

export default EventItem;
