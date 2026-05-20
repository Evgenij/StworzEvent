import prisma from "@/lib/prisma";
import z from "zod";
import { BankTransferMethodSchema } from "../schemas/payment/bank-transfer-method.schema";
import { ExternalLinkMethodSchema } from "../schemas/payment/external-link-method.schema";
import { CashMethodSchema } from "../schemas/payment/cash-method.schema";
import { FreeMethodSchema } from "../schemas/payment/free-method.schema";

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
