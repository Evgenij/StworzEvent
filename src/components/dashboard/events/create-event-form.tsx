"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
	createEventSchema,
	type CreateEventInput,
} from "@/schemas/create-event.schema";
import { createEventAction } from "@/actions/events/create-event.action";
import { EventStatus } from "@prisma/client";
import { Label } from "@/components/shadcn/ui/label";
import { Button } from "@/components/shadcn/ui/button";
import { Field, FieldError } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcn/ui/select";
import { EventCoverUpload } from "./event-cover-upload";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import {
	IconBuilding,
	IconCalendar,
	IconLoader2,
	IconMapPin,
	IconPhoto,
	IconPhotoCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyOrganizations } from "@/actions/organizations/get-my-organizations.action";
import { CategoryCombobox } from "./category-combobox";
import QUERY_KEYS from "@/consts/query-keys";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/shadcn/ui/accordion";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "@/components/shared/date-time-picker";
import { useCreateEventPreview } from "./create-event-context";

export function CreateEventForm() {
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("CreateEvent");
	const tErrors = useTranslations("CreateEventErrors");
	const { setPreview } = useCreateEventPreview();

	const form = useForm<CreateEventInput>({
		resolver: zodResolver(createEventSchema(tErrors)),
		defaultValues: {
			title: "",
			description: {},
			coverImage: "",
			status: EventStatus.DRAFT,
			organizationId: "",
			categoryId: "",
			startsAt: "",
			endsAt: "",
			location: "",
			address: "",
		},
		mode: "onBlur",
		reValidateMode: "onBlur",
	});

	form.watch((data) => {
		setPreview(data as Partial<CreateEventInput>);
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = form;

	const { data: memberships = [], isLoading: orgsLoading } = useQuery({
		queryKey: [QUERY_KEYS.ORGANIZATIONS.MY_ORG],
		queryFn: () => getMyOrganizations(),
		staleTime: 1000 * 60 * 5,
	});

	useEffect(() => {
		console.log(memberships);

		if (memberships.length === 1) {
			form.setValue("organizationId", memberships[0].organizations.id);
		}
	}, [memberships]);

	const onSubmit = async (data: CreateEventInput) => {
		const result = await createEventAction(data);

		console.log(result);

		if (!result.success) {
			toast.error(t("errors.default"));
			return;
		}

		// ✅ редирект на шаг 2
		router.push(
			`/${locale}/profile/events/${result.data.eventId}/edit/additional`,
		);
	};

	const coverImage = form.watch("coverImage");

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			{/* Организация — только если их > 1 */}
			{memberships.length > 1 && (
				<Controller
					name="organizationId"
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<Label>{t("organization")}</Label>
							<Select
								value={field.value}
								onValueChange={field.onChange}
								disabled={orgsLoading}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={t(
											"organizationPlaceholder",
										)}
									/>
								</SelectTrigger>
								<SelectContent>
									{memberships.map((m) => (
										<SelectItem
											key={m.organizations.id}
											value={m.organizations.id}
										>
											{m.organizations.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
			)}

			{/* Обложка */}
			<Accordion
				type="single"
				collapsible
				defaultValue="item-1"
				className={cn(
					"rounded-lg border hover:border-muted-foreground/50",
				)}
			>
				<AccordionItem value="item-1">
					<AccordionTrigger className="p-3 px-4 flex gap-3 w-full hover:no-underline">
						{coverImage ? (
							<div className="flex gap-1 text-green-600">
								<IconPhotoCheck className="size-5 " />
								<span>{t("coverUploaded")}</span>
							</div>
						) : (
							<div className="flex gap-1 ">
								<IconPhoto className="size-5" />
								<span>{t("cover")}</span>
							</div>
						)}
					</AccordionTrigger>

					<AccordionContent className="p-4 pt-0 h-fit">
						<Controller
							name="coverImage"
							control={control}
							render={({ field }) => (
								<EventCoverUpload
									value={field.value}
									onChange={field.onChange}
									onClear={() => field.onChange("")}
								/>
							)}
						/>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			{/* Название и категория */}
			<div className="flex gap-4">
				<Controller
					name="title"
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<Label>{t("title_field")}</Label>
							<InputGroup>
								<InputGroupInput
									{...field}
									aria-invalid={fieldState.invalid}
									placeholder={t("titlePlaceholder")}
								/>
							</InputGroup>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
				<Controller
					name="categoryId"
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<Label>{t("category")}</Label>
							<CategoryCombobox
								value={field.value}
								onChange={field.onChange}
							/>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
			</div>

			{/* Даты */}
			<div className="grid grid-cols-2 gap-4">
				<Controller
					name="startsAt"
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<Label>{t("startsAt")}</Label>
							<DateTimePicker
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								aria-invalid={fieldState.invalid}
								placeholder={t("dateTimePlaceholder")}
							/>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
				{/* <Controller
					name="startsAt"
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<Label>{t("startsAt")}</Label>
							<InputGroup>
								<InputGroupAddon>
									<IconCalendar className="size-4" />
								</InputGroupAddon>
								<InputGroupInput
									type="datetime-local"
									{...field}
									value={field.value ?? ""}
									aria-invalid={fieldState.invalid}
								/>
							</InputGroup>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/> */}
				<Controller
					name="endsAt"
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<Label>{t("endsAt")}</Label>
							<DateTimePicker
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								aria-invalid={fieldState.invalid}
								placeholder={t("dateTimePlaceholder")}
							/>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
				{/* <Controller
					name="endsAt"
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<Label>{t("endsAt")}</Label>
							<InputGroup>
								<InputGroupAddon>
									<IconCalendar className="size-4" />
								</InputGroupAddon>
								<InputGroupInput
									type="datetime-local"
									{...field}
									value={field.value ?? ""}
									aria-invalid={fieldState.invalid}
								/>
							</InputGroup>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/> */}
			</div>

			{/* Описание */}
			<Controller
				name="description"
				control={control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<Label>{t("description")}</Label>
						<RichTextEditor
							value={field.value}
							onChange={field.onChange}
							disabled={isSubmitting}
						/>
						{fieldState.invalid && (
							<FieldError errors={[fieldState.error]} />
						)}
					</Field>
				)}
			/>

			{/* Город */}
			<Controller
				name="location"
				control={control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<Label>{t("location")}</Label>
						<InputGroup>
							<InputGroupAddon>
								<IconMapPin className="size-4" />
							</InputGroupAddon>
							<InputGroupInput
								{...field}
								aria-invalid={fieldState.invalid}
								placeholder={t("locationPlaceholder")}
							/>
						</InputGroup>
						{fieldState.invalid && (
							<FieldError errors={[fieldState.error]} />
						)}
					</Field>
				)}
			/>

			{/* Адрес */}
			<Controller
				name="address"
				control={control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<Label>{t("address")}</Label>
						<InputGroup>
							<InputGroupAddon>
								<IconBuilding className="size-4" />
							</InputGroupAddon>
							<InputGroupInput
								{...field}
								aria-invalid={fieldState.invalid}
								placeholder={t("addressPlaceholder")}
							/>
						</InputGroup>
						{fieldState.invalid && (
							<FieldError errors={[fieldState.error]} />
						)}
					</Field>
				)}
			/>

			{/* Статус — убрали на шаг 3, но оставляем DRAFT по умолчанию скрыто */}

			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? (
					<>
						<IconLoader2 className="mr-2 size-4 animate-spin" />
						{t("saving")}
					</>
				) : (
					t("settingDetails")
				)}
			</Button>
		</form>
	);
}
