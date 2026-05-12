"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";

type Input = { organizationId: string; logoUrl: string | null };

export const updateOrganizationLogoAction = safeAction(
	async ({ organizationId, logoUrl }: Input) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		const member = await prisma.organizationMember.findFirst({
			where: {
				organizationId,
				userId: session.user.id,
				memberRole: { in: ["OWNER", "MANAGER"] },
			},
			select: { id: true },
		});
		if (!member) throw new ApiError(ErrorCode.FORBIDDEN, 403);

		await prisma.organization.update({
			where: { id: organizationId },
			data: { logo: logoUrl },
		});

		return { success: true };
	},
);
