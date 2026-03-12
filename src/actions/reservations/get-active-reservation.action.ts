"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getActiveReservation = async (eventId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// Гость не может восстановить резервацию — нет sessionId
	if (!session) return null;

	const reservation = await prisma.ticketReservation.findFirst({
		where: {
			eventId,
			sessionId: session.id,
			expiresAt: { gt: new Date() }, // только активные
		},
		include: {
			items: {
				include: {
					ticket: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc", // берём самую свежую
		},
	});

	return reservation;
};
