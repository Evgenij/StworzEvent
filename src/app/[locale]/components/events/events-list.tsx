"use client";

import { API_ROUTES } from "@/app/api/apiRoutes";
import { apiFetcher } from "@/app/api/fetcher";
import { Button } from "@/shadcn/ui/button";
import React from "react";
import useSWR from "swr";
import EventItem from "./event";
import { Event } from "@prisma/client";
import { ApiResponse } from "@/types/api-pesponse";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shadcn/ui/table";
import { useTranslations } from "next-intl";

const EventsList = () => {
	const {
		data: events,
		error,
		isLoading,
		isValidating,
		mutate,
	} = useSWR<ApiResponse<Event[]>>(API_ROUTES.events.list, apiFetcher);

	const tEventsTable = useTranslations(`EventsList.table`);

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

	return (
		<div className="flex flex-col gap-4">
			<Button onClick={() => mutate()} disabled={isValidating}>
				{isValidating ? "Refreshing..." : "Refresh events"}
			</Button>
			<Table>
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">
							{tEventsTable("header.data")}
						</TableHead>
						<TableHead>{tEventsTable("header.status")}</TableHead>
						<TableHead className="text-right">
							{tEventsTable("header.action")}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{events.data.map((event) => (
						<EventItem key={event.id} event={event} />
					))}
				</TableBody>
			</Table>
			<div className="list-events grid sm:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-4"></div>
		</div>
	);
};

export default EventsList;
