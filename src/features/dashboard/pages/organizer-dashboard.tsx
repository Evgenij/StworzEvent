import { PageHeader } from "@/features/layout";
import { UserType } from "@/features/user/types/user";
import HeaderWrapper from "../components/header-wrapper";
import { Typography } from "@/shared/components";
import { Button } from "@/components/ui/button";
import { IconCalendarEvent, IconMapPin, IconPlus } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";

export function OrganizerDashboard({ user }: { user: UserType }) {
	return (
		<div className="organizer-dashboard grid grid-cols-1 auto-rows-auto gap-4">
			<div className="dashboard-hero grid grid-cols-1 auto-rows-auto gap-4">
				<div className="dashboard-hero__header grid grid-cols-1 xl:grid-cols-5 gap-4">
					<HeaderWrapper className="col-span-3 p-7">
						<div className="data grid grid-cols-1 auto-rows-auto gap-10">
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
									<IconPlus /> Otwórz check-in
								</Button>
								<Button size="lg" variant="transparent">
									<IconPlus /> Wygeneruj raport
								</Button>
							</div>
						</div>
					</HeaderWrapper>
					<div className="p-5 flex flex-col gap-3 border border-border col-span-2 bg-background rounded-3xl">
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
					</div>
				</div>
				<div className="dashboard-actions grid grid-cols-4 gap-3">
					<div className="item border border-border rounded-2xl p-3 px-5 bg-background">
						1
					</div>
					<div className="item border border-border rounded-2xl p-3 px-5 bg-background">
						2
					</div>
					<div className="item border border-border rounded-2xl p-3 px-5 bg-background">
						3
					</div>
					<div className="item border border-border rounded-2xl p-3 px-5 bg-background">
						4
					</div>
				</div>
			</div>
			<div className="dashboard-stats grid grid-cols-4 border border-border rounded-3xl bg-background gap-3">
				<div className="item p-3 px-5">1</div>
				<div className="item p-3 px-5">2</div>
				<div className="item p-3 px-5">3</div>
				<div className="item p-3 px-5">4</div>
			</div>
			<div className="dashboard-details grid border border-border">2</div>
		</div>
	);
}
