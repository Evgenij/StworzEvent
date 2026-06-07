import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import EventsTable from "./table/events-table";
import { useEventsListContext } from "./context/event-list-context";

const EventsListTable = ({ className }: { className?: string }) => {
	const { events, isLoading } = useEventsListContext();

	console.log(events);

	return (
		<div
			className={cn(
				"events-list-table border border-border rounded-2xl bg-background",
				className,
			)}
		>
			<div className="table-actions flex justify-between items-center p-3 px-4">
				<p className="text-muted-foreground text-xs">
					Znaleziono{" "}
					<span className="font-semibold text-black">
						{events.length} wydarzeń
					</span>
				</p>
			</div>
			<div className="table-container">
				<EventsTable events={events} isLoading={isLoading} />
			</div>
		</div>
	);
};

export default EventsListTable;
