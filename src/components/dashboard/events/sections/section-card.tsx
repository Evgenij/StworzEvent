// src/components/dashboard/events/sections/section-card.tsx
"use client";

import { useState } from "react";
import { SectionType } from "@prisma/client";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/shadcn/ui/collapsible";
import { Button } from "@/components/shadcn/ui/button";
import {
	IconChevronDown,
	IconChevronUp,
	IconTrash,
	IconLoader2,
	IconGripVertical,
	IconPhoto,
	IconVideo,
	IconAlignLeft,
	IconLink,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SectionText } from "./section-text";
import { SectionGallery } from "./section-gallery";
import { SectionVideo } from "./section-video";
import { SectionLinks } from "./section-links";
import type { DraggableProvided } from "@hello-pangea/dnd";
import { deleteSectionAction } from "@/actions/events/sections/delete-section.action";

const SECTION_ICONS = {
	[SectionType.TEXT]: IconAlignLeft,
	[SectionType.LINKS]: IconLink,
	[SectionType.IMAGE]: IconPhoto,
	[SectionType.VIDEO]: IconVideo,
};

export type SectionData = {
	id: string;
	type: SectionType;
	title: string | null;
	content: any;
	order: number;
	isVisible: boolean;
};

type Props = {
	section: SectionData;
	provided: DraggableProvided;
	onDelete: (id: string) => void;
};

export function SectionCard({ section, provided, onDelete }: Props) {
	const t = useTranslations("EventWizard.sections");
	const [isOpen, setIsOpen] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);

	const Icon = SECTION_ICONS[section.type];

	const handleDelete = async () => {
		setIsDeleting(true);
		const result = await deleteSectionAction(section.id);
		setIsDeleting(false);

		if (!result.success) {
			toast.error(t("errors.deleteFailed"));
			return;
		}

		onDelete(section.id);
	};

	return (
		<div
			ref={provided.innerRef}
			{...provided.draggableProps}
			className="rounded-lg border bg-card"
		>
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				{/* Header */}
				<div className="flex items-center gap-2 p-3">
					{/* Drag handle */}
					<div
						{...provided.dragHandleProps}
						className="cursor-grab text-muted-foreground active:cursor-grabbing"
					>
						<IconGripVertical className="size-4" />
					</div>

					{/* Иконка типа */}
					<Icon className="size-4 shrink-0 text-muted-foreground" />

					{/* Название секции */}
					<span className="flex-1 truncate text-sm font-medium">
						{section.title ||
							t(`types.${section.type.toLowerCase()}`)}
					</span>

					{/* Кнопки */}
					<div className="flex items-center gap-1">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={isDeleting}
							onClick={handleDelete}
							className="text-destructive hover:text-destructive"
						>
							{isDeleting ? (
								<IconLoader2 className="size-4 animate-spin" />
							) : (
								<IconTrash className="size-4" />
							)}
						</Button>

						<CollapsibleTrigger asChild>
							<Button type="button" variant="ghost" size="sm">
								{isOpen ? (
									<IconChevronUp className="size-4" />
								) : (
									<IconChevronDown className="size-4" />
								)}
							</Button>
						</CollapsibleTrigger>
					</div>
				</div>

				{/* Body */}
				<CollapsibleContent>
					<div className={cn("border-t p-3")}>
						{section.type === SectionType.TEXT && (
							<SectionText section={section} />
						)}
						{section.type === SectionType.LINKS && (
							<SectionLinks section={section} />
						)}
						{section.type === SectionType.IMAGE && (
							<SectionGallery section={section} />
						)}
						{section.type === SectionType.VIDEO && (
							<SectionVideo section={section} />
						)}
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
