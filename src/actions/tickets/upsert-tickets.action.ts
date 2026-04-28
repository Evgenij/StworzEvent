"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { type EventTicketsInput } from "@/schemas/event-tickets.schema";
import { EventStatus } from "@prisma/client";

type Input = {
	eventId: string;
	status: EventStatus;
	data: EventTicketsInput;
};

export const upsertTicketsAction = safeAction(
	async ({ eventId, status, data }: Input) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		// Проверяем что пользователь член организации владеющей событием
		const event = await prisma.event.findFirst({
			where: {
				id: eventId,
				organization: {
					organizationMembers: {
						some: { userId: session.user.id },
					},
				},
			},
			select: { id: true },
		});

		if (!event) throw new ApiError(ErrorCode.FORBIDDEN, 403);

		const upsertedTickets = await prisma.$transaction(async (tx) => {
			const results = [];
			for (const ticket of data.tickets) {
				if (ticket.id) {
					// Обновляем существующий
					const updated = await tx.ticket.update({
						where: { id: ticket.id },
						data: {
							name: ticket.name,
							description: ticket.description ?? null,
							price: ticket.price * 100, // PLN → grosze
							quantity: ticket.quantity,
						},
						select: { id: true, name: true, description: true, price: true, quantity: true },
					});
					results.push(updated);
				} else {
					// Создаём новый
					const created = await tx.ticket.create({
						data: {
							eventId,
							name: ticket.name,
							description: ticket.description ?? null,
							price: ticket.price * 100,
							quantity: ticket.quantity,
						},
						select: { id: true, name: true, description: true, price: true, quantity: true },
					});
					results.push(created);
				}
			}

			// Пересчитываем minPrice из всех билетов события
			const allTickets = await tx.ticket.findMany({
				where: { eventId },
				select: { price: true },
			});
			const minPrice =
				allTickets.length > 0
					? Math.min(...allTickets.map((t) => t.price))
					: null;

			await tx.event.update({
				where: { id: eventId },
				data: { status, minPrice },
			});

			return results;
		});

		return {
			tickets: upsertedTickets.map((t) => ({ ...t, price: t.price / 100 })),
		};
	},
);
