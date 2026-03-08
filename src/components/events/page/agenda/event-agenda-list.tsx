"use client";
import { EventAgendaItem } from "@prisma/client";
import React, { useState } from "react";
import EventAgendaListItem from "./event-agenda-item";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/ui/button";

const EventAgendaList = ({
	items,
	locale,
	isOpen,
}: {
	items: EventAgendaItem[];
	locale: string;
	isOpen: boolean;
}) => {
	return (
		<div className="w-full flex flex-col items-start justify-center gap-4 relative over">
			<div className="w-px h-full bg-slate-200 absolute top-0 left-17 z-[-1]"></div>
			<div
				className={cn(
					"list-wrapper w-full overflow-hidden rounded-b-3xl h-30",
					{
						"h-fit": isOpen,
					},
				)}
			>
				{items.map((item) => (
					<EventAgendaListItem
						key={item.id}
						data={item}
						locale={locale}
					/>
				))}
			</div>
		</div>
	);
};

export default EventAgendaList;
