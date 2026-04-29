"use client";

import { API_ROUTES } from "@/app/api/apiRoutes";
import { apiFetcher } from "@/app/api/fetcher";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event, EventCategoryOnEvent, EventCategory } from "@prisma/client";
import { ApiResponse } from "@/types/api-response.types";
import EventItem from "./event-item";
import { EVENT_PAGE_ROUTE } from "@/config/routes";

type EventWithCategory = Event & {
	categories: (EventCategoryOnEvent & {
		category: Pick<EventCategory, "id" | "name" | "slug" | "icon">;
	})[];
	minPrice: number | null;
};

const EventsListOrg = () => {
	const [sortField, setSortField] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const {
		data: events,
		error,
		isLoading,
		isFetching,
		refetch,
	} = useQuery<ApiResponse<EventWithCategory[]>>({
		queryKey: ["events", sortField, sortOrder],
		queryFn: () =>
			apiFetcher(API_ROUTES.events.list, {
				params: {
					sort: sortField,
					order: sortOrder,
				},
			}),
	});

	console.log(events);

	if (isLoading || isFetching)
		return (
			<>
				<Button onClick={() => refetch()} disabled={isFetching}>
					{isFetching ? "Refreshing..." : "Refresh events"}
				</Button>
				<div>Loading...</div>
			</>
		);

	if (error)
		return (
			<>
				<Button onClick={() => refetch()} disabled={isFetching}>
					{isFetching ? "Refreshing..." : "Refresh events"}
				</Button>
				<div>Error: {error.message}</div>
			</>
		);

	if (!events?.success || !events?.data) return <div>No events found</div>;

	return (
		<div className="flex flex-col gap-4">
			<Button onClick={() => refetch()} disabled={isFetching}>
				{isFetching ? "Refreshing..." : "Refresh events"}
			</Button>
			<div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 justify-between items-start">
				{events.data.map((event) => (
					<EventItem
						key={event.id}
						event={{ ...event, startsAt: new Date(event.startsAt) }}
						minPrice={event.minPrice}
						category={event.categories[0]?.category ?? null}
						href={`${EVENT_PAGE_ROUTE(event.id)}`}
					/>
				))}
			</div>
		</div>
	);
};

export default EventsListOrg;
