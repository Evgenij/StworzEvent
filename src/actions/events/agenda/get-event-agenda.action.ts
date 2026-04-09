// src/actions/agenda/get-event-agenda.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { verifyEventOwnership } from "@/lib/verify-ownership";

export async function getEventAgendaAction(eventId: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	await verifyEventOwnership(eventId, session.user.id);

	return prisma.eventAgendaItem.findMany({
		where: { eventId },
		orderBy: { order: "asc" },
		select: {
			id: true,
			title: true,
			description: true,
			startsAt: true,
			endsAt: true,
			location: true,
			speakerName: true,
			order: true,
		},
	});
}

export type AgendaItem = Awaited<
	ReturnType<typeof getEventAgendaAction>
>[number];
