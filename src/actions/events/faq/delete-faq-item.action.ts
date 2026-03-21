// src/actions/faq/delete-faq-item.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { verifyFaqItemOwnership } from "@/lib/verify-ownership";

export const deleteFaqItemAction = safeAction(async (itemId: string) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	await verifyFaqItemOwnership(itemId, session.user.id);

	const item = await prisma.eventFaq.findFirst({
		where: {
			id: itemId,
			event: {
				organization: {
					organizationMembers: { some: { userId: session.user.id } },
				},
			},
		},
		select: { id: true },
	});

	if (!item) throw new ApiError(ErrorCode.FORBIDDEN, 403);

	await prisma.eventFaq.delete({ where: { id: itemId } });

	return { success: true };
});
