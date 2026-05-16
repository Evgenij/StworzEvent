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
	IconClipboardList,
	IconFileInfo,
	IconLoader,
	IconReceiptDollar,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
	organizationGeneralSchema,
	type OrganizationGeneralInput,
	type OrganizationGeneralFormValues,
} from "@/features/organizations/schemas/organization-general.schema";
import { updateOrganizationGeneralAction } from "@/features/organizations/actions/update-organization-general.action";
import { FormGroup, FormRow } from "@/shared/components/form";

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
	const t = useTranslations("OrganizationSettings.general");
	const tErrors = useTranslations("OrganizationSettings.general.errors");
	const tRoot = useTranslations("OrganizationSettings");

	const form = useForm<
		OrganizationGeneralFormValues,
		any,
		OrganizationGeneralInput
	>({
		resolver: zodResolver(organizationGeneralSchema(tErrors)),
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
		const result = await updateOrganizationGeneralAction({
			organizationId,
			data,
		});
		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(tRoot("saved"));
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			{/* Podstawowe dane */}
			<FormGroup label="Dane podstawowe" icon={IconClipboardList}>
				<FormRow>
					<Field>
						<FieldLabel>{t("name")}</FieldLabel>
						<Input
							{...register("name")}
							placeholder={t("namePlaceholder")}
						/>
						{formState.errors.name && (
							<FieldError>
								{formState.errors.name.message}
							</FieldError>
						)}
					</Field>
				</FormRow>
				<FormRow className="">
					<Field>
						<FieldLabel>{t("phone")}</FieldLabel>
						<Input
							{...register("phone")}
							placeholder={t("phonePlaceholder")}
						/>
						{formState.errors.phone && (
							<FieldError>
								{formState.errors.phone.message}
							</FieldError>
						)}
					</Field>

					<Field>
						<FieldLabel>{t("email")}</FieldLabel>
						<Input
							type="email"
							{...register("email")}
							placeholder={t("emailPlaceholder")}
						/>
						{formState.errors.email && (
							<FieldError>
								{formState.errors.email.message}
							</FieldError>
						)}
					</Field>
				</FormRow>
				<FormRow>
					<Field>
						<FieldLabel>{t("website")}</FieldLabel>
						<Input
							type="url"
							{...register("website")}
							placeholder={t("websitePlaceholder")}
						/>
						{formState.errors.website && (
							<FieldError>
								{formState.errors.website.message}
							</FieldError>
						)}
					</Field>
				</FormRow>
			</FormGroup>

			<FormGroup label="Dane prawne" icon={IconFileInfo}>
				<FormRow>
					<Field>
						<FieldLabel>{t("nip")}</FieldLabel>
						<Input
							{...register("nip")}
							placeholder={t("nipPlaceholder")}
						/>
						<FieldDescription>Zweryfikowano w GUS</FieldDescription>
						{formState.errors.nip && (
							<FieldError>
								{formState.errors.nip.message}
							</FieldError>
						)}
					</Field>

					<Field>
						<FieldLabel>{t("regon")}</FieldLabel>
						<Input
							{...register("regon")}
							placeholder={t("regonPlaceholder")}
						/>
						{formState.errors.regon && (
							<FieldError>
								{formState.errors.regon.message}
							</FieldError>
						)}
					</Field>

					<Field>
						<FieldLabel>{t("krs")}</FieldLabel>
						<Input
							{...register("krs")}
							placeholder={t("krsPlaceholder")}
						/>
						{formState.errors.krs && (
							<FieldError>
								{formState.errors.krs.message}
							</FieldError>
						)}
					</Field>
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

					<Field>
						<FieldLabel>{t("legalFormCode")}</FieldLabel>
						<Input
							{...register("legalFormCode")}
							placeholder={t("legalFormCodePlaceholder")}
						/>
						<FieldDescription>
							Trzycyfrowy kod z klasyfikacji GUS
						</FieldDescription>
					</Field>
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

					<Field>
						<FieldLabel>{t("vatId")}</FieldLabel>
						<Input
							{...register("vatId")}
							placeholder={t("vatIdPlaceholder")}
						/>
					</Field>
				</FormRow>
			</FormGroup>
			<FormGroup label="Dane branżowe" icon={IconReceiptDollar}>
				<FormRow>
					<Field>
						<FieldLabel>{t("industry")}</FieldLabel>
						<Input
							{...register("industry")}
							placeholder={t("industryPlaceholder")}
						/>
					</Field>

					<Field>
						<FieldLabel>{t("mainPkdCode")}</FieldLabel>
						<Input
							{...register("mainPkdCode")}
							placeholder={t("mainPkdCodePlaceholder")}
						/>
					</Field>
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
