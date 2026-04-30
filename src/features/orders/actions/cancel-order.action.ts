"use server";

import { ApiError } from "@/error/api-error";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ErrorCode } from "@/types/error-code";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const cancelOrderSchema = z.object({
	orderId: z.string().min(1),
	eventId: z.string().min(1),
	reason: z.string().trim().min(3).max(500),
});

type CancelOrderInput = z.infer<typeof cancelOrderSchema>;

export const cancelOrderAction = safeAction(async (input: CancelOrderInput) => {
	const { orderId, eventId, reason } = cancelOrderSchema.parse(input);

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
	if (order.status === OrderStatus.CANCELLED) {
		throw new ApiError(ErrorCode.VALIDATION_ERROR, 400);
	}

	await prisma.order.update({
		where: { id: order.id },
		data: {
			status: OrderStatus.CANCELLED,
			cancelReason: reason,
		},
	});

	revalidatePath(`/profile/events/${eventId}/orders`);

	return { id: order.id, status: OrderStatus.CANCELLED };
});
