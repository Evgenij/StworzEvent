// src/actions/sections/delete-section.action.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { verifySectionOwnership } from "@/lib/verify-ownership";

export const deleteSectionAction = safeAction(async (sectionId: string) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	await verifySectionOwnership(sectionId, session.user.id);

	await prisma.eventSection.delete({ where: { id: sectionId } });

	return { success: true };
});
