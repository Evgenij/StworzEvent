// src/components/dashboard/events/sections/section-links.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/ui/button";
import { Field, FieldError } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import { Label } from "@/components/shadcn/ui/label";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/shadcn/ui/combobox";
import { IconLoader2, IconPlus, IconTrash } from "@tabler/icons-react";
import type { ComponentType } from "react";
import { updateSectionAction } from "@/actions/events/sections/update-section.action";
import { SectionType } from "@prisma/client";
import { toast } from "sonner";
import type { SectionData } from "./section-card";
import { LINK_SERVICES } from "./link-services";

type Props = {
	section: SectionData;
};

type ServiceOption = {
	id: string;
	label: string;
	Icon: ComponentType<{ className?: string }>;
};

type LinkItem = { url: string; service: string };

// ─── ServiceCombobox ─────────────────────────────────────────────────────────

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
			value={selected}
			onValueChange={(item) => onChange(item?.id ?? "none")}
			items={allOptions}
			itemToStringLabel={(item) => item?.label ?? ""}
			isItemEqualToValue={(a, b) => a?.id === b?.id}
			onInputValueChange={setInputValue}
			onOpenChange={(open) => { if (open) setInputValue(""); }}
		>
			<ComboboxInput className="w-44 shrink-0" showClear={value !== "none"}>
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

export function SectionLinks({ section }: Props) {
	const t = useTranslations("EventWizard.sections");
	const [sectionTitle, setSectionTitle] = useState(section.title ?? "");
	const [links, setLinks] = useState<LinkItem[]>(
		(section.content as any)?.links ?? [],
	);
	const [errors, setErrors] = useState<(string | null)[]>([]);
	const [isSaving, setIsSaving] = useState(false);

	const addLink = () => {
		setLinks((prev) => [...prev, { url: "", service: "none" }]);
		setErrors((prev) => [...prev, null]);
	};

	const removeLink = (index: number) => {
		setLinks((prev) => prev.filter((_, i) => i !== index));
		setErrors((prev) => prev.filter((_, i) => i !== index));
	};

	const updateLink = (index: number, patch: Partial<LinkItem>) => {
		setLinks((prev) =>
			prev.map((link, i) => (i === index ? { ...link, ...patch } : link)),
		);
		if (patch.url !== undefined) {
			setErrors((prev) => prev.map((e, i) => (i === index ? null : e)));
		}
	};

	const handleSave = async () => {
		const newErrors = links.map((link) => {
			if (!link.url) return t("links.urlRequired");
			try {
				new URL(link.url);
				return null;
			} catch {
				return t("links.invalidUrl");
			}
		});

		setErrors(newErrors);
		if (newErrors.some(Boolean)) return;

		setIsSaving(true);

		const result = await updateSectionAction({
			sectionId: section.id,
			data: {
				type: SectionType.LINKS,
				title: sectionTitle,
				content: { links },
			},
		});

		setIsSaving(false);

		if (!result.success) {
			toast.error(t("errors.saveFailed"));
			return;
		}

		toast.success(t("saved"));
	};

	return (
		<div className="flex flex-col gap-3">
			<Field>
				<Label>{t("sectionTitle")}</Label>
				<InputGroup>
					<InputGroupInput
						value={sectionTitle}
						onChange={(e) => setSectionTitle(e.target.value)}
						placeholder={t("sectionTitlePlaceholder")}
					/>
				</InputGroup>
			</Field>

			<div className="flex flex-col gap-2">
				<Label>{t("links.linksLabel")}</Label>

				{links.length === 0 && (
					<p className="text-sm text-muted-foreground">
						{t("links.empty")}
					</p>
				)}

				{links.map((link, index) => (
					<div key={index} className="flex items-start gap-2">
						{/* Service combobox */}
						<ServiceCombobox
							value={link.service}
							onChange={(serviceId) =>
								updateLink(index, { service: serviceId })
							}
						/>

						{/* URL input */}
						<Field
							data-invalid={!!errors[index]}
							className="flex-1"
						>
							<InputGroup>
								<InputGroupInput
									value={link.url}
									onChange={(e) =>
										updateLink(index, {
											url: e.target.value,
										})
									}
									placeholder="https://..."
									aria-invalid={!!errors[index]}
								/>
							</InputGroup>
							{errors[index] && (
								<FieldError
									errors={[{ message: errors[index]! }]}
								/>
							)}
						</Field>

						{/* Remove */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => removeLink(index)}
							className="shrink-0 text-destructive hover:text-destructive"
						>
							<IconTrash className="size-4" />
						</Button>
					</div>
				))}

				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={addLink}
					className="self-start"
				>
					<IconPlus className="mr-1.5 size-4" />
					{t("links.addLink")}
				</Button>
			</div>

			<Button
				type="button"
				size="sm"
				disabled={isSaving}
				onClick={handleSave}
				className="self-end"
			>
				{isSaving ? (
					<>
						<IconLoader2 className="mr-2 size-4 animate-spin" />
						{t("saving")}
					</>
				) : (
					t("save")
				)}
			</Button>
		</div>
	);
}
