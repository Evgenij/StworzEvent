"use server";

import { ApiError } from "@/error/api-error";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ErrorCode } from "@/types/error-code";
import { PaymentMethod } from "@prisma/client";
import { headers } from "next/headers";
import { getMember } from "../../helpers/payment-methods";

export const togglePaymentMethodAction = safeAction(
	async ({
		organizationId,
		method,
		enabled,
	}: {
		organizationId: string;
		method: PaymentMethod;
		enabled: boolean;
	}) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		const member = await getMember(organizationId, session.user.id);
		if (!member) throw new ApiError(ErrorCode.FORBIDDEN, 403);

		const org = await prisma.organization.findUnique({
			where: { id: organizationId },
			select: { enabledPaymentMethods: true, defaultPaymentMethod: true },
		});

		const current = org?.enabledPaymentMethods ?? [];

		const next = enabled
			? ([...new Set([...current, method])] as PaymentMethod[])
			: current.filter((m) => m !== method);

		const isDefaultBeingDisabled =
			!enabled && org?.defaultPaymentMethod === method;

		await prisma.organization.update({
			where: { id: organizationId },
			data: {
				enabledPaymentMethods: { set: next },
				...(isDefaultBeingDisabled ? { defaultPaymentMethod: null } : {}),
			},
		});

		return { success: true };
	},
);
