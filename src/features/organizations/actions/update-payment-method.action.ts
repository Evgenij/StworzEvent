"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

const bankTransferSchema = z.object({
	organizationId: z.string(),
	method: z.literal("BANK_TRANSFER"),
	bankAccountNumber: z.string().trim().min(1).max(40),
	bankAccountHolder: z.string().trim().min(1).max(120),
	bankName: z.string().trim().max(120).nullable().optional(),
	instructions: z.string().trim().max(2000).nullable().optional(),
});

const externalLinkSchema = z.object({
	organizationId: z.string(),
	method: z.literal("EXTERNAL_LINK"),
	paymentLink: z.string().trim().min(1).max(500),
	instructions: z.string().trim().max(2000).nullable().optional(),
});

const cashSchema = z.object({
	organizationId: z.string(),
	method: z.literal("CASH_AT_ENTRANCE"),
	instructions: z.string().trim().max(2000).nullable().optional(),
});

const freeSchema = z.object({
	organizationId: z.string(),
	method: z.literal("FREE"),
	instructions: z.string().trim().max(2000).nullable().optional(),
});

const inputSchema = z.discriminatedUnion("method", [
	bankTransferSchema,
	externalLinkSchema,
	cashSchema,
	freeSchema,
]);

type Input = z.infer<typeof inputSchema>;

async function getMember(organizationId: string, userId: string) {
	return prisma.organizationMember.findFirst({
		where: {
			organizationId,
			userId,
			memberRole: { in: ["OWNER", "MANAGER", "FINANCE"] },
		},
		select: { id: true },
	});
}

export const updatePaymentMethodAction = safeAction(async (input: Input) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	const member = await getMember(input.organizationId, session.user.id);
	if (!member) throw new ApiError(ErrorCode.FORBIDDEN, 403);

	const parsed = inputSchema.parse(input);

	if (parsed.method === "BANK_TRANSFER") {
		await prisma.organization.update({
			where: { id: parsed.organizationId },
			data: {
				defaultBankAccountNumber: parsed.bankAccountNumber,
				defaultBankAccountHolder: parsed.bankAccountHolder,
				defaultBankName: parsed.bankName ?? null,
				bankTransferInstructions: parsed.instructions ?? null,
			},
		});
	} else if (parsed.method === "EXTERNAL_LINK") {
		await prisma.organization.update({
			where: { id: parsed.organizationId },
			data: {
				defaultPaymentLink: parsed.paymentLink,
				externalLinkInstructions: parsed.instructions ?? null,
			},
		});
	} else if (parsed.method === "CASH_AT_ENTRANCE") {
		await prisma.organization.update({
			where: { id: parsed.organizationId },
			data: {
				cashAtEntranceInstructions: parsed.instructions ?? null,
			},
		});
	} else if (parsed.method === "FREE") {
		await prisma.organization.update({
			where: { id: parsed.organizationId },
			data: {
				freeInstructions: parsed.instructions ?? null,
			},
		});
	}

	return { success: true };
});

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
