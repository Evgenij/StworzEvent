"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
	eventDetailsSchema,
	type EventDetailsInput,
} from "@/schemas/event-details.schema";
import { updateEventAction } from "@/actions/events/update-event.action";
import { type EventForEdit } from "@/actions/events/get-event-for-edit.action";

import { Label } from "@/components/shadcn/ui/label";
import { Button } from "@/components/shadcn/ui/button";
import { CategoryCombobox } from "@/components/dashboard/events/category-combobox";
import {
	IconCalendar,
	IconMapPin,
	IconBuilding,
	IconLoader2,
	IconArrowLeft,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Field, FieldError } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";

type Props = {
	event: EventForEdit;
};

export function StepDetails({ event }: Props) {
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("EventWizard.details");
	const tErrors = useTranslations("CreateEventErrors");

	const form = useForm<EventDetailsInput>({
		resolver: zodResolver(eventDetailsSchema(tErrors)),
		defaultValues: {
			startsAt: event.startsAt
				? new Date(event.startsAt).toISOString().slice(0, 16)
				: "",
			endsAt: event.endsAt
				? new Date(event.endsAt).toISOString().slice(0, 16)
				: "",
			location: event.location ?? "",
			address: event.address ?? "",
			categoryId: event.categoryId,
		},
		mode: "onBlur",
		reValidateMode: "onBlur",
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (data: EventDetailsInput) => {
		const result = await updateEventAction({ eventId: event.id, data });

		if (!result.success) {
			toast.error(t("errors.default"));
			return;
		}

		router.push(`/${locale}/profile/events/${event.id}/edit/tickets`);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			{/* Даты */}
			<div className="grid grid-cols-2 gap-4">
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
									aria-invalid={fieldState.invalid}
								/>
							</InputGroup>
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
				/>
			</div>

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

			{/* Категория */}
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

			{/* Навигация */}
			<div className="flex justify-between">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(`/${locale}/profile/events/new`)}
				>
					<IconArrowLeft className="mr-2 size-4" />
					{t("back")}
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? (
						<>
							<IconLoader2 className="mr-2 size-4 animate-spin" />
							{t("saving")}
						</>
					) : (
						t("next")
					)}
				</Button>
			</div>
		</form>
	);
}
