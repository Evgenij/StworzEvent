import type { Event, Organization, PaymentMethod } from "@prisma/client";

export type ResolvedPayment = {
	method: PaymentMethod | null;
	bankAccountNumber: string | null;
	bankAccountHolder: string | null;
	paymentLink: string | null;
	paymentInstructions: string | null;
	source: "event" | "organization" | "none";
};

export function resolvePayment(
	event: Pick<
		Event,
		| "paymentMethod"
		| "bankAccountNumber"
		| "bankAccountHolder"
		| "paymentLink"
		| "paymentInstructions"
	>,
	organization: Pick<
		Organization,
		| "defaultPaymentMethod"
		| "defaultBankAccountNumber"
		| "defaultBankAccountHolder"
		| "defaultPaymentLink"
		| "bankTransferInstructions"
	>,
): ResolvedPayment {
	if (event.paymentMethod) {
		return {
			method: event.paymentMethod,
			bankAccountNumber: event.bankAccountNumber,
			bankAccountHolder: event.bankAccountHolder,
			paymentLink: event.paymentLink,
			paymentInstructions: event.paymentInstructions,
			source: "event",
		};
	}
	if (organization.defaultPaymentMethod) {
		return {
			method: organization.defaultPaymentMethod,
			bankAccountNumber: organization.defaultBankAccountNumber,
			bankAccountHolder: organization.defaultBankAccountHolder,
			paymentLink: organization.defaultPaymentLink,
			paymentInstructions: organization.bankTransferInstructions,
			source: "organization",
		};
	}
	return {
		method: null,
		bankAccountNumber: null,
		bankAccountHolder: null,
		paymentLink: null,
		paymentInstructions: null,
		source: "none",
	};
}
