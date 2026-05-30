"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { LegalForm, VatStatus, EmployeeCountRange } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import {
	IconBrandStackshare,
	IconClipboardList,
	IconDeviceFloppy,
	IconFileDigit,
	IconFileInfo,
	IconLoader,
	IconReceiptDollar,
	IconWorld,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
	organizationGeneralSchema,
	type OrganizationGeneralInput,
	type OrganizationGeneralFormValues,
} from "@/features/organizations/schemas/organization-general.schema";
import { updateOrganizationGeneralAction } from "@/features/organizations/actions/update-organization-general.action";
import { FormGroup, FormRow } from "@/shared/components/form";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupIMask,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";

type Props = {
	organizationId: string;
	initialData: Partial<OrganizationGeneralFormValues>;
};

const LEGAL_FORMS = Object.values(LegalForm) as LegalForm[];
const VAT_STATUSES = Object.values(VatStatus) as VatStatus[];
const EMPLOYEE_COUNT_RANGES = Object.values(
	EmployeeCountRange,
) as EmployeeCountRange[];

export function UpdateOrganizationForm({ organizationId, initialData }: Props) {
	const t = useTranslations("OrganizationSettings");
	const tErrors = useTranslations("OrganizationSettings.errors");

	const form = useForm<
		OrganizationGeneralFormValues,
		any,
		OrganizationGeneralInput
	>({
		resolver: zodResolver(organizationGeneralSchema(tErrors)),
		mode: "onBlur",
		reValidateMode: "onBlur",
		defaultValues: {
			name: initialData.name ?? "",
			nip: initialData.nip ?? "",
			regon: initialData.regon ?? "",
			krs: initialData.krs ?? "",
			legalForm: initialData.legalForm ?? null,
			legalFormCode: initialData.legalFormCode ?? "",
			vatStatus: initialData.vatStatus ?? null,
			vatId: initialData.vatId ?? "",
			website: initialData.website ?? "",
			phone: initialData.phone ?? "",
			email: initialData.email ?? "",
			industry: initialData.industry ?? "",
			mainPkdCode: initialData.mainPkdCode ?? "",
			employeeCountRange: initialData.employeeCountRange ?? null,
		},
	});

	const { handleSubmit, control, register, formState } = form;

	const onSubmit = async (data: OrganizationGeneralInput) => {
		console.log(data);

		const result = await updateOrganizationGeneralAction({
			organizationId,
			data,
		});

		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(t("saved"));
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			{/* Podstawowe dane */}
			<FormGroup label="Dane podstawowe" icon={IconClipboardList}>
				<FormRow>
					<Controller
						name="name"
						control={control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("name")}</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id="name"
										name="name"
										aria-invalid={fieldState.invalid}
										placeholder={t("namePlaceholder")}
										autoComplete="on"
										type="text"
									/>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FormRow>
				<FormRow className="">
					<Controller
						name="phone"
						control={control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("phone")}</FieldLabel>
								<InputGroup>
									<InputGroupAddon>
										<InputGroupText>+48</InputGroupText>
									</InputGroupAddon>
									<InputGroupIMask
										mask="000-000-000"
										value={field.value ?? ""}
										onAccept={(value) =>
											field.onChange(value)
										}
										placeholder={t("phonePlaceholder")}
										inputRef={field.ref}
										aria-invalid={fieldState.invalid}
										onBlur={field.onBlur}
									/>
								</InputGroup>

								{/* <Input
									{...register("phone")}
									placeholder={t("phonePlaceholder")}
								/> */}

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="email"
						control={control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("email")}</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										value={field.value ?? ""}
										id="email"
										name="email"
										aria-invalid={fieldState.invalid}
										placeholder={t("emailPlaceholder")}
										autoComplete="on"
										type="email"
									/>
								</InputGroup>
								{/* <Input
									type="email"
									{...register("email")}
									placeholder={t("emailPlaceholder")}
								/> */}
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FormRow>
				<FormRow>
					<Controller
						name="website"
						control={control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("website")}</FieldLabel>
								<InputGroup>
									<InputGroupAddon>
										<IconWorld />
									</InputGroupAddon>
									<InputGroupInput
										{...field}
										value={field.value ?? ""}
										id="website"
										name="website"
										aria-invalid={fieldState.invalid}
										placeholder={t("websitePlaceholder")}
										autoComplete="on"
										type="url"
									/>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FormRow>
			</FormGroup>

			<FormGroup label="Dane prawne" icon={IconFileInfo}>
				<FormRow>
					<Controller
						name="nip"
						control={control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("nip")}</FieldLabel>
								<InputGroup>
									<InputGroupIMask
										mask="0000000000"
										value={field.value ?? ""}
										onAccept={(value) =>
											field.onChange(value)
										}
										placeholder={t("nipPlaceholder")}
										inputRef={field.ref}
										aria-invalid={fieldState.invalid}
										onBlur={field.onBlur}
									/>
								</InputGroup>
								{fieldState.invalid ? (
									<FieldError errors={[fieldState.error]} />
								) : (
									<FieldDescription>
										Zweryfikowano w GUS
									</FieldDescription>
								)}
							</Field>
						)}
					/>

					<Controller
						name="regon"
						control={control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("regon")}</FieldLabel>
								<InputGroup>
									<InputGroupIMask
										mask="00000000000000"
										value={field.value ?? ""}
										onAccept={(value) =>
											field.onChange(value)
										}
										placeholder={t("regonPlaceholder")}
										inputRef={field.ref}
										aria-invalid={fieldState.invalid}
										onBlur={field.onBlur}
									/>
								</InputGroup>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="krs"
						control={control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("krs")}</FieldLabel>
								<InputGroup>
									<InputGroupIMask
										mask="0000000000"
										value={field.value ?? ""}
										onAccept={(value) =>
											field.onChange(value)
										}
										placeholder={t("krsPlaceholder")}
										inputRef={field.ref}
										aria-invalid={fieldState.invalid}
										onBlur={field.onBlur}
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
						name="legalForm"
						render={({ field }) => (
							<Field>
								<FieldLabel>{t("legalForm")}</FieldLabel>
								<Select
									value={field.value ?? ""}
									onValueChange={(v) =>
										field.onChange(
											v ? (v as LegalForm) : null,
										)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Wybierz formę" />
									</SelectTrigger>
									<SelectContent>
										{LEGAL_FORMS.map((lf) => (
											<SelectItem key={lf} value={lf}>
												{t(`legalForms.${lf}`)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						)}
					/>

					<Controller
						control={control}
						name="legalFormCode"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("legalFormCode")}</FieldLabel>
								<InputGroup>
									<InputGroupIMask
										mask="000"
										value={field.value ?? ""}
										onAccept={(value) =>
											field.onChange(value)
										}
										placeholder={t(
											"legalFormCodePlaceholder",
										)}
										inputRef={field.ref}
										aria-invalid={fieldState.invalid}
										onBlur={field.onBlur}
									/>
								</InputGroup>
								{/* <Input
									{...register("legalFormCode")}
									placeholder={t("legalFormCodePlaceholder")}
								/> */}

								{fieldState.invalid ? (
									<FieldError errors={[fieldState.error]} />
								) : (
									<FieldDescription>
										Trzycyfrowy kod z klasyfikacji GUS
									</FieldDescription>
								)}
							</Field>
						)}
					/>
				</FormRow>
			</FormGroup>

			<FormGroup label="VAT" icon={IconReceiptDollar}>
				<FormRow>
					<Controller
						control={control}
						name="vatStatus"
						render={({ field }) => (
							<Field>
								<FieldLabel>{t("vatStatus")}</FieldLabel>
								<Select
									value={field.value ?? ""}
									onValueChange={(v) =>
										field.onChange(
											v ? (v as VatStatus) : null,
										)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Wybierz status" />
									</SelectTrigger>
									<SelectContent>
										{VAT_STATUSES.map((vs) => (
											<SelectItem key={vs} value={vs}>
												{t(`vatStatuses.${vs}`)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						)}
					/>

					<Controller
						control={control}
						name="vatId"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("vatId")}</FieldLabel>
								<InputGroup>
									<InputGroupIMask
										mask="PL0000000000"
										value={field.value ?? ""}
										onAccept={(value) =>
											field.onChange(value)
										}
										placeholder={t("vatIdPlaceholder")}
										inputRef={field.ref}
										aria-invalid={fieldState.invalid}
										onBlur={field.onBlur}
									/>
								</InputGroup>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FormRow>
			</FormGroup>
			<FormGroup label="Dane branżowe" icon={IconReceiptDollar}>
				<FormRow>
					<Controller
						control={control}
						name="industry"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("industry")}</FieldLabel>
								<InputGroup>
									<InputGroupAddon>
										<IconBrandStackshare />
									</InputGroupAddon>
									<InputGroupInput
										{...field}
										value={field.value ?? ""}
										id="industry"
										name="industry"
										aria-invalid={fieldState.invalid}
										placeholder={t("industryPlaceholder")}
										autoComplete="on"
										type="url"
									/>
								</InputGroup>
								{/* <Input
									{...register("industry")}
									placeholder={t("industryPlaceholder")}
								/> */}
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						control={control}
						name="mainPkdCode"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("mainPkdCode")}</FieldLabel>
								<InputGroup>
									<InputGroupAddon>
										<IconFileDigit />
									</InputGroupAddon>
									<InputGroupInput
										{...field}
										value={field.value ?? ""}
										id="industry"
										name="industry"
										aria-invalid={fieldState.invalid}
										placeholder={t(
											"mainPkdCodePlaceholder",
										)}
										autoComplete="on"
										type="url"
									/>
								</InputGroup>
								{/* <Input
									{...register("mainPkdCode")}
									placeholder={t("mainPkdCodePlaceholder")}
								/> */}
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						control={control}
						name="employeeCountRange"
						render={({ field }) => (
							<Field>
								<FieldLabel>
									{t("employeeCountRange")}
								</FieldLabel>
								<Select
									value={field.value ?? ""}
									onValueChange={(v) =>
										field.onChange(
											v
												? (v as EmployeeCountRange)
												: null,
										)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Wybierz wielkość" />
									</SelectTrigger>
									<SelectContent>
										{EMPLOYEE_COUNT_RANGES.map((ecr) => (
											<SelectItem key={ecr} value={ecr}>
												{t(
													`employeeCountRanges.${ecr}`,
												)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						)}
					/>
				</FormRow>
			</FormGroup>

			{/* <FormGroup label="Dane branżowe" icon={IconReceiptDollar}>
				<FormRow>
					<Controller
						control={control}
						name="industry"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>{t("industry")}</FieldLabel>
								<InputGroup>
									<InputGroupAddon>
										<IconWorld />
									</InputGroupAddon>
									<InputGroupInput
										{...field}
										value={field.value ?? ""}
										id="website"
										name="website"
										aria-invalid={fieldState.invalid}
										placeholder={t("websitePlaceholder")}
										autoComplete="on"
										type="url"
									/>
								</InputGroup>
								<Input
									{...register("industry")}
									placeholder={t("industryPlaceholder")}
								/>
							</Field>
						)}
					/>

					<Controller
						control={control}
						name="employeeCountRange"
						render={({ field }) => (
							<Field>
								<FieldLabel>
									{t("employeeCountRange")}
								</FieldLabel>
								<Select
									value={field.value ?? ""}
									onValueChange={(v) =>
										field.onChange(
											v
												? (v as EmployeeCountRange)
												: null,
										)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Wybierz wielkość" />
									</SelectTrigger>
									<SelectContent>
										{EMPLOYEE_COUNT_RANGES.map((ecr) => (
											<SelectItem key={ecr} value={ecr}>
												{t(
													`employeeCountRanges.${ecr}`,
												)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						)}
					/>
				</FormRow>
			</FormGroup> */}

			<div className="button-wrapper flex justify-end sticky bottom-0  pt-2 bg-background">
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
			</div>
		</form>
	);
}
