// src/components/dashboard/events/tickets/ticket-card.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import { Textarea } from "@/components/shadcn/ui/textarea";
import {
	IconTrash,
	IconLoader,
	IconDeviceFloppy,
	IconTicket,
	IconCurrencyZloty,
	IconUsers,
	IconPencil,
} from "@tabler/icons-react";
import { ticketSchema, type TicketInput } from "@/schemas/event-tickets.schema";
import { upsertTicketsAction } from "@/actions/tickets/upsert-tickets.action";
import { deleteTicketAction } from "@/actions/tickets/delete-ticket.action";
import { toast } from "sonner";
import { EventStatus } from "@prisma/client";
import { Separator } from "@/components/shadcn/ui/separator";
import { TicketWrapper } from "@/components/events/tickets/steps/participants/ticket-wrapper";
import { Typography } from "@/components/shared";
import { formatCurrencyPln } from "@/lib/utils";

export type LocalTicket = {
	id: string; // "temp-{timestamp}" for unsaved, real UUID for saved
	name: string;
	description?: string | null;
	price: number;
	quantity: number | null;
};

type Props = {
	eventId: string;
	ticket: LocalTicket;
	index: number;
	onDelete: (id: string) => void;
	onSave: (oldId: string, updated: LocalTicket) => void;
};

export function TicketCard({
	eventId,
	ticket,
	index,
	onDelete,
	onSave,
}: Props) {
	const t = useTranslations("EventWizard.tickets");
	const tErrors = useTranslations("CreateEventErrors");
	const isTemp = ticket.id.startsWith("temp-");
	const [isEditing, setIsEditing] = useState(isTemp);
	const [isDeleting, setIsDeleting] = useState(false);

	const form = useForm<TicketInput>({
		resolver: zodResolver(ticketSchema(tErrors)),
		defaultValues: {
			id: isTemp ? undefined : ticket.id,
			name: ticket.name,
			description: ticket.description ?? null,
			price: ticket.price,
			quantity: ticket.quantity,
		},
		mode: "onBlur",
		reValidateMode: "onBlur",
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (data: TicketInput) => {
		const result = await upsertTicketsAction({
			eventId,
			status: EventStatus.DRAFT,
			data: {
				tickets: [
					{
						id: isTemp ? undefined : ticket.id,
						name: data.name,
						description: data.description ?? null,
						price: data.price,
						quantity: data.quantity,
					},
				],
			},
		});

		if (!result.success) {
			toast.error(t("errors.default"));
			return;
		}

		const saved = result.data.tickets[0];
		toast.success(t("saved"));
		setIsEditing(false);
		onSave(ticket.id, saved);
	};

	const handleDelete = async () => {
		if (isTemp) {
			onDelete(ticket.id);
			return;
		}

		setIsDeleting(true);
		const result = await deleteTicketAction(ticket.id);
		setIsDeleting(false);

		if (!result.success) {
			toast.error(t("errors.deleteFailed"));
			return;
		}

		onDelete(ticket.id);
	};

	const handleCancel = () => {
		if (isTemp) {
			onDelete(ticket.id);
		} else {
			form.reset({
				id: ticket.id,
				name: ticket.name,
				description: ticket.description ?? null,
				price: ticket.price,
				quantity: ticket.quantity,
			});
			setIsEditing(false);
		}
	};

	if (!isEditing) {
		return (
			<TicketWrapper id={ticket.id} className="added-ticket group h-fit">
				<header className="flex items-start justify-between h-8">
					<div className="flex items-center gap-1 ">
						<IconTicket className="size-5" />
						<span className="text-sm font-medium text-muted-foreground">
							{t("ticketNumber", { number: index + 1 })}
						</span>
					</div>
					<div className="flex group-hover:flex md:hidden items-center gap-1">
						<Button
							type="button"
							size="icon-sm"
							variant="outline"
							onClick={() => setIsEditing(true)}
						>
							<IconPencil className="size-4" />
						</Button>
						<Button
							type="button"
							size="icon-sm"
							variant="destructive"
							disabled={isDeleting}
							onClick={handleDelete}
						>
							{isDeleting ? (
								<IconLoader className="size-4 animate-spin" />
							) : (
								<IconTrash className="size-4" />
							)}
						</Button>
					</div>
				</header>
				<main className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<Typography variant="h3">{ticket.name}</Typography>
						{ticket.description && (
							<p className="text-sm text-muted-foreground">
								{ticket.description}
							</p>
						)}
					</div>

					<div className="flex flex-wrap items-center gap-3 gap-y-1 text-sm text-muted-foreground">
						<span className="flex items-center gap-1">
							{ticket.price === 0
								? t("free")
								: formatCurrencyPln(ticket.price * 100)}
						</span>
						<span className="flex items-center gap-1">
							<IconUsers className="size-4" />
							{ticket.quantity === null
								? t("unlimited")
								: ticket.quantity}
						</span>
					</div>
				</main>
			</TicketWrapper>
		);
	}

	return (
		<TicketWrapper id={ticket.id} className="ticket-edit">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3 col-span-2"
			>
				<header className="flex items-center gap-1">
					<IconTicket className="size-5" />
					<span className="text-sm font-medium text-muted-foreground">
						{t("ticketNumber", { number: index + 1 })}
					</span>
				</header>
				<Separator />

				<div className="flex flex-col gap-4">
					{/* Название */}
					<div className="row">
						<Controller
							name="name"
							control={control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									className="sm:col-span-1"
								>
									<FieldLabel>{t("name")}</FieldLabel>
									<InputGroup>
										<InputGroupAddon>
											<IconTicket className="size-4" />
										</InputGroupAddon>
										<InputGroupInput
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder={t("namePlaceholder")}
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
					</div>

					{/* Описание */}
					<div className="row">
						<Controller
							name="description"
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>{t("description")}</FieldLabel>
									<Textarea
										{...field}
										value={field.value ?? ""}
										onChange={(e) =>
											field.onChange(
												e.target.value === ""
													? null
													: e.target.value,
											)
										}
										aria-invalid={fieldState.invalid}
										placeholder={t(
											"descriptionPlaceholder",
										)}
										rows={2}
									/>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
					</div>

					<div className="row grid grid-cols-1 sm:grid-cols-2 gap-3">
						{/* Цена */}
						<Controller
							name="price"
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>{t("price")}</FieldLabel>
									<InputGroup>
										<InputGroupAddon>
											<IconCurrencyZloty className="size-4" />
										</InputGroupAddon>
										<InputGroupInput
											{...field}
											type="number"
											min={0}
											step={1}
											aria-invalid={fieldState.invalid}
											placeholder="0"
											onChange={(e) =>
												field.onChange(
													Number(e.target.value),
												)
											}
										/>
									</InputGroup>
									<div className="flex flex-wrap gap-1 mt-1">
										{[0, 25, 50, 100, 200, 500].map(
											(preset) => (
												<button
													key={preset}
													type="button"
													onClick={() =>
														field.onChange(preset)
													}
													className={`text-xs rounded-lg px-2 py-0.5  cursor-pointer font-medium transition-colors ${
														field.value === preset
															? " bg-foreground text-white"
															: "text-muted-foreground bg-muted hover:text-foreground"
													}`}
												>
													{preset === 0
														? t("free")
														: `${preset} zl`}
												</button>
											),
										)}
									</div>
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
							name="quantity"
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>{t("quantity")}</FieldLabel>
									<InputGroup>
										<InputGroupAddon>
											<IconUsers className="size-4" />
										</InputGroupAddon>
										<InputGroupInput
											{...field}
											type="number"
											min={1}
											aria-invalid={fieldState.invalid}
											placeholder={t(
												"quantityPlaceholder",
											)}
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value === ""
														? null
														: Number(
																e.target.value,
															),
												)
											}
											disabled={field.value === null}
										/>
									</InputGroup>
									<div className="flex flex-wrap gap-1 mt-1">
										{[null, 25, 50, 100, 200].map(
											(preset) => (
												<button
													key={preset}
													type="button"
													onClick={() =>
														field.onChange(preset)
													}
													className={`text-xs rounded-lg px-2 py-0.5 cursor-pointer font-medium transition-colors ${
														field.value === preset
															? " bg-foreground text-white "
															: "text-muted-foreground bg-muted hover:text-foreground"
													}`}
												>
													{preset === null
														? t("unlimited")
														: `${preset}`}
												</button>
											),
										)}
									</div>
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

				<Separator />
				<div className="flex justify-end gap-1">
					<Button
						type="button"
						size="sm"
						variant="secondary"
						disabled={isSubmitting}
						onClick={handleCancel}
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
		</TicketWrapper>
	);
}
