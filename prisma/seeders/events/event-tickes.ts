import { Event, PrismaClient, Ticket } from "@prisma/client";

const tickets = [
	{
		name: "Bilet regularny",
		price: 14500, // 145.00 zł в грошах
		quantity: 100,
	},
	{
		name: "Bilet VIP",
		price: 29900, // 299.00 zł
		quantity: 20,
	},
	{
		name: "Bilet grupowy (5 osób)",
		price: 59900, // 599.00 zł
		quantity: 10,
	},
];

export const createTickets = async (prisma: PrismaClient, events: Event[]) => {
	console.log("🔥 Creating tickets events ---------------------");

	for (const event of events) {
		// Удаляем старые билеты и создаём заново
		await prisma.ticket.deleteMany({
			where: { eventId: event.id },
		});

		console.log("➕ Adding tickets for event with id: ", event.id);
		await prisma.ticket.createMany({
			data: tickets.map((ticket) => ({
				eventId: event.id,
				...ticket,
			})),
		});
	}
};
