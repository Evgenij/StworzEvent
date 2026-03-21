// src/actions/events/update-event-map.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { verifyEventOwnership } from "@/lib/verify-ownership";

type Input = {
	eventId: string;
	lat: number | null;
	lng: number | null;
	showMap: boolean;
};

export const updateEventMapAction = safeAction(
	async ({ eventId, lat, lng, showMap }: Input) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		await verifyEventOwnership(eventId, session.user.id);

		await prisma.event.update({
			where: { id: eventId },
			data: { lat, lng, showMap },
		});

		return { success: true };
	},
);
