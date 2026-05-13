import { PageHeader, WrapperFutureSection } from "@/features/layout";
import { UserType } from "@/features/user/types/user";
import HeaderWrapper from "../../layout/components/header-wrapper";
import { Typography } from "@/shared/components";
import { Button } from "@/components/ui/button";
import {
	IconArrowRight,
	IconArrowUpRight,
	IconCalendarEvent,
	IconEdit,
	IconFileAnalytics,
	IconListSearch,
	IconMapPin,
	IconMinus,
	IconPlus,
	IconQrcode,
	IconReport,
	IconSettingsSearch,
	IconTrendingUp,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import { NEW_EVENT_ROUTE } from "@/config/routes";
import ActionPanel from "../components/action-panel";
import FutureEventItem from "../components/future-events/future-event-item";
import FutureEventsList from "../components/future-events/future-events-list";
import WrapperFutureFunction from "@/features/layout/components/wrapper-future-function";
import LiveActionList from "../components/live-actions/live-action-list";

export function OrganizerDashboard({ user }: { user: UserType }) {
	return (
		<div className="organizer-dashboard grid grid-cols-1 auto-rows-auto gap-6">
			<div className="dashboard-hero grid grid-cols-1 auto-rows-auto gap-4">
				<div className="dashboard-hero__header grid grid-cols-1 xl:grid-cols-5 gap-4">
					<HeaderWrapper className="col-span-3 p-7">
						<div className="data flex flex-col justify-between h-full">
							<div className="data__header flex flex-col gap-3">
								<Typography variant="h1">
									Co robimy dzisiaj, {user.name}?
								</Typography>
								<p className="opacity-60">
									Sprzedaż na Warsaw Jazz Night przyspieszyła
									— w ostatnich 24h sprzedanych 38 biletów.
									Zostało Ci jeszcze 58 miejsc.
								</p>
							</div>
							<div className="data__buttons flex flex-wrap gap-2">
								<Button size="lg">
									<IconPlus /> Utwórz wydarzenie
								</Button>
								<Button size="lg" variant="transparent">
									<IconQrcode /> Otwórz check-in
								</Button>
								<WrapperFutureFunction>
									<Button size="lg" variant="transparent">
										<IconFileAnalytics /> Wygeneruj raport
									</Button>
								</WrapperFutureFunction>
							</div>
						</div>
					</HeaderWrapper>
					<div className="p-5 flex flex-col gap-4 border border-border col-span-2 bg-background rounded-3xl">
						<div className="label flex items-center gap-2">
							<span className="relative flex size-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
								<span className="relative inline-flex size-2 rounded-full bg-primary"></span>
							</span>
							<span className="text-primary font-medium text-sm">
								Najbliższe — za 21 dni
							</span>
						</div>
						<div className="event flex items-start gap-3">
							<img
								className="event__preview aspect-square h-20 rounded-lg object-cover object-center"
								src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdGvNlLLu9WU1r3yMaMIvkEgjvC7dgGVyt6A&s"
							></img>
							<div className="event__data flex flex-col gap-2">
								<Typography
									variant="h3"
									className="line-clamp-2"
								>
									Warsaw Jazz Night 2026
								</Typography>
								<div className="event__details text-xs flex flex-wrap gap-2 text-muted-foreground">
									<div className="event__item flex items-center gap-1">
										<IconCalendarEvent className="size-4" />
										Sob, 21 cze · 20:00
									</div>
									<div className="event__item flex items-center gap-1">
										<IconMapPin className="size-4" />
										Warszawa, Hydrozagadka 13
									</div>
								</div>
							</div>
						</div>
						<Separator />
						<div className="event__stats grid grid-cols-3 gap-3 divide-x">
							<div className="event__stats-item flex flex-col gap-1 text-sm text-muted-foreground">
								<span className="uppercase">Sprzedane</span>
								<div className="event__stats-item-value flex items-baseline gap-0.5">
									<p className="font-semibold text-lg text-black">
										142
									</p>
									<span className="text-xs ">/</span>
									<span className="text-xs ">200</span>
								</div>
							</div>
							<div className="event__stats-item flex flex-col gap-1 text-sm text-muted-foreground">
								<span className="uppercase">Przychód</span>
								<div className="event__stats-item-value flex items-baseline gap-0.5">
									<p className="font-semibold text-lg text-black">
										17 040 zł
									</p>
								</div>
							</div>
							<div className="event__stats-item flex flex-col gap-1 text-sm text-muted-foreground">
								<span className="uppercase">Wykorzystanie</span>
								<div className="event__stats-item-value flex items-baseline gap-0.5">
									<p className="font-semibold text-lg text-black">
										71%
									</p>
								</div>
							</div>
						</div>
						<div className="event-actions flex flex-wrap gap-2">
							<Button variant="outline" size="sm">
								<IconListSearch /> Szczegóły wydarzenia
							</Button>
							<Button variant="outline" size="sm">
								<IconEdit /> Edytuj
							</Button>
						</div>
					</div>
				</div>
				<div className="dashboard-actions grid grid-cols-4 gap-3">
					<ActionPanel />
					<ActionPanel />
					<ActionPanel />
					<ActionPanel />
				</div>
			</div>
			<WrapperFutureSection>
				<div className="dashboard-stats bg-background grid grid-cols-4 p-5 divide-x border border-border rounded-3xl gap-5">
					<div className="dashboard-stats__item text-sm">
						<div className="dashboard-stats__item-label uppercase text-muted-foreground">
							Sprzedane bilety (30d)
						</div>
						<div className="dashboard-stats__item-value text-2xl font-semibold mt-1 mb-1">
							1 842
						</div>
						<div className="dashboard-stats__item-approximate text-green-600 flex items-center gap-0.5 text-xs font-medium">
							<IconTrendingUp className="size-4" />
							+18,3%
						</div>
					</div>
					<div className="dashboard-stats__item text-sm">
						<div className="dashboard-stats__item-label uppercase text-muted-foreground">
							Przychód (MTD)
						</div>
						<div className="dashboard-stats__item-value text-2xl font-semibold mt-1 mb-1">
							92 134 zł
						</div>
						<div className="dashboard-stats__item-approximate text-green-600 flex items-center gap-0.5 text-xs font-medium">
							<IconTrendingUp className="size-4" />
							+24,1%
						</div>
					</div>
					<div className="dashboard-stats__item text-sm">
						<div className="dashboard-stats__item-label uppercase text-muted-foreground">
							Średnia frekwencja
						</div>
						<div className="dashboard-stats__item-value text-2xl font-semibold mt-1 mb-1">
							87%
						</div>
						<div className="dashboard-stats__item-approximate text-gray-600 flex items-center gap-0.5 text-xs font-medium">
							<IconMinus className="size-4" />
							bez zmian
						</div>
					</div>
					<div className="dashboard-stats__item text-sm">
						<div className="dashboard-stats__item-label uppercase text-muted-foreground">
							Aktywne wydarzenia
						</div>
						<div className="dashboard-stats__item-value text-2xl font-semibold mt-1 mb-1">
							12
						</div>
						<div className="dashboard-stats__item-approximate text-green-600 flex items-center gap-0.5 text-xs font-medium">
							<IconArrowUpRight className="size-4" />
							+2 w tym mies.
						</div>
					</div>
				</div>
			</WrapperFutureSection>

			<section className="dashboard-details grid grid-cols-1 xl:grid-cols-5 gap-4">
				<section className="dashboard-details__stat-all-events col-span-3 p-5 flex flex-col gap-4 border border-border bg-background rounded-3xl">
					<header className="flex items-start justify-between">
						<div className="header-wrapper">
							<Typography variant="h3">
								Frekwencja w nadchodzących
							</Typography>
							<span className="text-muted-foreground text-sm">
								Bilety sprzedane vs. dostępne
							</span>
						</div>
						<WrapperFutureFunction className="flex-0">
							<Button variant="ghost" size="sm">
								Otwórz analitykę
								<IconArrowRight className="size-4" />
							</Button>
						</WrapperFutureFunction>
					</header>
					<main className="future-events">
						<FutureEventsList />
					</main>
				</section>
				<aside className="dashboard-details__live-activity col-span-2 p-5 flex flex-col gap-4 border border-border bg-background rounded-3xl">
					<header className="flex items-start justify-between">
						<div className="header-wrapper">
							<Typography variant="h3">
								Aktywność na żywo
							</Typography>
							<span className="text-muted-foreground text-sm">
								Zamówienia i check-ins
							</span>
						</div>
						<div className="live-badge bg-green-600/10 p-2 px-3 rounded-full text-green-600 text-xs flex items-center gap-1">
							<span className="relative flex size-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-75"></span>
								<span className="relative inline-flex size-2 rounded-full bg-green-600"></span>
							</span>
							Live
						</div>
					</header>
					<main className="live-actions">
						<LiveActionList />
					</main>
				</aside>
			</section>
		</div>
	);
}
