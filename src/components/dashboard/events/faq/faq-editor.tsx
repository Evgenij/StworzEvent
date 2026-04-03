// src/components/dashboard/events/faq/faq-editor.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/ui/button";
import { IconPlus, IconLoader } from "@tabler/icons-react";
import { FaqItemCard } from "./faq-item-card";
import { upsertFaqItemAction } from "@/actions/events/faq/upsert-faq-item.action";
import { toast } from "sonner";
import type { FaqItem } from "@/actions/events/faq/get-event-faq.action";

type Props = {
	eventId: string;
	initialItems: FaqItem[];
};

export function FaqEditor({ eventId, initialItems }: Props) {
	const t = useTranslations("EventWizard.faq");
	const [items, setItems] = useState<FaqItem[]>(initialItems);
	const [isCreating, setIsCreating] = useState(false);

	const handleAdd = async () => {
		setIsCreating(true);

		const result = await upsertFaqItemAction({
			eventId,
			data: { question: "", answer: "" },
		});

		setIsCreating(false);

		if (!result.success) {
			toast.error(t("errors.createFailed"));
			return;
		}

		setItems((prev) => [
			...prev,
			{
				id: result.data.itemId,
				question: "",
				answer: "",
				order: prev.length,
			},
		]);
	};

	const handleDelete = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const handleSave = (id: string, updated: FaqItem) => {
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
				<FaqItemCard
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
					<IconLoader className="mr-2 size-4 animate-spin" />
				) : (
					<IconPlus className="mr-2 size-4" />
				)}
				{t("add")}
			</Button>
		</div>
	);
}
