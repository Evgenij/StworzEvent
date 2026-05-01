// src/features/orders/actions/create-order.action.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { OrderStatus } from "@prisma/client";
import { headers } from "next/headers";
import { resolvePayment } from "@/lib/payment/resolve-payment";
import { generateOrderNumber } from "@/lib/payment/order-number";
import { sendEmailAction } from "@/lib/email/send-email.action";
import { TypeMail } from "@/types/enums";
import { APP_CONFIG } from "@/config/app";
import { buildTicketsEmailData } from "@/lib/email/build-tickets-email";

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

	// Generate orderNumber with up to 3 retries on unique collision
	let orderNumber: string | null = null;
	for (let attempt = 0; attempt < 3; attempt++) {
		const candidate = generateOrderNumber();
		const existing = await prisma.order.findUnique({
			where: { orderNumber: candidate },
			select: { id: true },
		});
		if (!existing) {
			orderNumber = candidate;
			break;
		}
	}
	if (!orderNumber) throw new ApiError(ErrorCode.INTERNAL_ERROR, 500);

	const finalOrderNumber = orderNumber;

	const { order, eventTitle, event } = await prisma.$transaction(async (tx) => {
		// 1. Load tickets and verify availability
		const tickets = await tx.ticket.findMany({
			where: { id: { in: input.items.map((i) => i.ticketId) } },
		});

		for (const item of input.items) {
			const ticket = tickets.find((t) => t.id === item.ticketId);
			if (!ticket) throw new ApiError(ErrorCode.NOT_FOUND, 404);

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

				const available =
					ticket.quantity - (sold._sum.quantity ?? 0);
				if (available < item.quantity) {
					throw new ApiError(ErrorCode.VALIDATION_ERROR, 400);
				}
			}
		}

		// 2. Calculate total
		const total = input.items.reduce((sum, item) => {
			const ticket = tickets.find((t) => t.id === item.ticketId)!;
			return sum + ticket.price * item.quantity;
		}, 0);

		// 3. Load event + organization for payment snapshot
		const event = await tx.event.findUnique({
			where: { id: input.eventId },
			include: {
				organization: {
					include: {
						organizationMembers: {
							where: { memberRole: "OWNER" },
							include: { user: { select: { email: true } } },
							take: 1,
						},
					},
				},
			},
		});
		if (!event) throw new ApiError(ErrorCode.NOT_FOUND, 404);

		// 4. Resolve effective payment settings
		const resolved = resolvePayment(event, event.organization);

		// 5. Determine order status
		const status =
			total === 0 || resolved.method === "CASH_AT_ENTRANCE"
				? OrderStatus.CONFIRMED
				: OrderStatus.PENDING;

		// 6. Create order with payment snapshot
		const order = await tx.order.create({
			data: {
				eventId: input.eventId,
				userId: session?.user.id ?? null,
				email: input.email,
				buyerName: input.buyerName,
				buyerSurname: input.buyerSurname,
				buyerPhone: input.buyerPhone,
				total,
				status,
				orderNumber: finalOrderNumber,
				paymentMethod: resolved.method,
				paymentBankAccount: resolved.bankAccountNumber,
				paymentBankHolder: resolved.bankAccountHolder,
				paymentLink: resolved.paymentLink,
				paymentInstructions: resolved.paymentInstructions,
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
								create: (
									participantGroup?.items ?? []
								).map((p) => ({
									name: p.name,
									surname: p.surname,
									email: p.email,
									phone: p.phone,
								})),
							},
						};
					}),
				},
			},
		});

		//console.log("✅ Order created:", order.id);
		//console.log("🗑 Deleting reservation:", input.reservationId);

		// 7. Delete reservation — tickets are now locked by the order
		await tx.ticketReservation.delete({
			where: { id: input.reservationId },
		});

		return { order, eventTitle: event.title, event };
	});

	// Email #1 — покупателю: реквизиты оплаты
	if (order.paymentMethod !== null) {
		void sendEmailAction({
			to: input.email,
			subject: `Zamówienie ${order.orderNumber} – szczegóły płatności`,
			type: TypeMail.ORDER_PAYMENT_INSTRUCTIONS,
			data: {
				buyerName: input.buyerName,
				eventTitle: eventTitle,
				orderNumber: order.orderNumber!,
				paymentMethod: order.paymentMethod,
				bankAccount: order.paymentBankAccount,
				bankHolder: order.paymentBankHolder,
				paymentLink: order.paymentLink,
				paymentInstructions: order.paymentInstructions,
			},
		});
	}

	// Email #2 — организатору: новый заказ ждёт подтверждения
	if (order.status === OrderStatus.PENDING) {
		const org = event.organization;
		const organizerEmail =
			org.email ?? org.organizationMembers[0]?.user?.email;

		if (organizerEmail) {
			void sendEmailAction({
				to: organizerEmail,
				subject: `Nowe zamówienie ${order.orderNumber} – ${event.title}`,
				type: TypeMail.ORDER_ORGANIZER_NOTIFY,
				data: {
					organizationName: org.name,
					eventTitle: event.title,
					orderNumber: order.orderNumber!,
					buyerName: input.buyerName,
					buyerSurname: input.buyerSurname,
					buyerEmail: input.email,
					total: order.total,
					currency: "PLN",
					ordersUrl: `${APP_CONFIG.url}/profile/events/${event.id}/orders`,
				},
			});
		}
	}

	// Email #3 — покупателю: QR-билеты (только если статус сразу CONFIRMED)
	if (order.status === OrderStatus.CONFIRMED) {
		void (async () => {
			try {
				const payload = await buildTicketsEmailData(order.id);
				if (payload) {
					await sendEmailAction({
						to: payload.to,
						subject: `Twoje bilety – ${event.title}`,
						type: TypeMail.ORDER_TICKETS,
						data: payload.data,
					});
				}
			} catch {
				// email failure must not fail the order
			}
		})();
	}

	return order;
};
