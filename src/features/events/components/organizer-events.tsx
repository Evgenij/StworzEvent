import { EventsList } from "@/features/events";
import { PageHeader } from "@/features/layout";

const OrganizerEventsPage = () => {
	return (
		<>
			<PageHeader />
			<div className="organizer-events-page">
				<EventsList />
			</div>
		</>
	);
};

export default OrganizerEventsPage;
