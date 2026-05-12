import { z } from "zod";
import { PaymentMethod } from "@prisma/client";
import {
	paymentFieldsShape,
	refinePayment,
} from "@/lib/payment/payment-fields";

export const organizationPaymentSchema = (t: (key: string) => string) =>
	z
		.object({
			defaultPaymentMethod: z.enum(PaymentMethod).nullable().optional(),
			defaultBankAccountNumber: paymentFieldsShape(t).bankAccountNumber,
			defaultBankAccountHolder: paymentFieldsShape(t).bankAccountHolder,
			defaultPaymentLink: paymentFieldsShape(t).paymentLink,
			defaultPaymentInstructions:
				paymentFieldsShape(t).paymentInstructions,
		})
		.superRefine((data, ctx) => {
			refinePayment(
				{
					paymentMethod: data.defaultPaymentMethod ?? null,
					bankAccountNumber: data.defaultBankAccountNumber ?? null,
					bankAccountHolder: data.defaultBankAccountHolder ?? null,
					paymentLink: data.defaultPaymentLink ?? null,
				},
				ctx,
				t,
			);
		});

export type OrganizationPaymentInput = z.infer<
	ReturnType<typeof organizationPaymentSchema>
>;

export type OrganizationPaymentFormValues = z.input<
	ReturnType<typeof organizationPaymentSchema>
>;

export const organizationPaymentServerSchema = organizationPaymentSchema(
	(k) => k,
);
