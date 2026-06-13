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
import { EventWithCategories } from "@/types/event";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";

const EventsListTable = ({
	className,
	events,
	isLoading,
	isFetching,
	onRefresh,
}: {
	className?: string;
	events: EventWithCategories[] | null;
	isLoading: boolean;
	isFetching?: boolean;
	onRefresh: () => void;
}) => {
	return (
		<div
			className={cn(
				"events-list-table border border-border rounded-2xl bg-background",
				className,
			)}
		>
			<div className="table-actions flex justify-between items-center p-3 px-4">
				<p className="text-muted-foreground text-sm">
					Znaleziono{" "}
					<span className="font-semibold text-black">
						{events?.length ?? 0} wydarzeń
					</span>
				</p>
				<Button onClick={onRefresh} variant="ghost" size="sm" disabled={isFetching}>
					<IconRefresh className={cn(isFetching && "animate-spin")} />
					Odswież
				</Button>
			</div>
			<div className="table-container">
				<EventsTable
					events={events}
					isLoading={isLoading}
					refetch={onRefresh}
				/>
			</div>
		</div>
	);
};

export default EventsListTable;
