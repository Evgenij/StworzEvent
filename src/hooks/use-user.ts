"use client";

import { useSession } from "@/lib/auth-client";
import { UserRole } from "@prisma/client";
import { useMemo } from "react";

export function useUser() {
	const { data: session, isPending: isSessionLoading } = useSession();
	const isLoading = isSessionLoading;

	//console.log("useUser", JSON.stringify(session));

	return useMemo(
		() => ({
			user: session?.user ?? null,
			isOrganizer: session?.user?.role === UserRole.ORGANIZER,
			session,
			isLoading,
		}),
		[session],
	);
}
