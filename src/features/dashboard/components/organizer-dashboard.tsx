import { PageHeader } from "@/features/layout";
import { UserType } from "@/features/user/types/user";

export function OrganizerDashboard({ user }: { user: UserType }) {
	return (
		<>
			<PageHeader />
			<div>organizer dashboard</div>
			{/* events stats, orders, finance */}
		</>
	);
}
