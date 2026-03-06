//TODO: Unused

import prisma from "@/lib/prisma";
import { ActionResult } from "@/types/action-result";
import { ErrorCode } from "@/types/error-code";
import { Invitation } from "@prisma/client";

export async function getInvitesAction(): Promise<ActionResult<Invitation[]>> {
	try {
		const invites = await prisma.invitation.findMany({
			orderBy: { createdAt: "desc" },
		});

		return { success: true, data: invites };
	} catch (error) {
		console.error(error);

		return {
			success: false,
			code: ErrorCode.FETCH_FAILED,
		};
	}
}
