// src/actions/tickets/get-tickets-with-availability.action.ts
"use server";

import prisma from "@/lib/prisma";
import { getAvailableQuantity } from "./get-available-quantity.action";

export const getTicketsWithAvailability = async (eventId: string) => {
	const tickets = await prisma.ticket.findMany({
		where: { eventId },
	});

	return Promise.all(
		tickets.map(async (ticket) => ({
			...ticket,
			available: await getAvailableQuantity(ticket.id),
		})),
	);
};
