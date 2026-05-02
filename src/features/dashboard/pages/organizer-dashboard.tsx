import { PageHeader } from "@/features/layout";
import { UserType } from "@/features/user/types/user";
import HeaderWrapper from "../components/header-wrapper";
import { Typography } from "@/shared/components";

export function OrganizerDashboard({ user }: { user: UserType }) {
	return (
		<div className="organizer-dashboard">
			{/* <PageHeader />
			<div>organizer dashboard</div> */}
			{/* events stats, orders, finance */}
			<div className="dashboard-hero grid grid-rows-2">
				<div className="dashboard-hero__header grid grid-cols-5 gap-4">
					<HeaderWrapper className="col-span-3 flex flex-col gap-3">
						<Typography variant="h1">
							Co robimy dzisiaj, Ewa?
						</Typography>
						<p>
							Sprzedaż na Warsaw Jazz Night przyspieszyła — w
							ostatnich 24h sprzedanych 38 biletów. Zostało Ci
							jeszcze 58 miejsc.
						</p>
					</HeaderWrapper>
					<div className="p-4 border border-border col-span-2">2</div>
				</div>
			</div>
			<div className="dashboard-stats grid"></div>
			<div className="dashboard-details grid"></div>
		</div>
	);
}
