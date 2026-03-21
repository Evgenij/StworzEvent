import EventItemCatalog from "@/components/events/catalog/event-item";
import prisma from "@/lib/prisma";

const EventsCatalogPage = async () => {
	const events = await prisma.event.findMany({
		include: {
			tickets: {
				include: {
					orderItems: {
						where: {
							orders: {
								status: {
									in: ["CONFIRMED", "PAID", "PENDING"],
								},
							},
						},
					},
				},
			},
		},
	});

	// Фильтруем в JS
	const availableEvents = events.filter((event) =>
		event.tickets.some((ticket) => {
			if (ticket.quantity === null) return true; // безлимитный
			const sold = ticket.orderItems.reduce(
				(sum, oi) => sum + oi.quantity,
				0,
			);
			return ticket.quantity - sold > 0;
		}),
	);

	return (
		<div className="grid grid-cols-3 gap-4">
			{availableEvents.map((event) => (
				<EventItemCatalog key={event.id} event={event} />
			))}
		</div>
	);
};

export default EventsCatalogPage;
