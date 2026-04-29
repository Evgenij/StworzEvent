// src/actions/agenda/upsert-agenda-item.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { verifyEventOwnership } from "@/lib/verify-ownership";
import { type AgendaItemInput } from "@/features/events/schemas/agenda-item.schema";

type Input = {
	eventId: string;
	itemId?: string; // есть — обновляем, нет — создаём
	data: AgendaItemInput;
};

export const upsertAgendaItemAction = safeAction(
	async ({ eventId, itemId, data }: Input) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		await verifyEventOwnership(eventId, session.user.id);

		if (itemId) {
			await prisma.eventAgendaItem.update({
				where: { id: itemId },
				data: {
					title: data.title,
					description: data.description ?? null,
					startsAt: new Date(data.startsAt),
					endsAt: data.endsAt ? new Date(data.endsAt) : null,
					location: data.location ?? null,
					speakerName: data.speakerName ?? null,
				},
			});
			return { itemId };
		}

		// Новый элемент — получаем max order
		const last = await prisma.eventAgendaItem.findFirst({
			where: { eventId },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const item = await prisma.eventAgendaItem.create({
			data: {
				eventId,
				title: data.title,
				description: data.description ?? null,
				startsAt: new Date(data.startsAt),
				endsAt: data.endsAt ? new Date(data.endsAt) : null,
				location: data.location ?? null,
				speakerName: data.speakerName ?? null,
				order: (last?.order ?? -1) + 1,
			},
		});

		return { itemId: item.id };
	},
);
