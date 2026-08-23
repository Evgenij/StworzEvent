"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";

export async function getEventAction(eventId: string) {
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
			street: true,
			streetNumber: true,
			lat: true,
			lng: true,
			showMap: true,
			organizationId: true,
			status: true,
			categories: {
				include: { category: true },
				take: 1,
			},
			eventIsOffline: true,
			onlineUrl: true,
			minPrice: true,
		},
	});

	console.log(event);

	if (!event) return null;

	return {
		...event,
		category: event.categories[0]?.category ?? "",
		street: event.street ?? "",
		streetNumber: event.streetNumber ?? "",
	};
}
