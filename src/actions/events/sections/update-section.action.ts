// src/actions/sections/update-section.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { Prisma } from "@prisma/client";
import { verifySectionOwnership } from "@/lib/verify-ownership";
import { sectionSchema, type SectionInput } from "@/schemas/section.schema";

type Input = {
	sectionId: string;
	data: SectionInput;
};

export const updateSectionAction = safeAction(
	async ({ sectionId, data }: Input) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		await verifySectionOwnership(sectionId, session.user.id);

		// Парсим через схему — TypeScript теперь знает точный тип
		const parsed = sectionSchema.parse(data);

		await prisma.eventSection.update({
			where: { id: sectionId },
			data: {
				title: parsed.title ?? null,
				content: JSON.parse(
					JSON.stringify(parsed.content),
				) as Prisma.InputJsonValue,
			},
		});

		return { success: true };
	},
);
