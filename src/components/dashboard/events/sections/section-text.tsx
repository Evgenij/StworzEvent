"use client";

import { useTranslations } from "next-intl";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { Button } from "@/components/shadcn/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import { IconDeviceFloppy, IconLoader } from "@tabler/icons-react";
import { updateSectionAction } from "@/actions/events/sections/update-section.action";
import { SectionType } from "@prisma/client";
import { toast } from "sonner";
import type { SectionData } from "./section-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
	type SectionTextInput,
	sectionTextSchema,
} from "@/schemas/section.schema";

type Props = {
	section: SectionData;
	onTitleChange?: (title: string) => void;
};

export function SectionText({ section, onTitleChange }: Props) {
	const t = useTranslations("EventWizard.sections");
	const tErrors = useTranslations("EventWizard.sections.errors");

	const form = useForm<SectionTextInput>({
		resolver: zodResolver(sectionTextSchema(tErrors)),
		defaultValues: {
			type: SectionType.TEXT, // ← было missing
			title: section.title ?? "",
			content: section.content as Record<string, unknown>,
		},
		mode: "onChange",
		reValidateMode: "onChange",
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (values: SectionTextInput) => {
		// console.log(values);

		const result = await updateSectionAction({
			sectionId: section.id,
			data: {
				type: SectionType.TEXT,
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

			<Controller
				name="content"
				control={control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel>{t("content")}</FieldLabel>
						<RichTextEditor
							value={field.value}
							onChange={field.onChange}
							data-invalid={fieldState.invalid}
						/>
						{fieldState.invalid && (
							<FieldError errors={[fieldState.error]} />
						)}
					</Field>
				)}
			/>

			<Button
				type="submit"
				variant="success"
				size="sm"
				disabled={isSubmitting}
				className="self-end"
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
		</form>
	);
}
