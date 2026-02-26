import { formatDate } from "@/helpers/format-date";
import { Event } from "@prisma/client";
import React from "react";
import StatusBadge from "./status-badge";
import Image from "next/image";
import { AspectRatio } from "../aspect-ratio";
import { TableCell, TableRow } from "@/shadcn/ui/table";

const EventItem = ({ event }: { event: Event }) => {
	return (
		<>
			<TableRow>
				<TableCell className="font-medium w-1/2">
					{event.title}
				</TableCell>
				<TableCell>
					<StatusBadge status={event.status} />
				</TableCell>
				<TableCell className="text-right">
					{formatDate(event.startsAt)}
				</TableCell>
			</TableRow>
		</>
		// <div className="border rounded-2xl p-3 flex flex-col justify-between gap-3">
		// 	<AspectRatio
		// 		ratio={16 / 9}
		// 		className="bg-muted rounded-lg overflow-hidden"
		// 	>
		// 		<Image
		// 			src="https://mailmktg.makemytrip.com/mybusiness/images/MICE-Corp-Events_2.jpg"
		// 			alt={event.title}
		// 			width={1200} // ← add this (example: use a value around the real width)
		// 			height={675}
		// 			className="w-full h-full object-cover"
		// 		/>
		// 	</AspectRatio>
		// 	<section className="px-2 flex flex-col justify-between gap-2">
		// 		<header className="flex justify-between items-center">
		// 			<div className="text-md font-semibold">{event.title}</div>
		// 			<div className="text-sm text-gray-500">
		// 				<StatusBadge status={event.status} />
		// 			</div>
		// 		</header>

		// 		<main className="text-sm text-gray-500">dghdf</main>
		// 		<footer className="text-sm text-gray-500">
		// 			{formatDate(event.startsAt)}
		// 		</footer>
		// 	</section>
		// </div>
	);
};

export default EventItem;
