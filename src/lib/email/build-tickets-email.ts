import prisma from "@/lib/prisma";
import type { OrderTicketsMailProps } from "@/helpers/mail-templates";

export async function buildTicketsEmailData(
	orderId: string,
): Promise<{ to: string; data: OrderTicketsMailProps } | null> {
	const order = await prisma.order.findFirst({
		where: { id: orderId },
		include: {
			events: {
				select: {
					title: true,
					startsAt: true,
					location: true,
					street: true,
				},
			},
			orderItems: {
				include: {
					participants: {
						select: {
							name: true,
							surname: true,
							checkInCode: true,
						},
					},
					tickets: { select: { name: true } },
				},
			},
		},
	});

	if (!order || !order.email) return null;

	const event = order.events;

	const formattedDate = new Intl.DateTimeFormat("pl-PL", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "Europe/Warsaw",
	}).format(event.startsAt);

	const locationParts = [event.street, event.location].filter(Boolean);
	const eventLocation = locationParts.length ? locationParts.join(", ") : null;

	const participants = order.orderItems.flatMap((item) =>
		item.participants.map((p) => ({
			ticketName: item.tickets.name,
			participantName: p.name,
			participantSurname: p.surname,
			checkInCode: p.checkInCode,
		})),
	);

	if (participants.length === 0) return null;

	return {
		to: order.email,
		data: {
			buyerName: order.buyerName ?? "Uczestnik",
			eventTitle: event.title,
			eventDate: formattedDate,
			eventLocation,
			orderNumber: order.orderNumber ?? order.id,
			participants,
		},
	};
}
