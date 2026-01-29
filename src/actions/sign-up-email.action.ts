"use server";
import { auth } from "@/lib/auth";

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
		if (error instanceof Error) {
			return { error: "Oops! Something went wrong" };
		}

		return { error: "Internal Server Error" };
	}
}
