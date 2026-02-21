import { ApiError } from "@/error/api-error";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ErrorCode } from "@/types/error-code";
import { APIError } from "better-auth/api";

export const acceptInvitationService = safeAction(
	async (token: string, password: string) => {
		try {
			const invitation = await prisma.invitation.findUnique({
				where: { token },
			});

			if (!invitation) {
				throw new ApiError(ErrorCode.DONT_FOUND);
			}

			if (invitation.expiresAt < new Date()) {
				throw new ApiError(ErrorCode.TOKEN_EXPIRED);
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

			return user;
		} catch (err: unknown) {
			if (err instanceof APIError) {
				const baCode = err.body?.code || err.status || "";

				if (
					baCode === "INVALID_EMAIL_OR_PASSWORD" ||
					err.status === 401
				) {
					throw new ApiError(ErrorCode.INVALID_PASSWORD, {
						password: [ErrorCode.INVALID_PASSWORD],
					});
				}

				// неизвестный код от Better Auth
				throw new ApiError(ErrorCode.INTERNAL_ERROR, {
					general: [err.message || "Błąd autoryzacji"],
				});
			}

			// совсем чужая ошибка
			throw err;
		}
	},
);
