"use client";

import { API_ROUTES } from "@/app/api/apiRoutes";
import { apiFetcher } from "@/app/api/fetcher";
import { Button } from "@/components/shadcn/ui/button";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
} from "@/components/shadcn/ui/table";
import { useTranslations } from "next-intl";

const EventsList = () => {
	const [sortField, setSortField] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const {
		data: events,
		error,
		isLoading,
		isFetching,
		refetch,
	} = useQuery<ApiResponse<Event[]>>({
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
			<Table>
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
