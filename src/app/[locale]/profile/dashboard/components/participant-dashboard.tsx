import { PageHeader } from "@/features/layout";
import { UserType } from "@/types/user";

export function ParticipantDashboard({ user }: { user: UserType }) {
	return (
		<>
			<PageHeader />
			<h1>Czesc, {user.name}!</h1>
			{/* tickets, orders */}
		</>
	);
}
