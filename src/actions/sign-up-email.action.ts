"use server";
import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";

export async function signUpEmailAction(formData: FormData) {
	const name = formData.get("name") as string;
	if (!name) return { message: "Name is required" };

	const email = formData.get("email") as string;
	if (!email) return { message: "Email is required" };

	const password = formData.get("password") as string;
	if (!password) return { message: "Password is required" };

	try {
		await auth.api.signUpEmail({ body: { name, email, password } });

		return { message: null };
	} catch (error: any) {
		if (error instanceof APIError) {
			const errCode = error.body
				? (error.body.code as ErrorCode)
				: "UNKNOWN";

			console.error("SignUp Error code: ", errCode);

			switch (errCode) {
				case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
					return {
						message: "User with this email already exists. ",
						description: `Use another email`,
					};
				case "INVALID_EMAIL":
					return { message: "Invalid email address" };
				case "PASSWORD_TOO_SHORT":
					return {
						message: "Password too short",
						description: "Min length is 6 characters",
					};
				default:
					return { message: "Oops! Something went wrong..." };
			}

			//return { message: error.message };
		}

		return { message: "Internal Server Error" };
	}
}
