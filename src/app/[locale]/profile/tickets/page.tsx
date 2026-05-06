import { SIGNIN_ROUTE } from "@/config/routes";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { headers } from "next/headers";
import React from "react";
import NotFoundPage from "../../not-found";
import UsersTickets from "@/features/tickets/pages/users-tickets";

const TicketsPage = async ({
	params,
}: {
	params: Promise<{ locale: string }>;
}) => {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect({ href: SIGNIN_ROUTE, locale });
		return null;
	}

	const role = session.user.role ?? UserRole.USER;

	// console.log(role);

	const ticketPages = {
		[UserRole.ADMIN]: <NotFoundPage />,
		[UserRole.ORGANIZER]: <NotFoundPage />,
		[UserRole.USER]: <UsersTickets />,
	};

	return ticketPages[role] ?? <div>ORGANIZER dashboard</div>;
};

export default TicketsPage;
