import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import EventsTableRow from "./events-table-row";
import { Event } from "@prisma/client";
import { IconLoader } from "@tabler/icons-react";

const EventsTable = ({
	className,
	events,
	isLoading,
}: {
	className?: string;
	events: Event[] | null;
	isLoading?: boolean;
}) => {
	return (
		<div className={cn("events-table", className)}>
			<Table>
				{/* <TableCaption>A list of your recent invoices.</TableCaption> */}

				<TableHeader className="bg-muted rounded-tr-xl">
					<TableRow>
						<TableHead>Wydarzenie</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Method</TableHead>
						<TableHead className="text-right">Amount</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{isLoading ? (
						<TableRow className={cn("events-table-row", className)}>
							<TableCell
								className="text-muted-foreground text-center"
								colSpan={4}
							>
								<div className="flex gap-1 items-center justify-center py-2">
									<IconLoader className="animate-spin" />
									Ladowanie
								</div>
							</TableCell>
						</TableRow>
					) : (
						events &&
						events.map((event: Event) => (
							<EventsTableRow key={event.id} data={event} />
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default EventsTable;
