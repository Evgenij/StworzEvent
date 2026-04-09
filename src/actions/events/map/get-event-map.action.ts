// src/actions/events/get-event-map.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { verifyEventOwnership } from "@/lib/verify-ownership";

export async function getEventMapAction(eventId: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	await verifyEventOwnership(eventId, session.user.id);

	return prisma.event.findUnique({
		where: { id: eventId },
		select: {
			lat: true,
			lng: true,
			showMap: true,
			location: true,
			street: true,
		},
	});
}

export type EventMapData = Awaited<ReturnType<typeof getEventMapAction>>;
