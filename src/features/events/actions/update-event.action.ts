"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { EventStatus, Prisma } from "@prisma/client";

// тип description меняем:
type UpdateEventInput = {
	eventId: string;
	data: {
		startsAt?: string;
		endsAt?: string;
		location?: string;
		street?: string | null;
		streetNumber?: string | null;
		lat?: number | null;
		lng?: number | null;
		showMap?: boolean;
		categoryId?: string;
		status?: EventStatus;
		title?: string;
		description?: Prisma.InputJsonValue; // ← было Record<string, unknown>
		coverImage?: string | null;
		eventIsOffline?: boolean;
		onlineUrl?: string | null;
	};
};

export const updateEventAction = safeAction(
	async ({ eventId, data }: UpdateEventInput) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		// Проверяем что событие принадлежит организации пользователя
		const event = await prisma.event.findFirst({
			where: {
				id: eventId,
				organization: {
					organizationMembers: {
						some: { userId: session.user.id },
					},
				},
			},
			select: { id: true },
		});

		if (!event) throw new ApiError(ErrorCode.FORBIDDEN, 403);

		const { categoryId, startsAt, endsAt, ...rest } = data;

		await prisma.$transaction(async (tx) => {
			await tx.event.update({
				where: { id: eventId },
				data: {
					...rest,
					...(startsAt && { startsAt: new Date(startsAt) }),
					...(endsAt && { endsAt: new Date(endsAt) }),
				},
			});

			if (categoryId) {
				await tx.eventCategoryOnEvent.deleteMany({
					where: { eventId },
				});
				await tx.eventCategoryOnEvent.create({
					data: { eventId, categoryId },
				});
			}
		});

		return { success: true };
	},
);
