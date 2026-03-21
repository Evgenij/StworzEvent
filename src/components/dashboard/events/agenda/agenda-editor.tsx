// src/components/dashboard/events/agenda/agenda-editor.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/ui/button";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import { AgendaItemCard } from "./agenda-item-card";
import { upsertAgendaItemAction } from "@/actions/events/agenda/upsert-agenda-item.action";
import { toast } from "sonner";
import type { AgendaItem } from "@/actions/events/agenda/get-event-agenda.action";

type Props = {
	eventId: string;
	initialItems: AgendaItem[];
};

export function AgendaEditor({ eventId, initialItems }: Props) {
	const t = useTranslations("EventWizard.agenda");
	const [items, setItems] = useState<AgendaItem[]>(initialItems);
	const [isCreating, setIsCreating] = useState(false);

	const handleAdd = async () => {
		setIsCreating(true);

		const result = await upsertAgendaItemAction({
			eventId,
			data: {
				title: "",
				description: "",
				startsAt: new Date().toISOString().slice(0, 16),
				endsAt: "",
				location: "",
				speakerName: "",
			},
		});

		setIsCreating(false);

		if (!result.success) {
			toast.error(t("errors.createFailed"));
			return;
		}

		// Добавляем пустой элемент — откроется сразу для редактирования
		setItems((prev) => [
			...prev,
			{
				id: result.data.itemId,
				title: "",
				description: null,
				startsAt: new Date(),
				endsAt: null,
				location: null,
				speakerName: null,
				order: prev.length,
			},
		]);
	};

	const handleDelete = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const handleSave = (id: string, updated: AgendaItem) => {
		setItems((prev) =>
			prev.map((item) => (item.id === id ? updated : item)),
		);
	};

	return (
		<div className="flex flex-col gap-3">
			{items.length === 0 && (
				<div className="rounded-lg border border-dashed p-6 text-center">
					<p className="text-sm text-muted-foreground">
						{t("empty")}
					</p>
				</div>
			)}

			{items.map((item) => (
				<AgendaItemCard
					key={item.id}
					eventId={eventId}
					item={item}
					onDelete={handleDelete}
					onSave={handleSave}
				/>
			))}

			<Button
				type="button"
				variant="outline"
				disabled={isCreating}
				onClick={handleAdd}
				className="w-full border-dashed"
			>
				{isCreating ? (
					<IconLoader2 className="mr-2 size-4 animate-spin" />
				) : (
					<IconPlus className="mr-2 size-4" />
				)}
				{t("add")}
			</Button>
		</div>
	);
}
