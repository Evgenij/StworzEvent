import { ActionResult } from "@/types/action-result";
import { CodeError } from "@/types/enums";

type ErrorWithBody = {
	body?: {
		code?: string;
		message?: string;
		data?: Record<string, string[]>;
	};
	message?: string;
};

export function handleActionError(error: unknown): ActionResult<never> {
	const err = error as ErrorWithBody;

	if (err.body?.code === "VALIDATION_ERROR") {
		return {
			success: false,
			message: "Błąd walidacji danych",
			errors: err.body.data,
		};
	}

	const code = err.body?.code;
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
				err.body?.message ||
				"Wystąpił nieoczekiwany błąd",
		};
	}

	return {
		success: false,
		message: err.message || "Wystąpił nieoczekiwany błąd",
	};
}

export function success<T>(data: T): ActionResult<T> {
	return { success: true, data };
}

export function fail(
	message: string,
	code?: CodeError,
	errors?: Record<string, string[]>,
): ActionResult<never> {
	return { success: false, message, errors };
}
