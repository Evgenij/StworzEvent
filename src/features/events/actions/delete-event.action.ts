"use server";

import { ApiError } from "@/error/api-error";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ErrorCode } from "@/types/error-code";
import { EventStatus } from "@prisma/client";
import { headers } from "next/headers";

export const deleteEventAction = safeAction(
	async ({ eventId }: { eventId: string }) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		const event = await prisma.event.findFirst({
			where: {
				id: eventId,
				status: EventStatus.DRAFT,
				organization: {
					organizationMembers: {
						some: { userId: session.user.id },
					},
				},
			},
			select: { id: true },
		});

		if (!event) throw new ApiError(ErrorCode.FORBIDDEN, 403);

		await prisma.event.delete({ where: { id: eventId } });

		return { success: true };
	},
);
