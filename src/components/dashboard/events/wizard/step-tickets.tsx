"use client";

import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
	eventTicketsSchema,
	type EventTicketsInput,
} from "@/schemas/event-tickets.schema";
import { upsertTicketsAction } from "@/actions/tickets/upsert-tickets.action";
import { deleteTicketAction } from "@/actions/tickets/delete-ticket.action";
import { type EventTicket } from "@/actions/tickets/get-event-tickets.action";

import { Label } from "@/components/shadcn/ui/label";
import { Button } from "@/components/shadcn/ui/button";
import {
	IconPlus,
	IconTrash,
	IconLoader2,
	IconArrowLeft,
	IconTicket,
	IconCurrencyZloty,
	IconUsers,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useState } from "react";
import { Field, FieldError } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import { EventStatus } from "@prisma/client";

type Props = {
	eventId: string;
	initialTickets: EventTicket[];
};

export function StepTickets({ eventId, initialTickets }: Props) {
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("EventWizard.tickets");
	const tErrors = useTranslations("CreateEventErrors");
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const form = useForm<EventTicketsInput>({
		resolver: zodResolver(eventTicketsSchema(tErrors)),
		defaultValues: {
			tickets:
				initialTickets.length > 0
					? initialTickets
					: [{ name: "", price: 0, quantity: 100 }], // одна пустая карточка по умолчанию
		},
		mode: "onBlur",
		reValidateMode: "onBlur",
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "tickets",
	});

	const [submitStatus, setSubmitStatus] = useState<EventStatus>(
		EventStatus.DRAFT,
	);

	const onSubmit = async (data: EventTicketsInput) => {
		const result = await upsertTicketsAction({
			eventId,
			status: submitStatus,
			data,
		});

		if (!result.success) {
			toast.error(t("errors.default"));
			setSubmitStatus(EventStatus.DRAFT);
			return;
		}

		toast.success(
			submitStatus === EventStatus.PUBLISHED
				? t("successPublished")
				: t("successDraft"),
		);

		router.push(`/${locale}/profile/events`);
	};

	const handleDelete = async (index: number, ticketId?: string) => {
		if (ticketId) {
			setDeletingId(ticketId);
			const result = await deleteTicketAction(ticketId);
			setDeletingId(null);

			if (!result.success) {
				toast.error(t("errors.deleteFailed"));
				return;
			}
		}
		remove(index);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			{/* Список билетов */}
			<div className="flex flex-col gap-4">
				{fields.map((field, index) => (
					<div
						key={field.id}
						className="relative rounded-lg border bg-card p-4"
					>
						{/* Заголовок карточки */}
						<div className="mb-4 flex items-center justify-between">
							<span className="text-sm font-medium text-muted-foreground">
								{t("ticketNumber", { number: index + 1 })}
							</span>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								disabled={
									deletingId === field.id ||
									fields.length === 1
								}
								onClick={() => handleDelete(index, field.id)}
								className="text-destructive hover:text-destructive"
							>
								{deletingId === field.id ? (
									<IconLoader2 className="size-4 animate-spin" />
								) : (
									<IconTrash className="size-4" />
								)}
							</Button>
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
							{/* Название */}
							<Controller
								name={`tickets.${index}.name`}
								control={control}
								render={({ field, fieldState }) => (
									<Field
										data-invalid={fieldState.invalid}
										className="sm:col-span-1"
									>
										<Label>{t("name")}</Label>
										<InputGroup>
											<InputGroupAddon>
												<IconTicket className="size-4" />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
												aria-invalid={
													fieldState.invalid
												}
												placeholder={t(
													"namePlaceholder",
												)}
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

							{/* Цена */}
							<Controller
								name={`tickets.${index}.price`}
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<Label>{t("price")}</Label>
										<InputGroup>
											<InputGroupAddon>
												<IconCurrencyZloty className="size-4" />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
												type="number"
												min={0}
												step={1}
												aria-invalid={
													fieldState.invalid
												}
												placeholder="0"
												onChange={(e) =>
													field.onChange(
														Number(e.target.value),
													)
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

							{/* Количество */}
							<Controller
								name={`tickets.${index}.quantity`}
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<Label>{t("quantity")}</Label>
										<InputGroup>
											<InputGroupAddon>
												<IconUsers className="size-4" />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
												type="number"
												min={1}
												aria-invalid={
													fieldState.invalid
												}
												placeholder={t(
													"quantityPlaceholder",
												)}
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(
														e.target.value === ""
															? null
															: Number(
																	e.target
																		.value,
																),
													)
												}
											/>
										</InputGroup>
										<p className="mt-1 text-xs text-muted-foreground">
											{t("quantityHint")}
										</p>
										{fieldState.invalid && (
											<FieldError
												errors={[fieldState.error]}
											/>
										)}
									</Field>
								)}
							/>
						</div>
					</div>
				))}
			</div>

			{/* Добавить билет */}
			<Button
				type="button"
				variant="outline"
				onClick={() => append({ name: "", price: 0, quantity: 100 })}
				className="w-full border-dashed"
			>
				<IconPlus className="mr-2 size-4" />
				{t("addTicket")}
			</Button>

			{/* Навигация */}
			<div className="flex justify-between">
				<Button
					type="button"
					variant="outline"
					onClick={() =>
						router.push(
							`/${locale}/profile/events/${eventId}/edit/additional`,
						)
					}
				>
					<IconArrowLeft className="mr-2 size-4" />
					{t("back")}
				</Button>

				<div className="flex gap-3">
					<Button
						type="submit"
						variant="outline"
						disabled={isSubmitting}
						onClick={() => setSubmitStatus(EventStatus.DRAFT)}
					>
						{isSubmitting && submitStatus === EventStatus.DRAFT ? (
							<IconLoader2 className="mr-2 size-4 animate-spin" />
						) : null}
						{t("saveDraft")}
					</Button>
					<Button
						type="submit"
						disabled={isSubmitting}
						onClick={() => setSubmitStatus(EventStatus.PUBLISHED)}
					>
						{isSubmitting &&
						submitStatus === EventStatus.PUBLISHED ? (
							<IconLoader2 className="mr-2 size-4 animate-spin" />
						) : null}
						{t("publish")}
					</Button>
				</div>
			</div>
		</form>
	);
}
