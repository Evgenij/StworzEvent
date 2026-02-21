"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { APIError } from "better-auth";
import prisma from "@/lib/prisma";

export const signInEmailAction = safeAction(async (formData: FormData) => {
	const email = formData.get("email")?.toString()?.trim();
	const password = formData.get("password")?.toString();

	if (!email) {
		throw new ApiError(ErrorCode.VALIDATION_ERROR, {
			email: ["Email jest wymagany"],
		});
	}

	if (!password) {
		throw new ApiError(ErrorCode.VALIDATION_ERROR, {
			password: ["Hasło jest wymagane"],
		});
	}

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new ApiError(ErrorCode.USER_NOT_FOUND, {
			email: ["Nie znaleziono użytkownika z tym adresem email"],
		});
	}

	try {
		await auth.api.signInEmail({
			body: { email, password },
			headers: await headers(),
		});

		return { success: true };
	} catch (err: unknown) {
		if (err instanceof APIError) {
			const baCode = err.body?.code || err.status || "";

			if (baCode === "INVALID_EMAIL_OR_PASSWORD" || err.status === 401) {
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
});
