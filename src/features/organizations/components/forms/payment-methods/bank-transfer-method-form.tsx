import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateBankTransferMethodAction } from "@/features/organizations/actions/payment-methods/update-bank-transfer-method.action";
import {
	BankTransferMethodSchema,
	BankTransferMethodSchemaInput,
} from "@/features/organizations/schemas/payment/bank-transfer-method.schema";
import { cn } from "@/lib/utils";
import { FormRow } from "@/shared/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const BankTransferMethodForm = ({ className }: { className?: string }) => {
	const t = useTranslations("PaymentMethods");

	const form = useForm<BankTransferMethodSchemaInput>({
		resolver: zodResolver(
			BankTransferMethodSchema((key) => t(`bankTransfer.errors.${key}`)),
		),
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			organizationId: "",
			bankAccountNumber: "",
			bankAccountHolder: "",
			bankName: "",
			instructions: "",
		},
	});

	const { handleSubmit, control, register, formState } = form;

	const onSubmit: SubmitHandler<BankTransferMethodSchemaInput> = async (
		data,
	) => {
		const result = await updateBankTransferMethodAction(data);

		if (!result.success) {
			toast.error(t("errors.default"));
			return;
		}

		toast.success(t("saved"));

		// router.refresh();
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={cn(
				"bank-transfer-method-form flex flex-col gap-4",
				className,
			)}
		>
			<FormRow>
				<Field>
					<FieldLabel htmlFor="bankAccountNumber">
						{t("bankTransfer.bankAccountNumber")}
					</FieldLabel>
					<Controller
						control={control}
						name="bankAccountNumber"
						render={({ field }) => (
							<Input
								id="bankAccountNumber"
								{...field}
								placeholder={t(
									"bankTransfer.bankAccountNumberPlaceholder",
								)}
								aria-invalid={
									!!formState.errors.bankAccountNumber
								}
							/>
						)}
					/>

					<FieldError errors={[formState.errors.bankAccountNumber]} />
					<FieldDescription>
						{t("bankTransfer.bankAccountNumberHint")}
					</FieldDescription>
				</Field>
			</FormRow>
			<FormRow>
				<Field>
					<FieldLabel htmlFor="bankAccountHolder">
						{t("bankTransfer.bankAccountHolder")}
					</FieldLabel>
					<Controller
						control={control}
						name="bankAccountHolder"
						render={({ field }) => (
							<Input
								id="bankAccountHolder"
								{...field}
								placeholder={t(
									"bankTransfer.bankAccountHolderPlaceholder",
								)}
								aria-invalid={
									!!formState.errors.bankAccountHolder
								}
							/>
						)}
					/>
					<FieldError errors={[formState.errors.bankAccountHolder]} />
				</Field>
				<Field>
					<FieldLabel htmlFor="bankName">
						{t("bankTransfer.bankName")}
					</FieldLabel>
					<Controller
						control={control}
						name="bankName"
						render={({ field }) => (
							<Input
								id="bankName"
								{...field}
								placeholder={t(
									"bankTransfer.bankNamePlaceholder",
								)}
								aria-invalid={!!formState.errors.bankName}
							/>
						)}
					/>
					<FieldError errors={[formState.errors.bankName]} />
				</Field>
			</FormRow>
			<FormRow>
				<Field>
					<FieldLabel htmlFor="instructions">
						{t("bankTransfer.instructions")}
					</FieldLabel>
					<Controller
						control={control}
						name="instructions"
						render={({ field }) => (
							<Input
								id="instructions"
								{...field}
								placeholder={t(
									"bankTransfer.instructionsPlaceholder",
								)}
								aria-invalid={!!formState.errors.instructions}
							/>
						)}
					/>
					<FieldError errors={[formState.errors.instructions]} />
				</Field>
			</FormRow>
			<FormRow className="flex justify-end">
				<Button type="submit">{t("save")}</Button>
			</FormRow>
		</form>
	);
};

export default BankTransferMethodForm;
