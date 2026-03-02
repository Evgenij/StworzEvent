import { UserType } from "@/types/user";

export function ParticipantDashboard({ user }: { user: UserType }) {
	return (
		<section>
			<h1>Привет, {user.name}!</h1>
			{/* tickets, orders */}
		</section>
	);
}
