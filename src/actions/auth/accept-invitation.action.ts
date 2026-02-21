"use server";

import { acceptInvitation } from "@/services/invites.service";

export async function acceptInvitationAction(token: string, password: string) {
	// acceptInvitation уже использует safeAction внутри → просто вызываем
	return acceptInvitation(token, password);
}
