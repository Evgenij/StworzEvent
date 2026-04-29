"use client";

import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";

import { EventStatus } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { EventCoverUpload } from "../event-cover-upload";
import {
	IconCircleCheckFilled,
	IconDeviceFloppy,
	IconLink,
	IconLoader,
	IconMap2,
	IconPhoto,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryCombobox } from "../category-combobox";
import QUERY_KEYS from "@/config/query-keys";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useCreateEventPreview } from "../create-event-context";
import { LocationPicker } from "../location/location-picker";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/shared/components/date-time-picker";
import { DateTimeFormatter } from "@/helpers/date";
import {
	CreateEventInput,
	createEventSchema,
} from "@/features/events/schemas/event.schema";
import { getMyOrganizations } from "@/features/organizations/actions/get-my-organizations.action";
import { getEventForEditAction } from "@/features/events/actions/get-event-for-edit.action";
import { updateEventAction } from "@/features/events/actions/update-event.action";
import { RichTextEditor } from "@/shared/components/rich-text-editor";

type Props = {
	eventId: string;
	onSuccess?: () => void;
};

export function StepBasicData({ eventId, onSuccess }: Props) {
	const [locationKey, setLocationKey] = useState("new");
	const t = useTranslations("CreateEvent");
	const tErrors = useTranslations("CreateEventErrors");
	const { setPreview, setSelectedCategory } = useCreateEventPreview();

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
			street: "",
			streetNumber: "",
			lat: undefined,
			lng: undefined,
			showMap: true,
			eventIsOffline: false,
		},
		mode: "onChange",
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

	const { data: eventData } = useQuery({
		queryKey: ["event-for-edit", eventId],
		queryFn: () => getEventForEditAction(eventId),
		staleTime: 0,
		refetchOnMount: true,
	});

	useEffect(() => {
		// if (memberships.length === 1) {
		// 	form.setValue("organizationId", memberships[0].organizations.id);
		// }
	}, [memberships]);

	useEffect(() => {
		if (!eventData) return;
		form.reset({
			title: eventData.title,
			description: eventData.description ?? {},
			coverImage: eventData.coverImage ?? "",
			status: (["DRAFT", "PUBLISHED"].includes(eventData.status)
				? eventData.status
				: "DRAFT") as "DRAFT" | "PUBLISHED",
			organizationId: eventData.organizationId,
			categoryId: eventData.categoryId,
			startsAt: DateTimeFormatter.timeISO(eventData.startsAt),
			endsAt: DateTimeFormatter.timeISO(eventData.endsAt),
			location: eventData.location ?? "",
			street: eventData.street ?? "",
			streetNumber: eventData.streetNumber ?? "",
			lat: eventData.lat ?? undefined,
			lng: eventData.lng ?? undefined,
			showMap: eventData.showMap,
			eventIsOffline: eventData.eventIsOffline ?? false,
			onlineUrl: eventData.onlineUrl ?? "",
		});
		setLocationKey(eventData.id);
	}, [eventData]);

	const onSubmit: SubmitHandler<CreateEventInput> = async (data) => {
		const result = await updateEventAction({
			eventId,
			data: {
				title: data.title,
				description: data.description,
				coverImage: data.coverImage || null,
				status: data.status,
				categoryId: data.categoryId,
				startsAt: data.startsAt,
				endsAt: data.endsAt,
				location: data.location,
				street: data.street || null,
				streetNumber: data.streetNumber || null,
				lat: data.lat ?? null,
				lng: data.lng ?? null,
				showMap: data.onlineUrl ? false : data.showMap,
				eventIsOffline: data.eventIsOffline,
				onlineUrl: data.onlineUrl || null,
			},
		});

		if (!result.success) {
			toast.error(t("errors.default"));
			return;
		}

		if (onSuccess) {
			onSuccess();
			return;
		}

		toast.success(t("settingDetails"));
	};

	const coverImage = form.watch("coverImage");
	const location = form.watch("location");
	const street = form.watch("street");
	const streetNumber = form.watch("streetNumber");
	const lat = form.watch("lat");
	const lng = form.watch("lng");
	const eventIsOffline = form.watch("eventIsOffline");
	const onlineUrl = form.watch("onlineUrl");
	const onlineUrlError = form.formState.errors.onlineUrl;

	const hasCoords = !!(lat && lng);

	useEffect(() => {
		form.setValue("showMap", hasCoords);
	}, [hasCoords]);

	useEffect(() => {
		if (!location || !street) {
			form.setValue("streetNumber", "");
		}
	}, [location, street]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
				className={cn(
					"rounded-lg border hover:border-muted-foreground/50",
				)}
			>
				<AccordionItem value="item-1">
					<AccordionTrigger className="p-3 flex items-center gap-3 w-full hover:no-underline data-[state=open]:bg-muted data-[state=open]:rounded-br-none data-[state=open]:rounded-bl-none">
						{coverImage ? (
							<div className="flex gap-1 items-center">
								<IconCircleCheckFilled className="size-6 text-green-600" />
								<span>{t("coverUploaded")}</span>
							</div>
						) : (
							<div className="flex gap-1 items-center h-6">
								<IconPhoto className="size-5" />
								<span>{t("cover")}</span>
							</div>
						)}
					</AccordionTrigger>

					<AccordionContent className="p-4 border-t border-border h-fit">
						<Controller
							name="coverImage"
							control={control}
							render={({ field }) => (
								<EventCoverUpload
									value={field.value}
									onChange={(url) => field.onChange(url)}
									onClear={() => field.onChange("")}
								/>
							)}
						/>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			{/* Название и категория */}
			<div className="flex flex-col md:flex-row gap-4">
				<Controller
					name="title"
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>{t("title_field")}</FieldLabel>
							<InputGroup>
								<InputGroupInput
									{...field}
									aria-invalid={fieldState.invalid}
									placeholder={t("titlePlaceholder")}
									onChange={field.onChange}
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
							<FieldLabel>{t("category")}</FieldLabel>
							<CategoryCombobox
								value={field.value}
								onChange={(item) => {
									field.onChange(item?.id ?? "");
									setSelectedCategory(item);
								}}
								invalid={fieldState.invalid}
								onBlur={field.onBlur}
							/>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
			</div>

			{/* Даты */}
			<div className="flex flex-col md:flex-row gap-4">
				<Controller
					name="startsAt"
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>{t("startsAt")}</FieldLabel>
							<DateTimePicker
								value={field.value}
								onChange={(date) => {
									field.onChange(date);
									if (date) {
										const endsAt = new Date(
											new Date(date).getTime() +
												2 * 60 * 60 * 1000,
										);
										form.setValue(
											"endsAt",
											DateTimeFormatter.timeISO(endsAt),
										);
									}
								}}
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

				<Controller
					name="endsAt"
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>{t("endsAt")}</FieldLabel>
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
			</div>

			{/* Описание */}
			<Controller
				name="description"
				control={control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<div className="flex gap-1">
							<FieldLabel>{t("description")}</FieldLabel>
							<span className="text-sm text-muted-foreground">
								(opcjonalnie)
							</span>
						</div>

						<RichTextEditor
							value={field.value}
							onChange={(item) => {
								field.onChange(item?.id ?? "");
								setSelectedCategory(item);
							}}
							disabled={isSubmitting}
						/>
						{fieldState.invalid && (
							<FieldError errors={[fieldState.error]} />
						)}
					</Field>
				)}
			/>

			<Accordion
				type="single"
				collapsible
				className={cn(
					"rounded-lg border hover:border-muted-foreground/50",
				)}
			>
				<AccordionItem value="item-1">
					<AccordionTrigger className="p-3 flex items-center gap-3 w-full hover:no-underline data-[state=open]:bg-muted data-[state=open]:rounded-br-none data-[state=open]:rounded-bl-none">
						{(location && street && streetNumber) ||
						(onlineUrl && !onlineUrlError) ? (
							<div className="flex gap-1 items-center">
								<IconCircleCheckFilled className="size-6 text-green-600" />
								<span>
									{eventIsOffline
										? t("linkSetted")
										: t("localizationSetted")}
								</span>
							</div>
						) : (
							<div className="flex gap-1 items-center h-6">
								{eventIsOffline ? (
									<IconLink className="size-5" />
								) : (
									<IconMap2 className="size-5" />
								)}

								<span>
									{eventIsOffline
										? t("link")
										: t("localization")}
								</span>
							</div>
						)}
					</AccordionTrigger>

					<AccordionContent className="p-4 border-t border-border h-fit flex flex-col gap-4">
						{eventIsOffline ? (
							<Controller
								name="onlineUrl"
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<Label>{t("onlineUrl")}</Label>
										<InputGroup>
											<InputGroupInput
												{...field}
												placeholder={t(
													"linkPlaceholder",
												)}
												aria-invalid={
													fieldState.invalid
												}
											/>
										</InputGroup>
										{fieldState.invalid && (
											<FieldError
												errors={[fieldState.error]}
											/>
										)}
									</Field>
								)}
							/>
						) : (
							<>
								<Controller
									name="location"
									control={control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<LocationPicker
												key={locationKey}
												value={{
													city: location ?? "",
													street: street ?? "",
													streetNumber:
														streetNumber ?? "",
													lat: lat ?? 0,
													lng: lng ?? 0,
												}}
												onChange={(loc) => {
													form.setValue(
														"location",
														loc.city,
													);
													form.setValue(
														"street",
														loc.street,
													);
													form.setValue(
														"streetNumber",
														loc.streetNumber,
													);
													form.setValue(
														"lat",
														loc.lat,
													);
													form.setValue(
														"lng",
														loc.lng,
													);
												}}
												invalid={fieldState.invalid}
												onBlur={field.onBlur}
											/>
											{fieldState.invalid && (
												<FieldError
													errors={[fieldState.error]}
												/>
											)}
										</Field>
									)}
								/>
								<Controller
									name="showMap"
									control={control}
									render={({ field }) => (
										<div
											className={`justify-between rounded-lg border p-3 flex items-center ${!hasCoords ? "opacity-50" : ""}`}
										>
											<div className="flex flex-col gap-0.5">
												<span className="text-sm font-medium">
													{t("showMap")}
												</span>
												<span className="text-xs text-muted-foreground">
													{t("showMapHint")}
												</span>
											</div>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={!hasCoords}
											/>
										</div>
									)}
								/>
							</>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<Button type="submit" disabled={isSubmitting} className="self-end">
				{isSubmitting ? (
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
		</form>
	);
}
