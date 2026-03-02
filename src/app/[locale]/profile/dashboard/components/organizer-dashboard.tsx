import { PageHeader } from "@/features/layout";
import { UserType } from "@/types/user";

export function OrganizerDashboard({ user }: { user: UserType }) {
	return (
		<>
			<PageHeader />
			<div>organizer dashboard</div>
			{/* events stats, orders, finance */}
		</>
	);
}
