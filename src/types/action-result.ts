import { ErrorCode } from "./error-code";

export type ActionResult<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			code: ErrorCode;
			errors?: Record<string, string[]>;
	  };
