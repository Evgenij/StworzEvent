"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";
import { PaymentFields } from "@/shared/components/payment/payment-fields";
import {
	eventPaymentSchema,
	type EventPaymentInput,
} from "@/features/events/schemas/payment.schema";
import { updateEventPaymentAction } from "@/features/events/actions/update-event-payment.action";

type Props = {
	eventId: string;
	initialData?: Partial<EventPaymentInput>;
	onSuccess?: () => void;
};

export function EventPaymentForm({ eventId, initialData, onSuccess }: Props) {
	const t = useTranslations("EventWizard.payment");
	const tErrors = useTranslations("EventWizard.payment.errors");

	const form = useForm<EventPaymentInput>({
		resolver: zodResolver(eventPaymentSchema(tErrors)),
		defaultValues: {
			paymentMethod: initialData?.paymentMethod ?? null,
			bankAccountNumber: initialData?.bankAccountNumber ?? null,
			bankAccountHolder: initialData?.bankAccountHolder ?? null,
			paymentLink: initialData?.paymentLink ?? null,
			paymentInstructions: initialData?.paymentInstructions ?? null,
		},
	});

	const { handleSubmit, control, formState } = form;

	const onSubmit = async (data: EventPaymentInput) => {
		const result = await updateEventPaymentAction({ eventId, data });
		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(t("saved"));
		onSuccess?.();
	};

	const tFields = {
		method: t("method"),
		methods: {
			BANK_TRANSFER: t("methods.BANK_TRANSFER"),
			EXTERNAL_LINK: t("methods.EXTERNAL_LINK"),
			CASH_AT_ENTRANCE: t("methods.CASH_AT_ENTRANCE"),
			FREE: t("methods.FREE"),
		},
		methodHints: {
			BANK_TRANSFER: t("methodHints.BANK_TRANSFER"),
			EXTERNAL_LINK: t("methodHints.EXTERNAL_LINK"),
			CASH_AT_ENTRANCE: t("methodHints.CASH_AT_ENTRANCE"),
			FREE: t("methodHints.FREE"),
		},
		bankAccountNumber: t("bankAccountNumber"),
		bankAccountNumberPlaceholder: t("bankAccountNumberPlaceholder"),
		bankAccountHolder: t("bankAccountHolder"),
		bankAccountHolderPlaceholder: t("bankAccountHolderPlaceholder"),
		paymentLink: t("paymentLink"),
		paymentLinkPlaceholder: t("paymentLinkPlaceholder"),
		paymentInstructions: t("paymentInstructions"),
		paymentInstructionsPlaceholder: t("paymentInstructionsPlaceholder"),
		paymentInstructionsHint: t("paymentInstructionsHint"),
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			<Controller
				control={control}
				name="paymentMethod"
				render={({ field: methodField, fieldState: methodState }) => (
					<Controller
						control={control}
						name="bankAccountNumber"
						render={({ field: accNumField, fieldState: accNumState }) => (
							<Controller
								control={control}
								name="bankAccountHolder"
								render={({
									field: accHolderField,
									fieldState: accHolderState,
								}) => (
									<Controller
										control={control}
										name="paymentLink"
										render={({
											field: linkField,
											fieldState: linkState,
										}) => (
											<Controller
												control={control}
												name="paymentInstructions"
												render={({
													field: instrField,
													fieldState: instrState,
												}) => (
													<PaymentFields
														t={tFields}
														method={methodField.value ?? null}
														onMethodChange={methodField.onChange}
														methodError={
															methodState.error?.message
														}
														bankAccountNumber={
															accNumField.value ?? null
														}
														onBankAccountNumberChange={
															accNumField.onChange
														}
														bankAccountNumberError={
															accNumState.error?.message
														}
														bankAccountHolder={
															accHolderField.value ?? null
														}
														onBankAccountHolderChange={
															accHolderField.onChange
														}
														bankAccountHolderError={
															accHolderState.error?.message
														}
														paymentLink={linkField.value ?? null}
														onPaymentLinkChange={
															linkField.onChange
														}
														paymentLinkError={
															linkState.error?.message
														}
														paymentInstructions={
															instrField.value ?? null
														}
														onPaymentInstructionsChange={
															instrField.onChange
														}
														paymentInstructionsError={
															instrState.error?.message
														}
													/>
												)}
											/>
										)}
									/>
								)}
							/>
						)}
					/>
				)}
			/>

			<Button
				type="submit"
				disabled={formState.isSubmitting}
				className="w-fit"
			>
				{formState.isSubmitting && (
					<IconLoader className="size-4 animate-spin mr-2" />
				)}
				{t("save")}
			</Button>
		</form>
	);
}
