import { fail, handleActionError, success } from "@/lib/action-utils";
import prisma from "@/lib/prisma";
import { ActionResult } from "@/types/action-result";
import { UserDTO } from "@/types/DTOs/user.dto";

export async function verifyInviteTokenAction(
	token: string,
): Promise<ActionResult<UserDTO>> {
	try {
		if (!token) {
			return fail("Token nie został przekazany");
		}

		const user = await prisma.user.findFirst({
			where: {
				inviteToken: token,
				inviteExpires: { gt: new Date() },
			},
			select: {
				id: true,
				email: true,
				name: true,
			},
		});

		if (!user) {
			return fail("Token jest nieprawidłowy lub wygasł");
		}

		return success(user);
	} catch (error: unknown) {
		return handleActionError(error);
	}
}
