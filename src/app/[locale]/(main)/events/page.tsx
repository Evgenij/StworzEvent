import { EventsCatalogList } from "@/components/events/events-catalog-list";
import { LottieAnimation } from "@/components/shared/lottie-animation";
import { PageHeader } from "@/features/layout";
import { getEventsPage } from "@/actions/events/get-events-page.action";

const EventsCatalogPage = async () => {
	const { items, hasMore } = await getEventsPage(0);

	return (
		<div className="events-catalog flex flex-col gap-4 w-full h-full items-start p-4 pt-0">
			<PageHeader padding />

			{items.length === 0 ? (
				<div className="flex flex-col items-center justify-center w-full py-20 gap-4">
					<LottieAnimation />
					<p className="text-muted-foreground">Brak wydarzeń</p>
				</div>
			) : (
				<EventsCatalogList
					initialItems={items}
					initialHasMore={hasMore}
				/>
			)}
		</div>
	);
};

export default EventsCatalogPage;
