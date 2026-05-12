import { z } from "zod";
import { PaymentMethod } from "@prisma/client";
import { isValidPolishIban } from "@/lib/payment/iban";

export const paymentFieldsShape = (t: (key: string) => string) => ({
	paymentMethod: z.enum(PaymentMethod).nullable(),
	bankAccountNumber: z
		.string()
		.trim()
		.max(40, t("max40"))
		.nullable()
		.optional()
		.transform((v) => (v === "" ? null : (v ?? null))),
	bankAccountHolder: z
		.string()
		.trim()
		.max(120, t("max120"))
		.nullable()
		.optional()
		.transform((v) => (v === "" ? null : (v ?? null))),
	paymentLink: z
		.string()
		.trim()
		.max(500, t("max500"))
		.refine((v) => URL.canParse(v), { message: t("invalidUrl") })
		.nullable()
		.optional()
		.or(z.literal("").transform(() => null)),
	paymentInstructions: z
		.string()
		.trim()
		.max(2000, t("max2000"))
		.nullable()
		.optional()
		.transform((v) => (v === "" ? null : (v ?? null))),
});

export const refinePayment = (
	data: {
		paymentMethod: PaymentMethod | null;
		bankAccountNumber?: string | null;
		bankAccountHolder?: string | null;
		paymentLink?: string | null;
	},
	ctx: z.RefinementCtx,
	t: (k: string) => string,
) => {
	if (data.paymentMethod === "BANK_TRANSFER") {
		if (!data.bankAccountNumber) {
			ctx.addIssue({
				code: "custom",
				path: ["bankAccountNumber"],
				message: t("required"),
			});
		} else if (!isValidPolishIban(data.bankAccountNumber)) {
			ctx.addIssue({
				code: "custom",
				path: ["bankAccountNumber"],
				message: t("invalidIban"),
			});
		}
		if (!data.bankAccountHolder) {
			ctx.addIssue({
				code: "custom",
				path: ["bankAccountHolder"],
				message: t("required"),
			});
		}
	}
	if (data.paymentMethod === "EXTERNAL_LINK" && !data.paymentLink) {
		ctx.addIssue({
			code: "custom",
			path: ["paymentLink"],
			message: t("required"),
		});
	}
};
