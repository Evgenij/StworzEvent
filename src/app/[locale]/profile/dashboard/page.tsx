import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "@/i18n/routing";
import { SIGNIN_ROUTE } from "@/helpers/routes";
import { UserRole } from "@prisma/client";
import { AdminDashboard } from "./components/admin-dashboard";
import { OrganizerDashboard } from "./components/organizer-dashboard";
import { ParticipantDashboard } from "./components/participant-dashboard";
import { UserType } from "@/types/user";

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
		[UserRole.USER]: (
			<ParticipantDashboard user={session.user as UserType} />
		),
	};

	return (
		dashboards[role] ?? (
			<ParticipantDashboard user={session.user as UserType} />
		)
	);
}
