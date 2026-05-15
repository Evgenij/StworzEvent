"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
	organizationId: z.string(),
	method: z.enum(PaymentMethod).nullable(),
});

export const setDefaultPaymentMethodAction = safeAction(
	async ({ organizationId, method }: z.infer<typeof schema>) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		const member = await prisma.organizationMember.findFirst({
			where: {
				organizationId,
				userId: session.user.id,
				memberRole: { in: ["OWNER", "MANAGER", "FINANCE"] },
			},
			select: { id: true },
		});
		if (!member) throw new ApiError(ErrorCode.FORBIDDEN, 403);

		await prisma.organization.update({
			where: { id: organizationId },
			data: { defaultPaymentMethod: method },
		});

		return { success: true };
	},
);
