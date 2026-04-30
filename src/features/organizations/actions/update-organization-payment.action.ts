"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import {
	organizationPaymentServerSchema,
	type OrganizationPaymentInput,
} from "@/features/organizations/schemas/payment.schema";

type Input = { organizationId: string; data: OrganizationPaymentInput };

export const updateOrganizationPaymentAction = safeAction(
	async ({ organizationId, data }: Input) => {
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

		const parsed = organizationPaymentServerSchema.parse(data);

		await prisma.organization.update({
			where: { id: organizationId },
			data: {
				defaultPaymentMethod: parsed.defaultPaymentMethod ?? null,
				defaultBankAccountNumber:
					parsed.defaultBankAccountNumber ?? null,
				defaultBankAccountHolder:
					parsed.defaultBankAccountHolder ?? null,
				defaultPaymentLink: parsed.defaultPaymentLink ?? null,
				defaultPaymentInstructions:
					parsed.defaultPaymentInstructions ?? null,
			},
		});

		return { success: true };
	},
);
