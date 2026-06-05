import { Button } from "@/components/ui/button";
import { EventsList } from "@/features/dashboard/components/organizer/events";
import { EventsListProvider } from "@/features/dashboard/components/organizer/events/list/context/event-list-context";
import { PageHeader } from "@/features/layout";
import WrapperFutureFunction from "@/features/layout/components/wrapper-future-function";
import { IconDownload, IconPlus } from "@tabler/icons-react";

const OrganizerEventsPage = () => {
	return (
		<EventsListProvider>
			<div className="organizer-events-page flex flex-col gap-7">
				<section className="header flex justify-between items-center">
					<header className="flex flex-col gap-2">
						<PageHeader />
						{/* TODO: Add data to subtitle */}
						{/* <p className="flex gap-1 text-muted-foreground">
						<span>14 wydarzeń</span>
						<span>-</span>
						<span className="font-semibold text-success-foreground">
							5 w sprzedaży
						</span>
						<span>·</span>
						<span>2 szkice</span>
						<span>·</span>
						<span>1 do publikacji</span>
					</p> */}
					</header>
					<div className="header-buttons flex gap-1">
						<WrapperFutureFunction>
							<Button variant="outline">
								<IconDownload /> Exportuj
							</Button>
						</WrapperFutureFunction>
						<Button>
							<IconPlus /> Dodaj wydarzenie
						</Button>
					</div>
				</section>

				{/* <section className="stats">
				<EventsStatistics />
			</section> */}
				<main className="data">
					<EventsList />
				</main>

				{/* <div className="organizer-events-page">
				<EventsList />
			</div> */}
			</div>
		</EventsListProvider>
	);
};

export default OrganizerEventsPage;
