// src/components/dashboard/events/agenda/agenda-item-card.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/shadcn/ui/collapsible";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Field, FieldError } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import {
	IconChevronDown,
	IconChevronUp,
	IconTrash,
	IconLoader2,
	IconCalendar,
	IconMapPin,
	IconUser,
} from "@tabler/icons-react";
import {
	agendaItemSchema,
	type AgendaItemInput,
} from "@/schemas/agenda-item.schema";
import { upsertAgendaItemAction } from "@/actions/events/agenda/upsert-agenda-item.action";
import { deleteAgendaItemAction } from "@/actions/events/agenda/delete-agenda-item.action";
import { toast } from "sonner";
import { format } from "date-fns";
import type { AgendaItem } from "@/actions/events/agenda/get-event-agenda.action";

type Props = {
	eventId: string;
	item: AgendaItem;
	onDelete: (id: string) => void;
	onSave: (id: string, data: AgendaItem) => void;
};

export function AgendaItemCard({ eventId, item, onDelete, onSave }: Props) {
	const t = useTranslations("EventWizard.agenda");
	const tErrors = useTranslations("CreateEventErrors");
	const [isOpen, setIsOpen] = useState(!item.title); // новые — сразу открыты
	const [isDeleting, setIsDeleting] = useState(false);

	const form = useForm<AgendaItemInput>({
		resolver: zodResolver(agendaItemSchema(tErrors)),
		defaultValues: {
			title: item.title,
			description: item.description ?? "",
			startsAt: item.startsAt
				? new Date(item.startsAt).toISOString().slice(0, 16)
				: "",
			endsAt: item.endsAt
				? new Date(item.endsAt).toISOString().slice(0, 16)
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
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (data: AgendaItemInput) => {
		const result = await upsertAgendaItemAction({
			eventId,
			itemId: item.id,
			data,
		});

		if (!result.success) {
			toast.error(t("errors.saveFailed"));
			return;
		}

		toast.success(t("saved"));
		setIsOpen(false);

		onSave(item.id, {
			...item,
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

	return (
		<div className="rounded-lg border bg-card">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				{/* Header */}
				<div className="flex items-center gap-2 p-3">
					<div className="flex-1 min-w-0">
						<p className="truncate text-sm font-medium">
							{item.title || t("newItem")}
						</p>
						{item.startsAt && !isOpen && (
							<p className="text-xs text-muted-foreground">
								{format(
									new Date(item.startsAt),
									"d MMM, HH:mm",
								)}
							</p>
						)}
					</div>

					<div className="flex items-center gap-1">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={isDeleting}
							onClick={handleDelete}
							className="text-destructive hover:text-destructive"
						>
							{isDeleting ? (
								<IconLoader2 className="size-4 animate-spin" />
							) : (
								<IconTrash className="size-4" />
							)}
						</Button>

						<CollapsibleTrigger asChild>
							<Button type="button" variant="ghost" size="sm">
								{isOpen ? (
									<IconChevronUp className="size-4" />
								) : (
									<IconChevronDown className="size-4" />
								)}
							</Button>
						</CollapsibleTrigger>
					</div>
				</div>

				{/* Body */}
				<CollapsibleContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-3 border-t p-3"
					>
						{/* Название */}
						<Controller
							name="title"
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<Label>{t("title")}</Label>
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

						{/* Описание */}
						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<Field>
									<Label>{t("description")}</Label>
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

						{/* Даты */}
						<div className="grid grid-cols-2 gap-3">
							<Controller
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
							<Controller
								name="endsAt"
								control={control}
								render={({ field }) => (
									<Field>
										<Label>{t("endsAt")}</Label>
										<InputGroup>
											<InputGroupAddon>
												<IconCalendar className="size-4" />
											</InputGroupAddon>
											<InputGroupInput
												type="datetime-local"
												{...field}
												value={field.value ?? ""}
											/>
										</InputGroup>
									</Field>
								)}
							/>
						</div>

						{/* Зал / Спикер */}
						<div className="grid grid-cols-2 gap-3">
							<Controller
								name="location"
								control={control}
								render={({ field }) => (
									<Field>
										<Label>{t("location")}</Label>
										<InputGroup>
											<InputGroupAddon>
												<IconMapPin className="size-4" />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
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
										<Label>{t("speakerName")}</Label>
										<InputGroup>
											<InputGroupAddon>
												<IconUser className="size-4" />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
												placeholder={t(
													"speakerNamePlaceholder",
												)}
											/>
										</InputGroup>
									</Field>
								)}
							/>
						</div>

						<Button
							type="submit"
							size="sm"
							disabled={isSubmitting}
							className="self-end"
						>
							{isSubmitting ? (
								<>
									<IconLoader2 className="mr-2 size-4 animate-spin" />
									{t("saving")}
								</>
							) : (
								t("save")
							)}
						</Button>
					</form>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
