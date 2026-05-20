import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateExternalLinkMethodAction } from "@/features/organizations/actions/payment-methods/update-external-link-method.action";
import {
	ExternalLinkMethodSchema,
	ExternalLinkMethodSchemaInput,
} from "@/features/organizations/schemas/payment/external-link-method.schema";
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

const ExternalLinkMethodForm = ({
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

	const form = useForm<ExternalLinkMethodSchemaInput>({
		resolver: zodResolver(
			ExternalLinkMethodSchema((key) => t(`externalLink.errors.${key}`)),
		),
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			organizationId: data.data.organizationId,
			method: PaymentMethod.EXTERNAL_LINK,
			paymentLink: data.data.config.externalLink.paymentLink ?? "",
			instructions: data.data.config.externalLink.instructions ?? "",
		},
	});

	const router = useRouter();
	const { handleSubmit, control, formState, trigger, reset } = form;

	const externalLink = data.data.config.externalLink;
	useEffect(() => {
		reset({
			organizationId: data.data.organizationId,
			method: PaymentMethod.EXTERNAL_LINK,
			paymentLink: externalLink.paymentLink ?? "",
			instructions: externalLink.instructions ?? "",
		});
	}, [
		data.data.organizationId,
		externalLink.paymentLink,
		externalLink.instructions,
	]);

	const handleToggle = async (method: PaymentMethod, enabled: boolean) => {
		if (enabled) {
			const isValid = await trigger();
			if (!isValid) throw new Error("validation_failed");
		}
		await toggleMethod(method, enabled);
	};

	const onSubmit: SubmitHandler<ExternalLinkMethodSchemaInput> = async (
		formData,
	) => {
		const result = await updateExternalLinkMethodAction(formData);

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
				"external-link-method-form flex flex-col gap-4",
				className,
			)}
		>
			<PaymentMethodToggleItem
				method={data}
				toggleMethod={handleToggle}
			/>
			<FormRow>
				<Field>
					<FieldLabel htmlFor="paymentLink">
						{t("externalLink.paymentLink")}
					</FieldLabel>
					<Controller
						control={control}
						name="paymentLink"
						render={({ field }) => (
							<Input
								id="paymentLink"
								{...field}
								placeholder={t("externalLink.paymentLinkPlaceholder")}
								aria-invalid={!!formState.errors.paymentLink}
							/>
						)}
					/>
					<FieldError errors={[formState.errors.paymentLink]} />
					<FieldDescription>
						{t("externalLink.paymentLinkHint")}
					</FieldDescription>
				</Field>
			</FormRow>
			<FormRow>
				<Field>
					<FieldLabel htmlFor="externalLinkInstructions">
						{t("externalLink.instructions")}
					</FieldLabel>
					<Controller
						control={control}
						name="instructions"
						render={({ field }) => (
							<Textarea
								id="externalLinkInstructions"
								{...field}
								value={field.value ?? ""}
								placeholder={t(
									"externalLink.instructionsPlaceholder",
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

export default ExternalLinkMethodForm;
