// src/components/dashboard/events/sections/section-type-picker.tsx
"use client";

import { SectionType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
	IconPhoto,
	IconVideo,
	IconAlignLeft,
	IconLink,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

type Props = {
	onSelect: (type: SectionType) => void;
	disabled?: boolean;
};

const SECTION_TYPES = [
	{ type: SectionType.TEXT, icon: IconAlignLeft, labelKey: "text" },
	{ type: SectionType.LINKS, icon: IconLink, labelKey: "links" },
	{ type: SectionType.IMAGE, icon: IconPhoto, labelKey: "image" },
	{ type: SectionType.VIDEO, icon: IconVideo, labelKey: "video" },
] as const;

export function SectionTypePicker({ onSelect, disabled }: Props) {
	const t = useTranslations("EventWizard.sections");

	return (
		<div className="flex gap-2">
			{SECTION_TYPES.map(({ type, icon: Icon, labelKey }) => (
				<Button
					key={type}
					type="button"
					variant="outline"
					disabled={disabled}
					onClick={() => onSelect(type)}
					className="flex flex-1 flex-col items-center gap-1.5 h-auto py-3"
				>
					<Icon className="size-5" />
					<span className="text-xs">{t(`types.${labelKey}`)}</span>
				</Button>
			))}
		</div>
	);
}
