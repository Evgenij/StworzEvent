import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const CashMethodSchema = (t: (key: string) => string) =>
	z
		.object({
			organizationId: z.string(),
			method: z.literal(PaymentMethod.CASH_AT_ENTRANCE),
			instructions: z.string().trim().max(2000).nullable().optional(),
		})
		.superRefine((data, ctx) => {
			// cross-field validation
		});

export type CashMethodSchemaInput = z.infer<
	ReturnType<typeof CashMethodSchema>
>;

export const CashMethodSchemaServerSchema = CashMethodSchema((key) => key);
