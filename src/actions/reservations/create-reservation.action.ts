// src/actions/reservations/create-reservation.action.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { headers } from "next/headers";

type CreateReservationInput = {
	eventId: string;
	items: {
		ticketId: string;
		quantity: number;
	}[];
};

export const createReservation = async (input: CreateReservationInput) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// sessionId — берём из сессии если залогинен, иначе генерируем для гостя
	const sessionId = session?.id ?? randomUUID();

	// console.log("SESSION:", JSON.stringify(session, null, 2));

	// 1. Проверяем доступность билетов перед резервацией
	for (const item of input.items) {
		const ticket = await prisma.ticket.findUnique({
			where: { id: item.ticketId },
		});

		if (!ticket) throw new Error(`Bilet nie istnieje: ${item.ticketId}`);

		if (ticket.quantity) {
			const taken = await prisma.orderItem.aggregate({
				where: {
					ticketId: item.ticketId,
					orders: {
						status: { in: ["CONFIRMED", "PAID", "PENDING"] },
					},
				},
				_sum: { quantity: true },
			});

			// Считаем активные резервации (не истёкшие)
			const reserved = await prisma.ticketReservationItem.aggregate({
				where: {
					ticketId: item.ticketId,
					reservation: {
						expiresAt: { gt: new Date() },
					},
				},
				_sum: { quantity: true },
			});

			const available =
				ticket.quantity -
				(taken._sum.quantity ?? 0) -
				(reserved._sum.quantity ?? 0);

			if (available < item.quantity) {
				throw new Error(
					`Niewystarczająca liczba biletów: ${ticket.name}`,
				);
			}
		}
	}

	// 2. Удаляем истёкшие резервации (lazy deletion)
	await prisma.ticketReservation.deleteMany({
		where: { expiresAt: { lt: new Date() } },
	});

	// 3. Создаём резервацию на 15 минут
	const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

	const reservation = await prisma.ticketReservation.create({
		data: {
			eventId: input.eventId,
			sessionId,
			expiresAt,
			items: {
				create: input.items.map((item) => ({
					ticketId: item.ticketId,
					quantity: item.quantity,
				})),
			},
		},
		include: {
			items: true,
		},
	});

	return reservation;
};
