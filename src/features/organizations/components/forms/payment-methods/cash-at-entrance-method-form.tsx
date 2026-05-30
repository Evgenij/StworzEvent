import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { updateCashAtEntranceMethodAction } from "@/features/organizations/actions/payment-methods/update-cash-at-entrance-method.action";
import {
	CashMethodSchema,
	CashMethodSchemaInput,
} from "@/features/organizations/schemas/payment/cash-method.schema";
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
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { IconDeviceFloppy, IconLoader } from "@tabler/icons-react";

const CashAtEntranceMethodForm = ({
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

	const form = useForm<CashMethodSchemaInput>({
		resolver: zodResolver(
			CashMethodSchema((key) => t(`cashAtEntrance.errors.${key}`)),
		),
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			organizationId: data.data.organizationId,
			method: PaymentMethod.CASH_AT_ENTRANCE,
			instructions: data.data.config.cashAtEntrance.instructions ?? "",
		},
	});

	const router = useRouter();
	const { handleSubmit, control, formState, trigger, reset } = form;

	const cashAtEntrance = data.data.config.cashAtEntrance;
	useEffect(() => {
		reset({
			organizationId: data.data.organizationId,
			method: PaymentMethod.CASH_AT_ENTRANCE,
			instructions: cashAtEntrance.instructions ?? "",
		});
	}, [data.data.organizationId, cashAtEntrance.instructions]);

	const handleToggle = async (method: PaymentMethod, enabled: boolean) => {
		if (enabled) {
			const isValid = await trigger();
			if (!isValid) throw new Error("validation_failed");
		}
		await toggleMethod(method, enabled);
	};

	const onSubmit: SubmitHandler<CashMethodSchemaInput> = async (formData) => {
		const result = await updateCashAtEntranceMethodAction(formData);

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
				"cash-at-entrance-method-form flex flex-col gap-4",
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
					name="instructions"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel htmlFor="cashInstructions">
								{t("cashAtEntrance.instructions")}
							</FieldLabel>
							<InputGroup>
								<InputGroupTextarea
									{...field}
									id="cashInstructions"
									value={field.value ?? ""}
									placeholder={t(
										"cashAtEntrance.instructionsPlaceholder",
									)}
									aria-invalid={fieldState.invalid}
								/>
							</InputGroup>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}

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

export default CashAtEntranceMethodForm;
