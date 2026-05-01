"use server";

import { ApiError } from "@/error/api-error";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ErrorCode } from "@/types/error-code";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendEmailAction } from "@/lib/email/send-email.action";
import { TypeMail } from "@/types/enums";
import { buildTicketsEmailData } from "@/lib/email/build-tickets-email";

type ConfirmOrderInput = {
	orderId: string;
	eventId: string;
};

export const confirmOrderAction = safeAction(
	async ({ orderId, eventId }: ConfirmOrderInput) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
				eventId,
				events: {
					organization: {
						organizationMembers: {
							some: { userId: session.user.id },
						},
					},
				},
			},
			select: { id: true, status: true },
		});

		if (!order) throw new ApiError(ErrorCode.FORBIDDEN, 403);
		if (order.status !== OrderStatus.PENDING) {
			throw new ApiError(ErrorCode.VALIDATION_ERROR, 400);
		}

		await prisma.order.update({
			where: { id: order.id },
			data: {
				status: OrderStatus.CONFIRMED,
				cancelReason: null,
			},
		});

		// Email #3 — покупателю: QR-билеты после ручного подтверждения
		void (async () => {
			try {
				const payload = await buildTicketsEmailData(order.id);
				if (payload) {
					const evt = await prisma.event.findUnique({
						where: { id: eventId },
						select: { title: true },
					});
					await sendEmailAction({
						to: payload.to,
						subject: `Twoje bilety – ${evt?.title ?? "Wydarzenie"}`,
						type: TypeMail.ORDER_TICKETS,
						data: payload.data,
					});
				}
			} catch {
				// email failure must not fail the confirmation
			}
		})();

		revalidatePath(`/profile/events/${eventId}/orders`);

		return { id: order.id, status: OrderStatus.CONFIRMED };
	},
);
