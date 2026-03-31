"use client";

import { EventAgendaItem } from "@prisma/client";
import React, { useRef, useState } from "react";
import { Typography } from "@/components/shared";
import {
	IconChevronDown,
	IconChevronUp,
	IconListDetails,
} from "@tabler/icons-react";
import EventAgendaList from "./event-agenda-list";
import { Button } from "@/components/shadcn/ui/button";
import { cn } from "@/lib/utils";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/shadcn/ui/tabs";
import AgendaToggleButton from "./agenda-toggle-button";

// Группируем items по дате (YYYY-MM-DD)
export const groupByDay = (items: EventAgendaItem[]) => {
	const groups = new Map<string, EventAgendaItem[]>();
	items.forEach((item) => {
		const day = item.startsAt.toISOString().split("T")[0]; // "2026-03-17"
		if (!groups.has(day)) groups.set(day, []);
		groups.get(day)!.push(item);
	});
	return Array.from(groups.entries()).map(([date, items]) => ({
		date,
		items,
	}));
};

export const formatDayLabel = (
	dateStr: string,
	idx: number,
	locale: string,
) => {
	const date = new Date(dateStr);
	return `Dzień ${idx + 1} · ${date.toLocaleDateString(locale, { day: "numeric", month: "short" })}`;
};

const EventAgendaSection = ({
	items,
	locale,
}: {
	items: EventAgendaItem[];
	locale: string;
}) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const days = groupByDay(items);
	const isMultiDay = days.length > 1;

	const handleClose = () => {
		setOpen(false);
		setTimeout(() => {
			ref.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}, 50);
	};

	return (
		<div className="w-full flex flex-col items-start justify-center gap-4">
			<header className="w-full flex gap-2 items-center">
				<IconListDetails className="w-6 h-6 text-primary" />
				<Typography variant="h3">Agenda</Typography>
			</header>
			{isMultiDay ? (
				<Tabs defaultValue={days[0].date} className="w-full">
					<TabsList className="mb-2">
						{days.map(({ date }, idx) => (
							<TabsTrigger key={date} value={date}>
								{formatDayLabel(date, idx, locale)}
							</TabsTrigger>
						))}
					</TabsList>

					{days.map(({ date, items: dayItems }) => (
						<TabsContent key={date} value={date}>
							<div className="wrapper w-full">
								<EventAgendaList
									items={dayItems}
									locale={locale}
									isOpen={open}
								/>
								<AgendaToggleButton
									open={open}
									onOpen={() => setOpen(true)}
									onClose={handleClose}
									ref={ref}
								/>
							</div>
						</TabsContent>
					))}
				</Tabs>
			) : (
				<div className="wrapper w-full">
					<EventAgendaList
						items={items}
						locale={locale}
						isOpen={open}
					/>
					<AgendaToggleButton
						open={open}
						onOpen={() => setOpen(true)}
						onClose={handleClose}
						ref={ref}
					/>
				</div>
			)}
		</div>
	);
};

export default EventAgendaSection;
