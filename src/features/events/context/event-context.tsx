"use client";

import { createContext, useContext } from "react";
import type { getEventAction } from "../actions/get-event.action";

export type EventData = NonNullable<Awaited<ReturnType<typeof getEventAction>>>;

const EventContext = createContext<EventData | null>(null);

export function EventProvider({
	children,
	event,
}: {
	children: React.ReactNode;
	event: EventData;
}) {
	// console.log("EventProvider", event);

	return (
		<EventContext.Provider value={event}>{children}</EventContext.Provider>
	);
}

export function useEvent(): EventData {
	const ctx = useContext(EventContext);
	if (!ctx) throw new Error("useEvent must be used within EventProvider");
	return ctx;
}
