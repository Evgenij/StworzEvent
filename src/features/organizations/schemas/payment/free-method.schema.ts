import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const FreeMethodSchema = (t: (key: string) => string) =>
	z
		.object({
			organizationId: z.string(),
			method: z.literal(PaymentMethod.FREE),
			instructions: z.string().trim().max(2000).nullable().optional(),
		})
		.superRefine((data, ctx) => {
			// cross-field validation
		});

export type FreeMethodSchemaInput = z.infer<
	ReturnType<typeof FreeMethodSchema>
>;

export const FreeMethodSchemaServerSchema = FreeMethodSchema((key) => key);
