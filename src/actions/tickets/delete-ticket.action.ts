"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";

export const deleteTicketAction = safeAction(async (ticketId: string) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	// Проверяем через цепочку что билет принадлежит организации пользователя
	// и что у пользователя достаточно прав (OWNER или MANAGER)
	const ticket = await prisma.ticket.findFirst({
		where: {
			id: ticketId,
			events: {
				organization: {
					organizationMembers: {
						some: {
							userId: session.user.id,
							memberRole: { in: ["OWNER", "MANAGER"] },
						},
					},
				},
			},
		},
		select: { id: true, eventId: true },
	});

	if (!ticket) throw new ApiError(ErrorCode.FORBIDDEN, 403);

	await prisma.$transaction(async (tx) => {
		await tx.ticket.delete({ where: { id: ticketId } });

		const remaining = await tx.ticket.findMany({
			where: { eventId: ticket.eventId },
			select: { price: true },
		});
		const minPrice =
			remaining.length > 0
				? Math.min(...remaining.map((t) => t.price))
				: null;

		await tx.event.update({
			where: { id: ticket.eventId },
			data: { minPrice },
		});
	});

	return { success: true };
});
