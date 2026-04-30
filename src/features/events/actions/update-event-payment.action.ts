"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import {
	eventPaymentServerSchema,
	type EventPaymentInput,
} from "@/features/events/schemas/payment.schema";

type Input = { eventId: string; data: EventPaymentInput };

export const updateEventPaymentAction = safeAction(
	async ({ eventId, data }: Input) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		const event = await prisma.event.findFirst({
			where: {
				id: eventId,
				organization: {
					organizationMembers: {
						some: {
							userId: session.user.id,
							memberRole: { in: ["OWNER", "MANAGER", "FINANCE"] },
						},
					},
				},
			},
			select: { id: true },
		});
		if (!event) throw new ApiError(ErrorCode.FORBIDDEN, 403);

		const parsed = eventPaymentServerSchema.parse(data);

		await prisma.event.update({
			where: { id: eventId },
			data: {
				paymentMethod: parsed.paymentMethod,
				bankAccountNumber: parsed.bankAccountNumber ?? null,
				bankAccountHolder: parsed.bankAccountHolder ?? null,
				paymentLink: parsed.paymentLink ?? null,
				paymentInstructions: parsed.paymentInstructions ?? null,
			},
		});

		return { success: true };
	},
);
