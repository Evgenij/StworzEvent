import prisma from "@/lib/prisma";
import z from "zod";
import { BankTransferMethodSchema } from "../schemas/payment/bank-transfer-method.schema";
import { ExternalLinkMethodSchema } from "../schemas/payment/external-link-method.schema";
import { CashMethodSchema } from "../schemas/payment/cash-method.schema";
import { FreeMethodSchema } from "../schemas/payment/free-method.schema";
import { safeAction } from "@/lib/safe-action";
import { PaymentMethod } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { headers } from "next/headers";

const inputDataSchema = z.discriminatedUnion("method", [
	BankTransferMethodSchema((key) => key),
	ExternalLinkMethodSchema((key) => key),
	CashMethodSchema((key) => key),
	FreeMethodSchema((key) => key),
]);

export type Input = z.infer<typeof inputDataSchema>;

export async function getMember(organizationId: string, userId: string) {
	return prisma.organizationMember.findFirst({
		where: {
			organizationId,
			userId,
			memberRole: { in: ["OWNER", "MANAGER", "FINANCE"] },
		},
		select: { id: true },
	});
}

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
				...(isDefaultBeingDisabled
					? { defaultPaymentMethod: null }
					: {}),
			},
		});

		return { success: true };
	},
);
