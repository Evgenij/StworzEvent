"use client";

import { useEvent } from "@/features/events/context/event-context";

const OrganizerEventDataPage = async () => {
	const data = useEvent();

	return (
		<section className="event-data-page flex flex-col gap-4">
			event-data {data.id}
		</section>
	);
};

export default OrganizerEventDataPage;
