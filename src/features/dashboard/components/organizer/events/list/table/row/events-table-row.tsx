import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EventWithCategories } from "@/types/event";
import EventDateLabel from "./event-date-label";
import TicketSalesStats from "./event-sales-stats";
import EventActions from "./event-actions";
import EventName from "./event-name";
import { EventStatusBadge } from "@/shared/components";

type EventsTableRowType = {
	data: EventWithCategories;
	className?: string;
};

const EventsTableRow = ({ className, data }: EventsTableRowType) => {
	return (
		<TableRow className={cn("events-table-row group", className)}>
			{/* nazwa */}
			<TableCell className="max-w-[500px] overflow-hidden group">
				<EventName
					data={{
						id: data.id || "",
						coverImage: data.coverImage || "",
						title: data.title || "",
						location: data.location || "",
						street: data.street || "",
						streetNumber: data.streetNumber || "",
						categories: data.categories.map((c) => ({
							category: {
								name: c.category.name || "",
							},
						})),
					}}
				/>
			</TableCell>

			{/* status */}
			<TableCell>
				<EventStatusBadge status={data.status} />
			</TableCell>

			{/* termin */}
			<TableCell>
				<EventDateLabel date={data.startsAt} />
			</TableCell>

			{/* sprzedaz */}
			<TableCell>
				<TicketSalesStats tickets={data.tickets} />
			</TableCell>

			{/* akcje */}
			<TableCell className="text-right">
				<EventActions
					status={data.status}
					slug={data.slug}
					eventId={data.id}
				/>
			</TableCell>
		</TableRow>
	);
};

export default EventsTableRow;
