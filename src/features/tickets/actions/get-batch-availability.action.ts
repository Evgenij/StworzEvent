// src/actions/tickets/get-batch-availability.action.ts
"use server";

import prisma from "@/lib/prisma";

/**
 * Возвращает Map<ticketId, available | null> для списка билетов.
 * null означает безлимитный билет.
 * Выполняет 2 запроса вместо N*3.
 */
export const getBatchAvailability = async (
	tickets: { id: string; quantity: number | null }[],
): Promise<Map<string, number | null>> => {
	const limitedIds = tickets
		.filter((t) => t.quantity != null)
		.map((t) => t.id);

	if (!limitedIds.length) {
		return new Map(tickets.map((t) => [t.id, null]));
	}

	const [sold, reserved] = await Promise.all([
		prisma.orderItem.groupBy({
			by: ["ticketId"],
			where: {
				ticketId: { in: limitedIds },
				orders: { status: { in: ["CONFIRMED", "PAID", "PENDING"] } },
			},
			_sum: { quantity: true },
		}),
		prisma.ticketReservationItem.groupBy({
			by: ["ticketId"],
			where: {
				ticketId: { in: limitedIds },
				reservation: { expiresAt: { gt: new Date() } },
			},
			_sum: { quantity: true },
		}),
	]);

	const soldMap = new Map(sold.map((r) => [r.ticketId, r._sum.quantity ?? 0]));
	const reservedMap = new Map(
		reserved.map((r) => [r.ticketId, r._sum.quantity ?? 0]),
	);

	return new Map(
		tickets.map((t) => {
			if (t.quantity == null) return [t.id, null];
			const available =
				t.quantity -
				(soldMap.get(t.id) ?? 0) -
				(reservedMap.get(t.id) ?? 0);
			return [t.id, available];
		}),
	);
};
