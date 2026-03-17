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
	const ticket = await prisma.ticket.findFirst({
		where: {
			id: ticketId,
			events: {
				organization: {
					organizationMembers: {
						some: { userId: session.user.id },
					},
				},
			},
		},
		select: { id: true },
	});

	if (!ticket) throw new ApiError(ErrorCode.FORBIDDEN, 403);

	await prisma.ticket.delete({ where: { id: ticketId } });

	return { success: true };
});
