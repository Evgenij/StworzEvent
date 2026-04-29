"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import {
	IconDeviceFloppy,
	IconLoader,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import { SectionType } from "@prisma/client";
import { toast } from "sonner";
import type { SectionData } from "./section-card";
import { LINK_SERVICES } from "./link-services";
import EmptySection from "./empty-section";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import {
	SectionLinksInput,
	sectionLinksSchema,
} from "@/features/events/schemas/section.schema";
import { updateSectionAction } from "@/features/events/actions/sections/update-section.action";

type Props = {
	section: SectionData;
	onTitleChange?: (title: string) => void;
};

type ServiceOption = {
	id: string;
	label: string;
	Icon: ComponentType<{ className?: string }>;
};

// ─── ServiceCombobox ──────────────────────────────────────────────────────────

type ServiceComboboxProps = {
	value: string;
	onChange: (serviceId: string) => void;
};

function ServiceCombobox({ value, onChange }: ServiceComboboxProps) {
	const t = useTranslations("EventWizard.sections");
	const [inputValue, setInputValue] = useState("");

	const allOptions: ServiceOption[] = LINK_SERVICES.map((s) => ({
		id: s.id,
		label: t(`links.services.${s.labelKey}`),
		Icon: s.Icon,
	}));

	const filtered = allOptions.filter((o) =>
		o.label.toLowerCase().includes(inputValue.toLowerCase()),
	);

	const selected = allOptions.find((o) => o.id === value) ?? allOptions[0];
	const SelectedIcon = selected.Icon;

	return (
		<Combobox
			// value={selected}
			// onValueChange={(item) => onChange(item?.id ?? "none")}
			// itemToStringLabel={(item) => item?.label ?? ""}
			// isItemEqualToValue={(a, b) => a?.id === b?.id}
			// onInputValueChange={setInputValue}
			// onOpenChange={(open) => {
			// 	if (open) setInputValue("");
			// }}
			value={selected}
			onValueChange={(item) => onChange(item?.id ?? "none")}
			items={allOptions} // ← вернуть
			itemToStringLabel={(item) => item?.label ?? ""}
			isItemEqualToValue={(a, b) => a?.id === b?.id}
		>
			<ComboboxInput
				className="w-44 shrink-0"
				showClear={value !== "none"}
			>
				<InputGroupAddon>
					<SelectedIcon className="size-4" />
				</InputGroupAddon>
			</ComboboxInput>
			<ComboboxContent>
				<ComboboxEmpty>{t("links.noResults")}</ComboboxEmpty>
				<ComboboxList>
					{filtered.map((option) => (
						<ComboboxItem key={option.id} value={option}>
							<option.Icon className="size-4 shrink-0" />
							{option.label}
						</ComboboxItem>
					))}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}

// ─── SectionLinks ─────────────────────────────────────────────────────────────

export function SectionLinks({ section, onTitleChange }: Props) {
	const t = useTranslations("EventWizard.sections");
	const tErrors = useTranslations("EventWizard.sections.errors");

	const form = useForm<SectionLinksInput>({
		resolver: zodResolver(sectionLinksSchema(tErrors)),
		defaultValues: {
			type: SectionType.LINKS,
			title: section.title ?? "",
			content: {
				links: (section.content as any)?.links ?? [],
			},
		},
		mode: "onBlur",
		reValidateMode: "onChange",
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting, errors },
	} = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "content.links",
	});

	const onSubmit = async (values: SectionLinksInput) => {
		const result = await updateSectionAction({
			sectionId: section.id,
			data: {
				type: SectionType.LINKS,
				title: values.title,
				content: values.content,
			},
		});

		if (!result.success) {
			toast.error(t("errors.saveFailed"));
			return;
		}

		onTitleChange?.(values.title);
		toast.success(t("saved"));
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
			<Controller
				name="title"
				control={control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel>{t("sectionTitle")}</FieldLabel>
						<InputGroup>
							<InputGroupInput
								{...field}
								aria-invalid={fieldState.invalid}
								placeholder={t("sectionTitlePlaceholder")}
							/>
						</InputGroup>
						{fieldState.invalid && (
							<FieldError errors={[fieldState.error]} />
						)}
					</Field>
				)}
			/>

			<div className="flex flex-col gap-1">
				<FieldLabel>{t("links.linksLabel")}</FieldLabel>

				{fields.length === 0 && (
					<EmptySection>{t("links.empty")}</EmptySection>
				)}
				<div className="flex flex-col gap-2">
					{fields.length > 0 && (
						<div className="links-list flex flex-col gap-2">
							{fields.map((field, index) => (
								<div
									key={field.id}
									className="flex items-start gap-2"
								>
									<Controller
										name={`content.links.${index}.service`}
										control={control}
										render={({ field: serviceField }) => (
											<ServiceCombobox
												value={serviceField.value}
												onChange={serviceField.onChange}
											/>
										)}
									/>

									<Controller
										name={`content.links.${index}.url`}
										control={control}
										render={({
											field: urlField,
											fieldState,
										}) => (
											<Field
												data-invalid={
													fieldState.invalid
												}
												className="flex-1"
											>
												<InputGroup>
													<InputGroupInput
														{...urlField}
														aria-invalid={
															fieldState.invalid
														}
														placeholder="https://..."
													/>
												</InputGroup>
												{fieldState.invalid && (
													<FieldError
														errors={[
															fieldState.error,
														]}
													/>
												)}
											</Field>
										)}
									/>

									<Button
										type="button"
										variant="destructive"
										size="icon"
										onClick={() => remove(index)}
										className="shrink-0"
									>
										<IconTrash className="size-4" />
									</Button>
								</div>
							))}
						</div>
					)}
					<div className="new-link-wrapper flex px-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => {
								append({ url: "", service: "none" });
							}}
							className="self-start flex-1"
						>
							<IconPlus className="size-4" />
							{t("links.addLink")}
						</Button>
					</div>
				</div>

				{errors.content?.links?.root?.message && ( // ← добавить
					<p className="text-sm text-destructive">
						{errors.content.links.root.message}
					</p>
				)}
			</div>

			<Button
				type="submit"
				variant="success"
				size="sm"
				disabled={isSubmitting}
				className="self-end"
			>
				{isSubmitting ? (
					<>
						<IconLoader className="mr-2 size-4 animate-spin" />
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
