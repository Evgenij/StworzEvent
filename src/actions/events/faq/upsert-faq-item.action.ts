// src/actions/faq/upsert-faq-item.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { verifyEventOwnership } from "@/lib/verify-ownership";
import { type FaqItemInput } from "@/schemas/faq-item.schema";

type Input = {
	eventId: string;
	itemId?: string;
	data: FaqItemInput;
};

export const upsertFaqItemAction = safeAction(
	async ({ eventId, itemId, data }: Input) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		await verifyEventOwnership(eventId, session.user.id);

		if (itemId) {
			await prisma.eventFaq.update({
				where: { id: itemId },
				data: { question: data.question, answer: data.answer },
			});
			return { itemId };
		}

		const last = await prisma.eventFaq.findFirst({
			where: { eventId },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const item = await prisma.eventFaq.create({
			data: {
				eventId,
				question: data.question,
				answer: data.answer,
				order: (last?.order ?? -1) + 1,
			},
		});

		return { itemId: item.id };
	},
);
