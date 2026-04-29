// src/components/dashboard/events/agenda/agenda-item-card.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	IconTrash,
	IconLoader,
	IconMapPin,
	IconUser,
	IconClock,
	IconDeviceFloppy,
	IconCheck,
	IconPencil,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { AgendaItem } from "@/features/events/actions/agenda/get-event-agenda.action";
import {
	AgendaItemInput,
	agendaItemSchema,
} from "@/features/events/schemas/agenda-item.schema";
import { upsertAgendaItemAction } from "@/features/events/actions/agenda/upsert-agenda-item.action";
import { deleteAgendaItemAction } from "@/features/events/actions/agenda/delete-agenda-item.action";
import { formatDayLabel } from "../../page/agenda/event-agenda";
import { DateTimeFormatter } from "@/helpers/date";

type Props = {
	eventId: string;
	item: AgendaItem;
	dayNumber?: number;
	date: Date;
	onDelete: (id: string) => void;
	onSave: (id: string, data: AgendaItem) => void;
};

const toLocalDateTimeString = (d: Date): string => {
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function AgendaItemCard({
	dayNumber,
	eventId,
	item,
	date,
	onDelete,
	onSave,
}: Props) {
	const t = useTranslations("EventWizard.agenda");
	const tErrors = useTranslations("CreateEventErrors");
	const [isEditing, setIsEditing] = useState(!item.title);
	const [isDeleting, setIsDeleting] = useState(false);

	const form = useForm<AgendaItemInput>({
		resolver: zodResolver(agendaItemSchema(tErrors)),
		defaultValues: {
			title: item.title,
			description: item.description ?? "",
			startsAt: item.startsAt
				? toLocalDateTimeString(new Date(item.startsAt))
				: "",
			endsAt: item.endsAt
				? toLocalDateTimeString(new Date(item.endsAt))
				: "",
			location: item.location ?? "",
			speakerName: item.speakerName ?? "",
		},
		mode: "onBlur",
		reValidateMode: "onBlur",
	});

	const {
		handleSubmit,
		control,
		watch,
		formState: { isSubmitting },
	} = form;

	const startsAtValue = watch("startsAt");

	const onSubmit = async (data: AgendaItemInput) => {
		const isTemp = item.id.startsWith("temp-");
		const result = await upsertAgendaItemAction({
			eventId,
			itemId: isTemp ? undefined : item.id,
			data,
		});

		if (!result.success) {
			toast.error(t("errors.saveFailed"));
			return;
		}

		toast.success(t("saved"));
		setIsEditing(false);

		onSave(item.id, {
			...item,
			id: result.data.itemId,
			title: data.title,
			description: data.description ?? null,
			startsAt: new Date(data.startsAt),
			endsAt: data.endsAt ? new Date(data.endsAt) : null,
			location: data.location ?? null,
			speakerName: data.speakerName ?? null,
		});
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		const result = await deleteAgendaItemAction(item.id);
		setIsDeleting(false);

		if (!result.success) {
			toast.error(t("errors.deleteFailed"));
			return;
		}

		onDelete(item.id);
	};

	if (!isEditing)
		return (
			<CreatedItem
				data={item}
				onDelete={handleDelete}
				onEdit={() => {
					form.reset({
						title: item.title,
						description: item.description ?? "",
						startsAt: item.startsAt
							? toLocalDateTimeString(new Date(item.startsAt))
							: "",
						endsAt: item.endsAt
							? toLocalDateTimeString(new Date(item.endsAt))
							: "",
						location: item.location ?? "",
						speakerName: item.speakerName ?? "",
					});
					setIsEditing(true);
				}}
			/>
		);

	return (
		<div className="w-full flex flex-col gap-4 border-border border-l-2 border-t p-4">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
				<FieldSet className="w-full flex flex-col gap-5">
					<div className="row flex items-start gap-3">
						<div className="flex flex-col gap-1">
							<div className="flex flex-row gap-0 items-end">
								<Controller
									name="startsAt"
									control={control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
											className="w-min"
										>
											<FieldLabel htmlFor="startAt">
												{t("startsAt")}
											</FieldLabel>
											<InputGroup>
												<InputGroupAddon>
													<IconClock className="size-4" />
												</InputGroupAddon>
												<InputGroupInput
													type="time"
													id="startAt"
													className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
													value={
														field.value?.slice(
															11,
															16,
														) ?? ""
													}
													onChange={(e) => {
														const date =
															field.value?.slice(
																0,
																10,
															);
														field.onChange(
															date
																? `${date}T${e.target.value}`
																: e.target
																		.value,
														);
													}}
													onBlur={field.onBlur}
													aria-invalid={
														fieldState.invalid
													}
												/>
											</InputGroup>
											{/* {fieldState.invalid && (
											<FieldError
												errors={[fieldState.error]}
											/>
										)} */}
										</Field>
									)}
								/>
								<div className="separator w-2 h-0.5 border-b border-border mb-4"></div>
								<Controller
									name="endsAt"
									control={control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
											className="w-min"
										>
											<FieldLabel htmlFor="endsAt">
												{t("endsAt")}
											</FieldLabel>
											<InputGroup>
												<InputGroupAddon>
													<IconClock className="size-4" />
												</InputGroupAddon>

												<InputGroupInput
													type="time"
													id="endsAt"
													className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
													value={
														field.value?.slice(
															11,
															16,
														) ?? ""
													}
													onChange={(e) => {
														const date = (
															startsAtValue ??
															field.value
														)?.slice(0, 10);
														field.onChange(
															date
																? `${date}T${e.target.value}`
																: e.target
																		.value,
														);
													}}
													onBlur={field.onBlur}
													aria-invalid={
														fieldState.invalid
													}
												/>
											</InputGroup>
											{/* {fieldState.invalid && (
											<FieldError
												errors={[fieldState.error]}
											/>
										)} */}
										</Field>
									)}
								/>
							</div>
							{dayNumber && (
								<FieldDescription className="pl-2">
									{formatDayLabel(
										date.toDateString(),
										dayNumber,
										"pl",
									)}
								</FieldDescription>
							)}
						</div>

						<Separator orientation="vertical" />
						<div className="flex flex-row w-full gap-2 items-end">
							<Controller
								name="location"
								control={control}
								render={({ field }) => (
									<Field>
										<FieldLabel htmlFor="location">
											{t("location")}
										</FieldLabel>
										<InputGroup>
											<InputGroupAddon>
												<IconMapPin className="size-4" />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
												id="location"
												placeholder={t(
													"locationPlaceholder",
												)}
											/>
										</InputGroup>
									</Field>
								)}
							/>
							<Controller
								name="speakerName"
								control={control}
								render={({ field }) => (
									<Field>
										<FieldLabel htmlFor="speakerName">
											{t("speakerName")}
										</FieldLabel>
										<InputGroup>
											<InputGroupAddon>
												<IconUser className="size-4" />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
												id="speakerName"
												placeholder={t(
													"speakerNamePlaceholder",
												)}
											/>
										</InputGroup>
									</Field>
								)}
							/>
						</div>
					</div>
					<div className="row flex flex-col gap-3">
						<Controller
							name="title"
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="title">
										{t("title")}
									</FieldLabel>
									<InputGroup>
										<InputGroupInput
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder={t("titlePlaceholder")}
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

						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<Field>
									<FieldLabel htmlFor="title">
										{t("description")}
									</FieldLabel>
									<InputGroup>
										<InputGroupInput
											{...field}
											placeholder={t(
												"descriptionPlaceholder",
											)}
										/>
									</InputGroup>
								</Field>
							)}
						/>
					</div>
				</FieldSet>
				<div className="buttons justify-end flex gap-1">
					<Button
						type="button"
						size="sm"
						variant="secondary"
						disabled={isSubmitting}
						onClick={() =>
							item.id.startsWith("temp-")
								? onDelete(item.id)
								: setIsEditing(false)
						}
					>
						{t("cancel")}
					</Button>
					<Button
						type="submit"
						size="sm"
						variant="success"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<IconLoader className="mr-2 size-4 animate-spin" />
								{t("saving")}
							</>
						) : (
							<>
								{isEditing ? (
									<>
										<IconDeviceFloppy className="size-4" />
										{t("save")}
									</>
								) : (
									<>
										<IconCheck className="size-4" />
										{t("add")}
									</>
								)}
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}

const CreatedItem = ({
	data,
	onDelete,
	onEdit,
}: {
	data: AgendaItem;
	onDelete: (id: string) => void;
	onEdit: () => void;
}) => {
	return (
		<div className="agenda-item-card w-full relative flex flex-col gap-1 border-border border-l-2 pl-5 pt-1 pb-3 group text-base ">
			<div className="mark absolute size-2.5 -left-1.5 top-3.5 rounded-full bg-black"></div>
			<header className="flex gap-2 items-center justify-between h-8">
				<div className="data flex items-start gap-3">
					<div className="time flex gap-1 items-center text-muted-foreground">
						<p className="text-foreground font-medium">
							{DateTimeFormatter.time(data.startsAt, "pl")}
						</p>
						<span>-</span>
						<p>{DateTimeFormatter.time(data.endsAt, "pl")}</p>
					</div>

					{data.location && <Separator orientation="vertical" />}
					<div className="location-speaker flex items-center gap-1 text-muted-foreground">
						{data.location && (
							<div className="location text-primary font-medium">
								{data.location}
							</div>
						)}
						{data.speakerName && (
							<>
								<span>-</span>
								{data.speakerName}
							</>
						)}
					</div>
				</div>
				<div className="buttons hidden group-hover:flex gap-1">
					<Button
						type="button"
						size="icon-sm"
						variant="outline"
						onClick={onEdit}
					>
						<IconPencil className="size-4" />
					</Button>
					<Button
						type="button"
						size="icon-sm"
						variant="destructive"
						onClick={() => onDelete(data.id)}
					>
						<IconTrash className="size-4" />
					</Button>
				</div>
			</header>
			<main className="flex flex-col gap-1">
				<h5 className="font-medium">{data.title}</h5>
				<p className="text-sm text-muted-foreground">
					{data.description}
				</p>
			</main>
		</div>
	);
};
