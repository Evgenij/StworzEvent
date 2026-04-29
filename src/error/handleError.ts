import { ErrorCode } from "@/types/error-code";
import { ApiError } from "./api-error";

export function handleError(error: unknown) {
	if (error instanceof ApiError) {
		return {
			status: error.code,
			body: {
				message: error.message,
				code: error.code,
				errors: error.errors,
			},
		};
	}

	console.error("Unhandled error:", error);

	return {
		status: 500,
		body: {
			message: "Internal server error",
			code: ErrorCode.INTERNAL_ERROR,
		},
	};
}
