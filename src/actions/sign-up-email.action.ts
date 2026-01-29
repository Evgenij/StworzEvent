"use server";
import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";

export async function signUpEmailAction(formData: FormData) {
	const name = formData.get("name") as string;
	if (!name) return { error: "Name is required" };

	const email = formData.get("email") as string;
	if (!email) return { error: "Email is required" };

	const password = formData.get("password") as string;
	if (!password) return { error: "Password is required" };

	try {
		await auth.api.signUpEmail({ body: { name, email, password } });

		return { error: null };
	} catch (error: any) {
		if (error instanceof APIError) {
			const errCode = error.body
				? (error.body.code as ErrorCode)
				: "UNKNOWN";

			console.log(errCode);

			switch (errCode) {
				default:
					return { error: "Oops! Something went wrong..." };
				case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
					return {
						error: "User with this email already exists. ",
						description: `Use another email`,
					};
				case "INVALID_EMAIL":
					return { error: "Invalid email address" };
				case "PASSWORD_TOO_SHORT":
					return {
						error: "Password too short",
						description: "Min length is 6 characters",
					};
			}

			return { error: error.message };
		}

		return { error: "Internal Server Error" };
	}
}
