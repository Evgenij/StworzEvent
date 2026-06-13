"use client";

import { API_ROUTES } from "@/app/api/apiRoutes";
import { apiFetcher } from "@/app/api/fetcher";
import QUERY_KEYS from "@/config/query-keys";
import { useActiveOrganization } from "@/features/organizations/context/active-organization-context";
import { ApiResponse } from "@/types/api-response.types";
import { EventWithCategories } from "@/types/event";
import {
	useQuery,
	type QueryObserverResult,
	type RefetchOptions,
} from "@tanstack/react-query";
import { DateTimeFormatter } from "@/helpers/date";
import { createContext, useContext, useState, ReactNode } from "react";
import { type DateRange } from "react-day-picker";
import { EventStatus } from "@prisma/client";

export interface EventListFilters {
	searchText: string;
	statuses: EventStatus[];
	dateRange: DateRange | undefined;
}

interface EventsListContextType {
	events: EventWithCategories[] | null;
	isLoading: boolean;
	isFetching: boolean;
	filters: EventListFilters;
	setFilters: (filters: EventListFilters) => void;
	refetch: (
		options?: RefetchOptions,
	) => Promise<QueryObserverResult<ApiResponse<EventWithCategories[]>>>;
}

const EventsListContext = createContext<EventsListContextType | undefined>(
	undefined,
);

const DEFAULT_FILTERS: EventListFilters = {
	searchText: "",
	statuses: [],
	dateRange: undefined,
};

export const EventsListProvider = ({ children }: { children: ReactNode }) => {
	const { activeOrganization } = useActiveOrganization();
	const organizationId = activeOrganization?.id;

	const [filters, setFilters] = useState<EventListFilters>(DEFAULT_FILTERS);

	const { data, isLoading, isFetching, refetch } = useQuery<
		ApiResponse<EventWithCategories[]>
	>({
		queryKey: [QUERY_KEYS.USER_DATA.EVENTS, organizationId, filters],
		queryFn: () =>
			apiFetcher(API_ROUTES.events.list, {
				params: {
					organizationId,
					...(filters.searchText && { search: filters.searchText }),
					...(filters.statuses.length > 0 && {
						status: filters.statuses,
					}),
					...(filters.dateRange?.from && {
						from: DateTimeFormatter.toLocalDateString(
							filters.dateRange.from,
						),
					}),
					...(filters.dateRange?.to && {
						to: DateTimeFormatter.toLocalDateString(
							filters.dateRange.to,
						),
					}),
					order: "asc",
				},
			}),
		enabled: !!organizationId,
	});

	const events = data?.data ?? null;

	return (
		<EventsListContext.Provider
			value={{ events, isLoading, isFetching, filters, setFilters, refetch }}
		>
			{children}
		</EventsListContext.Provider>
	);
};

export const useEventsListContext = () => {
	const context = useContext(EventsListContext);
	if (context === undefined) {
		throw new Error(
			"useEventsListContext must be used within a EventsListProvider",
		);
	}
	return context;
};
