"use client";

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
import {
	IconLoader,
	IconCalendarOff,
	IconSortAscending2,
	IconSortDescending2,
	IconRefresh,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useEventsListContext } from "../context/event-list-context";

const COLSPAN = 5;

const NEXT_SORT = {
	asc: "desc",
	desc: "asc",
} as const;

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
	const { filters, setFilters } = useEventsListContext();
	const dateSort = filters.dateSort;

	const handleDateSort = () => {
		setFilters({
			...filters,
			dateSort: NEXT_SORT[(dateSort ?? "desc") as keyof typeof NEXT_SORT],
		});
	};

	const DateSortIcon =
		dateSort === "desc" ? IconSortDescending2 : IconSortAscending2;

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
					<TableCell colSpan={COLSPAN} className="py-12 text-center">
						<div className="flex flex-col gap-4 items-center justify-center">
							<IconCalendarOff className="size-8 opacity-40" />
							<div className="flex flex-col gap-1">
								<p className="font-medium">
									Nie znaleziono wydarzeń
								</p>
								<span className="text-muted-foreground text-xs">
									Spróbuj zmienić kryteria wyszukiwanania
								</span>
							</div>

							<Button
								variant="outline"
								size="xs"
								onClick={refetch}
							>
								<IconRefresh className="size-3" />
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
						<TableHead className="max-w-[500px]">
							Wydarzenie
						</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>
							Termin
							<Button
								variant="ghost"
								size="sm"
								className="ml-0"
								onClick={handleDateSort}
							>
								<DateSortIcon />
							</Button>
						</TableHead>
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
