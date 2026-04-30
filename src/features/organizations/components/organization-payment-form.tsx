"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";
import { PaymentFields } from "@/shared/components/payment/payment-fields";
import {
	organizationPaymentSchema,
	type OrganizationPaymentInput,
} from "@/features/organizations/schemas/payment.schema";
import { updateOrganizationPaymentAction } from "@/features/organizations/actions/update-organization-payment.action";

type Props = {
	organizationId: string;
	initialData?: Partial<OrganizationPaymentInput>;
};

export function OrganizationPaymentForm({
	organizationId,
	initialData,
}: Props) {
	const t = useTranslations("EventWizard.payment");
	const tErrors = useTranslations("EventWizard.payment.errors");

	const form = useForm<OrganizationPaymentInput>({
		resolver: zodResolver(organizationPaymentSchema(tErrors)),
		defaultValues: {
			defaultPaymentMethod: initialData?.defaultPaymentMethod ?? null,
			defaultBankAccountNumber:
				initialData?.defaultBankAccountNumber ?? null,
			defaultBankAccountHolder:
				initialData?.defaultBankAccountHolder ?? null,
			defaultPaymentLink: initialData?.defaultPaymentLink ?? null,
			defaultPaymentInstructions:
				initialData?.defaultPaymentInstructions ?? null,
		},
	});

	const { handleSubmit, control, formState } = form;

	const onSubmit = async (data: OrganizationPaymentInput) => {
		const result = await updateOrganizationPaymentAction({
			organizationId,
			data,
		});
		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(t("saved"));
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
				name="defaultPaymentMethod"
				render={({ field: methodField, fieldState: methodState }) => (
					<Controller
						control={control}
						name="defaultBankAccountNumber"
						render={({ field: accNumField, fieldState: accNumState }) => (
							<Controller
								control={control}
								name="defaultBankAccountHolder"
								render={({
									field: accHolderField,
									fieldState: accHolderState,
								}) => (
									<Controller
										control={control}
										name="defaultPaymentLink"
										render={({
											field: linkField,
											fieldState: linkState,
										}) => (
											<Controller
												control={control}
												name="defaultPaymentInstructions"
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
