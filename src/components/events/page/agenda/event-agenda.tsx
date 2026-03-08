"use client";

import { EventAgendaItem } from "@prisma/client";
import React, { useRef, useState } from "react";
import EventAgendaListItem from "./event-agenda-item";
import { Typography } from "@/components/shared";
import {
	IconChevronDown,
	IconChevronUp,
	IconListDetails,
} from "@tabler/icons-react";
import EventAgendaList from "./event-agenda-list";
import { Button } from "@/components/shadcn/ui/button";
import { cn } from "@/lib/utils";

const EventAgendaSection = ({
	items,
	locale,
}: {
	items: EventAgendaItem[];
	locale: string;
}) => {
	const [open, setOpen] = useState(false);

	const ref = useRef<HTMLDivElement>(null);

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
			<div className="wrapper w-full">
				<EventAgendaList items={items} locale={locale} isOpen={open} />
				<div
					ref={ref}
					className={cn(
						"toggle-wrapper relative h-20 transform -translate-y-full flex items-end justify-center w-full bg-linear-to-t from-white to-transparent border-b rounded-2xl pointer-events-none",
					)}
				>
					<Button
						className="absolute -bottom-1/2 -translate-y-1/2 pointer-events-auto"
						variant="outline"
						onClick={open ? handleClose : () => setOpen(true)}
					>
						{!open ? <IconChevronDown /> : <IconChevronUp />}

						{open ? "Ukryj agendę" : "Pokaż agendę"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default EventAgendaSection;
