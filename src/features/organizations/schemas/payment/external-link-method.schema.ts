import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const ExternalLinkMethodSchema = (t: (key: string) => string) =>
	z
		.object({
			organizationId: z.string(),
			method: z.literal(PaymentMethod.EXTERNAL_LINK),
			paymentLink: z.string().trim().min(1).max(500),
			instructions: z.string().trim().max(2000).nullable().optional(),
		})
		.superRefine((data, ctx) => {
			// cross-field validation
		});

export type ExternalLinkMethodSchemaInput = z.infer<
	ReturnType<typeof ExternalLinkMethodSchema>
>;

export const ExternalLinkMethodSchemaServerSchema = ExternalLinkMethodSchema(
	(key) => key,
);
