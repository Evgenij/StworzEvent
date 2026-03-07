"use client";

import { Button } from "@/components/shadcn/ui/button";
import { Link } from "@/i18n/routing";
import { Event } from "@prisma/client";
import { useRouter } from "next/navigation";

const EventItemCatalog = ({ event }: { event: Event }) => {
	const router = useRouter();

	return (
		<div className="flex flex-col items-start justify-center gap-3 border border-gray-300 p-4">
			<h2>{event.title}</h2>
			<Button
				variant={"outline"}
				onClick={() => router.push(`/events/${event.id}`)}
				asChild
			>
				<Link href={`/events/${event.id}`}>Zobacz więcej</Link>
			</Button>
		</div>
	);
};

export default EventItemCatalog;
