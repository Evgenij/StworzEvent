// src/lib/verify-ownership.ts
import prisma from "@/lib/prisma";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";

export async function verifyEventOwnership(eventId: string, userId: string) {
	const event = await prisma.event.findFirst({
		where: {
			id: eventId,
			organization: {
				organizationMembers: { some: { userId, memberRole: "OWNER" } },
			},
		},
		select: { id: true },
	});
	if (!event) throw new ApiError(ErrorCode.FORBIDDEN, 403);
	return event;
}

export async function verifySectionOwnership(
	sectionId: string,
	userId: string,
) {
	const section = await prisma.eventSection.findFirst({
		where: {
			id: sectionId,
			event: {
				organization: {
					organizationMembers: { some: { userId, memberRole: "OWNER" } },
				},
			},
		},
		select: { id: true },
	});
	if (!section) throw new ApiError(ErrorCode.FORBIDDEN, 403);
	return section;
}

export async function verifyAgendaItemOwnership(
	itemId: string,
	userId: string,
) {
	const item = await prisma.eventAgendaItem.findFirst({
		where: {
			id: itemId,
			event: {
				organization: {
					organizationMembers: { some: { userId, memberRole: "OWNER" } },
				},
			},
		},
		select: { id: true },
	});
	if (!item) throw new ApiError(ErrorCode.FORBIDDEN, 403);
	return item;
}

export async function verifyFaqItemOwnership(itemId: string, userId: string) {
	const item = await prisma.eventFaq.findFirst({
		where: {
			id: itemId,
			event: {
				organization: {
					organizationMembers: { some: { userId, memberRole: "OWNER" } },
				},
			},
		},
		select: { id: true },
	});
	if (!item) throw new ApiError(ErrorCode.FORBIDDEN, 403);
	return item;
}
