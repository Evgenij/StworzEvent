// src/actions/sections/reorder-sections.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { verifyEventOwnership } from "@/lib/verify-ownership";

type Input = {
	eventId: string;
	orderedIds: string[];
};

export const reorderSectionsAction = safeAction(
	async ({ eventId, orderedIds }: Input) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		await verifyEventOwnership(eventId, session.user.id);

		await prisma.$transaction(
			orderedIds.map((id, index) =>
				prisma.eventSection.update({
					where: { id },
					data: { order: index },
				}),
			),
		);

		return { success: true };
	},
);
