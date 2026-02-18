import prisma from "@/lib/prisma";
import { Invitation } from "@prisma/client";

export async function getInvitesAction(): Promise<Invitation[]> {
	try {
		// берем только нужные поля и сортируем по дате
		const invites: Invitation[] = await prisma.invitation.findMany({
			select: {
				id: true,
				name: true,
				surname: true,
				isAccepted: true,
				expiresAt: true,
				email: true,
				token: true,
				createdAt: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return invites;
	} catch (error: unknown) {
		console.error("[DB] Failed to fetch invites:", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch invites";
		throw Object.assign(new Error(message), {
			code: "INVITES_FETCH_FAILED",
		});
	}
}
