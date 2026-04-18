// src/actions/orders/create-order.action.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { headers } from "next/headers";

type ParticipantInput = {
	name: string;
	surname: string;
	email: string;
	phone?: string;
};

type CreateOrderInput = {
	reservationId: string;
	eventId: string;
	email: string;
	buyerName: string;
	buyerSurname: string;
	buyerPhone?: string;
	items: {
		ticketId: string;
		quantity: number;
	}[];
	participants: {
		ticketId: string;
		ticketName: string;
		items: ParticipantInput[];
	}[];
};

export const createOrder = async (input: CreateOrderInput) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const order = await prisma.$transaction(async (tx) => {
		// 1. Получаем билеты и проверяем доступность внутри транзакции
		const tickets = await tx.ticket.findMany({
			where: { id: { in: input.items.map((i) => i.ticketId) } },
		});

		for (const item of input.items) {
			const ticket = tickets.find((t) => t.id === item.ticketId);
			if (!ticket) throw new Error("Ticket not found");

			if (ticket.quantity) {
				const sold = await tx.orderItem.aggregate({
					where: {
						ticketId: item.ticketId,
						orders: {
							status: { in: ["CONFIRMED", "PAID", "PENDING"] },
						},
					},
					_sum: { quantity: true },
				});

				const available = ticket.quantity - (sold._sum.quantity ?? 0);
				if (available < item.quantity) {
					throw new Error(
						`Niewystarczająca liczba biletów: ${ticket.name}`,
					);
				}
			}
		}

		// 2. Считаем итоговую сумму
		const total = input.items.reduce((sum, item) => {
			const ticket = tickets.find((t) => t.id === item.ticketId)!;
			return sum + ticket.price * item.quantity;
		}, 0);

		// 3. Создаём заказ
		const order = await tx.order.create({
			data: {
				eventId: input.eventId,
				userId: session?.user.id ?? null,
				email: input.email,
				buyerName: input.buyerName,
				buyerSurname: input.buyerSurname,
				buyerPhone: input.buyerPhone,
				total,
				status:
					total === 0 ? OrderStatus.CONFIRMED : OrderStatus.PENDING,
				orderItems: {
					create: input.items.map((item) => {
						const ticket = tickets.find(
							(t) => t.id === item.ticketId,
						)!;
						const participantGroup = input.participants.find(
							(p) => p.ticketId === item.ticketId,
						);

						return {
							ticketId: item.ticketId,
							quantity: item.quantity,
							price: ticket.price,
							participants: {
								create: (participantGroup?.items ?? []).map(
									(p) => ({
										name: p.name,
										surname: p.surname,
										email: p.email,
										phone: p.phone,
									}),
								),
							},
						};
					}),
				},
			},
		});

		//console.log("✅ Order created:", order.id);
		//console.log("🗑 Deleting reservation:", input.reservationId);

		// Удаляем резервацию — билеты теперь заняты заказом
		await tx.ticketReservation.delete({
			where: { id: input.reservationId },
		});

		return order;
	});

	return order;
};
