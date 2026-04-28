import { EventsList } from "@/features/events";
import { PageHeader } from "@/features/layout";
import React from "react";

const OrganizerEventsPage = () => {
	return (
		<>
			<PageHeader />
			<EventsList />
		</>
	);
};

export default OrganizerEventsPage;
