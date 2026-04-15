"use client";

import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
	createOrganizationSchema,
	type CreateOrganizationInput,
} from "@/schemas/create-organization.schema";
import { createOrganizationAction } from "@/actions/organizations/create-organization.action";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupIMask,
	InputGroupText,
} from "@/components/shadcn/ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcn/ui/select";
import {
	IconBuildingSkyscraper,
	IconLoader,
	IconMap2,
	TablerIcon,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PolishCityCombobox } from "../events/location/polish-city-combobox";
import { FormGroup, FormRow, FormHeader } from "@/components/forms";

export function CreateOrganizationForm({
	header,
	onSuccess,
}: {
	header?: {
		title: string;
		subTitle: string;
	};
	onSuccess?: () => void;
}) {
	const router = useRouter();
	const t = useTranslations("CreateOrganization");

	const form = useForm<CreateOrganizationInput>({
		resolver: zodResolver(
			createOrganizationSchema((key) => t(`errors.${key}`)),
		),
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			name: "",
			nip: "",
			email: "",
			phone: "",
			legalForm: undefined,
			vatStatus: undefined,
			address: {
				street: "",
				buildingNumber: "",
				zipCode: "",
				city: "",
			},
		},
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting, errors },
	} = form;

	const onSubmit: SubmitHandler<CreateOrganizationInput> = async (data) => {
		const result = await createOrganizationAction(data);

		if (!result.success) {
			toast.error(t("errors.default"));
			return;
		}

		//router.push("/profile/dashboard");
		//router.refresh();
		onSuccess?.();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
			{/* <pre className="text-xs">
				{JSON.stringify(form.getValues(), null, 2)}
			</pre> */}

			{header && (
				<FormHeader
					title={header.title}
					description={header.subTitle}
					icon={IconBuildingSkyscraper}
				/>
			)}

			{/* Sekcja: Dane organizatora */}
			<FormGroup className="gap-4">
				<Field>
					<FieldLabel htmlFor="org-name">{t("name")}</FieldLabel>
					<Controller
						control={control}
						name="name"
						render={({ field }) => (
							<Input
								id="org-name"
								{...field}
								placeholder={t("namePlaceholder")}
								aria-invalid={!!errors.name}
							/>
						)}
					/>
					<FieldError errors={[errors.name]} />
				</Field>

				<Field>
					<FieldLabel>{t("nip")}</FieldLabel>
					<Controller
						control={control}
						name="nip"
						render={({ field, fieldState }) => (
							<InputGroup>
								<InputGroupIMask
									mask="0000000000"
									value={field.value ?? ""}
									onAccept={(value) => field.onChange(value)}
									placeholder={t("nipPlaceholder")}
									inputRef={field.ref}
									aria-invalid={fieldState.invalid}
									onBlur={field.onBlur}
								/>
							</InputGroup>
						)}
					/>
					<FieldError errors={[errors.nip]} />
				</Field>

				<Field>
					<FieldLabel htmlFor="org-email">{t("email")}</FieldLabel>
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<Input
								id="org-email"
								type="email"
								{...field}
								placeholder={t("emailPlaceholder")}
								aria-invalid={!!errors.email}
							/>
						)}
					/>
					<FieldError errors={[errors.email]} />
				</Field>

				<Field>
					<FieldLabel>{t("phone")}</FieldLabel>
					<Controller
						control={control}
						name="phone"
						render={({ field, fieldState }) => (
							<InputGroup>
								<InputGroupAddon>
									<InputGroupText>+48</InputGroupText>
								</InputGroupAddon>
								<InputGroupIMask
									mask="000-000-000"
									value={field.value ?? ""}
									onAccept={(value) => field.onChange(value)}
									placeholder="___-___-___"
									inputRef={field.ref}
									aria-invalid={fieldState.invalid}
									onBlur={field.onBlur}
								/>
							</InputGroup>
						)}
					/>
					<FieldError errors={[errors.phone]} />
				</Field>

				<Field>
					<FieldLabel>{t("legalForm")}</FieldLabel>
					<Controller
						control={control}
						name="legalForm"
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger
									className={cn("w-full")}
									aria-invalid={!!errors.legalForm}
								>
									<SelectValue
										placeholder={t("legalFormPlaceholder")}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="OSOBA_FIZYCZNA">
										{t("legalForms.OSOBA_FIZYCZNA")}
									</SelectItem>
									<SelectItem value="JEDNOOSOBOWA_DG">
										{t("legalForms.JEDNOOSOBOWA_DG")}
									</SelectItem>
									<SelectItem value="SP_ZOO">
										{t("legalForms.SP_ZOO")}
									</SelectItem>
									<SelectItem value="SA">
										{t("legalForms.SA")}
									</SelectItem>
									<SelectItem value="SP_JAWNA">
										{t("legalForms.SP_JAWNA")}
									</SelectItem>
									<SelectItem value="SP_PARTNERSKA">
										{t("legalForms.SP_PARTNERSKA")}
									</SelectItem>
									<SelectItem value="SP_KOMANDYTOWA">
										{t("legalForms.SP_KOMANDYTOWA")}
									</SelectItem>
									<SelectItem value="SP_KOMANDYTOWO_AKCYJNA">
										{t("legalForms.SP_KOMANDYTOWO_AKCYJNA")}
									</SelectItem>
									<SelectItem value="STOWARZYSZENIE">
										{t("legalForms.STOWARZYSZENIE")}
									</SelectItem>
									<SelectItem value="FUNDACJA">
										{t("legalForms.FUNDACJA")}
									</SelectItem>
									<SelectItem value="SPOLDZIELNIA">
										{t("legalForms.SPOLDZIELNIA")}
									</SelectItem>
									<SelectItem value="INNE">
										{t("legalForms.INNE")}
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					<FieldError errors={[errors.legalForm]} />
				</Field>

				<Field>
					<FieldLabel>{t("vatStatus")}</FieldLabel>
					<Controller
						control={control}
						name="vatStatus"
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger
									className="w-full"
									aria-invalid={!!errors.vatStatus}
								>
									<SelectValue
										placeholder={t("vatStatusPlaceholder")}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ACTIVE">
										{t("vatStatuses.ACTIVE")}
									</SelectItem>
									<SelectItem value="EXEMPT">
										{t("vatStatuses.EXEMPT")}
									</SelectItem>
									<SelectItem value="UNREGISTERED">
										{t("vatStatuses.UNREGISTERED")}
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					<FieldError errors={[errors.vatStatus]} />
				</Field>
			</FormGroup>

			{/* Sekcja: Adres siedziby */}
			<FormGroup
				className="gap-4"
				label={t("sectionAddress")}
				icon={IconMap2}
			>
				<FormRow>
					<Field>
						<FieldLabel htmlFor="org-street">
							{t("street")}
						</FieldLabel>
						<Controller
							control={control}
							name="address.street"
							render={({ field }) => (
								<Input
									id="org-street"
									{...field}
									placeholder={t("streetPlaceholder")}
									aria-invalid={!!errors.address?.street}
								/>
							)}
						/>
						<FieldError errors={[errors.address?.street]} />
					</Field>

					<Field className="w-35 shrink-0">
						<FieldLabel htmlFor="org-building">
							{t("buildingNumber")}
						</FieldLabel>
						<Controller
							control={control}
							name="address.buildingNumber"
							render={({ field }) => (
								<Input
									id="org-building"
									{...field}
									placeholder={t("buildingNumberPlaceholder")}
									aria-invalid={
										!!errors.address?.buildingNumber
									}
								/>
							)}
						/>
						<FieldError errors={[errors.address?.buildingNumber]} />
					</Field>
				</FormRow>

				{/* <Field>
					<FieldLabel>{t("phone")}</FieldLabel>
					<Controller
						control={control}
						name="phone"
						render={({ field, fieldState }) => (
							<InputGroup>
								<InputGroupAddon>
									<InputGroupText>+48</InputGroupText>
								</InputGroupAddon>
								<InputGroupIMask
									mask="000-000-000"
									value={field.value ?? ""}
									onAccept={(value) => field.onChange(value)}
									placeholder="___-___-___"
									inputRef={field.ref}
									aria-invalid={fieldState.invalid}
									onBlur={field.onBlur}
								/>
							</InputGroup>
						)}
					/>
					<FieldError errors={[errors.phone]} />
				</Field> */}

				<FormRow>
					<Field className="w-32 shrink-0">
						<FieldLabel htmlFor="org-zip">
							{t("zipCode")}
						</FieldLabel>
						<Controller
							control={control}
							name="address.zipCode"
							// render={({ field }) => (
							// 	<Input
							// 		id="org-zip"
							// 		{...field}
							// 		placeholder={t("zipCodePlaceholder")}
							// 		aria-invalid={!!errors.address?.zipCode}
							// 	/>
							// )}
							render={({ field, fieldState }) => (
								<InputGroup>
									{/* <InputGroupAddon>
									<InputGroupText>ZIP CODE</InputGroupText>
								</InputGroupAddon> */}
									<InputGroupIMask
										id="org-zip"
										mask="00-000"
										value={field.value ?? ""}
										onAccept={(value) =>
											field.onChange(value)
										}
										placeholder={t("zipCodePlaceholder")}
										inputRef={field.ref}
										aria-invalid={!!errors.address?.zipCode}
										onBlur={field.onBlur}
									/>
								</InputGroup>
							)}
						/>
						<FieldError errors={[errors.address?.zipCode]} />
					</Field>
					<Field className="flex-1 ">
						<FieldLabel>{t("city")}</FieldLabel>
						<Controller
							control={control}
							name="address.city"
							render={({ field }) => (
								<PolishCityCombobox
									value={field.value || ""}
									onChange={field.onChange}
									onBlur={field.onBlur}
									invalid={!!errors.address?.city}
								/>
							)}
						/>
						<FieldError errors={[errors.address?.city]} />
					</Field>
				</FormRow>

				{/* <Field>
					<FieldLabel htmlFor="org-city">{t("city")}</FieldLabel>
					<Controller
						control={control}
						name="address.city"
						render={({ field }) => (
							<Input
								id="org-city"
								{...field}
								placeholder={t("cityPlaceholder")}
								aria-invalid={!!errors.address?.city}
							/>
						)}
					/>
					<FieldError errors={[errors.address?.city]} />
				</Field> */}
			</FormGroup>

			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? (
					<IconLoader className="size-4 animate-spin mr-2" />
				) : null}
				{t("submit")}
			</Button>
		</form>
	);
}
