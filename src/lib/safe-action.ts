import { ApiError } from "@/error/api-error";
import { ActionResult } from "@/types/action-result";
import { ErrorCode } from "@/types/error-code";
import { APIError } from "better-auth/api";
import { ZodError } from "zod";

export function safeAction<T, Args extends unknown[]>(
	fn: (...args: Args) => Promise<T>,
) {
	return async (...args: Args): Promise<ActionResult<T>> => {
		try {
			const data = await fn(...args);

			return {
				success: true,
				data,
			};
		} catch (error: unknown) {
			if (error instanceof ApiError) {
				return {
					success: false,
					code: error.code,
					errors: error.errors,
				};
			}

			if (error instanceof APIError) {
				const status = error.status;
				const codeFromBody = error.body?.code;
				const message =
					error.message ||
					error.body?.message ||
					"Authentication error";

				let mappedCode: ErrorCode = ErrorCode.INTERNAL_ERROR;

				switch (codeFromBody || status) {
					case "INVALID_EMAIL_OR_PASSWORD":
					case 401:
					case "UNAUTHORIZED":
						mappedCode = ErrorCode.UNAUTHORIZED;
						break;

					case "USER_ALREADY_EXISTS":
					case "EMAIL_ALREADY_TAKEN":
						mappedCode =
							ErrorCode.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL;
						break;

					case 403:
					case "EMAIL_NOT_VERIFIED":
					case "FORBIDDEN":
						mappedCode = ErrorCode.FORBIDDEN;
						break;

					case "INVALID_OTP":
					case "INVALID_TOKEN":
					case 400:
						mappedCode = ErrorCode.VALIDATION_ERROR;
						break;
				}

				return {
					success: false,
					code: mappedCode,
					errors: { general: [message] },
				};
			}

			if (error instanceof ZodError) {
				return {
					success: false,
					code: ErrorCode.VALIDATION_ERROR,
					errors: Object.fromEntries(
						error.issues.map((i) => [
							i.path.join("."),
							[i.message],
						]),
					),
				};
			}

			console.error("[Unhandled Action Error]", error);

			return {
				success: false,
				code: ErrorCode.INTERNAL_ERROR,
			};
		}
	};
}
