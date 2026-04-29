// src/actions/sections/get-event-sections.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { verifyEventOwnership } from "@/lib/verify-ownership";

export async function getEventSectionsAction(eventId: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	await verifyEventOwnership(eventId, session.user.id);

	return prisma.eventSection.findMany({
		where: { eventId },
		orderBy: { order: "asc" },
		select: {
			id: true,
			type: true,
			title: true,
			content: true,
			order: true,
			isVisible: true,
		},
	});
}

export type EventSection = Awaited<
	ReturnType<typeof getEventSectionsAction>
>[number];
