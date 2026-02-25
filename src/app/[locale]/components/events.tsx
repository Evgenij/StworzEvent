"use client";

import { API_ROUTES } from "@/app/api/apiRoutes";
import { apiFetcher } from "@/app/api/fetcher";
import { Button } from "@/shadcn/ui/button";
import React from "react";
import useSWR from "swr";

const EventsList = () => {
	const {
		data: events,
		error,
		isLoading,
		mutate,
	} = useSWR(
		[
			API_ROUTES.events,
			{ organizationId: "2020802e-34af-4d0e-a83f-43d76f122930" },
		],
		([url, params]) =>
			apiFetcher(url, {
				params,
			}),
	);

	if (isLoading) return <div>Loading...</div>;
	if (error)
		return (
			<>
				<Button onClick={() => mutate()}>Refresh events</Button>
				<div>Error: {error.message}</div>
			</>
		);
	if (!events) return <div>No events found</div>;

	return (
		<div className="flex flex-col gap-4">
			<Button onClick={() => mutate()}>Refresh events</Button>
			<pre>{JSON.stringify(events, null, 2)}</pre>
			{/* {events.data.map((event) => (
				<div key={event.id} className="border p-4 rounded-md">
					<h3 className="text-lg font-bold">{event.name}</h3>
					<p>{event.description}</p>
				</div>
			))} */}
		</div>
	);
};

export default EventsList;
