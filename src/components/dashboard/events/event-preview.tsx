import EventItem from "@/components/events/event-item";
import { useCreateEventPreview } from "./create-event-context";
import { EventImagePlaceholder } from "@/components/shared/event-image-placeholder";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { IconMapPin } from "@tabler/icons-react";

const EventPreview = () => {
	const { previewAsEventItem, selectedCategory } = useCreateEventPreview();

	if (!previewAsEventItem) {
		return (
			<div className="flex h-full rounded-2xl flex-col items-start justify-center gap-3 border border-border shadow-2xl/5 p-2">
				<EventImagePlaceholder />
				<div className="flex flex-col flex-1 px-2 gap-3 w-full">
					<header className="flex flex-col gap-2">
						<Skeleton className="h-6 w-full" />
						<div className="flex gap-2">
							<Skeleton className="h-3 w-1/4" />
							<Skeleton className="h-3 w-1/3" />
						</div>
					</header>
					<main className="flex gap-2 w-full">
						<Skeleton className="size-3" />
						<Skeleton className="h-3 w-1/4" />
						<Skeleton className="h-3 w-1/3" />
					</main>
					<footer className="pt-2 mt-auto flex items-center gap-2 border-t border-border w-full">
						<Skeleton className="h-5 w-1/10" />
						<Skeleton className="h-5 w-1/3" />
					</footer>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<EventItem
				event={previewAsEventItem}
				minPrice={null}
				isPreview
				category={selectedCategory}
			/>
		</div>
	);
};

export default EventPreview;
