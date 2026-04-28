"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";

export async function getEventTickets(eventId: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	const tickets = await prisma.ticket.findMany({
		where: {
			eventId,
			events: {
				organization: {
					organizationMembers: {
						some: { userId: session.user.id },
					},
				},
			},
		},
		select: {
			id: true,
			name: true,
			price: true,
			quantity: true,
		},
		orderBy: { createdAt: "asc" },
	});

	// grosze → PLN для формы
	return tickets.map((t) => ({
		...t,
		price: t.price / 100,
	}));
}

export type EventTicket = Awaited<ReturnType<typeof getEventTickets>>[number];
