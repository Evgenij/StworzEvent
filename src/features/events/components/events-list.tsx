"use client";

import { API_ROUTES } from "@/app/api/apiRoutes";
import { apiFetcher } from "@/app/api/fetcher";
import { Button } from "@/components/shadcn/ui/button";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event, EventCategoryOnEvent, EventCategory } from "@prisma/client";
import { ApiResponse } from "@/types/api-pesponse";

type EventWithCategory = Event & {
	categories: (EventCategoryOnEvent & {
		category: Pick<EventCategory, "id" | "name" | "slug" | "icon">;
	})[];
};
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/ui/table";
import { useTranslations } from "next-intl";
import EventItemRow from "./event";
import EventItem from "@/components/events/event-item";
import { EVENT_PAGE_ROUTE } from "@/consts/routes";

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

	const tEventsTable = useTranslations(`EventsList.table`);

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

			{/* {events.data.map((event) => (
				// <EventItem
				// 	key={event.id}
				// 	event={event}
				// 	minPrice={0}
				// 	category={[{}]}
				// />
			))} */}
			{/* <Table>
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-25">
							{tEventsTable("header.data")}
						</TableHead>
						<TableHead>{tEventsTable("header.status")}</TableHead>
						<TableHead className="text-right">
							{tEventsTable("header.action")}
						</TableHead>
					</TableRow>
					{events.data.map((event) => (
						<EventItemRow key={event.id} event={event} />
					))}
				</TableHeader>
				<TableBody></TableBody>
			</Table> */}
		</div>
	);
};

export default EventsListOrg;
