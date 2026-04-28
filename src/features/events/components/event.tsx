import { formatDate } from "@/helpers/format-date";
import { Event } from "@prisma/client";
import React from "react";
import StatusBadge from "./status-badge";
import { TableCell, TableRow } from "@/components/shadcn/ui/table";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/shadcn/ui/button";
import {
	EVENT_EDIT_ROUTE,
	EVENT_PAGE_ROUTE,
	MAIN_PAGE_EVENT_ROUTE,
} from "@/consts/routes";

const EventItemRow = ({ event }: { event: Event }) => {
	return (
		<>
			<TableRow>
				<TableCell className="font-medium w-1/2">
					<Button variant="outline" asChild>
						<Link href={MAIN_PAGE_EVENT_ROUTE(event.id)}>Page</Link>
					</Button>
					<Button variant="ghost" asChild>
						<Link href={EVENT_PAGE_ROUTE(event.id)}>
							{event.title}
						</Link>
					</Button>
					<Button variant="link" asChild>
						<Link href={EVENT_EDIT_ROUTE(event.id)}>Edit</Link>
					</Button>
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

export default EventItemRow;
