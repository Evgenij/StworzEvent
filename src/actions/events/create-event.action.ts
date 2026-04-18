"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
	createEventServerSchema,
	type CreateEventInput,
} from "@/schemas/create-event.schema";
import { generateUniqueSlug } from "@/lib/slugify/generate-unique-slug";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import prisma from "@/lib/prisma";
import { EventStatus } from "@prisma/client";

export const createEventAction = safeAction(async (input: CreateEventInput) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	const data = createEventServerSchema.parse(input);

	const userId = session.user.id;

	const member = await prisma.organizationMember.findFirst({
		where: { userId },
	});
	if (!member) throw new ApiError(ErrorCode.FORBIDDEN, 403);

	const slug = await generateUniqueSlug(data.title);

	const event = await prisma.event.create({
		data: {
			title: data.title,
			slug,
			status: data.publishImmediately ? EventStatus.PUBLISHED : EventStatus.DRAFT,
			startsAt: new Date(data.startsAt),
			endsAt: data.endsAt ? new Date(data.endsAt) : null,
			location: data.location,
			street: data.street ?? null,
			coverImage: data.coverImage ?? null,
			payAtEntrance: data.payAtEntrance ?? false,
			organizationId: member.organizationId,
			tickets: {
				create: {
					name:
						data.ticketType === "free"
							? "Wejście bezpłatne"
							: "Bilet",
					price:
						data.ticketType === "paid"
							? (data.ticketPrice ?? 0) * 100
							: 0,
					quantity: data.ticketQuantity,
				},
			},
		},
		select: { id: true },
	});

	return { eventId: event.id };
});
