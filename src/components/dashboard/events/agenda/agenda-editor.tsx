// src/components/dashboard/events/agenda/agenda-editor.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/ui/button";
import { IconLoader, IconPlus } from "@tabler/icons-react";
import { AgendaItemCard } from "./agenda-item-card";
import type { AgendaItem } from "@/actions/events/agenda/get-event-agenda.action";
import { formatDayLabel } from "@/components/events/page/agenda/event-agenda";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/shadcn/ui/tabs";
import { cn } from "@/lib/utils";
import EmptySection from "../sections/empty-section";

type Props = {
	eventId: string;
	initialItems: AgendaItem[];
	startDate?: Date | string;
	endDate?: Date | string;
};

const toDateString = (d: Date | string): string => {
	const date = new Date(d);
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
};

const generateDaysBetween = (
	start: Date | string,
	end: Date | string,
): string[] => {
	const days: string[] = [];
	const current = new Date(start);
	current.setHours(0, 0, 0, 0);
	const endDay = new Date(end);
	endDay.setHours(0, 0, 0, 0);

	while (current <= endDay) {
		const y = current.getFullYear();
		const m = String(current.getMonth() + 1).padStart(2, "0");
		const d = String(current.getDate()).padStart(2, "0");
		days.push(`${y}-${m}-${d}`);
		current.setDate(current.getDate() + 1);
	}
	return days;
};

export function AgendaEditor({
	eventId,
	initialItems,
	startDate,
	endDate,
}: Props) {
	const t = useTranslations("EventWizard.agenda");
	const [items, setItems] = useState<AgendaItem[]>(initialItems);
	const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
	const [sortedItems, setSortedItems] = useState<AgendaItem[]>([]);
	const [deleting, setDeleting] = useState<boolean>(false);

	const isMultiDay =
		startDate && endDate
			? toDateString(startDate) !== toDateString(endDate)
			: false;

	const allDays: string[] =
		isMultiDay && startDate && endDate
			? generateDaysBetween(startDate, endDate)
			: startDate
				? [toDateString(startDate)]
				: [];

	const [activeTab, setActiveTab] = useState<string>(allDays[0] ?? "");

	useEffect(() => {
		const saved = items.filter((i) => !newItemIds.has(i.id));
		const newOnes = items.filter((i) => newItemIds.has(i.id));
		setSortedItems([
			...[...saved].sort(
				(a, b) => a.startsAt.getTime() - b.startsAt.getTime(),
			),
			...newOnes,
		]);
	}, [items, newItemIds]);

	const handleAdd = (dayDate?: string) => {
		const baseDate = dayDate ?? activeTab;
		const startsAt = baseDate
			? `${baseDate}T09:00`
			: new Date().toISOString().slice(0, 16);

		const tempId = `temp-${Date.now()}`;
		setNewItemIds((prev) => new Set(prev).add(tempId));
		setItems((prev) => [
			...prev,
			{
				id: tempId,
				title: "",
				description: null,
				startsAt: new Date(startsAt),
				endsAt: null,
				location: null,
				speakerName: null,
				order: prev.length,
			},
		]);
	};

	const handleDelete = (id: string) => {
		setDeleting(true);

		setNewItemIds((prev) => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
		setItems((prev) => prev.filter((item) => item.id !== id));

		setDeleting(false);
	};

	const handleSave = (oldId: string, updated: AgendaItem) => {
		setNewItemIds((prev) => {
			const next = new Set(prev);
			next.delete(oldId);
			return next;
		});
		setItems((prev) =>
			prev.map((item) => (item.id === oldId ? updated : item)),
		);
	};

	const itemsForDay = (day: string) => {
		const dayItems = items.filter(
			(item) => toDateString(item.startsAt) === day,
		);
		const saved = dayItems.filter((i) => !newItemIds.has(i.id));
		const newOnes = dayItems.filter((i) => newItemIds.has(i.id));
		return [
			...saved.sort(
				(a, b) => a.startsAt.getTime() - b.startsAt.getTime(),
			),
			...newOnes,
		];
	};

	return (
		<div
			className={cn(
				"agenda-editor flex flex-col gap-3 items-center",
				// {
				// 	"opacity-50 cursor-not-allowed": deleting,
				// },
			)}
		>
			{items.length === 0 && (
				<EmptySection>{t("empty")}</EmptySection>
				// <div className="rounded-xl w-full border-2 border-dashed p-5 text-center">
				// 	<p className="text-sm text-muted-foreground">
				// 		{t("empty")}
				// 	</p>
				// </div>
			)}
			{isMultiDay && allDays.length > 0 ? (
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<TabsList className="mb-2">
						{allDays.map((date, idx) => (
							<TabsTrigger key={date} value={date}>
								{formatDayLabel(date, idx, "pl")}
							</TabsTrigger>
						))}
					</TabsList>

					{allDays.map((date, idx) => {
						const dayItems = itemsForDay(date);
						return (
							<TabsContent
								key={date}
								value={date}
								className="flex flex-col items-center gap-3"
							>
								{dayItems.length === 0 ? (
									<EmptySection>
										<p className="text-sm text-muted-foreground">
											{formatDayLabel(date, idx, "pl")} —{" "}
											{t("empty")}
										</p>
									</EmptySection>
								) : (
									<WrapperItemsList deleting={deleting}>
										{dayItems.map((item, idx) => (
											<AgendaItemCard
												key={item.id}
												date={item.startsAt}
												dayNumber={idx}
												eventId={eventId}
												item={item}
												onDelete={handleDelete}
												onSave={handleSave}
											/>
										))}
									</WrapperItemsList>
								)}

								<Button
									variant="outline"
									onClick={() => handleAdd(date)}
								>
									<IconPlus className=" size-4" />
									{t("add")}
								</Button>
							</TabsContent>
						);
					})}
				</Tabs>
			) : (
				<>
					{sortedItems.length > 0 && (
						<WrapperItemsList deleting={deleting}>
							{sortedItems.map((item) => (
								<AgendaItemCard
									key={item.id}
									date={item.startsAt}
									eventId={eventId}
									item={item}
									onDelete={handleDelete}
									onSave={handleSave}
								/>
							))}
						</WrapperItemsList>
					)}

					<Button
						variant="outline"
						disabled={deleting}
						onClick={() => handleAdd()}
					>
						<IconPlus className="mr-2 size-4" />
						{t("add")}
					</Button>
				</>
			)}
		</div>
	);
}

const WrapperItemsList = ({
	children,
	deleting,
}: {
	children: React.ReactNode;
	deleting: boolean;
}) => {
	return (
		<div className="agenda-wrapper-items-list  relative flex flex-col pl-4 w-full">
			{deleting && (
				<div className="flex items-center z-10 gap-2 justify-center text-sm text-foreground absolute top-0 right-0 bg-white/80 h-full w-full">
					<IconLoader className="size-5 animate-spin" /> Usunięcie
					punktu w trakcie
				</div>
			)}
			{children}
		</div>
	);
};
