"use client";

import { API_ROUTES } from "@/app/api/apiRoutes";
import { apiFetcher } from "@/app/api/fetcher";
import { Button } from "@/shadcn/ui/button";
import React from "react";
import useSWR from "swr";
import EventItem from "./events/event";
import { Event } from "@prisma/client";
import { ApiResponse } from "@/types/api-pesponse";

const EventsList = () => {
	const {
		data: events,
		error,
		isLoading,
		isValidating,
		mutate,
	} = useSWR<ApiResponse<Event[]>>(API_ROUTES.events.list, apiFetcher);

	if (isLoading || isValidating)
		return (
			<>
				<Button onClick={() => mutate()} disabled={isValidating}>
					{isValidating ? "Refreshing..." : "Refresh events"}
				</Button>
				<div>Loading...</div>
			</>
		);
	if (error)
		return (
			<>
				<Button onClick={() => mutate()} disabled={isValidating}>
					{isValidating ? "Refreshing..." : "Refresh events"}
				</Button>
				<div>Error: {error.message}</div>
			</>
		);
	if (!events?.success || !events?.data) return <div>No events found</div>;

	console.log(events);

	return (
		<div className="flex flex-col gap-4">
			<Button onClick={() => mutate()} disabled={isValidating}>
				{isValidating ? "Refreshing..." : "Refresh events"}
			</Button>
			{events.data.map((event) => (
				<EventItem key={event.id} event={event} />
			))}
		</div>
	);
};

export default EventsList;
