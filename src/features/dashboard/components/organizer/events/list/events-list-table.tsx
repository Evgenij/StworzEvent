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

	return (
		<div
			className={cn(
				"events-list-table border border-border rounded-2xl bg-background",
				className,
			)}
		>
			<div className="table-actions flex justify-between items-center p-3 px-4">
				<span className="text-muted-foreground text-sm">
					Znaleziono {events.length} wydarzeń
				</span>
			</div>
			<div className="table-container rounded-xl overflow-hidden m-2 mt-0">
				<EventsTable events={events} isLoading={isLoading} />
			</div>
		</div>
	);
};

export default EventsListTable;
