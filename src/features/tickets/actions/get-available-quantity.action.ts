// src/actions/tickets/get-available-quantity.action.ts
"use server";

import prisma from "@/lib/prisma";

export const getAvailableQuantity = async (ticketId: string) => {
	const ticket = await prisma.ticket.findUnique({
		where: { id: ticketId },
	});

	if (!ticket?.quantity) return null; // безлимитно

	const taken = await prisma.orderItem.aggregate({
		where: {
			ticketId,
			orders: {
				status: { in: ["CONFIRMED", "PAID", "PENDING"] },
			},
		},
		_sum: { quantity: true },
	});

	const reserved = await prisma.ticketReservationItem.aggregate({
		where: {
			ticketId,
			reservation: {
				expiresAt: { gt: new Date() },
			},
		},
		_sum: { quantity: true },
	});

	return (
		ticket.quantity -
		(taken._sum.quantity ?? 0) -
		(reserved._sum.quantity ?? 0)
	);
};
