// src/components/dashboard/events/sections/sections-editor.tsx
"use client";

import { useState, useTransition } from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
} from "@hello-pangea/dnd";
import { SectionType } from "@prisma/client";
import { SectionCard, type SectionData } from "./section-card";
import { SectionTypePicker } from "./section-type-picker";
import { createSectionAction } from "@/actions/events/sections/create-section.action";
import { reorderSectionsAction } from "@/actions/events/sections/reorder-sections.action";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import type { EventSection } from "@/actions/events/sections/get-event-sections.action";

type Props = {
	eventId: string;
	initialSections: EventSection[];
};

// Дефолтный контент для каждого типа секции
const DEFAULT_CONTENT: Record<SectionType, any> = {
	[SectionType.TEXT]: { type: "doc", content: [] },
	[SectionType.IMAGE]: { urls: [] },
	[SectionType.VIDEO]: { url: "" },
};

export function SectionsEditor({ eventId, initialSections }: Props) {
	const t = useTranslations("EventWizard.sections");
	const [sections, setSections] = useState<SectionData[]>(initialSections);
	const [isCreating, setIsCreating] = useState(false);
	const [isPendingReorder, startReorderTransition] = useTransition();

	const handleAddSection = async (type: SectionType) => {
		setIsCreating(true);

		const result = await createSectionAction({
			eventId,
			data: {
				type,
				title: "",
				content: DEFAULT_CONTENT[type],
			},
		});

		setIsCreating(false);

		if (!result.success) {
			toast.error(t("errors.saveFailed"));
			return;
		}

		// Добавляем новую секцию в список
		setSections((prev) => [
			...prev,
			{
				id: result.data.sectionId,
				type,
				title: null,
				content: DEFAULT_CONTENT[type],
				order: prev.length,
				isVisible: true,
			},
		]);
	};

	const handleDeleteSection = (id: string) => {
		setSections((prev) => prev.filter((s) => s.id !== id));
	};

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return;
		if (result.destination.index === result.source.index) return;

		const reordered = Array.from(sections);
		const [removed] = reordered.splice(result.source.index, 1);
		reordered.splice(result.destination.index, 0, removed);

		// Обновляем локально сразу — optimistic update
		setSections(reordered);

		// Сохраняем на сервер в фоне
		startReorderTransition(async () => {
			const result2 = await reorderSectionsAction({
				eventId,
				orderedIds: reordered.map((s) => s.id),
			});

			if (!result2.success) {
				// Откатываем если ошибка
				setSections(sections);
				toast.error(t("errors.reorderFailed"));
			}
		});
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Список секций с drag&drop */}
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="sections">
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="flex flex-col gap-2"
						>
							{sections.length === 0 && (
								<div className="rounded-lg border border-dashed p-6 text-center">
									<p className="text-sm text-muted-foreground">
										{t("emptySections")}
									</p>
								</div>
							)}

							{sections.map((section, index) => (
								<Draggable
									key={section.id}
									draggableId={section.id}
									index={index}
								>
									{(provided) => (
										<SectionCard
											section={section}
											provided={provided}
											onDelete={handleDeleteSection}
										/>
									)}
								</Draggable>
							))}

							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			{/* Индикатор reorder */}
			{isPendingReorder && (
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<IconLoader2 className="size-3 animate-spin" />
					{t("saving")}
				</div>
			)}

			{/* Добавить секцию */}
			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium">{t("addSection")}</p>
				{isCreating ? (
					<div className="flex items-center justify-center py-3">
						<IconLoader2 className="size-5 animate-spin text-muted-foreground" />
					</div>
				) : (
					<SectionTypePicker
						onSelect={handleAddSection}
						disabled={isCreating}
					/>
				)}
			</div>
		</div>
	);
}
