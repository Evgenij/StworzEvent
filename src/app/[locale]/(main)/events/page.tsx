import { getEventsPage } from "@/features/events/actions/get-events-page.action";
import { EventsCatalogList } from "@/features/events/components/catalog/events-catalog-list";
import { PageHeader } from "@/features/layout";
import { LottieAnimation } from "@/shared/components/lottie-animation";

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
