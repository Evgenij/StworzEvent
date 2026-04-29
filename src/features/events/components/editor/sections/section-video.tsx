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
	IconBrandYoutube,
	IconDeviceFloppy,
	IconLoader,
} from "@tabler/icons-react";
import { SectionType } from "@prisma/client";
import { toast } from "sonner";
import type { SectionData } from "./section-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
	SectionVideoInput,
	sectionVideoSchema,
} from "@/features/events/schemas/section.schema";
import { updateSectionAction } from "@/features/events/actions/sections/update-section.action";

type Props = {
	section: SectionData;
	onTitleChange?: (title: string) => void;
};

export function SectionVideo({ section, onTitleChange }: Props) {
	const t = useTranslations("EventWizard.sections");
	const tErrors = useTranslations("EventWizard.sections.errors");

	const form = useForm<SectionVideoInput>({
		resolver: zodResolver(sectionVideoSchema(tErrors)),
		defaultValues: {
			type: SectionType.VIDEO,
			title: section.title ?? "",
			content: {
				url: (section.content as any)?.url ?? "",
			},
		},
		mode: "onBlur",
		reValidateMode: "onChange",
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (values: SectionVideoInput) => {
		const result = await updateSectionAction({
			sectionId: section.id,
			data: {
				type: SectionType.VIDEO,
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
				name="content.url"
				control={control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel>{t("videoUrl")}</FieldLabel>
						<InputGroup>
							<InputGroupAddon>
								<IconBrandYoutube className="size-4" />
							</InputGroupAddon>
							<InputGroupInput
								{...field}
								aria-invalid={fieldState.invalid}
								placeholder="https://youtube.com/watch?v=..."
							/>
						</InputGroup>
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
