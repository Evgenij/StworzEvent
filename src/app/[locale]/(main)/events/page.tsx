import EventItemCatalog from "@/components/events/catalog/event-item";
import prisma from "@/lib/prisma";
import React from "react";

const EventsCatalogPage = async () => {
	const events = await prisma.event.findMany();

	return (
		<div className="grid grid-cols-3 gap-4">
			{events.map((event) => (
				<EventItemCatalog key={event.id} event={event} />
			))}
		</div>
	);
};

export default EventsCatalogPage;
