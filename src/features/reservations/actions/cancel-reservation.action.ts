// src/actions/reservations/cancel-reservation.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";

export const cancelReservation = safeAction(async (eventId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new ApiError(ErrorCode.UNAUTHORIZED);
	}

	await prisma.ticketReservation.deleteMany({
		where: {
			eventId,
			sessionId: session.session.id,
		},
	});
});
