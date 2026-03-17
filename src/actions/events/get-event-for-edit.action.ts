"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";

export async function getEventForEdit(eventId: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	const event = await prisma.event.findFirst({
		where: {
			id: eventId,
			organization: {
				organizationMembers: {
					some: { userId: session.user.id },
				},
			},
		},
		select: {
			id: true,
			title: true,
			description: true,
			coverImage: true,
			startsAt: true,
			endsAt: true,
			location: true,
			address: true,
			status: true,
			categories: {
				select: { categoryId: true },
				take: 1,
			},
		},
	});

	if (!event) throw new ApiError(ErrorCode.FORBIDDEN, 403);

	return {
		...event,
		categoryId: event.categories[0]?.categoryId ?? "",
	};
}

export type EventForEdit = Awaited<ReturnType<typeof getEventForEdit>>;
