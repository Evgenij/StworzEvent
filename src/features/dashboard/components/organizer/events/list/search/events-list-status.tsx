import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EventStatus } from "@prisma/client";

const EventsListStatus = ({
	status,
	className,
}: {
	status: EventStatus;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				"events-list-status flex items-center font-medium gap-1.5 text-xs p-1 border border-border rounded-full pl-3",
				className,
			)}
		>
			{status}
		</div>
	);
};

export default EventsListStatus;
