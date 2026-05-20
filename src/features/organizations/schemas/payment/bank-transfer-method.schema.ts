import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const BankTransferMethodSchema = (t: (key: string) => string) =>
	z
		.object({
			organizationId: z.string(),
			bankAccountNumber: z.string().trim().length(28, t("invalidIban")),
			bankAccountHolder: z
				.string()
				.trim()
				.min(2, t("bankAccountHolderMin"))
				.max(120, t("bankAccountHolderMax")),
			bankName: z
				.string()
				.trim()
				.min(2, t("bankNameMin"))
				.max(120, t("bankNameMax"))
				.optional(),
			instructions: z.string().trim().max(2000).optional(),
		})
		.superRefine((data, ctx) => {
			// cross-field validation
		});

export type BankTransferMethodSchemaInput = z.infer<
	ReturnType<typeof BankTransferMethodSchema>
>;

export const BankTransferMethodSchemaServerSchema = BankTransferMethodSchema(
	(key) => key,
);
