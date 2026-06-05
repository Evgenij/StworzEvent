import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Event } from "@prisma/client";

type EventsTableRowType = {
	data: Event;
	className?: string;
};

const EventsTableRow = ({ className, data }: EventsTableRowType) => {
	return (
		<TableRow className={cn("events-table-row", className)}>
			<TableCell className="font-medium">{data.title}</TableCell>
			<TableCell>Paid</TableCell>
			<TableCell>Credit Card</TableCell>
			<TableCell className="text-right">$250.00</TableCell>
		</TableRow>
	);
};

export default EventsTableRow;
