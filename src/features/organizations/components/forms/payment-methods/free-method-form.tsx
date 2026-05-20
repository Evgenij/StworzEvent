import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { updateFreeMethodAction } from "@/features/organizations/actions/payment-methods/update-free-method.action";
import {
	FreeMethodSchema,
	FreeMethodSchemaInput,
} from "@/features/organizations/schemas/payment/free-method.schema";
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

const FreeMethodForm = ({
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

	const form = useForm<FreeMethodSchemaInput>({
		resolver: zodResolver(
			FreeMethodSchema((key) => t(`free.errors.${key}`)),
		),
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			organizationId: data.data.organizationId,
			method: PaymentMethod.FREE,
			instructions: data.data.config.free.instructions ?? "",
		},
	});

	const router = useRouter();
	const { handleSubmit, control, formState, reset } = form;

	const free = data.data.config.free;
	useEffect(() => {
		reset({
			organizationId: data.data.organizationId,
			method: PaymentMethod.FREE,
			instructions: free.instructions ?? "",
		});
	}, [data.data.organizationId, free.instructions]);

	const onSubmit: SubmitHandler<FreeMethodSchemaInput> = async (formData) => {
		const result = await updateFreeMethodAction(formData);

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
			className={cn("free-method-form flex flex-col gap-4", className)}
		>
			<PaymentMethodToggleItem
				method={data}
				toggleMethod={toggleMethod}
			/>
			<FormRow>
				<Field>
					<FieldLabel htmlFor="freeInstructions">
						{t("free.instructions")}
					</FieldLabel>
					<Controller
						control={control}
						name="instructions"
						render={({ field }) => (
							<Textarea
								id="freeInstructions"
								{...field}
								value={field.value ?? ""}
								placeholder={t("free.instructionsPlaceholder")}
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

export default FreeMethodForm;
