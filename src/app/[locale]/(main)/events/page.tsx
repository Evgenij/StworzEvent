import EventItem from "@/components/events/event-item";
import { LottieAnimation } from "@/components/shared/lottie-animation";
import { PageHeader } from "@/features/layout";
import { getMinTicketPrice } from "@/helpers/event";
import prisma from "@/lib/prisma";
import { IconLoader } from "@tabler/icons-react";

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
		<div className="flex flex-col w-full h-full items-start gap-4 p-6 sm:p-0">
			<PageHeader />
			<div className="event-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
				{availableEvents.map((event) => (
					<EventItem
						key={event.id}
						event={event}
						minPrice={getMinTicketPrice(event.tickets)}
						category={event.categories[0]?.category}
					/>
				))}
			</div>
		</div>
	);
};

export default EventsCatalogPage;
