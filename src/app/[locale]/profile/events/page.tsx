import React from "react";
import PageHeader from "@/features/layout/components/page-header";
import EventsList from "@/features/events/components/events-list";

const EventsPage = () => {
	return (
		<>
			<PageHeader />
			<EventsList />
		</>
	);
};

export default EventsPage;
