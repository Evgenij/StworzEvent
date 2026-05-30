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
import {
	InputGroup,
	InputGroupIMask,
	InputGroupInput,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { IconDeviceFloppy, IconLoader } from "@tabler/icons-react";

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
		reValidateMode: "onBlur",
		defaultValues: {
			organizationId: data.data.organizationId,
			bankAccountNumber:
				data.data.config.bankTransfer.bankAccountNumber ?? "",
			bankAccountHolder:
				data.data.config.bankTransfer.bankAccountHolder ?? "",
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
				<Controller
					control={control}
					name="bankAccountNumber"
					render={({ field, fieldState }) => (
						// <Input
						// 	id="bankAccountNumber"
						// 	{...field}
						// 	placeholder={t(
						// 		"bankTransfer.bankAccountNumberPlaceholder",
						// 	)}
						// 	aria-invalid={!!formState.errors.bankAccountNumber}
						// />
						<Field>
							<FieldLabel>
								{t("bankTransfer.bankAccountNumber")}
							</FieldLabel>
							<InputGroup>
								<InputGroupIMask
									mask="PL00 0000 0000 0000 0000 0000 0000"
									value={field.value ?? ""}
									onAccept={(value): void =>
										field.onChange(
											value.replaceAll(" ", ""),
										)
									}
									placeholder={t(
										"bankTransfer.bankAccountNumberPlaceholder",
									)}
									inputRef={field.ref}
									aria-invalid={fieldState.invalid}
									onBlur={field.onBlur}
								/>
							</InputGroup>

							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : (
								<FieldDescription>
									{t("bankTransfer.bankAccountNumberHint")}
								</FieldDescription>
							)}

							{/* {fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)} */}
						</Field>
					)}
				/>
				{/* <Field>
					<FieldLabel htmlFor="bankAccountNumber">
						{t("bankTransfer.bankAccountNumber")}
					</FieldLabel>
					<Input
						id="bankAccountNumber"
						{...field}
						placeholder={t(
							"bankTransfer.bankAccountNumberPlaceholder",
						)}
						aria-invalid={!!formState.errors.bankAccountNumber}
					/>

					<FieldError errors={[formState.errors.bankAccountNumber]} />
					<FieldDescription>
						{t("bankTransfer.bankAccountNumberHint")}
					</FieldDescription>
				</Field> */}
			</FormRow>
			<FormRow>
				<Controller
					control={control}
					name="bankAccountHolder"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel htmlFor="bankAccountHolder">
								{t("bankTransfer.bankAccountHolder")}
							</FieldLabel>
							<InputGroup>
								<InputGroupInput
									id="bankAccountHolder"
									{...field}
									type="text"
									placeholder={t(
										"bankTransfer.bankAccountHolderPlaceholder",
									)}
									aria-invalid={fieldState.invalid}
								/>
							</InputGroup>

							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
				<Controller
					control={control}
					name="bankName"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel htmlFor="bankName">
								{t("bankTransfer.bankName")}
							</FieldLabel>
							<InputGroup>
								<InputGroupInput
									id="bankName"
									{...field}
									type="text"
									placeholder={t(
										"bankTransfer.bankNamePlaceholder",
									)}
									aria-invalid={fieldState.invalid}
								/>
							</InputGroup>

							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
			</FormRow>
			<FormRow>
				<Controller
					control={control}
					name="instructions"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel htmlFor="instructions">
								{t("bankTransfer.instructions")}
							</FieldLabel>
							<InputGroup>
								<InputGroupTextarea
									id="instructions"
									{...field}
									placeholder={t(
										"bankTransfer.instructionsPlaceholder",
									)}
									aria-invalid={fieldState.invalid}
								/>
							</InputGroup>

							{/* <Controller
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
					/> */}
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
			</FormRow>
			<FormRow className="flex justify-end">
				<Button
					type="submit"
					disabled={formState.isSubmitting}
					className="w-fit"
				>
					{formState.isSubmitting ? (
						<>
							<IconLoader className="size-4 animate-spin" />
							{t("saving")}
						</>
					) : (
						<>
							<IconDeviceFloppy className="size-4" />
							{t("save")}
						</>
					)}
				</Button>
			</FormRow>
		</form>
	);
};

export default BankTransferMethodForm;
