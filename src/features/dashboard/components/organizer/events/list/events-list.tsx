"use client";

import { cn } from "@/lib/utils";
import EventsListTable from "./events-list-table";
import EventsListSearch from "./search/events-list-search";
import { useEventsListContext } from "./context/event-list-context";
const EventsList = ({ className }: { className?: string }) => {
	const { events, isLoading, isFetching, refetch, setFilters } = useEventsListContext();

	const handleRefreshEventsList = async () => {
		await refetch();
	};

	return (
		<div
			className={cn(
				"events-list relative flex flex-col gap-4",
				className,
			)}
		>
			<EventsListSearch onSetFilters={setFilters} />
			<EventsListTable
				events={events}
				isLoading={isLoading}
				isFetching={isFetching}
				onRefresh={handleRefreshEventsList}
			/>
		</div>
	);
};

export default EventsList;
