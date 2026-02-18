import { CodeError } from "./enums";

export type ActionResult<T = null> =
	| { success: true; data: T }
	| {
			success: false;
			code?: CodeError;
			message: string;
			errors?: Record<string, string[]>;
	  };
