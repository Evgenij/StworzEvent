// src/components/dashboard/events/sections/section-text.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { Button } from "@/components/shadcn/ui/button";
import { Field, FieldError } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import { Label } from "@/components/shadcn/ui/label";
import { IconLoader } from "@tabler/icons-react";
import { updateSectionAction } from "@/actions/events/sections/update-section.action";
import { SectionType } from "@prisma/client";
import { toast } from "sonner";
import type { SectionData } from "./section-card";

type Props = {
	section: SectionData;
};

export function SectionText({ section }: Props) {
	const t = useTranslations("EventWizard.sections");
	const [title, setTitle] = useState(section.title ?? "");
	const [content, setContent] = useState(section.content);
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		setIsSaving(true);
		const result = await updateSectionAction({
			sectionId: section.id,
			data: {
				type: SectionType.TEXT,
				title,
				content,
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
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder={t("sectionTitlePlaceholder")}
					/>
				</InputGroup>
			</Field>

			<Field>
				<Label>{t("content")}</Label>
				<RichTextEditor value={content} onChange={setContent} />
			</Field>

			<Button
				type="button"
				size="sm"
				disabled={isSaving}
				onClick={handleSave}
				className="self-end"
			>
				{isSaving ? (
					<>
						<IconLoader className="mr-2 size-4 animate-spin" />
						{t("saving")}
					</>
				) : (
					t("save")
				)}
			</Button>
		</div>
	);
}
