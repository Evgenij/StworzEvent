// src/actions/reservations/cancel-reservation.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const cancelReservation = async (eventId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) return;

	await prisma.ticketReservation.deleteMany({
		where: {
			eventId,
			sessionId: session.id,
		},
	});
};
