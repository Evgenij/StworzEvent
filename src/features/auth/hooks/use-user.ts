import { UserType } from "@/features/user/types/user";
import { useSession } from "@/lib/auth-client";
import { UserRole } from "@prisma/client";
import { useMemo } from "react";

export function useUser() {
	const { data: session, isPending: isLoading } = useSession();

	return useMemo(() => {
		const rawUser = session?.user ?? null;

		const user: UserType | null = rawUser
			? {
					email: rawUser.email,
					name: rawUser.name,
					image: rawUser.image,
					role: rawUser.role as UserRole,
				}
			: null;

		return {
			user,
			isOrganizer: user?.role === UserRole.ORGANIZER,
			session,
			isLoading: isLoading || (!user && !!session), // ← фикс race condition
		};
	}, [session, isLoading]);
}
