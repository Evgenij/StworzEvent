"use client";

import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
	createEventSchema,
	type CreateEventInput,
} from "@/schemas/create-event.schema";
import { createEventAction } from "@/actions/events/create-event.action";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldTitle,
} from "@/components/shadcn/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/ui/radio-group";
import { DateTimePicker } from "@/components/shared/date-time-picker";
import { EventCoverUpload } from "./event-cover-upload";
import {
	IconInfoCircle,
	IconLoader,
	IconMap2,
	IconTicket,
} from "@tabler/icons-react";
import { Slider } from "@/components/shadcn/ui/slider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PolishCityCombobox } from "./location/polish-city-combobox";
import { Separator } from "@/components/shadcn/ui/separator";

export function CreateEventForm() {
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("CreateEvent");

	const form = useForm<CreateEventInput>({
		resolver: zodResolver(createEventSchema((key) => t(`errors.${key}`))),
		defaultValues: {
			title: "",
			startsAt: "",
			// endsAt: "",
			location: "",
			street: "",
			streetNumber: "",
			ticketType: "free",
			ticketPrice: 50,
			ticketQuantity: 5,
			coverImage: "",
		},
	});

	const {
		handleSubmit,
		control,
		register,
		watch,
		formState: { isSubmitting, errors },
	} = form;

	const ticketType = watch("ticketType");

	const onSubmit: SubmitHandler<CreateEventInput> = async (data) => {
		const result = await createEventAction(data);

		console.log(data);

		if (!result.success) {
			toast.error(t("errors.default"));
			return;
		}
		router.push(`/${locale}/profile/events/${result.data.eventId}/edit`);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
			<div className="fields-group flex flex-col gap-4">
				<Field>
					<div className="wrapper flex items-center gap-1">
						<FieldLabel htmlFor="title">{t("cover")}</FieldLabel>
						<span className="text-muted-foreground text-xs">
							({t("optional")})
						</span>
					</div>
					<Controller
						control={control}
						name="coverImage"
						render={({ field }) => (
							<EventCoverUpload
								value={field.value}
								onChange={field.onChange}
								onClear={() => field.onChange("")}
							/>
						)}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="title">{t("title")}</FieldLabel>
					<Input
						id="title"
						{...register("title")}
						placeholder={t("titlePlaceholder")}
						aria-invalid={!!errors.title}
					/>
					<FieldError errors={[errors.title]} />
				</Field>
				<Field>
					<FieldLabel>{t("startsAt")}</FieldLabel>
					<Controller
						control={control}
						name="startsAt"
						render={({ field }) => (
							<DateTimePicker
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								aria-invalid={!!errors.startsAt}
							/>
						)}
					/>
					<FieldError errors={[errors.startsAt]} />
				</Field>
			</div>

			{/* location */}
			<div className="fields-group flex flex-col gap-4">
				<div className="text-muted-foreground flex items-center gap-1 text-sm ml-2">
					<IconMap2 className="size-5 text-primary" />
					{t("locationLabel")}
				</div>
				<Field>
					<FieldLabel>{t("city")}</FieldLabel>
					<Controller
						control={control}
						name="location"
						render={({ field }) => (
							<PolishCityCombobox
								value={field.value || ""}
								onChange={field.onChange}
								onBlur={field.onBlur}
								invalid={!!errors.location}
							/>
						)}
					/>
					<FieldError errors={[errors.location]} />
				</Field>
				<div className="flex gap-2">
					<Field className="flex-2">
						<FieldLabel htmlFor="street">{t("street")}</FieldLabel>
						<Input
							id="street"
							{...register("street")}
							placeholder={t("streetPlaceholder")}
							aria-invalid={!!errors.street}
						/>
						<FieldError errors={[errors.street]} />
					</Field>
					<Field className="flex-1">
						<FieldLabel htmlFor="number">{t("number")}</FieldLabel>
						<Input
							id="streetNumber"
							{...register("streetNumber")}
							placeholder={t("numberPlaceholder")}
							aria-invalid={!!errors.streetNumber}
						/>
						<FieldError errors={[errors.streetNumber]} />
					</Field>
				</div>
			</div>
			<div className="fields-group flex flex-col gap-4">
				<div className="text-muted-foreground flex items-center gap-1 text-sm ml-2">
					<IconTicket className="size-5 text-primary" />
					{t("ticketLabel")}
				</div>
				<Field>
					<FieldLabel>{t("typeTicket")}</FieldLabel>
					<Controller
						control={control}
						name="ticketType"
						render={({ field }) => (
							<RadioGroup
								value={field.value}
								onValueChange={field.onChange}
								className="grid-cols-2"
							>
								<FieldLabel
									htmlFor="ticket-free"
									className="p-0 cursor-pointer"
								>
									<Field orientation="horizontal">
										<FieldContent>
											<FieldTitle>{t("free")}</FieldTitle>
											<FieldDescription>
												{t("freeDescription")}
											</FieldDescription>
										</FieldContent>
										<RadioGroupItem
											value="free"
											id="ticket-free"
										/>
									</Field>
								</FieldLabel>
								<FieldLabel
									htmlFor="ticket-paid"
									className="p-0 cursor-pointer"
								>
									<Field orientation="horizontal">
										<FieldContent>
											<FieldTitle>{t("paid")}</FieldTitle>
											<FieldDescription>
												{t("paidDescription")}
											</FieldDescription>
										</FieldContent>
										<RadioGroupItem
											value="paid"
											id="ticket-paid"
										/>
									</Field>
								</FieldLabel>
							</RadioGroup>
						)}
					/>
					<FieldDescription className="ml-2 text-sm flex items-center gap-1 mt-2">
						<IconInfoCircle className="size-4" />
						{t("ticketDescription")}
					</FieldDescription>
				</Field>

				{ticketType === "paid" && (
					<div className="border border-border rounded-xl p-3 shadow-xl/5">
						{/* <Separator /> */}
						<Field>
							<div className="flex items-center justify-between pr-2 mb-2">
								<FieldLabel className="pl-0">
									{t("ticketPrice")}
								</FieldLabel>
								<span className="text-sm font-semibold tabular-nums">
									{watch("ticketPrice") ?? 0} zł
								</span>
							</div>
							<Controller
								control={control}
								name="ticketPrice"
								render={({ field }) => {
									const adjust = (delta: number) =>
										field.onChange(
											Math.max(
												0,
												(field.value ?? 0) + delta,
											),
										);
									return (
										<div className="flex flex-col gap-2">
											<div className="flex gap-1">
												{[15, 30, 50, 100, 200].map(
													(preset) => (
														<Button
															key={preset}
															type="button"
															variant={
																field.value ===
																preset
																	? "default"
																	: "secondary"
															}
															size="sm"
															className="flex-1 text-xs h-7"
															onClick={() =>
																field.onChange(
																	preset,
																)
															}
														>
															{preset} zł
														</Button>
													),
												)}
											</div>
											<div className="flex items-center gap-1">
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="h-9 px-2.5 text-xs shrink-0"
													onClick={() => adjust(-20)}
												>
													−20
												</Button>
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="h-9 px-2.5 text-xs shrink-0"
													onClick={() => adjust(-5)}
												>
													−5
												</Button>
												<Input
													type="number"
													min={0}
													step={1}
													value={field.value ?? ""}
													onChange={(e) =>
														field.onChange(
															e.target.value ===
																""
																? undefined
																: e.target
																		.valueAsNumber,
														)
													}
													onBlur={field.onBlur}
													placeholder="0"
													aria-invalid={
														!!errors.ticketPrice
													}
													className="text-center"
												/>
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="h-9 px-2.5 text-xs shrink-0"
													onClick={() => adjust(5)}
												>
													+5
												</Button>
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="h-9 px-2.5 text-xs shrink-0"
													onClick={() => adjust(20)}
												>
													+20
												</Button>
											</div>
										</div>
									);
								}}
							/>
							<FieldError errors={[errors.ticketPrice]} />
						</Field>
					</div>
				)}
				{/* Quantity */}
				<Field>
					<div className="flex items-center justify-between pr-2 mb-2">
						<FieldLabel>{t("ticketQuantity")}</FieldLabel>
						<span className="text-sm font-semibold tabular-nums">
							{watch("ticketQuantity") ?? 5}
						</span>
					</div>
					<Controller
						control={control}
						name="ticketQuantity"
						render={({ field }) => (
							<div className="flex flex-col gap-3">
								<Slider
									min={5}
									max={2000}
									step={5}
									value={[field.value ?? 5]}
									onValueChange={([val]) =>
										field.onChange(val)
									}
								/>
								<div className="flex gap-1">
									{[25, 50, 100, 250, 500, 1000, 2000].map(
										(preset) => (
											<Button
												key={preset}
												type="button"
												variant={
													field.value === preset
														? "default"
														: "outline"
												}
												size="sm"
												className="flex-1 text-xs h-7"
												onClick={() =>
													field.onChange(preset)
												}
											>
												{preset}
											</Button>
										),
									)}
								</div>
							</div>
						)}
					/>
					<FieldError errors={[errors.ticketQuantity]} />
				</Field>
			</div>
			{/* <pre>{JSON.stringify(form.getValues(), null, 2)}</pre> */}
			{/* Submit */}
			<Button
				type="submit"
				disabled={isSubmitting}
				className={cn("w-full")}
			>
				{isSubmitting ? (
					<IconLoader className="size-4 animate-spin mr-2" />
				) : null}
				{t("submit")}
			</Button>
		</form>
	);
}
