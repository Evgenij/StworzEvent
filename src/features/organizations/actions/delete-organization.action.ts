"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { UserRole } from "@prisma/client";

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

		// Downgrade role to USER only if user has no other organizations
		const remaining = await prisma.organizationMember.count({
			where: { userId: session.user.id },
		});

		if (remaining === 0) {
			await prisma.user.update({
				where: { id: session.user.id },
				data: { role: UserRole.USER },
			});
		}

		return { success: true, isLastOrganization: remaining === 0 };
	},
);
