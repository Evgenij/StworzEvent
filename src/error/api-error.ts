import { ErrorCode } from "@/types/error-code";

export class ApiError extends Error {
	constructor(
		public code: ErrorCode,
		public statusCode = 400,
		public errors?: Record<string, string[]>,
	) {
		super(code);
	}
}
