// components/events/tickets/steps/buyer-form.tsx

import { Controller, UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/schemas/order.schema";
import { Field, FieldError, FieldGroup } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupIMask,
	InputGroupInput,
	InputGroupText,
} from "@/components/shadcn/ui/input-group";
import { useTranslations } from "next-intl";
import { IconMail, IconPhone, IconUser } from "@tabler/icons-react";

type BuyerFormProps = {
	form: UseFormReturn<OrderFormValues>;
};

export const BuyerForm = ({ form }: BuyerFormProps) => {
	const tAuth = useTranslations("Auth");

	return (
		<FieldGroup>
			<div className="flex gap-2">
				<Controller
					name="buyer.name"
					control={form.control}
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
									autoComplete="given-name"
								/>
							</InputGroup>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
				<Controller
					name="buyer.surname"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<InputGroup>
								<InputGroupInput
									{...field}
									aria-invalid={fieldState.invalid}
									placeholder={tAuth("placeholders.surname")}
									type="text"
									autoComplete="family-name"
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
				name="buyer.email"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<InputGroup>
							<InputGroupInput
								{...field}
								aria-invalid={fieldState.invalid}
								placeholder={tAuth("placeholders.mail")}
								type="email"
								autoComplete="email"
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
				name="buyer.phone"
				control={form.control}
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
	);
};
