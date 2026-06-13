import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import EventsTableRow from "./row/events-table-row";
import { EventWithCategories } from "@/types/event";
import { IconLoader, IconCalendarOff } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const COLSPAN = 5;

const EventsTable = ({
	className,
	events,
	isLoading,
	refetch,
}: {
	className?: string;
	events: EventWithCategories[] | null;
	isLoading?: boolean;
	refetch: () => void;
}) => {
	const renderBody = () => {
		if (isLoading || events === null) {
			return (
				<TableRow>
					<TableCell
						colSpan={COLSPAN}
						className="py-12 text-center text-muted-foreground"
					>
						<div className="flex flex-col gap-2 items-center justify-center">
							<IconLoader className="animate-spin size-5" />
							<span>Ładowanie wydarzeń...</span>
						</div>
					</TableCell>
				</TableRow>
			);
		}

		if (events.length === 0) {
			return (
				<TableRow>
					<TableCell
						colSpan={COLSPAN}
						className="py-12 text-center text-muted-foreground"
					>
						<div className="flex flex-col gap-2 items-center justify-center">
							<IconCalendarOff className="size-8 opacity-40" />
							<span>Nie znaleziono wydarzeń</span>
							<Button
								variant="outline"
								size="xs"
								onClick={refetch}
							>
								Odszukaj ponownie
							</Button>
						</div>
					</TableCell>
				</TableRow>
			);
		}

		return events.map((event) => (
			<EventsTableRow key={event.id} data={event} />
		));
	};

	return (
		<div className={cn("events-table", className)}>
			<Table>
				<TableHeader className="bg-muted rounded-tr-xl">
					<TableRow>
						<TableHead className="max-w-[300px]">
							Wydarzenie
						</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Termin</TableHead>
						<TableHead>Sprzedaz</TableHead>
						<TableHead className="text-right"></TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>{renderBody()}</TableBody>
			</Table>
		</div>
	);
};

export default EventsTable;
