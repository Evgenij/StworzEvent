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
	FieldGroup,
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
import { DateTimeFormatter } from "@/helpers/date-formatter";
import { FormGroup, FormRow } from "@/components/forms";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import FutureFunctionWrapper from "@/features/layout/components/wrapper-future-function";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/shadcn/ui/tabs";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/shadcn/ui/popover";

export function CreateEventForm() {
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("CreateEvent");

	const form = useForm<CreateEventInput>({
		resolver: zodResolver(createEventSchema((key) => t(`errors.${key}`))),
		defaultValues: {
			title: "",
			startsAt: DateTimeFormatter.timeISO(new Date()),
			// endsAt: "",
			location: "",
			street: "",
			streetNumber: "",
			ticketType: "free",
			ticketPrice: 50,
			payAtEntrance: false,
			publishImmediately: false,
			ticketQuantity: null,
			coverImage: null,
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

		// console.log(data);

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
					<div className="wrapper flex items-center justify-between gap-1">
						<div className="flex items-center gap-1">
							<FieldLabel htmlFor="title">
								{t("cover")}
							</FieldLabel>
							<span className="text-muted-foreground text-xs">
								({t("optional")})
							</span>
						</div>
						<Popover>
							<PopoverTrigger
								asChild
								className="cursor-pointer group hidden"
							>
								<div className="flex items-center gap-0.5">
									<IconInfoCircle className="size-4 text-link " />
									<span className="text-muted-foreground text-xs group-hover:text-foreground">
										{t("coverRules")}
									</span>
								</div>
							</PopoverTrigger>
							<PopoverContent className="w-80">
								<div className="grid gap-4">
									<div className="space-y-2">
										<h4 className="leading-none font-medium">
											Dimensions
										</h4>
										<p className="text-sm text-muted-foreground">
											Set the dimensions for the layer.
										</p>
									</div>
									<div className="grid gap-2">
										{/* <div className="grid grid-cols-3 items-center gap-4">
											<Label htmlFor="width">Width</Label>
											<Input
												id="width"
												defaultValue="100%"
												className="col-span-2 h-8"
											/>
										</div>
										<div className="grid grid-cols-3 items-center gap-4">
											<Label htmlFor="maxWidth">
												Max. width
											</Label>
											<Input
												id="maxWidth"
												defaultValue="300px"
												className="col-span-2 h-8"
											/>
										</div>
										<div className="grid grid-cols-3 items-center gap-4">
											<Label htmlFor="height">
												Height
											</Label>
											<Input
												id="height"
												defaultValue="25px"
												className="col-span-2 h-8"
											/>
										</div>
										<div className="grid grid-cols-3 items-center gap-4">
											<Label htmlFor="maxHeight">
												Max. height
											</Label>
											<Input
												id="maxHeight"
												defaultValue="none"
												className="col-span-2 h-8"
											/>
										</div> */}
									</div>
								</div>
							</PopoverContent>
						</Popover>
					</div>
					<Controller
						control={control}
						name="coverImage"
						render={({ field }) => (
							<EventCoverUpload
								value={field.value || ""}
								onChange={field.onChange}
								onClear={() => field.onChange(null)}
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
			<FormGroup label={t("locationLabel")} icon={IconMap2}>
				<Tabs defaultValue="offline" className="w-full gap-4">
					<TabsList className="w-full">
						<TabsTrigger value="offline">Lokalizacja</TabsTrigger>
						<FutureFunctionWrapper>
							<TabsTrigger value="online" disabled>
								Online
							</TabsTrigger>
						</FutureFunctionWrapper>
					</TabsList>
					<TabsContent
						value="offline"
						className="flex flex-col gap-4"
					>
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
						<FormRow>
							<Field>
								<FieldLabel htmlFor="street">
									{t("street")}
								</FieldLabel>
								<Input
									id="street"
									{...register("street")}
									placeholder={t("streetPlaceholder")}
									aria-invalid={!!errors.street}
								/>
								<FieldError errors={[errors.street]} />
							</Field>
							<Field className="w-35 shrink-0">
								<FieldLabel htmlFor="number">
									{t("number")}
								</FieldLabel>
								<Input
									id="streetNumber"
									{...register("streetNumber")}
									placeholder={t("numberPlaceholder")}
									aria-invalid={!!errors.streetNumber}
								/>
								<FieldError errors={[errors.streetNumber]} />
							</Field>
						</FormRow>
					</TabsContent>
					<TabsContent
						value="online"
						className="flex flex-col gap-4"
					></TabsContent>
				</Tabs>
			</FormGroup>
			{/* <div className="fields-group flex flex-col gap-4">
				
			</div> */}
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
					<div className="flex flex-col gap-3 border border-border rounded-xl p-3 shadow-xl/5">
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
						<Separator />
						<Controller
							control={control}
							name="payAtEntrance"
							render={({ field }) => (
								<Field
									orientation="horizontal"
									className="gap-2"
								>
									<Checkbox
										id="pay-at-entrance"
										checked={field.value ?? false}
										name="payAtEntrance"
										onCheckedChange={field.onChange}
									/>
									<FieldContent>
										<FieldLabel
											className="pl-0"
											htmlFor="pay-at-entrance"
										>
											{t("payAtEntrance")}
										</FieldLabel>
										<FieldDescription
											onClick={() =>
												field.onChange(!field.value)
											}
										>
											{t("payAtEntranceDescription")}
										</FieldDescription>
									</FieldContent>
								</Field>
								// <FieldLabel className="p-0 cursor-pointer">
								// 	<Field orientation="horizontal">
								// 		<Checkbox
								// 			id="pay-at-entrance"
								// 			checked={field.value ?? false}
								// 			onCheckedChange={field.onChange}
								// 		/>
								// 		<FieldContent>
								// 			<FieldTitle>
								// 				{t("payAtEntrance")}
								// 			</FieldTitle>
								// 			<FieldDescription>
								// 				{t("payAtEntranceDescription")}
								// 			</FieldDescription>
								// 		</FieldContent>
								// 	</Field>
								// </FieldLabel>
							)}
						/>
						{/* <FieldGroup className="mx-auto w-72">
							<Field orientation="horizontal">
								<Checkbox
									id="terms-checkbox-desc"
									name="terms-checkbox-desc"
									defaultChecked
								/>
								<FieldContent>
									<FieldLabel htmlFor="terms-checkbox-desc">
										Accept terms and conditions
									</FieldLabel>
									<FieldDescription>
										By clicking this checkbox, you agree to
										the terms and conditions.
									</FieldDescription>
								</FieldContent>
							</Field>
						</FieldGroup> */}
					</div>
				)}
				{/* Quantity */}
				<Field>
					<div className="flex items-center justify-between pr-2 mb-2">
						<FieldLabel>{t("ticketQuantity")}</FieldLabel>

						<span className="text-sm font-semibold tabular-nums">
							{watch("ticketQuantity") ?? "Bez limitu"}
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
									{[25, 50, 150, 500, 1000, 2000, null].map(
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
												{preset === null
													? "Bez limitu"
													: preset}
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
			<FutureFunctionWrapper>
				<FieldLabel className="pl-0">
					<Field orientation="horizontal" data-disabled>
						<Checkbox
							id="toggle-checkbox-2"
							name="toggle-checkbox-2"
							disabled
						/>
						<FieldContent>
							<FieldTitle>Wydarzenie prywatne</FieldTitle>
							<FieldDescription>
								Wydarzenie wylacznie dla zaproszonych
								użytkowników.
							</FieldDescription>
						</FieldContent>
					</Field>
				</FieldLabel>
			</FutureFunctionWrapper>

			{/* <pre>{JSON.stringify(form.getValues(), null, 2)}</pre> */}
			{/* Submit */}
			<div className="flex flex-col gap-3 items-center">
				<Button
					type="submit"
					disabled={isSubmitting}
					className={cn("w-full")}
				>
					{isSubmitting ? (
						<IconLoader className="size-4 animate-spin" />
					) : null}
					{t("submit")}
				</Button>
				<Controller
					control={control}
					name="publishImmediately"
					render={({ field }) => (
						<Field
							orientation="horizontal"
							className="gap-2 items-center w-fit"
						>
							<Checkbox
								id="publish-immediately"
								checked={field.value ?? false}
								onCheckedChange={field.onChange}
							/>
							<FieldLabel
								className="pl-0 cursor-pointer font-normal"
								htmlFor="publish-immediately"
							>
								{t("publishImmediately")}
							</FieldLabel>
						</Field>
					)}
				/>
			</div>
		</form>
	);
}
