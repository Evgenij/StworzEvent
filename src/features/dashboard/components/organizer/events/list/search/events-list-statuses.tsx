import { cn } from "@/lib/utils";
import EventsListStatus from "./events-list-status";
import { EventStatus } from "@prisma/client";

const statuses: EventStatus[] = Object.values(EventStatus);

const EventsListStatuses = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				"events-list-statuses flex gap-2 flex-wrap",
				className,
			)}
		>
			{statuses.map((status) => (
				<EventsListStatus key={status} status={status} />
			))}
		</div>
	);
};

export default EventsListStatuses;
