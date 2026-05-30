import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
import { IconDeviceFloppy, IconLoader } from "@tabler/icons-react";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";

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
				<Controller
					control={control}
					name="instructions"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel htmlFor="freeInstructions">
								{t("free.instructions")}
							</FieldLabel>

							<InputGroup>
								<InputGroupTextarea
									{...field}
									id="freeInstructions"
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

export default FreeMethodForm;
