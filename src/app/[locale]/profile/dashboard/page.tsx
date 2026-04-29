import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "@/i18n/routing";
import { SIGNIN_ROUTE } from "@/config/routes";
import { UserRole } from "@prisma/client";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
import { UserType } from "@/features/user/types/user";
import { OrganizerDashboard } from "@/features/dashboard/components/organizer-dashboard";
import { ParticipantDashboard } from "@/features/dashboard/components/participant-dashboard";

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
