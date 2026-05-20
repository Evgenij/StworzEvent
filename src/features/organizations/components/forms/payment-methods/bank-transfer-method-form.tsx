import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateBankTransferMethodAction } from "@/features/organizations/actions/payment-methods/update-bank-transfer-method.action";
import {
	BankTransferMethodSchema,
	BankTransferMethodSchemaInput,
} from "@/features/organizations/schemas/payment/bank-transfer-method.schema";
import { PaymentMethodData } from "@/features/organizations/components/payment-methods/payment-methods";
import { PaymentMethod } from "@prisma/client";
import { cn } from "@/lib/utils";
import { FormRow } from "@/shared/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PaymentMethodToggleItem from "../../payment-methods/payment-methods-toggle-item";

const BankTransferMethodForm = ({
	data,
	className,
	toggleMethod,
}: {
	organizationId: string;
	data: PaymentMethodData;
	className?: string;
	toggleMethod: (method: PaymentMethod, enabled: boolean) => Promise<void>;
}) => {
	const t = useTranslations("PaymentMethods");

	const form = useForm<BankTransferMethodSchemaInput>({
		resolver: zodResolver(
			BankTransferMethodSchema((key) => t(`bankTransfer.errors.${key}`)),
		),
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			organizationId: data.data.organizationId,
			bankAccountNumber: data.data.config.bankTransfer.bankAccountNumber ?? "",
			bankAccountHolder: data.data.config.bankTransfer.bankAccountHolder ?? "",
			bankName: data.data.config.bankTransfer.bankName ?? "",
			instructions: data.data.config.bankTransfer.instructions ?? "",
		},
	});

	const router = useRouter();
	const { handleSubmit, control, formState, trigger, reset } = form;

	const bankTransfer = data.data.config.bankTransfer;
	useEffect(() => {
		reset({
			organizationId: data.data.organizationId,
			bankAccountNumber: bankTransfer.bankAccountNumber ?? "",
			bankAccountHolder: bankTransfer.bankAccountHolder ?? "",
			bankName: bankTransfer.bankName ?? "",
			instructions: bankTransfer.instructions ?? "",
		});
	}, [
		data.data.organizationId,
		bankTransfer.bankAccountNumber,
		bankTransfer.bankAccountHolder,
		bankTransfer.bankName,
		bankTransfer.instructions,
	]);

	const handleToggle = async (method: PaymentMethod, enabled: boolean) => {
		if (enabled) {
			const isValid = await trigger();
			if (!isValid) throw new Error("validation_failed");
		}
		await toggleMethod(method, enabled);
	};

	const onSubmit: SubmitHandler<BankTransferMethodSchemaInput> = async (
		formData,
	) => {
		const result = await updateBankTransferMethodAction(formData);

		if (!result.success) {
			toast.error(t("errors.default"));
			return;
		}

		toast.success(t("saved"));
		router.refresh();
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={cn(
				"bank-transfer-method-form flex flex-col gap-4",
				className,
			)}
		>
			<PaymentMethodToggleItem
				method={data}
				toggleMethod={handleToggle}
			/>
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
							<Textarea
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
