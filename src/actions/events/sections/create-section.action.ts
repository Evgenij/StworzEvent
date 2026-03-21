// src/actions/sections/create-section.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { type SectionInput } from "@/schemas/section.schema";
import { Prisma } from "@prisma/client";
import { verifyEventOwnership } from "@/lib/verify-ownership";

type Input = {
	eventId: string;
	data: SectionInput;
};

export const createSectionAction = safeAction(
	async ({ eventId, data }: Input) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		await verifyEventOwnership(eventId, session.user.id);

		// Получаем максимальный order
		const last = await prisma.eventSection.findFirst({
			where: { eventId },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const section = await prisma.eventSection.create({
			data: {
				eventId,
				type: data.type,
				title: data.title ?? null,
				content: JSON.parse(
					JSON.stringify(data.content),
				) as Prisma.InputJsonValue,
				order: (last?.order ?? -1) + 1,
			},
		});

		return { sectionId: section.id };
	},
);
