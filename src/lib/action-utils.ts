import { ActionResult } from "@/types/action-result";

export function handleActionError(error: any): ActionResult {
	if (error.body?.code === "VALIDATION_ERROR") {
		return {
			success: false,
			message: "Błąd walidacji danych",
			errors: error.body.data,
		};
	}

	const code = error?.body?.code as string | undefined;
	if (code) {
		const codeMessages: Record<string, string> = {
			USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
				"Użytkownik z tym adresem e-mail już istnieje",
			INVALID_EMAIL: "Nieprawidłowy adres e-mail",
			PASSWORD_TOO_SHORT: "Hasło jest zbyt krótkie",
			INVALID_TOKEN: "Nieprawidłowy token",
			TOKEN_EXPIRED: "Token wygasł",
			EMAIL_NOT_FOUND: "Nie znaleziono adresu e-mail",
		};
		return {
			success: false,
			message:
				codeMessages[code] ||
				error.body?.message ||
				"Wystąpił nieoczekiwany błąd",
		};
	}

	return {
		success: false,
		message: error.message || "Wystąpił nieoczekiwany błąd",
	};
}

export function success<T = undefined>(data?: T): ActionResult<T> {
	return { success: true, data };
}

export function fail(
	message?: string,
	errors?: Record<string, string[]>,
): ActionResult {
	return { success: false, message, errors };
}
