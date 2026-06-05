"use client";

import { cn } from "@/lib/utils";
import EventsListTable from "./events-list-table";
import EventsListSearch from "./search/events-list-search";
import {
	EventsListProvider,
	useEventsListContext,
} from "./context/event-list-context";

const EventsList = ({ className }: { className?: string }) => {
	return (
		<div className={cn("events-list flex flex-col gap-4", className)}>
			<EventsListSearch />
			<EventsListTable />
		</div>
	);
};

export default EventsList;
