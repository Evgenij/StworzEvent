import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "@/i18n/routing";
import { SIGNIN_ROUTE } from "@/config/routes";
import { UserRole } from "@prisma/client";
import { AdminDashboard } from "@/features/dashboard/pages/admin-dashboard";
import { UserType } from "@/features/user/types/user";
import { OrganizerDashboard } from "@/features/dashboard/pages/organizer-dashboard";
import { ParticipantDashboard } from "@/features/dashboard/pages/participant-dashboard";
import UsersTickets from "@/features/tickets/pages/users-tickets";

export default async function DashboardPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect({ href: SIGNIN_ROUTE, locale });
		return null;
	}

	const role = session.user.role ?? UserRole.USER;

	const dashboards = {
		[UserRole.ADMIN]: <AdminDashboard user={session.user as UserType} />,
		[UserRole.ORGANIZER]: (
			<OrganizerDashboard user={session.user as UserType} />
		),
		[UserRole.USER]: <UsersTickets />,
	};

	return (
		dashboards[role] ?? (
			<ParticipantDashboard user={session.user as UserType} />
		)
	);
}
