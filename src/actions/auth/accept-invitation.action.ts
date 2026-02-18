"use server";

import { auth } from "@/lib/auth";
import { fail, success } from "@/lib/action-utils";
import prisma from "@/lib/prisma";
import { CodeError } from "@/types/enums";

export async function acceptInvitationAction(token: string, password: string) {
	try {
		const invitation = await prisma.invitation.findUnique({
			where: { token },
		});

		if (!invitation) {
			return fail("INVALID_TOKEN", CodeError.INVALID_TOKEN);
		}

		if (invitation.expiresAt < new Date()) {
			return fail("EXPIRED_TOKEN", CodeError.TOKEN_EXPIRED);
		}

		// Регистрируем пользователя через Better Auth
		const user = await auth.api.signUpEmail({
			body: {
				name: invitation.name,
				surname: invitation.surname,
				email: invitation.email,
				password,
			},
		});

		// Обновляем invite
		await prisma.invitation.update({
			where: { token },
			data: { isAccepted: true },
		});

		return success(user);
	} catch (error: any) {
		if (error?.statusCode === 422) {
			// конкретно "User already exists"
			return fail(
				"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
				CodeError.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL,
			);
		}
		// Любая другая ошибка
		return fail(error?.message ?? "INVITE_FAILED", CodeError.DEFAULT);
	}
}
