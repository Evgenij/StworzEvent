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

		await prisma.$transaction(async (tx) => {
			// Обновляем статус события
			await tx.event.update({
				where: { id: eventId },
				data: { status },
			});

			for (const ticket of data.tickets) {
				if (ticket.id) {
					// Обновляем существующий
					await tx.ticket.update({
						where: { id: ticket.id },
						data: {
							name: ticket.name,
							price: ticket.price * 100, // PLN → grosze
							quantity: ticket.quantity,
						},
					});
				} else {
					// Создаём новый
					await tx.ticket.create({
						data: {
							eventId,
							name: ticket.name,
							price: ticket.price * 100,
							quantity: ticket.quantity,
						},
					});
				}
			}
		});

		return { success: true };
	},
);
