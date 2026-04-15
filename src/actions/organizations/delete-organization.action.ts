"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";

export const deleteOrganizationAction = safeAction(
	async (organizationId: string) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		const membership = await prisma.organizationMember.findUnique({
			where: {
				user_organization_unique: {
					userId: session.user.id,
					organizationId,
				},
			},
			select: { memberRole: true },
		});

		if (!membership || membership.memberRole !== "OWNER") {
			throw new ApiError(ErrorCode.FORBIDDEN, 403);
		}

		await prisma.organization.delete({ where: { id: organizationId } });

		return { success: true };
	},
);
