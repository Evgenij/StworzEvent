import { ErrorCode } from "@/types/error-code";

export class ApiError extends Error {
	constructor(
		public code: ErrorCode,
		public errors?: Record<string, string[]>,
	) {
		super(code);
	}
}
