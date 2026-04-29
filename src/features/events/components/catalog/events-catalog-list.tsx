"use client";

import { useState, useTransition } from "react";
import EventItem from "./event-item";
import { Button } from "@/components/ui/button";
import { IconLoader } from "@tabler/icons-react";
import { EventCatalogItem, getEventsPage } from "../../actions/get-events-page.action";

interface EventsCatalogListProps {
	initialItems: EventCatalogItem[];
	initialHasMore: boolean;
}

export const EventsCatalogList = ({
	initialItems,
	initialHasMore,
}: EventsCatalogListProps) => {
	const [items, setItems] = useState(initialItems);
	const [hasMore, setHasMore] = useState(initialHasMore);
	const [isPending, startTransition] = useTransition();

	const loadMore = () => {
		startTransition(async () => {
			const { items: next, hasMore: more } = await getEventsPage(
				items.length,
			);
			setItems((prev) => [...prev, ...next]);
			setHasMore(more);
		});
	};

	return (
		<>
			<div className="event-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
				{items.map((event) => (
					<EventItem
						key={event.id}
						event={event}
						minPrice={event.minPrice}
						category={event.category}
					/>
				))}
			</div>

			{hasMore && (
				<div className="flex justify-center w-full pt-4">
					<Button
						variant="outline"
						onClick={loadMore}
						disabled={isPending}
					>
						{isPending ? (
							<IconLoader className="size-4 animate-spin mr-2" />
						) : null}
						Załaduj więcej
					</Button>
				</div>
			)}
		</>
	);
};
