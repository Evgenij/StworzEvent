"use server";

import { acceptInvitationService } from "@/services/invites.service";

export async function acceptInvitationAction(token: string, password: string) {
	// acceptInvitation уже использует safeAction внутри → просто вызываем
	return acceptInvitationService(token, password);
}
