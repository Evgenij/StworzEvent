import EventItem from "@/components/events/event-item";
import { getMinTicketPrice } from "@/helpers/event";
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
			categories: {
				include: {
					category: true,
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

	console.log(events);

	return (
		<div className="grid grid-cols-4 gap-4">
			{availableEvents.map((event) => (
				<EventItem
					key={event.id}
					event={event}
					minPrice={getMinTicketPrice(event.tickets)}
					category={event.categories[0]?.category}
				/>
			))}
		</div>
	);
};

export default EventsCatalogPage;
