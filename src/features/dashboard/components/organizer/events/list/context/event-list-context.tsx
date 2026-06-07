"use client";

import { API_ROUTES } from "@/app/api/apiRoutes";
import { apiFetcher } from "@/app/api/fetcher";
import QUERY_KEYS from "@/config/query-keys";
import { useActiveOrganization } from "@/features/organizations/context/active-organization-context";
import { ApiResponse } from "@/types/api-response.types";
import { EventWithCategories } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, ReactNode } from "react";

interface EventsListContextType {
	events: EventWithCategories[];
	isLoading: boolean;
}

const EventsListContext = createContext<EventsListContextType | undefined>(
	undefined,
);

interface EventsListProviderProps {
	children: ReactNode;
	events?: EventWithCategories[];
}

export const EventsListProvider = ({ children }: { children: ReactNode }) => {
	const { activeOrganization } = useActiveOrganization();
	const organizationId = activeOrganization?.id;
	const { data, isLoading } = useQuery<ApiResponse<EventWithCategories[]>>({
		queryKey: [QUERY_KEYS.USER_DATA.EVENTS, organizationId],
		queryFn: () =>
			apiFetcher(API_ROUTES.events.list, {
				params: { organizationId },
			}),
		enabled: !!organizationId,
	});

	const events = data?.data ?? [];

	return (
		<EventsListContext.Provider value={{ events, isLoading }}>
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
