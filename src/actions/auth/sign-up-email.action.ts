"use server";
import { ApiError } from "@/error/api-error";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ErrorCode } from "@/types/error-code";
import { APIError } from "better-auth/api";

export const signUpEmailAction = safeAction(async (formData: FormData) => {
	const name = formData.get("name")?.toString()?.trim() as string;
	if (!name)
		throw new ApiError(ErrorCode.VALIDATION_ERROR, 401, {
			name: ["Imię jest wymagane"],
		});

	const surname = formData.get("surname")?.toString()?.trim() as string;
	if (!surname)
		throw new ApiError(ErrorCode.VALIDATION_ERROR, 401, {
			surname: ["Nazwisko jest wymagane"],
		});

	const email = formData.get("email") as string;
	if (!email)
		throw new ApiError(ErrorCode.VALIDATION_ERROR, 401, {
			email: ["Email jest wymagany"],
		});

	const password = formData.get("password") as string;
	if (!password)
		throw new ApiError(ErrorCode.VALIDATION_ERROR, 401, {
			password: ["Hasło jest wymagane"],
		});

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (user) {
		throw new ApiError(
			ErrorCode.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL,
			401,
			{
				email: ["Użytkownik z tym adresem email już istnieje"],
			},
		);
	}

	try {
		await auth.api.signUpEmail({
			body: { name, surname, email, password },
		});

		return {
			message: "User created successfully",
		};
	} catch (err: unknown) {
		if (err instanceof APIError) {
			const baCode = err.body?.code || err.status || "";

			if (baCode === "INVALID_EMAIL_OR_PASSWORD" || err.status === 401) {
				throw new ApiError(ErrorCode.INVALID_PASSWORD, 401, {
					password: [ErrorCode.INVALID_PASSWORD],
				});
			}

			// неизвестный код от Better Auth
			throw new ApiError(ErrorCode.INTERNAL_ERROR, 500, {
				general: [err.message || "Błąd autoryzacji"],
			});
		}

		// совсем чужая ошибка
		throw err;
	}
});
