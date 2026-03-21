import { Controller, UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/schemas/order.schema";
import {
	Field,
	Field as FieldRow,
	FieldError,
	FieldGroup,
} from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupIMask,
	InputGroupText,
} from "@/components/shadcn/ui/input-group";
import { IconMail, IconPhone, IconTicket, IconUser } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { Label } from "@/components/shadcn/ui/label";

type ParticipantFormCardProps = {
	form: UseFormReturn<OrderFormValues>;
	groupIdx: number;
	participantIdx: number;
	ticketName: string;
	totalInGroup: number;
	buyerEmail?: string;
	onCopyBuyerEmail: () => void;
};

export const ParticipantFormCard = ({
	form,
	groupIdx,
	participantIdx,
	ticketName,
	totalInGroup,
	buyerEmail,
	onCopyBuyerEmail,
}: ParticipantFormCardProps) => {
	const tAuth = useTranslations("Auth");
	const { control, watch, setValue } = form;

	const base = `participants.${groupIdx}.items.${participantIdx}` as const;
	const emailValue = watch(`${base}.email`);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2 text-sm font-semibold">
				<IconTicket className="size-5 text-primary" />
				<span>{ticketName}</span>
				<span className="text-muted-foreground font-normal">
					— bilet {participantIdx + 1}/{totalInGroup}
				</span>
			</div>

			<FieldGroup>
				<div className="flex gap-2">
					<Controller
						name={`${base}.name`}
						control={control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<InputGroup>
									<InputGroupAddon>
										<IconUser className="size-4" />
									</InputGroupAddon>
									<InputGroupInput
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder={tAuth("placeholders.name")}
										type="text"
									/>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name={`${base}.surname`}
						control={control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<InputGroup>
									<InputGroupInput
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder={tAuth(
											"placeholders.surname",
										)}
										type="text"
									/>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</div>

				<Controller
					name={`${base}.email`}
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<InputGroup>
								<InputGroupInput
									{...field}
									aria-invalid={fieldState.invalid}
									placeholder={tAuth("placeholders.mail")}
									type="email"
								/>
								<InputGroupAddon>
									<IconMail className="size-4" />
								</InputGroupAddon>
							</InputGroup>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>

				<Controller
					name={`${base}.phone`}
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<InputGroup>
								<InputGroupAddon>
									<IconPhone className="size-4" />
								</InputGroupAddon>
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
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
			</FieldGroup>

			{buyerEmail && (
				<FieldRow orientation="horizontal">
					<Checkbox
						id={`copy-email-${groupIdx}-${participantIdx}`}
						checked={emailValue === buyerEmail}
						onCheckedChange={(v) => {
							if (v) {
								onCopyBuyerEmail();
							} else {
								setValue(`${base}.email`, "", {
									shouldValidate: true,
								});
							}
						}}
					/>
					<Label
						htmlFor={`copy-email-${groupIdx}-${participantIdx}`}
						className="text-sm"
					>
						Użyj adresu e-mail zamawiającego
					</Label>
				</FieldRow>
			)}
		</div>
	);
};
