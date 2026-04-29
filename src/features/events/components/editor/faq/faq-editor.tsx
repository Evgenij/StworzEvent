// src/components/dashboard/events/faq/faq-editor.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { IconPlus, IconLoader } from "@tabler/icons-react";
import { FaqItemCard } from "./faq-item-card";
import { toast } from "sonner";
import EmptySection from "../sections/empty-section";
import { FaqItem } from "@/features/events/actions/faq/get-event-faq.action";
import { upsertFaqItemAction } from "@/features/events/actions/faq/upsert-faq-item.action";

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
			{items.length === 0 ? (
				<EmptySection>{t("empty")}</EmptySection>
			) : (
				<div className="flex flex-col gap-2">
					{items.map((item) => (
						<FaqItemCard
							key={item.id}
							eventId={eventId}
							item={item}
							onDelete={handleDelete}
							onSave={handleSave}
						/>
					))}
				</div>
			)}

			<Button
				type="button"
				variant="outline"
				disabled={isCreating}
				onClick={handleAdd}
				className="w-full"
			>
				{isCreating ? (
					<IconLoader className=" size-4 animate-spin" />
				) : (
					<IconPlus className=" size-4" />
				)}
				{t("add")}
			</Button>
		</div>
	);
}
