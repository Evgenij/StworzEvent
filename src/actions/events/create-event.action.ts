// src/actions/events/create-event.action.ts
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
	createEventSchema,
	type CreateEventInput,
} from "@/schemas/create-event.schema";
import { generateUniqueSlug } from "@/lib/slugify/generate-unique-slug";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import prisma from "@/lib/prisma";

export const createEventAction = safeAction(async (input: CreateEventInput) => {
	const session = await auth.api.getSession({ headers: await headers() });
	console.log(session);

	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	const data = createEventSchema((key) => key).parse(input);

	console.log(data);

	// 🔒 Проверяем membership
	const membership = await prisma.organizationMember.findUnique({
		where: {
			user_organization_unique: {
				userId: session.user.id,
				organizationId: data.organizationId,
			},
		},
	});

	if (!membership) throw new ApiError(ErrorCode.FORBIDDEN, 403);

	const slug = await generateUniqueSlug(data.title);

	const event = await prisma.event.create({
		data: {
			title: data.title,
			description: data.description
				? JSON.parse(JSON.stringify(data.description))
				: undefined,
			coverImage: data.coverImage || null,
			status: data.status,
			slug,
			organizationId: data.organizationId,
			startsAt: new Date(data.startsAt),
			endsAt: data.endsAt ? new Date(data.endsAt) : null,
			location: data.location ?? null,
			street: data.eventIsOffline ? null : (data.street ?? null),
			streetNumber: data.eventIsOffline
				? null
				: (data.streetNumber ?? null),
			lat: data.lat ?? null,
			lng: data.lng ?? null,
			showMap: data.onlineUrl ? false : data.showMap,
			eventIsOffline: data.eventIsOffline,
			onlineUrl: data.onlineUrl ?? null,
		},
		select: { id: true, slug: true },
	});

	// категория отдельно
	if (data.categoryId) {
		await prisma.eventCategoryOnEvent.create({
			data: { eventId: event.id, categoryId: data.categoryId },
		});
	}

	return { eventId: event.id };
});
