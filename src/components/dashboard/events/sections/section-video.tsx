// src/components/dashboard/events/sections/section-video.tsx
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
import { IconBrandYoutube, IconLoader2 } from "@tabler/icons-react";
import { updateSectionAction } from "@/actions/events/sections/update-section.action";
import { sectionVideoSchema } from "@/schemas/section.schema";
import { SectionType } from "@prisma/client";
import { toast } from "sonner";
import type { SectionData } from "./section-card";

type Props = {
	section: SectionData;
};

export function SectionVideo({ section }: Props) {
	const t = useTranslations("EventWizard.sections");
	const tErrors = useTranslations("CreateEventErrors");
	const [sectionTitle, setSectionTitle] = useState(section.title ?? "");
	const [url, setUrl] = useState((section.content as any)?.url ?? "");
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		if (!url) {
			setError(tErrors("required"));
			return;
		}
		try {
			new URL(url);
		} catch {
			setError(tErrors("invalidUrl"));
			return;
		}

		setError(null);
		setIsSaving(true);

		const result = await updateSectionAction({
			sectionId: section.id,
			data: {
				type: SectionType.VIDEO,
				title: sectionTitle,
				content: { url },
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

			<Field data-invalid={!!error}>
				<Label>{t("videoUrl")}</Label>
				<InputGroup>
					<InputGroupAddon>
						<IconBrandYoutube className="size-4" />
					</InputGroupAddon>
					<InputGroupInput
						value={url}
						onChange={(e) => {
							setUrl(e.target.value);
							setError(null);
						}}
						placeholder="https://youtube.com/watch?v=..."
						aria-invalid={!!error}
					/>
				</InputGroup>
				{error && <FieldError errors={[{ message: error }]} />}
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
