import { ActionResult } from "@/types/action-result";

export function handleActionError(error: any): ActionResult {
	// Если это ошибка Better Auth
	if (error.body?.code === "VALIDATION_ERROR") {
		return {
			success: false,
			message: "Błąd walidacji danych",
			errors: error.body.data, // Better Auth прокидывает ошибки полей здесь
		};
	}

	// Стандартные ошибки
	return {
		success: false,
		message: error.message || "Wystąpił nieoczekiwany błąd",
	};
}
