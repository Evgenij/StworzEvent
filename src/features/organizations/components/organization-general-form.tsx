"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { LegalForm, VatStatus, EmployeeCountRange } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Field, FieldError } from "@/components/ui/field";
import { IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";
import {
	organizationGeneralSchema,
	type OrganizationGeneralInput,
	type OrganizationGeneralFormValues,
} from "@/features/organizations/schemas/organization-general.schema";
import { updateOrganizationGeneralAction } from "@/features/organizations/actions/update-organization-general.action";

type Props = {
	organizationId: string;
	initialData: Partial<OrganizationGeneralFormValues>;
};

const LEGAL_FORMS = Object.values(LegalForm) as LegalForm[];
const VAT_STATUSES = Object.values(VatStatus) as VatStatus[];
const EMPLOYEE_COUNT_RANGES = Object.values(
	EmployeeCountRange,
) as EmployeeCountRange[];

export function OrganizationGeneralForm({
	organizationId,
	initialData,
}: Props) {
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
			<div className="flex flex-col gap-4">
				<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Dane podstawowe
				</p>

				<Field>
					<Label>{t("name")}</Label>
					<Input
						{...register("name")}
						placeholder={t("namePlaceholder")}
					/>
					{formState.errors.name && (
						<FieldError>{formState.errors.name.message}</FieldError>
					)}
				</Field>

				<div className="grid grid-cols-2 gap-4">
					<Field>
						<Label>{t("phone")}</Label>
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
						<Label>{t("email")}</Label>
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
				</div>

				<Field>
					<Label>{t("website")}</Label>
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
			</div>

			{/* Dane prawne */}
			<div className="flex flex-col gap-4">
				<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Dane prawne
				</p>

				<div className="grid grid-cols-3 gap-4">
					<Field>
						<Label>{t("nip")}</Label>
						<Input
							{...register("nip")}
							placeholder={t("nipPlaceholder")}
						/>
						{formState.errors.nip && (
							<FieldError>
								{formState.errors.nip.message}
							</FieldError>
						)}
					</Field>

					<Field>
						<Label>{t("regon")}</Label>
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
						<Label>{t("krs")}</Label>
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
				</div>

				<div className="grid grid-cols-2 gap-4">
					<Controller
						control={control}
						name="legalForm"
						render={({ field }) => (
							<Field>
								<Label>{t("legalForm")}</Label>
								<Select
									value={field.value ?? ""}
									onValueChange={(v) =>
										field.onChange(
											v ? (v as LegalForm) : null,
										)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue
											placeholder="Wybierz formę"
										/>
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
						<Label>{t("legalFormCode")}</Label>
						<Input
							{...register("legalFormCode")}
							placeholder={t("legalFormCodePlaceholder")}
						/>
					</Field>
				</div>
			</div>

			{/* VAT */}
			<div className="flex flex-col gap-4">
				<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					VAT
				</p>

				<div className="grid grid-cols-2 gap-4">
					<Controller
						control={control}
						name="vatStatus"
						render={({ field }) => (
							<Field>
								<Label>{t("vatStatus")}</Label>
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
						<Label>{t("vatId")}</Label>
						<Input
							{...register("vatId")}
							placeholder={t("vatIdPlaceholder")}
						/>
					</Field>
				</div>

			</div>

			{/* Dane branżowe */}
			<div className="flex flex-col gap-4">
				<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Dane branżowe
				</p>

				<div className="grid grid-cols-2 gap-4">
					<Field>
						<Label>{t("industry")}</Label>
						<Input
							{...register("industry")}
							placeholder={t("industryPlaceholder")}
						/>
					</Field>

					<Field>
						<Label>{t("mainPkdCode")}</Label>
						<Input
							{...register("mainPkdCode")}
							placeholder={t("mainPkdCodePlaceholder")}
						/>
					</Field>
				</div>

				<Controller
					control={control}
					name="employeeCountRange"
					render={({ field }) => (
						<Field>
							<Label>{t("employeeCountRange")}</Label>
							<Select
								value={field.value ?? ""}
								onValueChange={(v) =>
									field.onChange(
										v ? (v as EmployeeCountRange) : null,
									)
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Wybierz wielkość" />
								</SelectTrigger>
								<SelectContent>
									{EMPLOYEE_COUNT_RANGES.map((ecr) => (
										<SelectItem key={ecr} value={ecr}>
											{t(`employeeCountRanges.${ecr}`)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					)}
				/>
			</div>

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
