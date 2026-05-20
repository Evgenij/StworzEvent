"use server";

import { ApiError } from "@/error/api-error";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { headers } from "next/headers";
import { getMember } from "../../helpers/payment-methods";
import { ErrorCode } from "@/types/error-code";
import { CashMethodSchemaInput } from "../../schemas/payment/cash-method.schema";

export const updateCashAtEntranceMethodAction = safeAction(
	async (data: CashMethodSchemaInput) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		const member = await getMember(data.organizationId, session.user.id);
		if (!member) throw new ApiError(ErrorCode.FORBIDDEN, 403);

		await prisma.organization.update({
			where: { id: data.organizationId },
			data: {
				cashAtEntranceInstructions: data.instructions ?? null,
			},
		});

		return { success: true };
	},
);
